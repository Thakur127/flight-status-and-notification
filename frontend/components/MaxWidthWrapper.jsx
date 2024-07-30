import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({ children, className }) => {
  return <div className={cn("container max-w-7xl", className)}>{children}</div>;
};

export default MaxWidthWrapper;
