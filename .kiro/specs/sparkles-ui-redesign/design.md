# Design Document: Sparkles UI Redesign

## Overview

The Sparkles UI redesign transforms the landing page from a dark, text-centric layout into a full-viewport, white-background animated scene in the Snoopy illustration style. Six characters go about their lives across the canvas; four clue objects and three props are scattered around them. Clicking characters triggers connection animations; clicking clues reveals quirky thought bubbles. A minimal CTA overlay floats above the scene.

The implementation targets four files:
- `app/page.tsx` — replaced with a thin shell that composes `Scene_Controller` and `CTA_Overlay`
- `components/AmbientScene.tsx` — replaced with the new `Scene_Controller` component
- `app/globals.css` — updated with new keyframes, character/clue/prop CSS classes, and white-background overrides
- `app/layout.tsx` — updated to remove the dark background and stop rendering the old `AmbientScene`

No new dependencies are required. All animation is CSS keyframes + React state.

---

## Architecture

```
app/layout.tsx
  └─ <body>  (white bg, no AmbientScene)
       └─ {children}  (z-index 10)

app/page.tsx
  └─ <SceneController>          (full-viewport, z-index 0)
       ├─ <Character> × 6
       ├─ <Clue> × 4
       ├─ <Prop> × 3
       └─ <ThoughtBubble>       (conditionally rendered)
  └─ <CTAOverlay>               (z-index 20, centered)
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| `SceneController` | Owns all scene state; handles click events; sequences animations; enforces the animation queue; applies `prefers-reduced-motion` |
| `Character` | Renders a single SVG/CSS character; accepts `idle \| animating \| paused` state; exposes click handler |
| `Clue` | Renders a single clue prop; accepts `idle \| active` state; exposes click handler |
| `Prop` | Renders a secondary prop; accepts `idle \| animating` state; exposes click handler |
| `ThoughtBubble` | Renders a Snoopy-style speech bubble with auto-dismiss timer |
| `CTAOverlay` | Pure presentational; logo, headline, tagline, two CTA buttons |

### State Flow

```
User click
  → SceneController.handleClick(target)
      → if animation playing: enqueue
      → else: dispatch animation action
          → set involved characters to "paused"
          → run CSS animation sequence (3 s max)
          → on complete: resume characters, dequeue next
```

---

## Components and Interfaces

### SceneController

```tsx
type AnimationType = 'key-pass' | 'red-string-pull' | 'bottle-pass' | 'dog-interaction';
type CharacterId = 'guitar-girl' | 'tree-boy' | 'dog' | 'software-engineer' | 'painter' | 'basketball-woman';
type ClueId = 'red-string' | 'key' | 'letter' | 'bottle';
type PropId = 'chair' | 'vinyl-record' | 'shoe';

