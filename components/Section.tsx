import { ReactNode } from "react";

export function Section({
  title,
  tagline,
  children,
}: {
  title: ReactNode;
  tagline?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white border border-nora-border-light rounded-xl shadow-sm p-8 mb-8">
      <h2 className="text-2xl font-bold text-nora-black mb-1.5">{title}</h2>
      {tagline && (
        <div className="text-base font-semibold text-accent-blue mb-4 pb-4 border-b border-nora-border-light">
          {tagline}
        </div>
      )}
      <div className="text-[0.95rem] leading-relaxed space-y-3.5">
        {children}
      </div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="text-center py-5">
      <span className="inline-block w-14 h-0.5 bg-accent-blue rounded" />
    </div>
  );
}

export default Section;
