/**
 * Small pure helpers for the landing hero star sequence (used by SceneController + tests).
 */

export type StarScenePhase = 'rest' | 'floor_lit' | 'at_snoopy' | 'to_lydia' | 'complete';

export const STAR_PHASE_ORDER: StarScenePhase[] = [
  'rest',
  'floor_lit',
  'at_snoopy',
  'to_lydia',
  'complete',
];

export function isStarSceneTerminal(phase: StarScenePhase): boolean {
  return phase === 'complete';
}

export function floorStarsVisible(phase: StarScenePhase): boolean {
  return phase === 'floor_lit';
}

export function bundleAtSnoopy(phase: StarScenePhase): boolean {
  return phase === 'at_snoopy' || phase === 'to_lydia' || phase === 'complete';
}

/** Lydia’s received stars — only after the handoff finishes */
export function bundleWithLydia(phase: StarScenePhase): boolean {
  return phase === 'complete';
}
