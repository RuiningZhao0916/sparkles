# Tasks

## Task List

- [x] 1. Update global styles and layout for white background
  - [x] 1.1 In `app/globals.css`, replace `--background: #0a0a0f` with `--background: #ffffff` and `--foreground` with `#1a1a1a`; add new keyframe animations for characters (idle bob, guitar strum, tree-plant, dog-bounce, type-tap, brush-stroke, ball-dribble), clues (sway, bob, drift), and props (chair-rock, record-spin, shoe-tap)
  - [x] 1.2 In `app/layout.tsx`, remove the `<AmbientScene />` import and usage; update `<body>` className to use white background (`bg-white`) and dark text; remove the old dark-background classes

- [x] 2. Build the SceneController component
  - [x] 2.1 Create `components/SceneController.tsx` as a `"use client"` component; define `CharacterId`, `ClueId`, `PropId`, `AnimationType` types; define `CHARACTERS`, `CLUES`, `PROPS` data maps with positions, animation mappings, and aria-labels as specified in the design
  - [x] 2.2 Implement `useReducedMotion()` hook inside the file using `window.matchMedia('(prefers-reduced-motion: reduce)')` with a change listener; default to `false` on SSR
  - [x] 2.3 Implement scene state: `characterStates`, `activeAnimation`, `animationQueue`, `activeThought` using `useReducer` or `useState`
  - [x] 2.4 Implement `handleCharacterClick(id)`: if animation is playing, enqueue; otherwise set involved characters to `paused`, set `activeAnimation`, schedule resume after 3000ms (or animation end), then dequeue next
  - [x] 2.5 Implement `handleClueClick(id)`: set `activeThought` with the clue's message; schedule auto-dismiss after 4000ms
  - [x] 2.6 Implement `handlePropClick(id)`: find nearest character or prop, trigger a short interaction animation on that neighbor
  - [x] 2.7 Wrap all animation sequences in try/catch; on error log to console and reset involved characters to `idle`
  - [x] 2.8 Render `<Character>`, `<Clue>`, `<Prop>` sub-components and `<ThoughtBubble>` conditionally; apply `reducedMotion` flag to suppress animation classes when active

- [x] 3. Build Character, Clue, Prop, and ThoughtBubble sub-components
  - [x] 3.1 Create `components/scene/Character.tsx`: renders an SVG/CSS figure for each `CharacterId`; applies idle animation CSS class when `state === 'idle'`; removes animation class when `state === 'paused'`; accepts `onClick`, `ariaLabel`, `position`, `size` props; hides via CSS when `hidden` prop is true
  - [x] 3.2 Draw inline SVG shapes for all six characters in Snoopy style (flat shapes, bold outlines, warm palette): guitar-girl, tree-boy, dog, software-engineer, painter, basketball-woman
  - [x] 3.3 Create `components/scene/Clue.tsx`: renders SVG/CSS clue for each `ClueId` (red-string, key, letter, bottle); applies ambient animation CSS class; sets opacity between 0.5–0.85 in idle state; accepts `onClick`, `ariaLabel`, `position` props
  - [x] 3.4 Create `components/scene/Prop.tsx`: renders SVG/CSS prop for each `PropId` (chair, vinyl-record, shoe); applies ambient animation CSS class; accepts `onClick`, `ariaLabel`, `position` props
  - [x] 3.5 Create `components/scene/ThoughtBubble.tsx`: renders a rounded speech bubble with a small tail; displays `message`; calls `onDismiss` on outside click (document click listener) and after 4s timer; styled in Snoopy style (warm white fill, bold border, rounded corners)

- [x] 4. Implement connection animations
  - [x] 4.1 Add CSS keyframes in `globals.css` for `key-pass` (key travels horizontally between two points), `red-string-pull` (string extends then contracts pulling two elements), `bottle-pass` (bottle arcs from one position to another), `dog-run` (dog moves toward target)
  - [x] 4.2 In `SceneController`, implement the `key-pass` animation: animate a key SVG element from the clicked character's position to the target character's position over 3s; target character plays a "receive" reaction
  - [x] 4.3 Implement `red-string-pull`: animate an SVG line extending from clicked character to target, then translate both characters slightly toward each other, then retract
  - [x] 4.4 Implement `bottle-pass`: animate a bottle SVG filling with color then arcing to the target character over 3s
  - [x] 4.5 Implement `dog-interaction`: animate the dog character moving toward the clicked character; clicked character plays a reaction animation

- [x] 5. Build the CTA Overlay
  - [x] 5.1 Create `components/CTAOverlay.tsx`: pure presentational component; renders Sparkles logo (Lucide `<Sparkles>` icon + "sparkle" text), `<h1>` with "AI is just the red string.", tagline paragraph, "Start chatting" `<Link href="/auth/signup">` button, "Sign in" `<Link href="/auth/login">` button
  - [x] 5.2 Style CTA_Overlay: `position: fixed`, centered via flexbox, `z-index: 20`; dark text (`text-gray-900`); primary button with orange gradient; secondary button with dark border; ensure both buttons meet WCAG 2.1 AA contrast on white background

- [x] 6. Update app/page.tsx
  - [x] 6.1 Replace the current `app/page.tsx` content with a thin shell that renders `<SceneController />` (full-viewport, `z-index: 0`) and `<CTAOverlay />` (`z-index: 20`) side by side in a relative container

- [x] 7. Implement responsive behavior
  - [x] 7.1 In `SceneController`, use a `useEffect` + `ResizeObserver` (or `window.innerWidth` check) to track viewport width; when width < 768px, pass `hidden={true}` to tree-boy, painter, and basketball-woman characters
  - [x] 7.2 In `Character.tsx`, when `hidden` prop is true, render `null` (or `display: none`); when viewport < 768px, cap the character's rendered size to 80px via a CSS class or inline style
  - [x] 7.3 Ensure all character and clue positions use percentage/viewport units so layout remains non-overlapping from 375px to 1920px

- [x] 8. Write property-based tests
  - [x] 8.1 Install `fast-check` as a dev dependency
  - [x] 8.2 Create `__tests__/sceneController.property.test.ts`; write Property 1 test (animation queue ordering) using `fc.array(fc.constantFrom(...characterIds), { minLength: 1 })`
  - [x] 8.3 Write Property 2 test (character state invariant during animation): for any animation type, assert characters transition `idle → paused → idle`
  - [x] 8.4 Write Property 3 test (thought bubble auto-dismiss): for any clue ID, click clue, advance fake timer 4000ms, assert `activeThought === null`
  - [x] 8.5 Write Property 4 test (thought bubble content validity): for any clue ID, assert message is non-empty and word count ≤ 10
  - [x] 8.6 Write Property 5 test (character click triggers correct animation): for any character ID, assert triggered animation matches `CHARACTERS[id].animation`
  - [x] 8.7 Write Property 6 test (reduced-motion disables all loops): with `reducedMotion=true`, assert no animation CSS class on any rendered element
  - [x] 8.8 Write Property 7 test (responsive character visibility): for any width in [375, 767], assert visible character IDs === `{dog, guitar-girl, software-engineer}`
  - [x] 8.9 Write Property 8 test (responsive character size): for any width in [375, 767], assert all visible character sizes ≤ 80px
  - [x] 8.10 Write Property 9 test (aria-label presence): for any interactive element ID, assert `aria-label` is a non-empty string
  - [x] 8.11 Write Property 10 test (error resilience): inject error into animation, assert scene still renders and character is in `idle` state
  - [x] 8.12 Write Property 11 test (non-overlapping layout): for any viewport width in [375, 1920], assert no two bounding boxes fully overlap
