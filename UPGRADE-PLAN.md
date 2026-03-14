# 🚀 UPGRADE PLAN - visa-path-aus
> Tài liệu nghiên cứu chiến lược bởi Auschain Team (Iris · Zara · Rex · Luna)
> Ngày: 14/03/2026 | Version: 1.0

---

## 1. EXECUTIVE SUMMARY

### Tình trạng hiện tại

visa-path-aus là một SPA (React + Vite) được xây dựng trên Supabase, DeepSeek AI và Stripe, nhắm đến thị trường ngách rất cụ thể: **người Việt tại Úc đang tìm lộ trình PR**. Sản phẩm đã live với bộ tính năng khá đầy đủ về mặt kỹ thuật (AI Chat, EOI Calculator, Document Tracker, Roadmap...) nhưng **chưa có một paying user nào**, revenue = $0.

### Vấn đề cốt lõi

Sản phẩm mắc kẹt ở **"Feature Trap"**: tập trung xây feature nhưng chưa giải quyết được câu hỏi người dùng hỏi đầu tiên: *"Tôi có đủ điều kiện PR không? Tôi nên bắt đầu từ đâu?"*

Các đối thủ thành công như Immigram, Boundless, Casium đều bắt đầu từ **instant value** (kết quả ngay lập tức, không cần đăng ký) → sau đó mới convert sang paid.

### Tiềm năng thị trường

- ~650,000 người Việt tại Úc (tăng trưởng ổn định)
- Visa subclass 189, 190, 482, 858 là những visa phổ biến nhất với cộng đồng Việt
- Chi phí migration agent tại Úc: $3,000–$8,000/hồ sơ → SaaS $12-25/tháng là **extremely affordable**
- Chưa có đối thủ nào tập trung 100% vào **tiếng Việt + context Úc**

### Mục tiêu 90 ngày

| Metric | Hiện tại | Mục tiêu 30 ngày | Mục tiêu 90 ngày |
|---|---|---|---|
| Paying users | 0 | 20 | 100 |
| MRR | $0 | $300 | $2,000 |
| Free users | ? | 200 | 1,000 |
| Conversion rate | 0% | 10% | 15% |

---

## 2. GAP ANALYSIS

### 2.1 Tính năng thiếu (Feature Gaps)

| Tính năng | Immigram | Boundless | Casium | visa-path-aus | Mức độ ưu tiên |
|---|---|---|---|---|---|
| **Instant eligibility check** (không cần đăng ký) | ✅ | ✅ | ✅ | ❌ | 🔴 Critical |
| **Success rate / case counter** (social proof) | ✅ 95%, 600+ | ❌ | ❌ | ❌ | 🔴 Critical |
| **Lawyer/agent review layer** | ❌ | ✅ | ❌ | ❌ | 🟡 High |
| **Guided step-by-step workflow** (không chỉ checklist) | ✅ | ✅ | ✅ | ❌ | 🔴 Critical |
| **Document upload + AI review** | ✅ | ✅ | ✅ | Partial (CV only) | 🟡 High |
| **Real-time application tracking** | ✅ | ✅ | ❌ | ❌ | 🟡 High |
| **Telegram/Email notifications** | ✅ | ❌ | ❌ | ❌ | 🟢 Medium |
| **Community / forum / Q&A** | ❌ | ❌ | ❌ | ❌ | 🟢 Medium |
| **Referral program** | ❌ | ❌ | ❌ | ❌ | 🟢 Medium |
| **Partner network** (agents, lawyers) | ❌ | ✅ | ❌ | ❌ | 🟡 High |

### 2.2 UX Gaps

| Vấn đề | Mô tả | Ảnh hưởng |
|---|---|---|
| **No instant value** | User phải đăng ký trước khi thấy bất kỳ kết quả nào | Bounce rate cao, conversion thấp |
| **Không có "aha moment"** rõ ràng | Sau đăng ký, user không biết làm gì tiếp theo | Activation thấp |
| **Onboarding quá phức tạp** | Không có flow hướng dẫn từng bước | Drop-off ngay sau signup |
| **AI Chat không có context** | Mỗi conversation độc lập, không nhớ hồ sơ user | Chất lượng thấp, cảm giác generic |
| **Thiếu progress indicator** | User không biết họ đang ở đâu trong lộ trình | Frustration, churn |
| **Mobile UX chưa tối ưu** | Người Việt dùng mobile rất nhiều | Miss mobile traffic |

### 2.3 Monetization Gaps

| Vấn đề | Mô tả | Giải pháp |
|---|---|---|
| **Không có freemium hook rõ ràng** | Free tier quá hào phóng hoặc quá giới hạn | Redesign value ladder |
| **Không có urgency/scarcity** | User có thể "dùng free mãi" | Limited slots, time-bound features |
| **Không có upsell trong flow** | Không có moment tự nhiên để upgrade | Contextual upgrade prompts |
| **Không có annual plan** | Chỉ có monthly | Annual = 2 tháng free = giảm churn |
| **Professional tier chưa rõ** | "Agent tools" là gì? Không communicate được | Define và market rõ hơn |

