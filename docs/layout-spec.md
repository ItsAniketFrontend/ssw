# Landing page layout specification

## 1. Header

- Maximum content width: 1180 px
- Height: 84–96 px desktop, 72 px mobile
- Background: warm ivory paper texture
- Logo left; four navigation links and one primary enquiry button right

## 2. Hero

- Desktop height: 680–760 px
- Use `hero-retreat.webp`
- Add a subtle left-to-right transparent forest overlay so white copy remains readable
- Place copy in the right 45% on desktop and lower-left on mobile
- Use `hero-wave-mask.svg` or a CSS `clip-path` for the curved lower edge

## 3. Introduction

- Centered column, maximum width 720 px
- Use `leaf-divider.svg` above the heading
- Keep at least 96 px vertical whitespace above and below

## 4. Treatment cards

- Three equal columns desktop; one column mobile
- Image ratio 1:1
- Alternate one corner radius to create an organic but controlled rhythm
- Use decorative SVGs sparingly at 8–14% opacity

## 5. Personalised journey

- Two columns: 35% steps / 65% image
- Three numbered steps only
- Clip `consultation-journey.webp` with `consultation-arch-mask.svg`

## 6. Stay and enquiry

- Two-column 62/38 split
- `nature-stay-cottage.webp` on the left
- Deep moss CTA panel on the right with `water-ripples.svg` in one corner

## 7. Footer

- Single compact row on desktop; stacked on mobile
- Repeat official logo, location and four primary links

## Responsive breakpoints

- Large desktop: 1200 px+
- Tablet: 768–1199 px
- Mobile: below 768 px

## Accessibility

- Keep body copy at 16 px minimum
- Use colour contrast of at least 4.5:1 for body text
- Add descriptive alt text to treatment and accommodation imagery
- Decorations should use empty alt text or `aria-hidden="true"`
- Do not bake headlines or buttons into images

