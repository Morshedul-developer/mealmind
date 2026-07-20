export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-cream-alt" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-cream-alt w-3/4 rounded" />
        <div className="flex gap-2">
          <div className="h-5 bg-cream-alt w-16 rounded-full" />
          <div className="h-5 bg-cream-alt w-16 rounded-full" />
        </div>
        <div className="flex justify-between mt-4">
          <div className="h-4 bg-cream-alt w-10 rounded" />
          <div className="h-4 bg-cream-alt w-16 rounded" />
        </div>
      </div>
    </div>
  );
}