### 2.4 Trust Gaps

| Vấn đề | Mô tả |
|---|---|
| **Zero social proof** | Không có testimonials, success stories, case count |
| **Không có success metrics** | Không claim được "X% thành công" |
| **Không có credentials** | Không có migration agent backing, legal disclaimer |
| **Thông tin AI không được verify** | User lo ngại AI đưa thông tin sai về visa |
| **Không có community** | Isolating experience, không có peer support |

---

## 3. TOP 10 PRIORITY UPGRADES

---

## [1] Instant Eligibility Check (No Login Required)

**Problem:** Người dùng mới truy cập không biết sản phẩm có phù hợp với họ không. Phải đăng ký trước khi thấy bất kỳ kết quả nào → bounce rate cao.

**Solution:** Xây dựng một wizard 5 bước ngay trên landing page (không cần login):
1. Bạn đang ở visa nào? (485, 482, Student, Tourist...)
2. Nghề nghiệp của bạn? (autocomplete từ ANZSCO)
3. Điểm tiếng Anh? (IELTS/PTE score)
4. Số năm kinh nghiệm?
5. Bang/Territory bạn sống?

→ Kết quả: "Bạn có khả năng đủ điều kiện Subclass 189 với dự kiến điểm EOI: **75 điểm**. Xem chi tiết →"

**Benchmark:** Immigram.io - eligibility wizard là entry point chính. NaviSmart AI - toàn bộ funnel bắt đầu từ eligibility check.

**Impact:** 🔴 Conversion tăng 40-60% (industry benchmark), giảm bounce rate, tăng sign-up rate

**Effort:** Medium (2-3 tuần dev)

**Priority:** P1 - Làm ngay trong tháng đầu

**Implementation notes:**
```
- Component: EligibilityWizard.jsx (standalone, no auth required)
- Store kết quả trong localStorage + offer "Save your results" → trigger signup
- Kết nối với dữ liệu EOI cutoff thực tế từ DOHA
- ANZSCO code lookup: import JSON từ ABS website
- A/B test: 3 bước vs 5 bước
- Track: wizard_started, wizard_completed, wizard_converted
```

---

## [2] Personalized Dashboard với Progress Tracking

**Problem:** Sau khi đăng ký, user nhìn vào dashboard và không biết làm gì. Không có sense of progress → không có lý do để quay lại.

**Solution:** Dashboard cá nhân hóa theo hồ sơ user:
- **"Lộ trình của bạn"** - Timeline rõ ràng: Bạn đang ở bước X/8
- **Progress bar** cho từng milestone (EOI submitted, Nomination, Invitation, Lodge...)
- **Next action card**: "Việc tiếp theo cần làm: Renew IELTS trước 15/04"
- **Score tracker**: EOI score history theo thời gian
- **Countdown**: "Còn X ngày trước khi pool points được reset"

**Benchmark:** Immigram.io - live dashboard tracking là core feature. Boundless.com - centralized application timeline.

**Impact:** 🔴 Retention tăng, Daily Active Users tăng, reduces churn

**Effort:** Medium (3-4 tuần)

**Priority:** P1

**Implementation notes:**
```
- Tạo bảng user_profile với: current_visa, target_visa, eoi_score, milestones[]
- Onboarding flow 4 bước sau signup: profile setup → goal selection → current status → first action
- Milestone system: định nghĩa 8-10 milestone chuẩn cho mỗi visa pathway
- Supabase realtime để cập nhật progress
- Weekly email digest: "Tuần này bạn cần làm gì"
```

---

## [3] AI Chat với Hồ sơ Cá nhân (Contextual AI)

**Problem:** AI Chat hiện tại không có context về user. Mỗi conversation bắt đầu từ đầu → cảm giác generic, không khác gì ChatGPT thông thường. Free tier 3 AI/ngày không đủ hấp dẫn để upgrade.

**Solution:** AI Chat biết về hồ sơ của user:
- Khi user hỏi "Tôi có đủ điều kiện 189 không?" → AI tự động lấy profile data và trả lời cụ thể: "Dựa trên hồ sơ của bạn: 75 điểm EOI, nghề IT, IELTS 7.5 → **Có thể nộp 189**. Tuy nhiên, pool hiện tại đang mời từ 80 điểm, bạn cần..."
- Memory giữa các sessions (lưu conversation history trong Supabase)
- AI "advisor mode": đặt câu hỏi proactive, không chỉ trả lời thụ động
- Upgrade hook: "Bạn đã dùng 3/3 câu hỏi hôm nay. Nâng cấp Basic để hỏi không giới hạn →"

