import { Header } from "@/components/Header";
import { MobileNavbar } from "@/components/MobileNavbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <section className="py-4">
        <div className="container mx-auto">
          <div className="px-4">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </section>
      
      <div className="container mx-auto space-y-6 px-4 py-6">
        {/* Filter skeleton */}
        <div>
          <Skeleton className="mb-3 h-6 w-40" />
          <div className="flex flex-wrap gap-2">
            {Array(7).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>
        
        <div>
          <Skeleton className="mb-3 h-6 w-32" />
          <div className="flex flex-wrap gap-2">
            {Array(10).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16 pt-6 md:pb-6">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-10 w-28" />
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-xl bg-white shadow dark:bg-slate-800">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="mb-4 h-6 w-full" />
                <Skeleton className="mb-2 h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <MobileNavbar />
    </main>
  );
}
