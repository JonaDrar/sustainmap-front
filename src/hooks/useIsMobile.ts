import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobileDevice(window.innerWidth < breakpoint);
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < breakpoint);
  }, [breakpoint]);

  return isMobileDevice;
};

export default useIsMobile;