**Benchmark:** Casium AI - contextual AI với user profile. Boundless - AI-guided form filling với context.

**Impact:** 🔴 Conversion Free → Basic, perceived value tăng mạnh

**Effort:** Medium (2-3 tuần)

**Priority:** P1

**Implementation notes:**
```
- System prompt injection: thêm user profile vào system message của mỗi conversation
- Bảng conversation_history trong Supabase (max 20 messages/user)
- Context injection format:
  "User profile: Visa 482, IT Manager, 8 năm kinh nghiệm, IELTS 7.0, NSW, target: 189/190"
- Smart limit: Free users thấy "X/3 câu hỏi còn lại hôm nay" với visual progress bar
- Track: messages_per_session, upgrade_prompt_shown, upgrade_prompt_converted
```

---

## [4] Success Stories & Social Proof System

**Problem:** Zero social proof. User mới không có lý do để tin tưởng sản phẩm. Immigram đã build được narrative "600+ cases, 95% success rate" rất mạnh.

**Solution:** Hệ thống social proof nhiều lớp:
- **Counter thực tế**: "Đã hỗ trợ X người Việt tìm được lộ trình PR" (tăng tự động theo DAU)
- **Success stories**: 5-10 case study ngắn (có thể ẩn danh): "Anh T.H., IT Engineer, Melbourne - đã nhận Invitation 189 sau 4 tháng dùng visa-path-aus"
- **Community wall**: User tự share milestone ("Tôi vừa submit EOI! 🎉")
- **Verified stats**: "Trong tháng qua, người dùng visa-path-aus trung bình tăng 8 điểm EOI sau 60 ngày"
- **Rating widget**: Yêu cầu user rate sau mỗi milestone hoàn thành

**Benchmark:** Immigram.io - "95% success rate" là headline trên homepage. Trust badges là conversion driver #1 trong fintech/legaltech.

**Impact:** 🔴 Conversion rate từ landing page tăng 25-40%

**Effort:** Low (1-2 tuần, phần lớn là content)

**Priority:** P1 - Nhanh nhất có thể

**Implementation notes:**
```
- Bước 1 (tuần 1): Thêm counter + 3 success stories vào landing page
- Bước 2 (tuần 2): In-app milestone sharing (opt-in)
- Bước 3 (tháng 2): Testimonial collection system
- Success stories có thể dùng composite characters ban đầu (disclosed as "based on real cases")
- Counter ban đầu: "Đã tạo X+ tài khoản" (thật hơn là claim success rate ngay)
- Schema markup cho reviews (Google rich snippets)
```

---

## [5] Guided Workflow Engine (Step-by-Step)

**Problem:** Checklist hiện tại chỉ là list to-do. Không có logic, không có điều kiện, không hướng dẫn thực sự. User nhìn vào 50 items và overwhelmed.

**Solution:** Workflow engine thông minh:
- **Pathway selection**: User chọn target visa → hệ thống tạo workflow cá nhân hóa
- **Conditional steps**: "Nếu bạn có IELTS < 7.0 → thêm bước 'Cải thiện IELTS' vào workflow"
- **Time estimates**: Mỗi bước có estimated time: "~2 tuần để hoàn thành"
- **Dependencies**: Step B bị lock cho đến khi hoàn thành Step A
- **Resources per step**: Mỗi step có links, templates, AI assistance phù hợp
- **Reminders**: "Bạn chưa hoàn thành Step 3 trong 7 ngày, cần hỗ trợ không?"

**Benchmark:** Immigram.io - step-by-step guided workflows là USP chính. Boundless - sequential guided flow.

**Impact:** 🔴 Activation rate, retention, và premium conversion tăng mạnh

**Effort:** High (4-6 tuần)

**Priority:** P2 - Tháng 2

**Implementation notes:**
```
- Data model: workflow_templates (per visa type) + user_workflow_progress
- Workflow template format: JSON với steps[], conditions[], dependencies[]
- Bắt đầu với 3 pathway: 189, 190 NSW, 482→PR
- UI: stepper component với sidebar progress
- Integration với Document Tracker và EOI Calculator
- Trigger notifications khi step overdue
```

---

## [6] Document Hub (Upload + AI Review)

**Problem:** Document Tracker hiện tại chỉ là checklist. Không có upload thực sự, không có review, không có storage. Boundless và Immigram có centralized document management là core value prop.

**Solution:** Proper document hub:
- **Upload bất kỳ document nào**: IELTS, Skills Assessment, Employment Letter, Police Check...
- **AI review**: "Document này có đủ requirements của DHA không?" → AI check và flag issues
- **Expiry tracking**: "IELTS của bạn hết hạn vào 15/06/2026 - còn 90 ngày"
- **Version history**: Lưu nhiều version của cùng một document
- **Share với agent**: Generate secure link để share với migration agent (Premium feature)
- **Checklist tự động**: Upload xong → tự tick checklist

