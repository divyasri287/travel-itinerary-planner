/**
 * Generic skeleton block. Pass a `className` (e.g. "skeleton-stat-card",
 * "skeleton-trip-card", "skeleton-line") to control size/shape via CSS,
 * or use `style` for one-off dimensions.
 */
const Skeleton = ({ className = "", style }) => {
  return <div className={`skeleton ${className}`.trim()} style={style} aria-hidden="true" />;
};

/**
 * Renders `count` skeleton cards in a grid, matching the layout used for
 * stat cards / trip cards while data is loading.
 */
export const SkeletonGrid = ({ count = 4, minWidth = 180, cardClassName = "skeleton-stat-card" }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap: 16,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cardClassName} />
      ))}
    </div>
  );
};

export default Skeleton;
