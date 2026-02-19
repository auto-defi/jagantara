import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border  p-4 transition duration-200 hover:shadow-xl bg-[var(--background)] border-none",
        className
      )}
      style={{
        boxShadow: "0 0 15px 4px rgba(0, 123, 255, 0.2)",
      }}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold ">{title}</div>
        <div className="font-sans text-xs font-normal ">{description}</div>
      </div>
    </div>
  );
};
