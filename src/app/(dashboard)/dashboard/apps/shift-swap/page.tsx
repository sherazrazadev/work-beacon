import type { Metadata } from "next";
import { ShiftSwapApp } from "@/components/dashboard/shift-swap-app";

export const metadata: Metadata = { title: "Shift Swap" };

export default function ShiftSwapPage() {
  return <ShiftSwapApp />;
}
