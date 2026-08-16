import type { ReactNode } from "react";

import { LoadingScreen } from "./loading-screen";

export function HomeShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LoadingScreen />
      {children}
    </>
  );
}
