import { InvokeLLM, SendEmail } from "@/api/integrations";
import { Notification, UserProfile } from "@/api/entities";

// checkImmigrationUpdates — scheduled daily at 8 am Sydney time (cron "0 8 * * *" TZ=Australia/Sydney)
export default async function checkImmigrationUpdates() {
  const today = new Date().toISOString().split("T")[0];

  // ── 1. Fetch latest immigration news via LLM + internet ─────────────────────
  let newsItems = [];
  try {
    const result = await InvokeLLM({
      prompt: `Search for the latest Australian immigration visa news from the past 24 hours.
Focus on:
- Policy changes from DOHA (immi.homeaffairs.gov.au)
- Visa fee updates
- EOI SkillSelect invitation rounds (cutoff points)
- Changes to visa subclasses: 189, 190, 491, 485, 482, 500, 858
- State/Territory nomination updates (CSOL, occupation lists)
- TSMIT or salary threshold changes

Return JSON:
{
  "news": [
    {
      "title": "<concise headline in Vietnamese>",
      "summary": "<2-3 sentence description in Vietnamese>",
      "date": "YYYY-MM-DD",
      "urgent": true/false,
      "source": "<source name, e.g. DOHA, immi.homeaffairs.gov.au>",
      "visa_types": ["189", "190"] // affected visa subclasses, empty array if general
    }
  ]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          news: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                date: { type: "string" },
                urgent: { type: "boolean" },
                source: { type: "string" },
                visa_types: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      },
      add_context_from_internet: true,
    });

    if (result?.news?.length) {
      newsItems = result.news;
    }
  } catch (err) {
    console.error("[checkImmigrationUpdates] LLM news fetch failed:", err?.message);
    return { success: false, reason: "LLM call failed" };
  }

  if (!newsItems.length) {
    console.log("[checkImmigrationUpdates] No new immigration updates found today.");
    return { success: true, notified: 0 };
  }

  // ── 2. Build notification content ───────────────────────────────────────────
  const urgentItems = newsItems.filter((n) => n.urgent);
  const allTitles = newsItems.map((n) => `• ${n.title}`).join("\n");
  const notificationTitle = urgentItems.length
    ? `🚨 ${urgentItems.length} cập nhật khẩn về visa Úc — ${today}`
    : `📰 Tin tức di trú mới nhất — ${today}`;
  const notificationMessage =
    newsItems.length === 1
      ? newsItems[0].summary
      : `Có ${newsItems.length} cập nhật mới về visa Úc hôm nay:\n${allTitles}`;

  // ── 3. Create in-app notifications for all users ─────────────────────────────
  let notifiedCount = 0;
  try {
    const profiles = await UserProfile.list();
    for (const profile of profiles ?? []) {
      if (!profile.user_id) continue;
      await Notification.create({
        user_id: profile.user_id,
        type: "visa_update",
        title: notificationTitle,
        message: notificationMessage,
        is_read: false,
        date: today,
        urgent: urgentItems.length > 0,
      });
      notifiedCount++;
    }
  } catch (err) {
    console.error("[checkImmigrationUpdates] Failed to create notifications:", err?.message);
  }

  // ── 4. Send email to subscribed users (in parallel) ─────────────────────────
  try {
    const subscribed = await UserProfile.filter({ notify_visa_updates: true });
    const emailSubject = urgentItems.length
      ? `🚨 Cập nhật khẩn về visa Úc — ${today}`
      : `📰 Tin tức di trú Úc mới nhất — ${today}`;
    const emailBody = newsItems
      .map(
        (item) =>
          `<h3>${item.urgent ? "🚨 " : "📰 "}${item.title}</h3>` +
          `<p>${item.summary}</p>` +
          `<p><small>Nguồn: ${item.source} | ${item.date}</small></p>`
      )
      .join("<hr/>");
    const htmlContent = `<div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#111">Tin tức di trú Úc hôm nay</h2>
          ${emailBody}
          <hr/>
          <p style="color:#888;font-size:12px">
            Visa Path Aus — Nền tảng tư vấn di trú Úc dành cho người Việt.<br/>
            Để hủy đăng ký nhận email, vào Cài đặt &gt; Thông báo.
          </p>
        </div>`;

    await Promise.all(
      (subscribed ?? [])
        .filter((p) => !!p.email)
        .map((profile) =>
          SendEmail({
            to: profile.email,
            subject: emailSubject,
            body: htmlContent,
          }).catch(() => {})
        )
    );
  } catch (err) {
    console.error("[checkImmigrationUpdates] Failed to send emails:", err?.message);
  }

  return { success: true, date: today, newsCount: newsItems.length, notified: notifiedCount };
}