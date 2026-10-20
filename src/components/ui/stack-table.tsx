"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a <table>. From `sm` up: horizontal scroll container (unchanged).
 * Below `sm`: each row becomes a card; cell labels come from the <th> text
 * (CSS in globals.css, `.wb-stack-wrap`). Labels are applied as `data-label`.
 */
export function StackTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const label = () => {
      root.querySelectorAll("table").forEach((table) => {
        const headers: string[] = [];
        table.querySelectorAll("thead th").forEach((th) => {
          const span = Number((th as HTMLTableCellElement).colSpan) || 1;
          const text = (th.textContent ?? "").trim();
          for (let i = 0; i < span; i++) headers.push(text);
        });
        if (headers.length === 0) return;
        table.querySelectorAll("tbody tr").forEach((tr) => {
          let col = 0;
          Array.from(tr.children).forEach((cell) => {
            const td = cell as HTMLTableCellElement;
            const text = headers[col] ?? "";
            if (td.getAttribute("data-label") !== text) {
              td.setAttribute("data-label", text);
            }
            col += td.colSpan || 1;
          });
        });
      });
    };

    label();
    const observer = new MutationObserver(label);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("wb-stack-wrap overflow-x-auto", className)}
    >
      {children}
    </div>
  );
}
