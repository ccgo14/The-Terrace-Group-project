import { Screen } from "./UI";

export function AuthShell({ heading, sub, children, footer }) {
  return (
    <Screen scroll={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-floodlight dark:bg-night-pitch rounded-cardLg border border-black/10 dark:border-white/10 overflow-hidden">
          <div className="flex flex-col h-full px-6 py-8">
            {/* wordmark + faint terracing texture header block */}
            <div className="relative -mx-6 -mt-8 h-40 bg-night-pitch overflow-hidden flex items-end">
              <div
                className="absolute inset-0 bg-terracing"
                aria-hidden="true"
              />
              <div className="relative px-6 pb-5">
                 <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-terracing dark:text-floodlight">
                  The Terrace
                </span>
                <h1 className="mt-1 font-display font-bold uppercase leading-none text-4xl text-floodlight text-balance">
                  {heading}
                </h1>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-night-pitch dark:text-floodlight/80 text-pretty">
              {sub}
            </p>

            <div className="mt-6 flex flex-col gap-4">{children}</div>

            <div className="mt-auto pb-8 pt-6 text-center font-mono text-xs text-terracing/60 dark:text-floodlight/50">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
