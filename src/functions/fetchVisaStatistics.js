import { InvokeLLM } from "@/api/integrations";
import { VisaStatistic, Notification, UserProfile } from "@/api/entities";

// Known baseline from DOHA public statistics (used as fallback when LLM fetch fails)
const FALLBACK_OFFSHORE_COUNT = 847253;

// fetchVisaStatistics — scheduled daily at 7 am Sydney time (cron "0 7 * * *" TZ=Australia/Sydney)
export default async function fetchVisaStatistics() {
  const today = new Date().toISOString().split("T")[0];

  // ── 1. Fetch previous "latest" snapshot for fallback values ─────────────────
  let previous = null;
  try {
    const rows = await VisaStatistic.filter({ id: "latest" });
    if (rows?.length) previous = rows[0];
  } catch {}

  // ── 2. Ask LLM to fetch the latest DOHA / ABS statistics ───────────────────
  let fresh = null;
  try {
    fresh = await InvokeLLM({
      prompt: `Search the latest Australian visa statistics from official sources:
- immi.homeaffairs.gov.au (Department of Home Affairs – DOHA)
- abs.gov.au (Australian Bureau of Statistics)
- migration.gov.au

Return a JSON object with:
{
  "date": "YYYY-MM-DD",
  "totalOffshore": <number – total pending offshore visa applications>,
  "ageGroups": [
    { "range": "18–24", "percentage": <number>, "count": <number>, "label": "Sinh viên & Mới tốt nghiệp" },
    { "range": "25–29", "percentage": <number>, "count": <number>, "label": "Người đi làm trẻ" },
    { "range": "30–34", "percentage": <number>, "count": <number>, "label": "Chuyên gia có kinh nghiệm" },
    { "range": "35–39", "percentage": <number>, "count": <number>, "label": "Chuyên gia cấp trung" },
    { "range": "40–44", "percentage": <number>, "count": <number>, "label": "Chuyên gia cấp cao" },
    { "range": "45+",   "percentage": <number>, "count": <number>, "label": "Người di cư gia đình" }
  ],
  "topVisaTypes": [
    { "type": "Visa 500 (Sinh viên)",              "count": <number>, "pct": <number> },
    { "type": "Visa 482 (Lao động có bảo lãnh)",   "count": <number>, "pct": <number> },
    { "type": "Visa 189/190/491 (PR kỹ năng)",     "count": <number>, "pct": <number> },
    { "type": "Visa 485 (Tốt nghiệp)",             "count": <number>, "pct": <number> },
    { "type": "Visa 858 (Nhân tài toàn cầu)",      "count": <number>, "pct": <number> }
  ],
  "dailyNew": <number – new applications lodged today>,
  "dailyProcessed": <number – applications finalised today>,
  "source": "<authoritative source name + URL>"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          date: { type: "string" },
          totalOffshore: { type: "number" },
          ageGroups: { type: "array" },
          topVisaTypes: { type: "array" },
          dailyNew: { type: "number" },
          dailyProcessed: { type: "number" },
          source: { type: "string" },
        },
        required: ["totalOffshore", "ageGroups", "topVisaTypes"],
      },
      add_context_from_internet: true,
    });
  } catch (err) {
    console.error("[fetchVisaStatistics] LLM call failed:", err?.message);
  }

  // ── 3. Merge with previous data to fill any missing fields ──────────────────
  const statsData = {
    date: today,
    totalOffshore:
      fresh?.totalOffshore ?? previous?.totalOffshore ?? FALLBACK_OFFSHORE_COUNT,
    ageGroups:
      fresh?.ageGroups?.length ? fresh.ageGroups : previous?.ageGroups ?? [],
    topVisaTypes:
      fresh?.topVisaTypes?.length ? fresh.topVisaTypes : previous?.topVisaTypes ?? [],
    dailyNew:
      fresh?.dailyNew ?? previous?.dailyNew ?? 0,
    dailyProcessed:
      fresh?.dailyProcessed ?? previous?.dailyProcessed ?? 0,
    source:
      fresh?.source ?? previous?.source ?? "Bộ Di trú Úc (DOHA)",
  };

  // ── 4. Upsert daily snapshot record ─────────────────────────────────────────
  try {
    const existing = await VisaStatistic.filter({ date: today });
    if (existing?.length) {
      await VisaStatistic.update(existing[0].id, statsData);
    } else {
      await VisaStatistic.create({ ...statsData });
    }
  } catch (err) {
    console.error("[fetchVisaStatistics] Failed to upsert daily record:", err?.message);
    return;
  }

  // ── 5. Upsert "latest" record ────────────────────────────────────────────────
  try {
    const latestRows = await VisaStatistic.filter({ id: "latest" });
    if (latestRows?.length) {
      await VisaStatistic.update("latest", statsData);
    } else {
      await VisaStatistic.create({ id: "latest", ...statsData });
    }
  } catch (err) {
    console.error("[fetchVisaStatistics] Failed to upsert 'latest' record:", err?.message);
  }

  // ── 6. Notify admin users (in parallel) ─────────────────────────────────────
  try {
    const admins = await UserProfile.filter({ role: "admin" });
    const summaryMsg =
      `📊 Thống kê visa ngày ${today}: ` +
      `${statsData.totalOffshore.toLocaleString()} đơn offshore đang chờ. ` +
      `Mới hôm nay: +${statsData.dailyNew.toLocaleString()} | Đã xử lý: ${statsData.dailyProcessed.toLocaleString()}.`;

    await Promise.all(
      (admins ?? []).map((admin) =>
        admin.user_id
          ? Notification.create({
              user_id: admin.user_id,
              type: "visa_update",
              title: "📊 Cập nhật thống kê visa hằng ngày",
              message: summaryMsg,
              is_read: false,
              date: today,
            }).catch(() => {})
          : Promise.resolve()
      )
    );
  } catch (err) {
    console.error("[fetchVisaStatistics] Failed to create admin notifications:", err?.message);
  }

  return { success: true, date: today, totalOffshore: statsData.totalOffshore };
}
