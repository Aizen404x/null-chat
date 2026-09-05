import { Skeleton } from "@/components/ui/skeleton";

export function PageSpinner() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function AuthFormSkeleton() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function ChatEmptySkeleton() {
  return (
    <div className="hidden h-full items-center justify-center md:flex">
      <Skeleton className="h-5 w-56" />
    </div>
  );
}

export function ChatConversationSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <Skeleton
              className={`h-12 rounded-2xl ${
                i % 2 === 0 ? "w-48" : "w-56"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ChatNewSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-lg">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="w-full min-h-screen overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />

        <div className="space-y-4 rounded-2xl border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export function ChatSidebarSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col border-r md:w-80">
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="flex-1 space-y-2 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatLayoutSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebarSkeleton />
      <div className="flex flex-1 flex-col">
        <ChatEmptySkeleton />
      </div>
    </div>
  );
}
