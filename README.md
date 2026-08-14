# Sri Sri Wellbeing — Landing Page

A lead-generation landing page for an Ayurvedic wellness retreat, built from the
approved prototype in `reference/approved-prototype.png`.

Static HTML/CSS/JS — no build step. Open `index.html` or serve the folder.

```bash
python -m http.server 5500
# then visit http://127.0.0.1:5500
```

## Structure

```
index.html              markup, inline SVG clip-path defs
styles/
  site.css              all page styles
  design-tokens.css     original supplied tokens (reference)
scripts/
  animations.js         GSAP + ScrollTrigger motion
  enquiry-modal.js      lead modal, validation, sticky CTA
vendor/                 GSAP 3.12.5 + ScrollTrigger (vendored, works offline)
images/                 png masters + webp
elements/               botanical SVG motifs and masks
logo/                   logo assets
docs/                   layout spec, image prompts
reference/              approved prototype
```

## Design system

Values come from the supplied `styles/design-tokens.css`.

- **Headings** — Cormorant Garamond 500
- **Body/UI** — Manrope 400–600
- **Palette** — ivory `#f4ebdd`, paper `#f8f1e7`, moss `#44563b`, forest `#273b29`,
  clay `#b86f4e`, brass `#b49a65`
- **Shapes** — the hero wave and consultation arch are inline `<clipPath>` defs using
  `objectBoundingBox` units, traced from `elements/*.svg` so they scale with the viewport.
  External `mask-image` was avoided — it failed to render.

## Lead capture

Eleven CTAs feed one modal: hero primary, three per-therapy card links, a post-cards
band, a journey CTA, a post-testimonials band, nav, footer, and a mobile sticky bar.

The modal is a real `aria-modal` dialog — focus moves to the first field, is trapped
while open, and returns to the trigger on close. Escape and overlay clicks dismiss.

Two conversion details:

- **Programme preselect** — a card link passes `data-programme`, so the form opens with
  that therapy already chosen.
- **Source attribution** — each lead records which CTA opened the modal, so you can tell
  which placements actually convert.

## ⚠️ Not production ready

1. **The form has no backend.** On submit it pushes an `enquiry_submitted` event to
   `window.dataLayer` and logs to console. The success message shows but *nothing is
   delivered*. Wire the marked block in `scripts/enquiry-modal.js` to your CRM.
2. **The logo is prototype-derived.** `logo-extracted-transparent.png` was extracted from
   the prototype. Replace it with the official brand vector.
3. **Imagery is AI-generated.** Per the original asset pack, confirm brand approval and any
   required disclosure before publishing.
4. **Testimonials are placeholder copy.** Replace with real, permissioned guest quotes —
   fabricated reviews are a legal risk in most markets.
5. Collecting names, emails and phone numbers brings privacy-policy and consent-record
   obligations. Add a linked privacy policy before going live.

## Accessibility

Skip link, semantic landmarks, visible focus rings, labelled form fields with
`aria-invalid` on error, `prefers-reduced-motion` honoured (animations bail out and
leave content visible), and descriptive alt text with decorative SVGs `aria-hidden`.
