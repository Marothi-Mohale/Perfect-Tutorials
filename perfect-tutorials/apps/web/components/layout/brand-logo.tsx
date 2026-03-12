import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Perfect Tutorials home"
      className={`brand-logo ${className}`.trim()}
    >
      <Image
        src="/logo.png"
        alt="Perfect Tutorials"
        width={751}
        height={275}
        priority={priority}
        className={`brand-logo-image ${imageClassName}`.trim()}
      />
    </Link>
  );
}
