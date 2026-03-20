import { cn } from "@/lib/utils";

export default function ImmiStudentPage({
  title,
  subtitle,
  children,
  maxWidthClass = "max-w-4xl",
  className,
  headerClassName,
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(maxWidthClass, "mx-auto px-4 py-10")}>
        {(title || subtitle) && (
          <div className={cn("mb-8", headerClassName)}>
            {title && (
              <h1 className="text-3xl font-bold text-[#0a1628] mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-500 text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

