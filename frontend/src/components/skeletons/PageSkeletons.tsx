import PageWrapper from "../shared/PageWrapper";

type SkeletonBlockProps = {
  className?: string;
};

const SkeletonBlock = ({ className = "" }: SkeletonBlockProps) => (
  <div className={`rounded-md bg-surface-container-high/80 ${className}`} />
);

export const AuthSplitSkeleton = ({ variant }: { variant: "login" | "register" }) => {
  const isRegister = variant === "register";

  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-6xl px-6 relative animate-pulse">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative flex flex-col items-center lg:items-start">
            <div className="max-w-md text-center lg:text-left w-full space-y-4">
              <SkeletonBlock className="h-6 w-32 rounded-full mx-auto lg:mx-0" />
              <div className="space-y-3">
                <SkeletonBlock className="h-10 w-full" />
                <SkeletonBlock className="h-10 w-5/6" />
                <SkeletonBlock className="h-10 w-2/3" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-11/12" />
                <SkeletonBlock className="h-4 w-8/12" />
              </div>
              <SkeletonBlock className="h-2 w-8 rounded-full mx-auto lg:mx-0" />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-8 shadow-xl">
              <div className="mb-6 space-y-3">
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="h-4 w-64" />
              </div>

              {isRegister ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <SkeletonBlock className="h-11 w-full" />
                    <SkeletonBlock className="h-11 w-full" />
                  </div>
                  <SkeletonBlock className="h-11 w-full" />
                  <SkeletonBlock className="h-11 w-full" />
                  <SkeletonBlock className="h-11 w-full" />
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="h-11 w-full rounded-lg" />
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <SkeletonBlock className="h-px flex-1" />
                      <SkeletonBlock className="h-3 w-32" />
                      <SkeletonBlock className="h-px flex-1" />
                    </div>
                    <div className="flex gap-3">
                      <SkeletonBlock className="h-10 flex-1 rounded-full" />
                      <SkeletonBlock className="h-10 flex-1 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <SkeletonBlock className="h-11 w-full" />
                  <SkeletonBlock className="h-11 w-full" />
                  <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-3 w-32" />
                    <SkeletonBlock className="h-3 w-24" />
                  </div>
                  <SkeletonBlock className="h-11 w-full rounded-full" />
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <SkeletonBlock className="h-px flex-1" />
                      <SkeletonBlock className="h-3 w-32" />
                      <SkeletonBlock className="h-px flex-1" />
                    </div>
                    <div className="flex gap-3">
                      <SkeletonBlock className="h-10 flex-1 rounded-full" />
                      <SkeletonBlock className="h-10 flex-1 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <SkeletonBlock className="h-3 w-48" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export const AuthCardSkeleton = ({
  fields,
  withSecondaryAction,
}: {
  fields: number;
  withSecondaryAction?: boolean;
}) => {
  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="mt-20 rounded-3xl bg-surface-container-lowest p-8 shadow-xl animate-pulse">
          <SkeletonBlock className="h-7 w-48" />
          <div className="mt-3 space-y-2">
            <SkeletonBlock className="h-4 w-64" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
          <div className="mt-6 space-y-4">
            {Array.from({ length: fields }).map((_, index) => (
              <SkeletonBlock key={index} className="h-11 w-full" />
            ))}
            {withSecondaryAction ? (
              <div className="flex items-center justify-between">
                <SkeletonBlock className="h-3 w-40" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
            ) : (
              <SkeletonBlock className="h-3 w-40" />
            )}
            <SkeletonBlock className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export const HomeSkeleton = () => {
  return (
    <div className="bg-background text-on-surface">
      <PageWrapper className="pt-20 relative overflow-hidden">
        <div className="relative z-10 animate-pulse">
          <section className="relative overflow-hidden pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <SkeletonBlock className="h-6 w-44 rounded-full" />
                <div className="space-y-4">
                  <SkeletonBlock className="h-12 w-full" />
                  <SkeletonBlock className="h-12 w-5/6" />
                  <SkeletonBlock className="h-12 w-3/4" />
                </div>
                <div className="space-y-3">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-11/12" />
                  <SkeletonBlock className="h-4 w-9/12" />
                </div>
                <div className="flex gap-4">
                  <SkeletonBlock className="h-12 w-40 rounded-xl" />
                  <SkeletonBlock className="h-12 w-40 rounded-xl" />
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <SkeletonBlock className="aspect-square rounded-xl" />
                <div className="absolute -bottom-6 -left-6 w-40 rounded-lg bg-surface-container-lowest p-4">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-3 h-3 w-32" />
                  <SkeletonBlock className="mt-2 h-3 w-24" />
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-surface-container-low">
            <div className="max-w-7xl mx-auto px-8">
              <div className="mb-16 space-y-4">
                <SkeletonBlock className="h-8 w-64" />
                <SkeletonBlock className="h-4 w-80" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SkeletonBlock className="md:col-span-2 h-56 rounded-lg" />
                <SkeletonBlock className="h-56 rounded-lg" />
                <SkeletonBlock className="h-56 rounded-lg" />
                <SkeletonBlock className="md:col-span-4 h-48 rounded-lg" />
              </div>
            </div>
          </section>

          <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-20 space-y-4">
                <SkeletonBlock className="h-10 w-72 mx-auto" />
                <SkeletonBlock className="h-4 w-96 mx-auto" />
                <SkeletonBlock className="h-4 w-72 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center text-center space-y-4">
                    <SkeletonBlock className="h-24 w-24 rounded-full" />
                    <SkeletonBlock className="h-6 w-40" />
                    <SkeletonBlock className="h-4 w-56" />
                    <SkeletonBlock className="h-4 w-44" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-32 px-8">
            <div className="max-w-7xl mx-auto rounded-xl bg-surface-container-low p-16 md:p-24 text-center">
              <div className="space-y-6">
                <SkeletonBlock className="h-10 w-72 mx-auto" />
                <SkeletonBlock className="h-4 w-96 mx-auto" />
                <SkeletonBlock className="h-4 w-72 mx-auto" />
                <SkeletonBlock className="h-12 w-64 mx-auto rounded-xl" />
              </div>
            </div>
          </section>
        </div>
      </PageWrapper>
    </div>
  );
};

export const AboutSkeleton = () => {
  return (
    <div className="bg-background text-on-surface">
      <PageWrapper className="pt-24 pb-24 relative overflow-hidden">
        <div className="relative z-10 animate-pulse">
          <section className="max-w-7xl mx-auto px-8 mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <SkeletonBlock className="h-6 w-40 rounded-full" />
                <SkeletonBlock className="h-12 w-11/12" />
                <SkeletonBlock className="h-12 w-9/12" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
              </div>
              <SkeletonBlock className="h-[450px] w-full rounded-xl" />
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-8 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <SkeletonBlock className="md:col-span-5 h-96 rounded-xl" />
              <SkeletonBlock className="md:col-span-7 h-96 rounded-xl" />
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-8">
            <div className="bg-surface-container-lowest rounded-xl p-12 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 space-y-4">
                <SkeletonBlock className="h-8 w-64" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <div className="flex flex-wrap gap-3">
                  <SkeletonBlock className="h-7 w-28 rounded-full" />
                  <SkeletonBlock className="h-7 w-28 rounded-full" />
                  <SkeletonBlock className="h-7 w-28 rounded-full" />
                </div>
              </div>
              <div className="md:w-5/12 grid grid-cols-2 gap-4">
                <SkeletonBlock className="aspect-square rounded-lg" />
                <SkeletonBlock className="aspect-square rounded-lg" />
                <SkeletonBlock className="aspect-square rounded-lg" />
                <SkeletonBlock className="aspect-square rounded-lg" />
              </div>
            </div>
          </section>
        </div>
      </PageWrapper>
    </div>
  );
};

export const ServiceSkeleton = () => {
  return (
    <div className="bg-background text-on-surface">
      <PageWrapper className="pt-24 pb-24 relative overflow-hidden">
        <div className="px-8 max-w-7xl mx-auto relative z-10 animate-pulse">
          <header className="mb-16 space-y-4">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-10 w-3/4" />
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-4 w-1/2" />
          </header>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-48 rounded-xl" />
            ))}
          </section>
          <section className="mt-24 rounded-xl bg-surface-container-low p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <SkeletonBlock className="h-8 w-64" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <div className="flex gap-4">
                <SkeletonBlock className="h-11 w-40 rounded-xl" />
                <SkeletonBlock className="h-11 w-32 rounded-xl" />
              </div>
            </div>
            <SkeletonBlock className="w-full md:w-1/3 aspect-square rounded-lg" />
          </section>
        </div>
      </PageWrapper>
    </div>
  );
};