interface SceneState {
  characterStates: Record<CharacterId, 'idle' | 'animating' | 'paused'>;
  activeAnimation: AnimationType | null;
  animationQueue: AnimationType[];
  activeThought: { clueId: ClueId; message: string } | null;
  reducedMotion: boolean;
}
```

### Character Component

```tsx
interface CharacterProps {
  id: CharacterId;
  state: 'idle' | 'animating' | 'paused';
  position: { x: string; y: string };   // viewport-relative, e.g. "15%" "70%"
  size: number;                          // base px, scaled via CSS at breakpoints
  onClick: (id: CharacterId) => void;
  ariaLabel: string;
}
```

### Clue Component

```tsx
interface ClueProps {
  id: ClueId;
  state: 'idle' | 'active';
  position: { x: string; y: string };
  onClick: (id: ClueId) => void;
  ariaLabel: string;
}
```

### Prop Component

```tsx
interface PropProps {
  id: PropId;
  state: 'idle' | 'animating';
  position: { x: string; y: string };
  onClick: (id: PropId) => void;
  ariaLabel: string;
}
```

### ThoughtBubble Component

```tsx
interface ThoughtBubbleProps {
  message: string;
  anchorPosition: { x: string; y: string };
  onDismiss: () => void;
}
```

### CTAOverlay Component

```tsx
// Pure presentational — no props needed
// Renders: logo, h1, tagline, two Link buttons
```

---

## Data Models

### Character Definitions

Each character has a fixed layout position (percentage-based), a primary connection animation, and a mobile visibility flag.

```ts
const CHARACTERS: Record<CharacterId, {
  label: string;
  position: { x: string; y: string };
  animation: AnimationType;
  mobileVisible: boolean;
  ariaLabel: string;
}> = {
  'guitar-girl':        { label: 'Girl playing guitar',      position: { x: '10%', y: '60%' }, animation: 'red-string-pull',  mobileVisible: true,  ariaLabel: 'Girl playing guitar — click to connect' },
  'tree-boy':           { label: 'Boy planting a tree',      position: { x: '25%', y: '65%' }, animation: 'bottle-pass',      mobileVisible: false, ariaLabel: 'Boy planting a tree — click to connect' },
  'dog':                { label: 'Dog playing with a ball',  position: { x: '50%', y: '72%' }, animation: 'dog-interaction',  mobileVisible: true,  ariaLabel: 'Dog playing with a ball — click to connect' },
  'software-engineer':  { label: 'Software engineer coding', position: { x: '68%', y: '62%' }, animation: 'key-pass',         mobileVisible: true,  ariaLabel: 'Software engineer coding — click to connect' },
  'painter':            { label: 'Painter painting',         position: { x: '82%', y: '68%' }, animation: 'red-string-pull',  mobileVisible: false, ariaLabel: 'Painter painting — click to connect' },
  'basketball-woman':   { label: 'Woman playing basketball', position: { x: '40%', y: '58%' }, animation: 'bottle-pass',      mobileVisible: false, ariaLabel: 'Woman playing basketball — click to connect' },
};
```

### Clue Definitions

```ts
const CLUES: Record<ClueId, {
  position: { x: string; y: string };
  thought: string;
  ariaLabel: string;
}> = {
  'red-string': { position: { x: '30%', y: '40%' }, thought: 'I like red coach. What are you listening to?',  ariaLabel: 'Red string — click to discover' },
  'key':        { position: { x: '60%', y: '35%' }, thought: 'Someone left this. Maybe it opens something.',   ariaLabel: 'Key — click to discover' },
  'letter':     { position: { x: '15%', y: '30%' }, thought: 'Unsent. Still warm.',                            ariaLabel: 'Letter — click to discover' },
  'bottle':     { position: { x: '78%', y: '45%' }, thought: 'A message, waiting for the right tide.',         ariaLabel: 'Glass bottle — click to discover' },
};
```

### Prop Definitions

```ts
const PROPS: Record<PropId, {
  position: { x: string; y: string };
  ariaLabel: string;
}> = {
  'chair':        { position: { x: '20%', y: '75%' }, ariaLabel: 'Chair — click to interact' },
  'vinyl-record': { position: { x: '55%', y: '50%' }, ariaLabel: 'Vinyl record — click to interact' },
  'shoe':         { position: { x: '88%', y: '78%' }, ariaLabel: 'Single shoe — click to interact' },
};
```

### Animation Durations

```ts
const ANIMATION_DURATION_MS = 3000; // max per requirement 5.7
const THOUGHT_DISMISS_MS    = 4000; // per requirement 6.4
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Animation queue ordering

*For any* sequence of character clicks, the connection animations SHALL play in the exact order they were triggered — no animation is skipped or reordered.

**Validates: Requirements 5.8**

### Property 2: Character state invariant during animation

*For any* connection animation type and any pair of involved characters, those characters SHALL be in the `paused` state for the entire duration of the animation, and SHALL return to `idle` immediately after the animation completes.

**Validates: Requirements 2.6, 2.7**

### Property 3: Thought bubble auto-dismiss

*For any* clue click, the thought bubble displayed SHALL be automatically dismissed after 4 seconds if no other dismissal event occurs first.

**Validates: Requirements 6.4**

### Property 4: Thought bubble content validity

*For any* clue ID, the thought message returned SHALL be non-empty and SHALL contain 10 words or fewer.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 5: Character click triggers correct animation

*For any* character ID, clicking that character SHALL trigger a non-null animation, and the animation type SHALL match the character's predefined animation mapping.

**Validates: Requirements 5.1, 5.2**

### Property 6: Reduced-motion disables all loops

*For any* scene state, when `prefers-reduced-motion: reduce` is active, no character, clue, or prop SHALL have a running CSS animation — all elements SHALL be in their static idle pose.

**Validates: Requirements 8.1**

### Property 7: Responsive character visibility

*For any* viewport width in [375, 767], the set of visible characters SHALL be exactly `{dog, guitar-girl, software-engineer}` — no more, no fewer.

**Validates: Requirements 9.2**

### Property 8: Responsive character size

*For any* viewport width in [375, 767], all visible characters SHALL have a rendered size no larger than 80px in their largest dimension.

**Validates: Requirements 9.3**

### Property 9: All interactive elements have aria-label

*For any* character, clue, or prop rendered in the scene, the element SHALL have a non-empty `aria-label` attribute describing its identity and action.

**Validates: Requirements 8.3**

### Property 10: Error resilience

