import { useDeviceType } from "@/hooks/useDeviceType";
import BgDecoration from "@/components/shared/BgDecoration";
import NavBar from "@/components/shared/NavBar";
import StaffPanel from "@/components/staff/StaffPanel";

export default function StaffDashboard() {
  const { deviceType } = useDeviceType();

  return (
    <div className="min-h-screen relative">
      <BgDecoration />
      <NavBar deviceType={deviceType} />

      <main className="relative z-10 container mx-auto px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-foam-100 mb-6">👨‍🍳 员工管理面板</h1>
        <StaffPanel />
      </main>
    </div>
  );
}
