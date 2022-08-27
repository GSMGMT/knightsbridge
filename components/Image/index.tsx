import useDarkMode from 'use-dark-mode';
import ImageDefault, { StaticImageData } from 'next/image';

interface ImageProps {
  className?: string;
  src: StaticImageData;
  alt: string;
  srcDark?: StaticImageData;
}
export const Image = ({ className, src, srcDark, alt }: ImageProps) => {
  const darkMode = useDarkMode(false);

  return (
    <ImageDefault
      className={className}
      // srcSet={darkMode.value ? srcSetDark : srcSet}
      src={darkMode.value ? srcDark! : src!}
      alt={alt}
    />
  );
};
Image.defaultProps = {
  className: undefined,
  srcDark: undefined,
};