**Benchmark:** Boundless.com - centralized document management. Immigram - document templates và tracking.

**Impact:** 🟡 Premium conversion (document features là premium-only), retention tăng

**Effort:** High (4-5 tuần)

**Priority:** P2

**Implementation notes:**
```
- Supabase Storage: bucket per user, max 50MB free / 500MB premium
- Document categories: Skills Assessment, Language, Employment, Identity, Health, Character
- AI review: gửi document text (extract PDF text) tới DeepSeek với checklist của từng document type
- Expiry tracking: bảng document_expiry với cron job hàng ngày check và notify
- Encryption at rest cho sensitive documents
- GDPR/Privacy: clear data retention policy, delete on request
```

---

## [7] Freemium Conversion Funnel Redesign

**Problem:** Free tier không có đủ "taste" của value để khiến user muốn upgrade. Không có upgrade moment tự nhiên trong product flow.

**Solution:** Redesign value ladder và upgrade triggers:

**Free tier (giữ nguyên nhưng thêm hooks):**
- 3 AI questions/ngày → hiển thị counter rõ ràng, animate khi gần hết
- 1 EOI calculation → sau đó show "See full breakdown and score optimization tips →" (paid)
- Workflow: chỉ thấy bước 1-3 → bước 4+ bị blur với "Unlock full workflow"

**Basic $12/tháng - Sharpen the value:**
- Unlimited AI với profile context
- Full workflow (tất cả steps)
- Document upload (5 documents)
- Email reminders

**Premium $25/tháng - Add enterprise feel:**
- Unlimited documents
- AI document review
- Share với agent (secure link)
- Priority support (24h response)
- Monthly 1:1 consultation call với migration advisor (30 min) ← **killer feature**

**Benchmark:** Notion, Linear - "locked features visible but blurred" là effective conversion driver. Calendly - consultation layer là upsell.

**Impact:** 🔴 Direct revenue impact, conversion rate optimization

**Effort:** Low-Medium (2-3 tuần)

**Priority:** P1

**Implementation notes:**
```
- Blur/overlay component cho locked features (thay vì hide hoàn toàn)
- Upgrade CTA: contextual, xuất hiện khi user gặp paywall
- Trial: 7-day free trial cho Basic (không cần card) → sau đó add card
- Annual: Basic $99/năm ($8.25/tháng), Premium $199/năm (save $101)
- Upgrade flow: <3 bước, no friction
- Stripe webhook: track upgrade events, trigger onboarding sequence
```

---

## [8] Community & Peer Support (Vietnamese Community Hub)

**Problem:** Immigration journey rất cô đơn. User không có nơi để hỏi nhau, share kinh nghiệm. Đây là lợi thế cạnh tranh duy nhất mà visa-path-aus có thể build mà các đối thủ quốc tế không có: **cộng đồng người Việt tại Úc**.

**Solution:** Community features nhẹ nhàng:
- **Q&A Forum**: Hỏi đáp cộng đồng, upvote, verified answers từ migration agents
- **Success Wall**: User share milestone, celebrate cùng nhau
- **State-based groups**: Nhóm theo NSW, VIC, QLD để chia sẻ state nomination tips
- **Weekly digest**: "Tuần này trong cộng đồng: pool points mới nhất, tips hay nhất"
- **Expert AMAs**: Migration agent trả lời câu hỏi cộng đồng hàng tháng

**Benchmark:** Không có đối thủ nào làm tốt cái này. **Đây là blue ocean.**

**Impact:** 🟡 Organic growth (word of mouth), retention, brand loyalty

**Effort:** Medium (3-4 tuần cho v1 forum)

**Priority:** P2

**Implementation notes:**
```
- MVP: Supabase + simple Q&A tables (posts, comments, votes)
- Moderation: AI-assisted spam filter + human moderator (có thể là founder)
- SEO value: UGC content về visa questions sẽ rank rất tốt
- Integration với Telegram group (người Việt dùng Telegram nhiều)
- Gamification: points, badges khi contribute
- Premium users có "verified member" badge → incentive to upgrade
```

---

## [9] Referral & Viral Growth System

**Problem:** $0 revenue = $0 marketing budget. Cần growth engine không tốn tiền.

**Solution:** Referral program đơn giản nhưng hiệu quả:
- **Refer a friend**: Mỗi referral thành công → cả 2 người nhận 1 tháng Basic miễn phí
- **Share your EOI score**: "Tôi đạt 75 điểm EOI - bạn đạt bao nhiêu? 🇦🇺" → shareable card với logo visa-path-aus
- **Milestone sharing**: "Tôi vừa hoàn thành Skills Assessment! Còn X bước nữa để PR 🎉" → auto-generated image card
- **Agent referral program**: Migration agents giới thiệu client → nhận 20% commission (B2B channel)

