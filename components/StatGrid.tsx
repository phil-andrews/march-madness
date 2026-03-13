import { ReactNode } from "react";

type StatCardProps = {
  value: string;
  label: string | ReactNode;
  color?: "green" | "red" | "blue" | "amber" | "default";
};

const colorMap: Record<string, string> = {
  green: "text-accent-green",
  red: "text-accent-red",
  blue: "text-accent-blue",
  amber: "text-accent-yellow",
  default: "text-nora-black",
};

export function StatGrid({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 my-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white border border-nora-border-light rounded-lg p-5 text-center"
        >
          <div
            className={`text-4xl font-bold leading-tight ${colorMap[stat.color || "default"]}`}
          >
            {stat.value}
          </div>
          <div className="text-sm text-nora-grey mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
export default StatGrid;
