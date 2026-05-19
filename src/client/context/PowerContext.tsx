import React, { createContext, useContext } from "react";
import { usePowerData } from "../hooks/usePowerData";

const PowerContext = createContext<ReturnType<typeof usePowerData> | null>(null);

export function PowerProvider({ children }: { children: React.ReactNode }) {
  const data = usePowerData(5000);
  return <PowerContext.Provider value={data}>{children}</PowerContext.Provider>;
}

export function usePower() {
  const ctx = useContext(PowerContext);
  if (!ctx) throw new Error("usePower must be used inside PowerProvider");
  return ctx;
}
