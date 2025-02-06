import * as React from "react"

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {}

const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={`mb-4 mt-2 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4 font-mono text-sm text-neutral-50 ${className}`}
        {...props}
      />
    )
  }
)
Code.displayName = "Code"

export { Code } 