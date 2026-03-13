export function CinderellaCard({
  seed,
  team,
  detail,
  result,
}: {
  seed: number;
  team: string;
  detail: string;
  result: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 px-4 bg-white border border-nora-border-light rounded-lg mb-2">
      <div className="w-10 h-10 rounded-full bg-accent-yellow text-white flex items-center justify-center font-bold text-sm shrink-0">
        #{seed}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-nora-black">{team}</div>
        <div className="text-xs text-nora-grey">{detail}</div>
      </div>
      <div className="font-bold text-accent-green text-sm shrink-0">
        {result}
      </div>
    </div>
  );
}
export default CinderellaCard;