*For any* animation that throws a JavaScript error, the scene SHALL remain rendered and the involved character or clue SHALL be left in its static idle pose without crashing the page.

**Validates: Requirements 8.5**

### Property 11: Non-overlapping layout across viewport range

*For any* viewport width in [375, 1920], no two character or clue bounding boxes SHALL fully overlap each other.

**Validates: Requirements 9.1, 2.3, 3.3**

---

## Error Handling

### Animation Errors

`SceneController` wraps each animation sequence in a `try/catch`. On error:
1. Log to `console.error` with the animation type and character IDs.
2. Reset all involved characters to `idle`.
3. Clear `activeAnimation` and process the next item in the queue.
4. Leave the scene otherwise intact (requirement 8.5).

### Thought Bubble Errors

If the thought message lookup fails (e.g., unknown clue ID), the bubble is not shown and the error is logged silently.

### Reduced-Motion Detection

`useReducedMotion()` hook reads `window.matchMedia('(prefers-reduced-motion: reduce)')` and subscribes to changes. If the media query API is unavailable (SSR), it defaults to `false` (animations enabled) and re-evaluates on the client.

---

## Testing Strategy

### Unit Tests

- `SceneController` queue logic: verify FIFO ordering, verify queue drains correctly after each animation.
- `ThoughtBubble` dismiss timer: verify auto-dismiss fires after 4 s; verify early dismiss on outside click.
- Character/Clue/Prop render: verify correct `aria-label` attributes; verify correct CSS class applied per state.
- Responsive visibility: verify character hide/show logic at 375 px, 767 px, 768 px, 1920 px breakpoints.
- Thought message lookup: verify each clue ID returns a non-empty string ≤ 10 words.

### Property-Based Tests

Using **fast-check** (TypeScript PBT library), minimum 100 iterations per property:

- **Property 1** — `fc.array(fc.constantFrom(...characterIds), { minLength: 1 })` → simulate click sequence → assert animation log matches input order.
  Tag: `Feature: sparkles-ui-redesign, Property 1: animation queue ordering`

- **Property 2** — `fc.constantFrom(...animationTypes)` → run animation → assert character states transition `idle → paused → idle`.
  Tag: `Feature: sparkles-ui-redesign, Property 2: character state invariant during animation`

- **Property 3** — `fc.constantFrom(...clueIds)` → click clue → advance fake timer by 4000 ms → assert `activeThought === null`.
  Tag: `Feature: sparkles-ui-redesign, Property 3: thought bubble auto-dismiss`

- **Property 4** — `fc.constantFrom(...clueIds)` → get thought message → assert `message.length > 0 && message.split(' ').length <= 10`.
  Tag: `Feature: sparkles-ui-redesign, Property 4: thought bubble content validity`

- **Property 5** — `fc.constantFrom(...characterIds)` → click character → assert `activeAnimation === CHARACTERS[id].animation`.
  Tag: `Feature: sparkles-ui-redesign, Property 5: character click triggers correct animation`

- **Property 6** — `fc.constant(true)` (reducedMotion=true) → render scene → assert no animation class on any element.
  Tag: `Feature: sparkles-ui-redesign, Property 6: reduced-motion disables all loops`

- **Property 7** — `fc.integer({ min: 375, max: 767 })` → render scene at that width → assert visible character IDs === `{dog, guitar-girl, software-engineer}`.
  Tag: `Feature: sparkles-ui-redesign, Property 7: responsive character visibility`

- **Property 8** — `fc.integer({ min: 375, max: 767 })` → render scene at that width → assert all visible character sizes ≤ 80px.
  Tag: `Feature: sparkles-ui-redesign, Property 8: responsive character size`

- **Property 9** — `fc.constantFrom(...allInteractiveIds)` → render element → assert `aria-label` attribute is non-empty string.
  Tag: `Feature: sparkles-ui-redesign, Property 9: all interactive elements have aria-label`

- **Property 10** — `fc.constantFrom(...animationTypes)` → inject error into animation → assert scene still renders and character is in `idle` state.
  Tag: `Feature: sparkles-ui-redesign, Property 10: error resilience`

- **Property 11** — `fc.integer({ min: 375, max: 1920 })` → compute bounding boxes at that width → assert no two boxes fully overlap.
  Tag: `Feature: sparkles-ui-redesign, Property 11: non-overlapping layout across viewport range`

### Integration / Smoke Tests

- Verify the landing page renders without JS errors in a headless browser (Playwright smoke test).
- Verify LCP ≤ 2.5 s via Lighthouse CI on the deployed preview URL.
- Verify CTA buttons link to `/auth/signup` and `/auth/login` respectively.
- Verify each of the four connection animation types plays visually (Playwright visual regression).