**Benchmark:** Dropbox referral - grew từ 100K → 4M users. Wise - dual-sided referral.

**Impact:** 🟡 Viral coefficient tăng, CAC giảm

**Effort:** Low-Medium (2-3 tuần)

**Priority:** P2

**Implementation notes:**
```
- Referral tracking: unique referral codes trong Supabase
- Shareable EOI card: canvas/og-image generation (có thể dùng Vercel OG)
- Reward fulfillment: tự động qua Stripe (extend subscription)
- Agent program: separate landing page, simple commission tracking
- Track: referral_shared, referral_clicked, referral_converted
```

---

## [10] Points Update Alert & Smart Notifications

**Problem:** Thông tin visa (EOI pool, invitation rounds, points cutoff) thay đổi thường xuyên. User hiện tại không có cách nào biết khi có update quan trọng.

**Solution:** Smart notification system:
- **EOI Pool Alerts**: Tự động scrape DOHA website → notify khi có invitation round mới
- **Personalized alerts**: "Pool vừa mời 75 điểm - **điểm của bạn đủ!** Cần làm gì ngay?"
- **Processing time changes**: Visa processing time thay đổi → notify
- **Expiry reminders**: "IELTS của bạn hết hạn sau 30 ngày"
- **Channels**: In-app + Email + Telegram bot (người Việt dùng Telegram nhiều)

**Benchmark:** Immigram.io - Telegram notifications là differentiator. Stock alert apps - personalized threshold alerts.

**Impact:** 🟡 Retention, DAU, urgency to maintain paid subscription

**Effort:** Medium (2-3 tuần)

**Priority:** P2

**Implementation notes:**
```
- DOHA scraper: cron job hàng ngày (Supabase Edge Function) check invitation round
- Notification bảng: user_notifications với type, read_at, data
- Email: Resend.com (có free tier, easy integration)
- Telegram bot: @visa_path_aus_bot (easy to build với telegraf.js)
- Personalization: chỉ notify khi cutoff <= user's score
- Unsubscribe management: one-click unsubscribe trong email
```

---

## 4. 30-60-90 DAY ROADMAP

### 🚀 Day 1–30: Quick Wins (Bắt đầu ngay, đừng chờ)

**Tuần 1 (Day 1-7): Trust & Conversion Foundation**
- [ ] Thêm success stories (3-5 stories) vào landing page
- [ ] Thêm user counter ("X+ người đã dùng visa-path-aus")
- [ ] Fix onboarding: sau signup phải có immediate value (show EOI estimate)
- [ ] Upgrade prompt thiết kế lại: blur locked features thay vì hide
- [ ] Setup Posthog hoặc Mixpanel để track funnel (hiện tại không có analytics?)
- [ ] Create Telegram group cho community

**Tuần 2 (Day 8-14): AI Context**
- [ ] Inject user profile vào AI system prompt
- [ ] Add conversation history (last 10 messages)
- [ ] Visual AI usage counter cho free tier ("2/3 câu hỏi hôm nay")
- [ ] Upgrade CTA khi user hit AI limit

**Tuần 3 (Day 15-21): Eligibility Wizard MVP**
- [ ] Build 5-step eligibility wizard (no login required)
- [ ] Connect với EOI calculator logic
- [ ] "Save results" → trigger signup
- [ ] A/B test landing page với vs không có wizard

**Tuần 4 (Day 22-30): Monetization Push**
- [ ] Redesign pricing page (clearer value props)
- [ ] Add annual plan (Basic $99/year, Premium $199/year)
- [ ] 7-day free trial cho Basic (no card required)
- [ ] Email sequence: signup → day 1 → day 3 → day 7 (conversion emails)
- [ ] **Target: 20 paying users, $300 MRR**

---

### ⚙️ Day 31–60: Core Features

**Tuần 5-6: Personalized Dashboard**
- [ ] Profile setup wizard (4 bước sau signup)
- [ ] Dashboard với progress indicator
- [ ] Next action card
- [ ] Score history tracker

**Tuần 7-8: Workflow Engine v1**
- [ ] Workflow cho 189 pathway (8-10 steps)
- [ ] Workflow cho 190 NSW pathway
- [ ] Step dependencies và completion tracking
- [ ] Email reminders khi step overdue

**Tháng 2 Goals:**
- [ ] Document upload cơ bản (Supabase Storage)
- [ ] Expiry tracking cho key documents
- [ ] Q&A forum MVP
- [ ] Referral program launch
- [ ] **Target: 50 paying users, $800 MRR**

---

### 📈 Day 61–90: Growth Features

**Tuần 9-10: Document Hub**
- [ ] Full document upload + categorization
- [ ] AI document review (check completeness)
- [ ] Secure share link cho agents

