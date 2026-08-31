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
      <div className="text-mute-600 text-sm" aria-hidden>
        ↓
      </div>
    </div>
  );
}
