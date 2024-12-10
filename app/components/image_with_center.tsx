import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface ImageWithAltCenterProps {
  src: string | StaticImageData;
  alt: string;
}


const ImageWithAltCenter: React.FC<ImageWithAltCenterProps> = ({ src, alt }) => {
    return (
      <div className="relative w-32 h-32 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-100">
        {src ? (
          <Image
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-center text-gray-500">{alt}</span>
        )}
      </div>
    );
  };

  export default ImageWithAltCenter;