**Tuần 11-12: Notifications & Viral**
- [ ] DOHA scraper + EOI round alerts
- [ ] Telegram bot cho notifications
- [ ] Shareable EOI score card
- [ ] Milestone celebration + sharing

**Tháng 3 Goals:**
- [ ] Agent referral program B2B
- [ ] Monthly consultation call setup (Calendly integration)
- [ ] SEO optimization (visa blog posts targeting Vietnamese keywords)
- [ ] **Target: 100 paying users, $2,000 MRR**

---

## 5. REVENUE MODEL ANALYSIS

### 5.1 Pricing Benchmarks vs Competitors

| Product | Free | Basic | Premium | Enterprise/Pro |
|---|---|---|---|---|
| **visa-path-aus** | 3 AI/ngày | $12/tháng | $25/tháng | (undefined) |
| **Immigram.io** | Assessment | £49/tháng | £99/tháng | £299/case |
| **Boundless.com** | ❌ | ❌ | $750-900/application | ❌ |
| **Casium AI** | Limited | $49/tháng | $99/tháng | ❌ |

**Nhận xét Rex (CFO):**
- Pricing của visa-path-aus ($12-25) là **lowest in market** - đây là lợi thế cho adoption nhưng cần communicate value rõ hơn
- Boundless model ($750-900/application) chứng minh willingness to pay rất cao trong market này
- Nên thêm **per-application tier**: $99-150/application với full support (one-time payment)

### 5.2 Freemium Conversion Tactics (từ thực tế)

**Tactic 1: Feature Visibility (không phải Feature Gate)**
- Show tất cả features nhưng lock các features cao cấp
- "Blurred preview" + "Unlock with Basic" > "Feature hidden until upgrade"
- User cần thấy họ đang miss gì

**Tactic 2: Usage-Based Urgency**
- "2/3 câu hỏi còn lại hôm nay" tạo urgency tự nhiên
- Reset counter → user quay lại hàng ngày (habit loop)
- Khi hit limit: không chỉ "Upgrade" mà "Bạn đang hỏi dở về [topic], upgrade để tiếp tục ngay"

**Tactic 3: Milestone-Based Upgrade**
- Sau khi user hoàn thành onboarding → "Bạn đã sẵn sàng. Unlock full plan để bắt đầu hành trình PR"
- Sau EOI calculation → "Điểm của bạn: 72. Xem 5 cách tăng lên 80 →" (paid feature)
- Sau workflow step 3 → "Tiếp theo: Prepare Skills Assessment. Xem guide chi tiết →" (paid)

**Tactic 4: Social Proof at Paywall**
- Khi user gặp paywall, show: "Hơn 50 người đã upgrade tháng này" + testimonial ngắn
- "Anh Minh từ Melbourne: 'Sau 2 tháng dùng Premium, tôi đã submit EOI với 80 điểm'"

**Tactic 5: Time-Limited Offers**
- First 100 users: 50% off tháng đầu
- Seasonal: "Trước invitation round tháng 4: upgrade Premium để nhận alert ngay khi pool mở"

### 5.3 Upsell Opportunities

| Upsell | Từ | Lên | Revenue |
|---|---|---|---|
| Monthly → Annual | Basic $12 | Basic $99/năm | Lock-in, reduce churn |
| Basic → Premium | $12 | $25 | $13/user/tháng |
| Premium → Consultation | $25 | $25 + $50/call | High-margin service |
| Any tier → Document Review | subscription | $29 one-time | Ad-hoc service |
| Any tier → Agent Referral | subscription | Commission to agent | B2B channel |

### 5.4 Revenue Targets

| Tháng | Paying Users | MRR | Notes |
|---|---|---|---|
| **Month 1** | 20 | $300 | Focus: 20 Basic users, friends/early adopters |
| **Month 2** | 50 | $800 | Referral launch, Telegram community |
| **Month 3** | 100 | $2,000 | SEO organic traffic, agent referrals |
| **Month 6** | 300 | $6,000 | Mix: 200 Basic + 80 Premium + 20 Pro |
| **Month 12** | 800 | $18,000 | Scale: content marketing, agent network |

**Key assumptions:**
- CAC thấp nhờ community + referral (target $10-15/user)
- Churn < 10%/tháng với proper onboarding
- 15% freemium conversion rate (industry avg 2-5%, nhưng intent cao hơn)
- Mix tháng 6: 65% Basic + 27% Premium + 8% Pro

---

## 6. TRUST & SOCIAL PROOF STRATEGY

### 6.1 Học từ Immigram: Làm thế nào build "95% success rate, 600+ cases"?

**Phân tích narrative của Immigram:**

Immigram không có 600 cases ngay từ đầu. Họ build narrative này theo từng bước:

