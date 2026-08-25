# Real photography — drop zone

Real GetAgeFit photography goes in the category folder it belongs to.
Once files land here, swap the corresponding `PhotoPlaceholder` usage for
`ResponsiveImage` with a real `src` (see `src/components/ui/ResponsiveImage.tsx` —
passing `src` is the only change needed, the component already falls back
to the abstract placeholder when `src` is omitted).

- `training/` — coaching in action: 1:1 and 1:2 sessions, form cues, movement
- `transformations/` — before/after and progress-story imagery for `/transformations`
- `clients/` — portraits and candid shots of real clients (testimonials, hero moments)
- `trainers/` — headshots and coaching shots for the `/trainers` roster
- `facility/` — the studio space itself
- `testimonials/` — client photos paired with quotes on the homepage

Keep filenames descriptive and slug-like (e.g. `client-janet-deadlift.jpg`),
since they'll be referenced directly as `/images/<category>/<file>` in
component `src` props.
