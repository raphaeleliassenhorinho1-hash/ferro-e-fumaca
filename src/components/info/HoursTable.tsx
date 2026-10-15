"use client";

import { useNow } from "@/hooks/useNow";
import { describeDay, WEEKDAY_NAMES, zonedNow } from "@/lib/hours";

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // segunda → domingo

export function HoursTable({ className = "" }: { className?: string }) {
  const now = useNow();
  const today = now ? zonedNow(now).weekday : null;
  return (
    <table className={`w-full text-left ${className}`}>
      <caption className="sr-only">Horários de funcionamento</caption>
      <tbody>
        {ORDER.map((day) => {
          const isToday = day === today;
          return (
            <tr key={day} aria-current={isToday ? "date" : undefined} className={`border-b border-osso/10 ${isToday ? "text-brasa" : ""}`}>
              <th scope="row" className="py-2.5 font-semibold capitalize">
                {WEEKDAY_NAMES[day]}
                {isToday && <span className="ml-2 bg-brasa px-1.5 py-0.5 text-xs font-bold text-carvao uppercase">Hoje</span>}
              </th>
              <td className="py-2.5 text-right">{describeDay(day)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
