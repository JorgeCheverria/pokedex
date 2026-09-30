export function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-800/60"
    >
      <div className="h-3 w-10 self-start rounded bg-slate-200 dark:bg-slate-700" />
      <div className="aspect-square w-full rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
