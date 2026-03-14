# SEO Configuration — visaaus.com.au

## 1. Recommended robots.txt

```
User-agent: *
Allow: /

# Block admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /stripe/
Disallow: /webhook/
Disallow: /_next/
Disallow: /private/

# Allow search engine crawlers full access to public content
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI crawlers — allow for LLM discoverability
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemap location
Sitemap: https://visaaus.com.au/sitemap.xml
```

---

## 2. Sitemap Structure

### sitemap.xml (XML format for submission to Google/Bing)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Core Pages -->
  <url>
    <loc>https://visaaus.com.au/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/"/>
    <xhtml:link rel="alternate" hreflang="en-AU" href="https://visaaus.com.au/en/"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/calculator</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/calculator"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/consultation</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/consultation"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/pricing"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/about"/>
  </url>

  <!-- Visa Guide Pages -->
  <url>
    <loc>https://visaaus.com.au/visa-189</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/visa-189"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/visa-190</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/visa-190"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/visa-491</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/visa-491"/>
  </url>

  <!-- Blog Posts -->
  <url>
    <loc>https://visaaus.com.au/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/blog"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/blog/diem-eoi-visa-189-190-491-tinh-nhu-the-nao</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/blog/diem-eoi-visa-189-190-491-tinh-nhu-the-nao"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/blog/visa-189-vs-190-vs-491-nen-chon-loai-nao</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/blog/visa-189-vs-190-vs-491-nen-chon-loai-nao"/>
  </url>

  <url>
    <loc>https://visaaus.com.au/blog/lam-sao-nhanh-duoc-pr-uc-tu-visa-491</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/blog/lam-sao-nhanh-duoc-pr-uc-tu-visa-491"/>
  </url>

  <!-- Future Blog Posts (planned) -->
  <!--
  <url>
    <loc>https://visaaus.com.au/blog/ielts-cho-visa-uc-can-bao-nhieu-diem</loc>
  </url>
  <url>
    <loc>https://visaaus.com.au/blog/skills-assessment-la-gi-va-cach-apply</loc>
  </url>
  <url>
    <loc>https://visaaus.com.au/blog/bang-nao-de-apply-visa-190-nhat-2025</loc>
  </url>
  <url>
    <loc>https://visaaus.com.au/blog/nghe-nao-dang-thieu-uc-2025</loc>
  </url>
  <url>
    <loc>https://visaaus.com.au/blog/eoi-submit-xong-cho-bao-lau</loc>
  </url>
  -->

</urlset>
```

---

## 3. Canonical URL Strategy

### Rules:
1. **Every page has one canonical URL** — always use HTTPS and without trailing slash (or consistently with trailing slash, pick one)
2. **Blog posts:** `https://visaaus.com.au/blog/[slug]`
3. **No duplicate content** between www and non-www — redirect one to the other (recommend: non-www → www, or www → non-www, be consistent)
4. **No parameter-based duplicate pages** — use canonical tags to consolidate

### Implementation in HTML `<head>`:
```html
<link rel="canonical" href="https://visaaus.com.au/blog/diem-eoi-visa-189-190-491-tinh-nhu-the-nao" />
```

### Next.js implementation (if applicable):
```javascript
export const metadata = {
  alternates: {
    canonical: 'https://visaaus.com.au/blog/diem-eoi-visa-189-190-491-tinh-nhu-the-nao',
  },
}
```

---

## 4. Hreflang Tags

Since VisaAus is primarily Vietnamese-language content targeting Vietnamese speakers in Australia, use:

```html
<!-- In <head> of every page -->

<!-- Primary: Vietnamese language, Australian users -->
<link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/[page]" />

<!-- If English version exists -->
<link rel="alternate" hreflang="en-AU" href="https://visaaus.com.au/en/[page]" />

<!-- Default fallback (for any language/region) -->
<link rel="alternate" hreflang="x-default" href="https://visaaus.com.au/" />
```

