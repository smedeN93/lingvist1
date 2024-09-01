import * as React from "react";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

  const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
    ({ className, ...props }, ref) => {
      return (
        <TextareaAutosize
          className={cn(
            "flex w-full rounded-full border border-zinc-950/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition duration-200",
            "h-7 sm:h-9 lg:h-9", // Justeret højde til at matche toolbar
            "text-[10px] sm:text-xs lg:text-base",
            "dark:text-white",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
  );
  Textarea.displayName = "Textarea";

export { Textarea };