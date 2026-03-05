import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // For scheduled automations, use service role
    const isScheduled = req.headers.get('x-automation-trigger') === 'scheduled';

    // Fetch latest immigration news via AI + internet
    const newsResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Hãy tìm kiếm và tổng hợp các tin tức di trú Úc mới nhất (trong 24-48 giờ qua) từ các nguồn chính thức như:
- Department of Home Affairs (immi.homeaffairs.gov.au)
- SkillSelect / Skilled Occupation List (SOL) thay đổi
- Lãnh sự quán / Đại sứ quán Úc tại Việt Nam
- Thay đổi về điểm EOI, visa subclass mới

Trả về JSON với danh sách cập nhật mới nhất. Nếu không có tin tức mới quan trọng, trả về danh sách rỗng.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          updates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                category: { type: "string", enum: ["sol_change", "visa_update", "policy_change", "deadline", "general"] },
                source_url: { type: "string" },
                is_important: { type: "boolean" }
              }
            }
          },
          has_important_updates: { type: "boolean" }
        }
      }
    });

    const { updates = [], has_important_updates = false } = newsResult;

    if (updates.length === 0) {
      return Response.json({ message: "Không có tin tức mới", updates: [] });
    }

    // Get all users who subscribed to notifications
    const allProfiles = await base44.asServiceRole.entities.UserProfile.list('-created_date', 200);
    const subscribedProfiles = allProfiles.filter(p => p.email_notifications === true && p.email);

    const categoryEmoji = {
      sol_change: "📋",
      visa_update: "🛂",
      policy_change: "⚖️",
      deadline: "⏰",
      general: "📢"
    };

    const typeMap = {
      sol_change: "visa_update",
      visa_update: "visa_update",
      policy_change: "alert",
      deadline: "deadline",
      general: "alert"
    };

    // Create in-app notifications for all users
    const allUsers = await base44.asServiceRole.entities.User.list('-created_date', 500);

    for (const update of updates) {
      const emoji = categoryEmoji[update.category] || "📢";
      for (const user of allUsers) {
        await base44.asServiceRole.entities.Notification.create({
          title: `${emoji} ${update.title}`,
          message: update.summary,
          type: typeMap[update.category] || "alert",
          action_url: update.source_url || "",
          read: false
        });
      }
    }

    // Send email to subscribed users
    if (has_important_updates && subscribedProfiles.length > 0) {
      const updatesList = updates
        .map(u => `<li><strong>${u.title}</strong><br/>${u.summary}</li>`)
        .join('');

      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0f2347, #1a3a6e); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🇦🇺 Cập nhật Di trú Úc mới nhất</h1>
            <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">Từ Úc Di Trú AI – ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <div style="background: #f8f9fc; padding: 24px; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 15px; margin-top: 0;">Chúng tôi phát hiện các cập nhật quan trọng về di trú Úc:</p>
            <ul style="color: #374151; font-size: 14px; line-height: 1.8;">
              ${updatesList}
            </ul>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://app.base44.com" style="background: #0f2347; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Xem chi tiết trên ứng dụng →
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; text-align: center;">
              Bạn nhận email này vì đã đăng ký nhận thông báo trên Úc Di Trú AI.<br/>
              Thông tin mang tính tham khảo. Luôn tham vấn MARA agent được đăng ký.
            </p>
          </div>
        </div>
      `;

      for (const profile of subscribedProfiles) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: profile.email,
          subject: `🇦🇺 Cập nhật di trú Úc mới – ${new Date().toLocaleDateString('vi-VN')}`,
          body: emailBody
        });
      }
    }

    return Response.json({
      message: `Đã xử lý ${updates.length} cập nhật, gửi email cho ${subscribedProfiles.length} người dùng`,
      updates,
      emails_sent: has_important_updates ? subscribedProfiles.length : 0
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});