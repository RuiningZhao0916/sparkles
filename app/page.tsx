import SceneController from '@/components/SceneController';
import CTAOverlay from '@/components/CTAOverlay';

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <SceneController />
      <CTAOverlay />
    </div>
  );
}
