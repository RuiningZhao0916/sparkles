import { describe, expect, it } from 'vitest';
import {
  STAR_PHASE_ORDER,
  bundleAtSnoopy,
  bundleWithLydia,
  floorStarsVisible,
  isStarSceneTerminal,
} from '../lib/sceneHeroStars';

describe('sceneHeroStars', () => {
  it('orders phases from rest to complete', () => {
    expect(STAR_PHASE_ORDER[0]).toBe('rest');
    expect(STAR_PHASE_ORDER[STAR_PHASE_ORDER.length - 1]).toBe('complete');
  });

  it('marks complete as terminal', () => {
    expect(isStarSceneTerminal('complete')).toBe(true);
    expect(isStarSceneTerminal('rest')).toBe(false);
  });

  it('shows floor stars only while floor_lit', () => {
    expect(floorStarsVisible('floor_lit')).toBe(true);
    expect(floorStarsVisible('at_snoopy')).toBe(false);
    expect(floorStarsVisible('rest')).toBe(false);
  });

  it('tracks Snoopy bundle through travel phases', () => {
    expect(bundleAtSnoopy('at_snoopy')).toBe(true);
    expect(bundleAtSnoopy('to_lydia')).toBe(true);
    expect(bundleAtSnoopy('complete')).toBe(true);
    expect(bundleAtSnoopy('floor_lit')).toBe(false);
  });

  it('shows Lydia stars only when complete', () => {
    expect(bundleWithLydia('complete')).toBe(true);
    expect(bundleWithLydia('to_lydia')).toBe(false);
  });
});
