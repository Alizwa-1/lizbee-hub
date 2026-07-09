import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { LizBeeWidget } from "@/components/lizbee-widget";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto text-6xl">🐝</div>
        <h1 className="mt-4 font-display text-5xl font-semibold text-foreground">404</h1>
        <h2 className="mt-2 text-xl font-semibold">Buzzed off course</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          LizBee couldn't find this page. Let's head back home.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-honey px-5 py-2.5 text-sm font-semibold text-charcoal shadow-honey"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-xl bg-gradient-honey px-4 py-2 text-sm font-semibold text-charcoal"
          >
            Try again
          </button>
          <a href="/" className="rounded-xl border px-4 py-2 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LizBee — AI Workplace Productivity Assistant" },
      { name: "description", content: "Meet LizBee 🐝 — your AI workplace productivity assistant. Draft professional emails, summarise meetings, and research faster. Where cute meets clever." },
      { name: "author", content: "LizBee" },
      { property: "og:title", content: "LizBee — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Draft emails, summarise meetings, and research faster with LizBee, your friendly AI workplace assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-1 font-display text-sm font-semibold">AI Workplace Productivity Assistant</div>
            <div className="ml-auto hidden text-xs text-muted-foreground sm:block">
              🐝 Small name. Big brains.
            </div>
          </header>
          <main className="min-h-[calc(100vh-3.5rem)]">
            <Outlet />
          </main>
        </SidebarInset>
        <LizBeeWidget />
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
