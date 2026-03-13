export function VsBlock({
  left,
  right,
}: {
  left: { value: string; label: string; color: string };
  right: { value: string; label: string; color: string };
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center my-6">
      <div className="bg-white border border-nora-border-light rounded-lg p-5 text-center">
        <div className="text-4xl font-bold" style={{ color: left.color }}>
          {left.value}
        </div>
        <div className="text-sm text-nora-grey mt-1">{left.label}</div>
      </div>
      <div className="text-2xl font-bold text-nora-grey-light">vs</div>
      <div className="bg-white border border-nora-border-light rounded-lg p-5 text-center">
        <div className="text-4xl font-bold" style={{ color: right.color }}>
          {right.value}
        </div>
        <div className="text-sm text-nora-grey mt-1">{right.label}</div>
      </div>
    </div>
  );
}
export default VsBlock;
