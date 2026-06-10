const SkeletonCard = () => {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-white/10" />

      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="h-4 bg-white/10 rounded w-3/4" />

        {/* Subtitle placeholder */}
        <div className="h-3 bg-white/10 rounded w-1/2" />

        {/* Price placeholder */}
        <div className="h-4 bg-white/10 rounded w-1/4" />

        {/* Button placeholder */}
        <div className="h-8 bg-white/10 rounded-full w-full mt-2" />
      </div>
    </div>
  );
};

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;