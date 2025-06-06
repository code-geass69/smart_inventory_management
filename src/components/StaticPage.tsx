export default function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="text-muted-foreground text-base space-y-4">{children}</div>
    </main>
  );
}
