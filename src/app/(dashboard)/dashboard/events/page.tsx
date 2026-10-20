import type { Metadata } from "next";
import { EventsLogView } from "@/components/dashboard/events-log-view";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return <EventsLogView />;
}
