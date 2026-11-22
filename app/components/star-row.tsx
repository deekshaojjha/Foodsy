type StarRowProps = {
  /** The whole-number rating (1-5) exactly as stored by the backend. */
  rating: number;
  className?: string;
};

/** Displays a rating as five stars. It only draws; it never calculates anything. */
export default function StarRow({ rating, className = "" }: StarRowProps) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`inline-flex gap-0.5 text-xl leading-none ${className}`}
    >
      {[1, 2, 3, 4, 5].map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={position <= rating ? "text-foodsy-red" : "text-foodsy-ink/15"}
        >
          ★
        </span>
      ))}
    </span>
  );
}
