import { PiStarFill } from "react-icons/pi";

export default function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-1 text-amyris-gold">
      {Array.from({ length: count }).map((_, i) => (
        <PiStarFill key={i} size={14} />
      ))}
    </div>
  );
}
