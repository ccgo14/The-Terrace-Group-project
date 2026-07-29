export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-terracing/20 dark:bg-terracing/40 rounded-card ${className}`}
    />
  );
}