1. **Giai đoạn 1 - Collect quietly**: Track mọi outcome của users, kể cả free users
2. **Giai đoạn 2 - Define "success"**: "Success" = nhận invitation/approval (không phải chỉ PR granted). Định nghĩa rộng hơn = số cao hơn
3. **Giai đoạn 3 - Ask for stories**: Email campaign "Share your success story, nhận 1 tháng free"
4. **Giai đoạn 4 - Feature prominently**: Homepage headline là số này, không phải features

**Chiến lược cho visa-path-aus:**

**Step 1: Start counting NOW (tháng 1)**
- Track: users who submitted EOI, received nomination, received invitation, lodged application
- Database field: `success_milestones[]` trong user profile
- Counter: "X người đã submit EOI với visa-path-aus" (thật, verifiable)

**Step 2: Define success broadly**
- "Success" = bất kỳ milestone nào tiến về phía PR
- Không cần chờ PR granted (mất 2-3 năm)
- "95% of users who completed our workflow submitted their EOI within 3 months" ← claim khả thi

**Step 3: Collect testimonials proactively**
- After each milestone: pop-up "Chúc mừng! Chia sẻ với cộng đồng không?"
- Monthly email: "Bạn có story để share không? Nhận 1 tháng Basic miễn phí"
- Testimonial template để user dễ viết: "Tôi là [tên], [nghề], [city]. Trước khi dùng visa-path-aus tôi [vấn đề]. Sau [X tuần/tháng] tôi đã [kết quả]."

**Step 4: Social proof placement**
- Landing page: Counter + 3 featured stories (above the fold)
- Pricing page: Testimonials ngay trên CTA button
- AI chat: "500+ người đã hỏi câu tương tự" (aggregate social proof)
- Email footer: Current success counter

### 6.2 Trust Building cho AI Advice

**Vấn đề**: Users lo ngại AI đưa thông tin sai về visa → legal liability

**Giải pháp**:
- **Disclaimer rõ ràng**: "Thông tin từ AI mang tính tham khảo. Quyết định quan trọng nên tham khảo thêm Registered Migration Agent."
- **Source citations**: Mỗi AI response nên trích dẫn nguồn (DOHA website, Migration Act)
- **"Verify with agent" CTA**: Sau mỗi complex question → "Xác nhận với Migration Agent →" (partner referral)
- **Human review layer**: Premium users có thể request human review cho AI advice

### 6.3 Credentials & Authority Building

- **Partner với 2-3 Registered Migration Agents người Việt** tại Úc:
  - Họ review content → bạn nói "Reviewed by Registered Migration Agent"
  - Họ available cho consultation calls (Premium feature)
  - Họ giới thiệu clients → B2B revenue stream

- **MARA (Migration Agents Registration Authority) disclaimer**: Rõ ràng visa-path-aus là software tool, không phải migration agent service

- **Media mentions**: Pitch to Vietnamese community media (Viet Times, Vietnam Economic Times Aus edition, Facebook groups lớn)

---

## 7. UX/ONBOARDING IMPROVEMENTS

### 7.1 First-Time User Experience (FTUE) Redesign

**Vấn đề hiện tại**: User đăng ký xong, nhìn vào app và không biết làm gì.

**Mục tiêu**: Trong 5 phút đầu, user phải có được **1 piece of actionable information** về hồ sơ của họ.

**New FTUE Flow:**

```
[Landing Page]
→ Eligibility Check Widget (no login)
   → "Bạn đạt 72 điểm - đủ điều kiện 190 NSW"
   → CTA: "Tạo tài khoản để lưu kết quả + xem roadmap đầy đủ"

[Signup - 2 bước, không hơn]
→ Email + Password HOẶC Google OAuth
→ Verify email (optional, can skip for now)

[Onboarding Wizard - 4 bước, ~3 phút]
Step 1: "Visa mục tiêu của bạn?" → 189 / 190 / 482→PR / Other
Step 2: "Bạn đang ở đâu trong hành trình?" → Just starting / Have EOI / Nominated / Lodged
Step 3: "Thông tin cơ bản" → Pre-fill từ eligibility check nếu đã làm
Step 4: "Ưu tiên của bạn?" → Speed / Cost / Certainty

[Dashboard - Lần đầu]
→ Welcome message: "Chào [Tên]! Lộ trình của bạn đã sẵn sàng."
→ Score card: EOI Score hiện tại của bạn
→ Next Action card: Việc đầu tiên cần làm
→ Progress bar: Bạn đang ở bước 1/8
```

### 7.2 Activation Metrics & Goals

| Metric | Hiện tại | Target 30 ngày | Target 90 ngày |
|---|---|---|---|
| Signup → Complete onboarding | ? | 60% | 75% |
| Signup → First AI chat | ? | 40% | 55% |
| Signup → Day 7 return | ? | 25% | 40% |
| Day 7 return → Paid | ? | 15% | 20% |

