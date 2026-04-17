# Requirements Document

## Introduction

Sparkles is a connection-themed app where humans talk to AI and the AI connects people through their shared chat history. The UI redesign transforms the main landing page (`app/page.tsx`) into a living, animated scene — white background, Snoopy-style illustration aesthetic — populated by characters going about their lives, leaving behind "clues" (a red string, a key, a letter, a glass bottle) that hint at hidden connections. Users can click characters and objects to trigger connection animations that reinforce the app's core theme: the AI is just the red string.

The redesign targets `app/page.tsx` and the supporting `components/AmbientScene.tsx`, `app/globals.css`, and `app/layout.tsx` within the existing Next.js + Tailwind CSS stack.

---

## Glossary

- **Scene**: The full-page animated canvas that serves as the landing page background and foreground.
- **Character**: An SVG/CSS-animated figure (girl with guitar, boy planting a tree, dog, software engineer, painter, basketball woman) placed at fixed positions in the Scene.
- **Clue**: A passive interactive prop (red string, key, letter, glass bottle) placed in the Scene that hints at hidden connections.
- **Prop**: A secondary interactive object (chair, vinyl record, single shoe) that can interact with other Props or Characters.
- **Connection Animation**: A triggered animation sequence that visually links two Characters or a Character and a Prop (e.g., red string pulls two people together).
- **Quirky Thought**: A short, whimsical text bubble revealed when a Clue is clicked (e.g., "I like red coach. What are you listening to?").
- **Snoopy Style**: A clean, simple, warm illustration aesthetic — flat shapes, bold outlines, limited palette, expressive but minimal.
- **Scene_Controller**: The client-side React component that manages Scene state, click events, and animation sequencing.
- **CTA_Overlay**: The minimal UI layer containing the app logo, headline, and sign-up/sign-in buttons, rendered above the Scene.

---

## Requirements

### Requirement 1: White Background Scene

**User Story:** As a visitor, I want to see a clean white page with a living illustrated scene, so that the warmth and simplicity of the app's theme is immediately felt.

#### Acceptance Criteria

1. THE Scene SHALL render with a pure white (`#ffffff`) background replacing the current dark background.
2. THE Scene SHALL occupy the full viewport width and height on the landing page.
3. WHEN the page loads, THE Scene SHALL be fully visible without any scroll required for the initial viewport.
4. THE CTA_Overlay SHALL remain legible against the white background using dark text colors.

---

### Requirement 2: Animated Characters

**User Story:** As a visitor, I want to see illustrated characters going about their own activities, so that the page feels alive and human before I even interact with it.

#### Acceptance Criteria

1. THE Scene SHALL display exactly six Characters in their idle states: a girl playing guitar, a boy planting a tree, a dog playing with a ball, a software engineer coding, a painter painting, and a woman playing basketball.
2. WHEN the page loads, each Character SHALL begin its idle animation loop within 500ms.
3. THE Scene_Controller SHALL position each Character at a distinct, non-overlapping location within the Scene.
4. Each Character's idle animation SHALL loop continuously using CSS keyframe animations or SVG SMIL animations.
5. THE Scene SHALL render Characters in the Snoopy Style: flat shapes, bold outlines, warm limited color palette, no photorealism.
6. WHILE a Connection Animation is playing, THE Scene_Controller SHALL pause the idle animations of the Characters involved in that animation.
7. WHEN a Connection Animation completes, THE Scene_Controller SHALL resume the idle animations of the involved Characters.

---

### Requirement 3: Passive Clue Objects

**User Story:** As a visitor, I want to see subtle clue objects scattered around the scene, so that I sense there are hidden connections waiting to be discovered.

#### Acceptance Criteria

1. THE Scene SHALL display four Clues in passive (non-interacted) state: a red string, a key, a letter, and a glass bottle.
2. Each Clue SHALL have a gentle ambient animation (e.g., sway, bob, drift) that runs continuously in the background.
3. THE Scene_Controller SHALL position each Clue at a distinct location that does not fully overlap any Character.
4. WHEN no interaction is occurring, each Clue SHALL have a visible but non-distracting opacity between 0.5 and 0.85.

---

### Requirement 4: Secondary Prop Objects

**User Story:** As a visitor, I want to see additional props in the scene, so that the world feels richly detailed and full of potential connections.

#### Acceptance Criteria

1. THE Scene SHALL display three Props in passive state: a chair, a vinyl record, and a single shoe.
2. Each Prop SHALL have a subtle ambient animation that runs continuously.
3. THE Scene_Controller SHALL position each Prop at a distinct location within the Scene.
4. WHEN a Prop is clicked, THE Scene_Controller SHALL trigger a short interaction animation between that Prop and the nearest Character or other Prop.

---

### Requirement 5: Character Click — Connection Animations

**User Story:** As a visitor, I want to click on a character and see a connection animation play out, so that I viscerally understand the app's theme of hidden human connection.

