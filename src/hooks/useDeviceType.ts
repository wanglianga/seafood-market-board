import { useState, useEffect } from "react";
import type { DeviceType } from "@/lib/types";

function detectDevice(): DeviceType {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width >= 1920 && height >= 800) return "board";
  if (width >= 768 && width < 1920) return "tablet";
  if (width < 768) return "phone";
  return "desktop";
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(detectDevice);

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(detectDevice());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isPhone = deviceType === "phone";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";
  const isBoard = deviceType === "board";

  return { deviceType, isPhone, isTablet, isDesktop, isBoard };
}
