"use client";

import type { ReactNode } from "react";

export default function DetailShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-120px)] rounded-none bg-white ">
      <div className="">{children}</div>
    </div>
  );
}
