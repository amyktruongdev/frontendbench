import { cn } from "../../lib/utils";

// Base Card wrapper
export function Card({
  className,
  role = "region",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border bg-white p-4 shadow", className)}
      role={role}
      {...props}
    />
  );
}

// Card content area
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-2", className)} {...props} />;
}
