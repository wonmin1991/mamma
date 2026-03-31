"use client";

interface ChipItem {
  id: string;
  label: string;
  emoji?: string;
}

interface Props {
  items: ChipItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: "primary" | "secondary";
}

export default function FilterChips({ items, activeId, onChange, variant = "primary" }: Props) {
  const activeBg = variant === "primary" ? "bg-primary" : "bg-secondary";

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          aria-pressed={activeId === item.id}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1
            ${activeId === item.id
              ? `${activeBg} text-white shadow-sm`
              : "bg-card text-muted border border-card-border"
            }`}
        >
          {item.emoji && <span>{item.emoji}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}
