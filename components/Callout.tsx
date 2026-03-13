import { ReactNode } from "react";

type CalloutVariant = "default" | "blue" | "amber" | "red" | "green" | "purple";

const variantStyles: Record<CalloutVariant, string> = {
  default: "bg-[#f0f4e8] border-l-[#6b8e23]",
  blue: "bg-[#eef3fa] border-l-accent-blue",
  amber: "bg-[#fef9e7] border-l-accent-yellow",
  red: "bg-[#fdf0ef] border-l-accent-red",
  green: "bg-[#f0faf0] border-l-accent-green",
  purple: "bg-[#f5f0fa] border-l-accent-purple",
};

export function Callout({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: CalloutVariant;
}) {
  return (
    <div
      className={`border-l-4 rounded-r-lg p-4 px-5 my-5 text-[0.95rem] leading-relaxed ${variantStyles[variant]}`}
    >
      {children}
    </div>
  );
}
export default Callout;
