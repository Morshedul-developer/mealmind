export function StarRating({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={className ?? "flex text-primary"}>
      {[1, 2, 3, 4, 5].map((star) => {
        const diff = value - (star - 1);
        const icon = diff >= 0.5 && diff < 1 ? "star_half" : "star";
        const fill = diff >= 1 ? 1 : diff >= 0.5 ? 0.5 : 0;
        return (
          <span
            key={star}
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: `'FILL' ${fill}`,
              opacity: fill === 0 ? 0.3 : 1,
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}