**Activation "aha moment" định nghĩa:**
> User đã nhận được **personalized EOI score + next action** → Đây là moment họ thấy product value

**Activation funnel:**
1. Lands on page → Sees eligibility widget → Takes test (no login)
2. Gets score → Creates account to save
3. Completes onboarding → Sees personalized dashboard
4. Uses AI chat (with profile context) → Gets specific advice
5. **"Aha moment"**: "Ồ, app này biết hết về hồ sơ của mình!"
6. Returns next day → Habit loop formed
7. Hits AI limit → Upgrades

### 7.3 Retention Hooks

**Day 1**: Welcome email với "3 việc cần làm trong tuần đầu"
**Day 3**: "Bạn đã điền xong profile chưa? Score của bạn có thể tăng thêm 5 điểm"
**Day 7**: "Cộng đồng visa-path-aus tuần này: [X người submit EOI, Y người nhận nomination]"
**Day 14**: "Reminder: Kiểm tra xem documents của bạn sắp hết hạn chưa"
**Day 30**: "Tháng đầu summary: Bạn đã hoàn thành X bước trong lộ trình"

**In-app retention:**
- Daily "tip of the day" về visa
- Weekly pool points update (scraped từ DOHA)
- Streak system: "Bạn đã vào app X ngày liên tiếp 🔥"
- Milestone celebrations (confetti animation, shareable card)

### 7.4 Mobile-First Redesign Priorities

Người Việt dùng mobile nhiều:
- [ ] Bottom navigation bar (thay vì sidebar)
- [ ] Touch-friendly checklist items (larger tap targets)
- [ ] Offline mode cho checklist (progressive enhancement)
- [ ] Push notifications (sau khi build Telegram bot)
- [ ] Share to Zalo/Messenger cho milestones (Vietnamese platforms)

---

## 8. QUICK WINS CHECKLIST (Tuần 1 - Làm ngay hôm nay)

Những thứ có thể làm trong 1-3 ngày, không cần dev phức tạp:

- [ ] **Thêm social proof counter** vào landing page (`X+ người đã dùng visa-path-aus`)
- [ ] **Viết 3 success stories** (composite, disclosed) và thêm vào trang chủ
- [ ] **Fix AI context**: Thêm user profile vào system prompt (1-2 giờ dev)
- [ ] **AI usage counter**: "2/3 câu hỏi còn lại hôm nay" trong UI
- [ ] **Improve upgrade CTA**: Thay "Upgrade" bằng contextual copy ("Hỏi không giới hạn về hồ sơ của bạn")
- [ ] **Add annual plan** vào Stripe + pricing page
- [ ] **Setup email sequences** (Loops.so hoặc Resend + Postmark) cho signup flow
- [ ] **Create Telegram group** và link từ app
- [ ] **Setup Posthog** để track funnel (không có data = không có direction)
- [ ] **Add FAQ về AI accuracy** để address trust concerns

---

## 9. TECH DEBT & RISK NOTES

*(Từ Zara - SA perspective)*

**Hiện tại cần lưu ý:**

1. **DeepSeek API reliability**: DeepSeek có thể bị block/throttled tại một số vùng. Cần có fallback (OpenAI hoặc Gemini) để không bị downtime.

2. **Supabase free tier limits**: 500MB database, 1GB storage, 50MB file uploads. Khi grow cần upgrade Supabase plan ($25/tháng).

3. **Rate limiting cho AI**: Cần rate limit chặt hơn để prevent abuse của free tier (đặc biệt khi profile context → longer prompts → higher cost).

4. **SEO**: SPA không có server-side rendering → bad SEO. Nên xem xét:
   - Static pages cho FAQ, Guide, Blog (Astro hoặc Next.js cho những section này)
   - Hoặc implement prerendering (vite-plugin-ssg)

5. **Analytics thiếu**: Không biết user đang drop off ở đâu → không optimize được. Setup Posthog ngay.

---

## 10. APPENDIX: KPI DASHBOARD

*(Theo dõi hàng tuần)*

**Acquisition:**
- Weekly signups
- Source breakdown (direct, social, referral, organic)
- CAC (cost per acquisition)

**Activation:**
- Onboarding completion rate
- Time to first AI chat
- Time to "aha moment" (EOI score calculated)

**Retention:**
- Day 1, 7, 30 retention
- Weekly active users
- Session length

**Revenue:**
- MRR
- Free → Paid conversion rate
- Churn rate
- ARPU (Average Revenue Per User)
- LTV/CAC ratio

**Engagement:**
- AI chats per user per week
- Documents uploaded
- Workflow steps completed

---

*Tài liệu này được tạo bởi Auschain Team*
*Iris (BA) · Zara (SA) · Rex (CFO) · Luna (Marketing)*
*Cập nhật: 14/03/2026*
