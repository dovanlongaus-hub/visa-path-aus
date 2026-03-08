// fetchVisaStatistics backend function (scheduled daily at 7am Sydney local time)
//
// Purpose:
//   Agent that automatically searches Google / the web for the latest Australian
//   visa statistics and stores a daily snapshot so the VisaStatsDashboard
//   component can display up-to-date figures without every client having to
//   call the LLM directly.
//
// Trigger: Scheduled — cron "0 7 * * *" with TZ=Australia/Sydney
//          (Sydney observes both AEST UTC+10 and AEDT UTC+11; use a
//           timezone-aware scheduler rather than a fixed UTC offset)
//
// Steps:
//   1. Call InvokeLLM with add_context_from_internet: true to fetch the latest
//      offshore visa application statistics from DOHA and ABS sources:
//        - immi.homeaffairs.gov.au (Department of Home Affairs)
//        - abs.gov.au (Australian Bureau of Statistics)
//        - migration.gov.au
//   2. Parse the response for:
//        - totalOffshore  : total number of pending offshore applications
//        - ageGroups      : breakdown by age band (18-24, 25-29, 30-34, 35-39, 40-44, 45+)
//                           each with { range, percentage, count, label }
//        - topVisaTypes   : top 5 visa subclasses with { type, count, pct }
//        - dailyNew       : new applications lodged today
//        - dailyProcessed : applications finalised today
//        - source         : authoritative source name + URL
//        - date           : YYYY-MM-DD of the snapshot
//   3. Upsert a VisaStatistic entity record for today's date so historical
//      tracking is preserved.
//   4. Create or update a single "latest" VisaStatistic record (id = "latest")
//      that the VisaStatsDashboard component can fetch directly via the API.
//   5. Create a Notification for all admin users summarising today's figures
//      so they are aware of significant changes (e.g. large spike in new apps).
//
// Error handling:
//   - If the LLM/internet call fails, log the error and skip the upsert so
//     the previous day's data remains the "latest" snapshot.
//   - Partial data (missing fields) should be filled with the previous day's
//     values rather than zeroes.
//
// Related components:
//   - src/components/home/VisaStatsDashboard.jsx  (displays this data)
//   - src/components/home/AINewsWidget.jsx          (uses same InvokeLLM pattern)
//
// Related entities:
//   - VisaStatistic  { date, totalOffshore, ageGroups, topVisaTypes,
//                      dailyNew, dailyProcessed, source }
