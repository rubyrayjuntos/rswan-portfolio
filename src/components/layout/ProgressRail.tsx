import { cn } from "@/lib/utils";

type Props = {
  labels: string[];
  index: number;
  onPick: (i: number) => void;
};

export function ProgressRail({ labels, index, onPick }: Props) {
  const hint = `${String(index + 1).padStart(2, "0")} / ${String(labels.length).padStart(2, "0")} · ${labels[index] ?? ""}`;

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-2">
      <div className="kicker writing-vertical max-h-28 overflow-hidden text-mute-600">
        {hint}
      </div>
      <div className="flex flex-col gap-2" role="tablist" aria-label="Stage sections">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={label}
            title={label}
            onClick={() => onPick(i)}
            className={cn(
              "h-2 border border-steel-600 transition-[width,background-color] duration-200 ease-out",
              i === index ? "w-5 bg-steel-800" : "w-2 bg-transparent hover:bg-steel-300",
            )}
          />
        ))}
      </div>
      {index < labels.length - 1 ? (
        <button
          type="button"
          className="kicker writing-vertical max-h-24 overflow-hidden text-mute-600 hover:text-ink"
          onClick={() => onPick(index + 1)}
          aria-label={`Next: ${labels[index + 1]}`}
        >
          ↓ {labels[index + 1]}
        </button>
      ) : (
        <div className="kicker writing-vertical text-mute-600" aria-hidden>
          end
        </div>
      )}
    </div>
  );
}
