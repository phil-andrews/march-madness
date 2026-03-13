import { ReactNode } from "react";

type CellAlignment = "left" | "right" | "center";

export function DataTable({
  headers,
  rows,
  alignments,
  highlightRows,
  headerColor,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  alignments?: CellAlignment[];
  highlightRows?: number[];
  headerColor?: string;
}) {
  const bgColor = headerColor || "bg-nora-black";

  return (
    <div className="overflow-x-auto my-5">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={`${bgColor} text-white py-2.5 px-3 font-semibold ${
                  alignments?.[i] === "right" ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-nora-border-light hover:bg-nora-atlas/60 ${
                highlightRows?.includes(ri)
                  ? "bg-accent-purple/5 font-semibold"
                  : ri % 2 === 1
                    ? "bg-nora-atlas/30"
                    : ""
              }`}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-2 px-3 ${
                    alignments?.[ci] === "right"
                      ? "text-right tabular-nums"
                      : "text-left"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;
