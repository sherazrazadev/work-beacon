import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StackTable } from "@/components/ui/stack-table";

export function DataTable({
  children,
  empty,
  minWidth = "32rem",
}: {
  children?: ReactNode;
  empty?: ReactNode;
  minWidth?: string;
}) {
  if (empty) {
    return (
      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-8 text-sm text-[var(--fg-muted)]">
        {empty}
      </div>
    );
  }
  return (
    <StackTable>
      <table
        className="wb-table w-full border-collapse text-left text-sm"
        style={{ minWidth }}
      >
        {children}
      </table>
    </StackTable>
  );
}

export function Th({
  children,
  numeric,
  className,
}: {
  children?: ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]",
        numeric && "text-right",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  numeric,
  className,
}: {
  children: ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-[var(--border)] px-3 py-2 text-[var(--fg)]",
        numeric && "text-right tabular-nums",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return (
    <tr className="bg-[var(--surface)] transition-colors hover:bg-[var(--surface-muted)] focus-within:bg-[var(--surface-muted)]">
      {children}
    </tr>
  );
}
