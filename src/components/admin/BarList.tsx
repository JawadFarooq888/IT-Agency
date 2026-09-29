/**
 * Horizontal bar chart built as a table: one series, one hue, values labelled.
 * The table markup doubles as the accessible data view.
 */
export function BarList({
  caption,
  rows,
  total,
}: {
  caption: string;
  rows: { label: string; value: number }[];
  total: number;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <table className="w-full border-separate border-spacing-y-2.5 text-[15px]">
      <caption className="sr-only">{caption}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Chart</th>
          <th scope="col">Leads</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const share = total ? Math.round((r.value / total) * 100) : 0;
          return (
            <tr key={r.label} className="group" title={`${r.label}: ${r.value} leads (${share}%)`}>
              <th scope="row" className="w-[42%] pr-3 text-left font-normal text-ink">
                <span className="line-clamp-1">{r.label}</span>
              </th>
              <td className="w-[46%] align-middle">
                <div className="h-2.5 w-full">
                  <div
                    className="h-full min-w-[2px] rounded-r-[4px] bg-accent transition-opacity group-hover:opacity-80"
                    style={{ width: `${(r.value / max) * 100}%` }}
                  />
                </div>
              </td>
              <td className="pl-3 text-right whitespace-nowrap text-ink tabular-nums">
                {r.value}
                <span className="ml-1.5 text-xs text-muted">{share}%</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
