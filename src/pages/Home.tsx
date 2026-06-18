import { useDeviceType } from "@/hooks/useDeviceType";
import { useSeafoodStore } from "@/hooks/useSeafoodStore";
import BgDecoration from "@/components/shared/BgDecoration";
import NavBar from "@/components/shared/NavBar";
import TabBar from "@/components/shared/TabBar";
import SeafoodGrid from "@/components/seafood/SeafoodGrid";

export default function Home() {
  const { deviceType, isPhone } = useDeviceType();
  const seafoodList = useSeafoodStore((s) => s.seafoodList);

  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen relative">
      <BgDecoration />
      <NavBar deviceType={deviceType} />

      <main className="relative z-10 container mx-auto px-4 pt-6 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foam-100 mb-1">
            🐟 海鲜市集
          </h1>
          <p className="text-sm text-foam-300">{today}</p>
        </div>

        <SeafoodGrid seafoodList={seafoodList} deviceType={deviceType} />
      </main>

      {isPhone && <TabBar />}
    </div>
  );
}