export const ContactSkeleton = () => {
  return (
    <div className="bg-background text-on-surface">
      <PageWrapper className="pt-24 relative overflow-hidden">
        <div className="relative z-10 animate-pulse">
          <section className="py-10">
            <div className="w-full max-w-none lg:max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div className="space-y-6">
                <SkeletonBlock className="h-10 w-56" />
                <SkeletonBlock className="h-10 w-48" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-72" />
                  <SkeletonBlock className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonBlock key={index} className="h-28 rounded-2xl" />
                  ))}
                </div>
              </div>
              <div className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 lg:p-10">
                <div className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <SkeletonBlock className="h-11 w-full" />
                    <SkeletonBlock className="h-11 w-full" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <SkeletonBlock className="h-11 w-full" />
                    <SkeletonBlock className="h-11 w-full" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <SkeletonBlock className="h-11 w-full" />
                    <SkeletonBlock className="h-11 w-full" />
                  </div>
                  <SkeletonBlock className="h-32 w-full" />
                  <SkeletonBlock className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-40 rounded-2xl" />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="max-w-5xl mx-auto px-6 space-y-4">
              <SkeletonBlock className="h-8 w-56" />
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          </section>

          <section className="pb-20 px-6">
            <div className="max-w-6xl mx-auto rounded-3xl bg-surface-container-low p-12 text-center space-y-4">
              <SkeletonBlock className="h-9 w-72 mx-auto" />
              <SkeletonBlock className="h-4 w-96 mx-auto" />
              <SkeletonBlock className="h-12 w-56 mx-auto rounded-xl" />
            </div>
          </section>
        </div>
      </PageWrapper>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-16 animate-pulse">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <SkeletonBlock className="h-5 w-32" />
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-24" />
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-9 w-full rounded-full" />
              ))}
            </div>
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-24" />
              {Array.from({ length: 2 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-9 w-full rounded-full" />
              ))}
            </div>
            <SkeletonBlock className="h-24 w-full rounded-2xl" />
          </aside>

          <main className="space-y-6">
            <div className="rounded-3xl bg-white px-6 py-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-32" />
                <SkeletonBlock className="h-7 w-48" />
                <SkeletonBlock className="h-3 w-56" />
              </div>
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-9 w-44 rounded-full" />
                <SkeletonBlock className="h-9 w-32 rounded-full" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-32 rounded-2xl" />
              ))}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
                <SkeletonBlock className="h-5 w-64" />
                <SkeletonBlock className="h-3 w-32" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-16 rounded-2xl" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
};

export const ProjectViewSkeleton = () => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-8 rounded bg-slate-200" />
          <div className="h-4 w-8 rounded bg-slate-200" />
          <div className="h-4 w-8 rounded bg-slate-200" />
          <div className="h-6 w-6 rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        <div className="bg-slate-100 p-6">
          <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
            <div className="h-6 w-3/4 rounded bg-slate-200 mx-auto" />
            <div className="mt-2 h-3 w-1/3 rounded bg-slate-200 mx-auto" />
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded bg-slate-200" />
              <div className="mt-2 h-3 w-11/12 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-10/12 rounded bg-slate-200" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-3 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        </div>
        <aside className="border-l border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-36 rounded bg-slate-200" />
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 p-4">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                <div className="mt-2 h-3 w-11/12 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="mt-5 h-9 w-full rounded-full bg-slate-200" />
        </aside>
      </div>
    </div>
  );
};
