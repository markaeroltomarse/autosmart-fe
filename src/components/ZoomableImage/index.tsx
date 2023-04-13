import React, { useState } from 'react';
import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
};

const ProductImageZoom: React.FC<Props> = ({ src, alt }) => {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setCursorPosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });

    console.log({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setZoomedIn(true)}
      onMouseLeave={() => setZoomedIn(false)}
      onMouseMove={handleMouseMove}
    >
      <Image src={src} alt={alt} fill className="border-2 border-slate-400" />

      {zoomedIn && (
        <div
          className="absolute top-0 left-0 z-10 w-full h-full"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${cursorPosition.x}px ${cursorPosition.y}px`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '300% 300%',
            filter: 'blur(3px)',
          }}
        />
      )}
    </div>
  );
};

export default ProductImageZoom;
