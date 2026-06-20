export function AppHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-b px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </header>
  );
}
