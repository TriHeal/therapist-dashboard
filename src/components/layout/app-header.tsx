export function AppHeader({ 
  title, 
  description,
  children 
}: { 
  title: string; 
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </header>
  );
}
