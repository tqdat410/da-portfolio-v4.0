# Phase 4: /certificates Page

**Priority:** Medium | **Effort:** S | **Status:** Pending

## Overview

New page at `/certificates` using same FCL layout. Left = certificate groups list. Right = selected certificate detail with links.

## Files to Create

```
src/app/certificates/
└── page.tsx

src/components/certificates-page/
├── certificate-list-panel.tsx
└── certificate-detail-panel.tsx
```

## Data Source

Reuse `content.about.certificates.items` — array of `CertificateGroup` with nested `CertificateItem[]`.

Existing structure:
```ts
CertificateGroup { name, issuer, count, items: CertificateItem[] }
CertificateItem { name, provider, url }
```

## Implementation

### 4.1 Create page route
- `src/app/certificates/page.tsx`
- Metadata: `title: "Certificates"`

### 4.2 Certificate List Panel
- Two-level list: group headers (Coursera, Other) → individual certificates
- Each group: expandable/collapsible section (default expanded)
- Each item: certificate name, provider, link indicator
- Click item → detail panel shows full info

### 4.3 Certificate Detail Panel
- Certificate name (large heading)
- Provider/issuer
- Link to certificate (if url exists) — opens in new tab
- Simple, clean layout — not much data per certificate

### 4.4 Page Layout
- Same header pattern as /projects: title "Certificates", back link
- FCL layout for the content area
- Silver Mist theme

## Success Criteria
- [ ] All certificate groups and items displayed
- [ ] Click item → detail with link
- [ ] FCL splitter works
- [ ] Mobile stacked layout
