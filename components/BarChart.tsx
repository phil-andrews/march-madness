type BarRow = {
  label: string;
  value: string;
  width: number; // percentage 0-100
  color?: "blue" | "orange" | "green" | "red" | "purple";
};

const gradientMap: Record<string, string> = {
  blue: "from-[#3A6EA5] to-[#2E5090]",
  orange: "from-[#e67e22] to-[#d35400]",
  green: "from-[#27ae60] to-[#1e8449]",
  red: "from-[#e74c3c] to-[#c0392b]",
  purple: "from-[#6b2fa0] to-[#8e44ad]",
};

export function BarChart({
  rows,
  title,
  caption,
}: {
  rows: BarRow[];
  title?: string;
  caption?: string;
}) {
  return (
    <div className="bg-white border border-nora-border-light rounded-lg p-5 my-5">
      {title && (
        <h3 className="text-base font-bold text-center mb-4 text-nora-black">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-[180px] text-sm text-nora-grey-dark text-right shrink-0">
              {row.label}
            </div>
            <div className="flex-1 h-7 bg-nora-border-light/50 rounded overflow-hidden">
              <div
                className={`h-full rounded bg-gradient-to-r ${gradientMap[row.color || "blue"]} flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all duration-500`}
                style={{ width: `${Math.max(row.width, 8)}%` }}
              >
                {row.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <p className="text-sm text-nora-grey text-center mt-3">{caption}</p>
      )}
    </div>
  );
}
export default BarChart;
