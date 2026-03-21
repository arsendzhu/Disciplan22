import { AppShell } from "@/components/navigation/AppShell";
import { CanvasSyncProvider } from "@/components/providers/CanvasSyncProvider";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CanvasSyncProvider>
      <AppShell>{children}</AppShell>
    </CanvasSyncProvider>
  );
}
