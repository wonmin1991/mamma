import type { ReactNode } from "react";

interface Props {
  emoji: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ emoji, title, description, action }: Props) {
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">{emoji}</p>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="text-xs text-muted mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
