import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand-lockup" aria-label="Michael Scott Paper Company home">
      <span className="brand-ms">MS</span>
      <span className="brand-copy">
        <strong>Michael Scott</strong>
        {!compact && <small>Paper Company</small>}
      </span>
    </Link>
  );
}