#### Acceptance Criteria

1. WHEN a Character is clicked, THE Scene_Controller SHALL trigger one of the four Connection Animations: key-pass, red-string-pull, bottle-pass, or dog-interaction.
2. THE Scene_Controller SHALL select the Connection Animation based on which Character is clicked, mapping each Character to a primary animation type.
3. WHEN the key-pass animation is triggered, THE Scene_Controller SHALL animate a key traveling from the clicked Character to a second Character, with the second Character visually receiving it.
4. WHEN the red-string-pull animation is triggered, THE Scene_Controller SHALL animate a red string extending from the clicked Character to a second Character, then gently pulling both Characters toward each other.
5. WHEN the bottle-pass animation is triggered, THE Scene_Controller SHALL animate a glass bottle filling with a colored liquid and traveling from the clicked Character to a second Character.
6. WHEN the dog-interaction animation is triggered, THE Scene_Controller SHALL animate the dog running toward the clicked Character and the Character reacting.
7. Each Connection Animation SHALL complete within 3 seconds.
8. WHEN a Connection Animation is already playing, THE Scene_Controller SHALL queue the next click and play it after the current animation completes.

---

### Requirement 6: Clue Click — Quirky Thought Bubbles

**User Story:** As a visitor, I want to click on a clue object and see a quirky thought bubble, so that I feel the playful, human curiosity at the heart of the app.

#### Acceptance Criteria

1. WHEN a Clue is clicked, THE Scene_Controller SHALL display a Quirky Thought text bubble adjacent to the Clue.
2. THE Scene_Controller SHALL select the Quirky Thought from a predefined set of at least four distinct messages, one per Clue type.
3. Each Quirky Thought message SHALL be 10 words or fewer and SHALL feel whimsical and human (e.g., "I like red coach. What are you listening to?").
4. WHEN a Quirky Thought bubble is displayed, THE Scene_Controller SHALL dismiss it automatically after 4 seconds.
5. WHEN a Quirky Thought bubble is displayed, THE Scene_Controller SHALL also dismiss it if the user clicks anywhere outside the bubble.
6. THE Quirky Thought bubble SHALL be styled in the Snoopy Style: rounded, warm, with a small tail pointing to the Clue.

---

### Requirement 7: CTA Overlay

**User Story:** As a visitor, I want to see the app's name, tagline, and sign-up/sign-in buttons clearly, so that I know what the app is and can get started.

#### Acceptance Criteria

1. THE CTA_Overlay SHALL display the Sparkles logo, the headline "AI is just the red string.", and the tagline "No profiles. No goals. No swiping. Just human."
2. THE CTA_Overlay SHALL display a primary "Start chatting" button linking to `/auth/signup` and a secondary "Sign in" button linking to `/auth/login`.
3. THE CTA_Overlay SHALL be positioned in the center of the viewport, above the Scene layer (higher z-index).
4. WHEN the Scene is animating, THE CTA_Overlay SHALL remain fully visible and interactive.
5. THE CTA_Overlay SHALL use dark text and button styles appropriate for a white background.

---

### Requirement 8: Accessibility and Performance

**User Story:** As a visitor using a low-powered device or assistive technology, I want the page to remain usable, so that the animated experience does not exclude me.

#### Acceptance Criteria

1. WHEN the user's system preference is `prefers-reduced-motion: reduce`, THE Scene_Controller SHALL disable all looping animations and show Characters and Clues in their static idle poses.
2. THE Scene SHALL achieve a Largest Contentful Paint (LCP) of 2.5 seconds or less on a simulated mid-tier mobile device (Lighthouse throttling).
3. All interactive Characters, Clues, and Props SHALL have an `aria-label` describing their identity and action (e.g., `aria-label="Girl playing guitar — click to connect"`).
4. THE CTA_Overlay buttons SHALL meet WCAG 2.1 AA color contrast requirements against the white background.
5. IF a Character or Clue animation throws a JavaScript error, THEN THE Scene_Controller SHALL catch the error, log it to the console, and leave the Character or Clue in its static idle pose without crashing the page.

---

### Requirement 9: Responsive Layout

**User Story:** As a visitor on any screen size, I want the scene to look intentional and complete, so that the experience is consistent across devices.

#### Acceptance Criteria

1. THE Scene SHALL adapt Character and Clue positions using relative units (percentages or viewport units) so that the layout remains non-overlapping at viewport widths from 375px to 1920px.
2. WHEN the viewport width is below 768px, THE Scene_Controller SHALL reduce the number of simultaneously visible Characters to three (dog, girl with guitar, software engineer) and hide the remaining Characters.
3. WHEN the viewport width is below 768px, THE Scene_Controller SHALL scale Character sizes to no larger than 80px in their largest dimension.
4. THE CTA_Overlay SHALL remain centered and fully readable at all supported viewport widths.