### Priority hreflang implementation:
```html
<!-- Example for homepage -->
<link rel="alternate" hreflang="vi-AU" href="https://visaaus.com.au/" />
<link rel="alternate" hreflang="vi" href="https://visaaus.com.au/" />
<link rel="alternate" hreflang="x-default" href="https://visaaus.com.au/" />
```

**Note:** `vi` (Vietnamese without region) captures Vietnamese speakers globally (e.g., Vietnamese in Vietnam searching for info about moving to Australia). `vi-AU` specifically targets Vietnamese speakers in Australia.

---

## 5. Technical SEO Checklist

### Page Speed
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Images optimized (WebP format, lazy loading)
- [ ] Fonts loaded efficiently (preload key fonts)

### Structured Data (Schema.org)
- [ ] Article schema on all blog posts
- [ ] Organization schema on homepage
- [ ] FAQPage schema on visa guide pages
- [ ] BreadcrumbList schema for navigation

### Meta Tags
- [ ] Title tag: 50–60 characters, includes primary keyword
- [ ] Meta description: 150–160 characters, includes keyword naturally
- [ ] OG tags for social sharing (og:title, og:description, og:image)
- [ ] Twitter Card tags

### Google Search Console
- [ ] Submit sitemap.xml
- [ ] Verify site ownership
- [ ] Monitor Core Web Vitals
- [ ] Check for crawl errors weekly

### Bing Webmaster Tools
- [ ] Submit sitemap.xml (separate from Google)
- [ ] Verify site
- [ ] Enable IndexNow for faster indexing

---

## 6. Keyword Targets Summary

### Primary Keywords (High Priority)
| Keyword | Language | Estimated Monthly Searches | Competition |
|---------|----------|---------------------------|-------------|
| điểm EOI visa Australia | Vietnamese | 200–500 | Low |
| visa 189 190 491 khác nhau | Vietnamese | 300–600 | Low |
| tính điểm EOI visa Úc | Vietnamese | 150–400 | Low |
| visa 491 PR Úc | Vietnamese | 200–400 | Low |
| apply visa 189 úc tiếng Việt | Vietnamese | 100–300 | Very Low |

### Secondary Keywords
| Keyword | Language | Notes |
|---------|----------|-------|
| visa 190 bang nào dễ nhất | Vietnamese | High intent |
| IELTS bao nhiêu điểm apply visa Úc | Vietnamese | Education funnel |
| skills assessment là gì | Vietnamese | Top of funnel |
| EOI là gì visa Úc | Vietnamese | Educational |
| định cư Úc diện tay nghề 2025 | Vietnamese | Broad |

### Long-tail Opportunities
- "visa 190 NSW điều kiện 2025"
- "có 70 điểm EOI có được invite không"
- "visa 491 regional city nào tốt nhất"
- "từ student visa lên PR Úc"
- "nghề IT visa Úc 2025"

---

## 7. Content Calendar (Next 3 Months)

### Month 1 (Priority)
- ✅ Điểm EOI visa 189/190/491 tính như thế nào
- ✅ Visa 189 vs 190 vs 491 so sánh
- ✅ Từ visa 491 lên PR nhanh nhất
- 🔲 IELTS cần bao nhiêu để apply skilled visa Úc

### Month 2
- 🔲 Skills assessment là gì? Cách apply từng nghề
- 🔲 Bang nào dễ apply visa 190 nhất năm 2025
- 🔲 Nghề nào đang thiếu tại Úc năm 2025 (SOL list)
- 🔲 EOI submit rồi phải chờ bao lâu?

### Month 3
- 🔲 Chi phí apply visa 189/190/491 hết bao nhiêu tiền?
- 🔲 Từ student visa lên skilled migration — lộ trình
- 🔲 Gia đình bảo lãnh diện regional visa 491
- 🔲 Q&A: Top 20 câu hỏi về skilled migration tiếng Việt
