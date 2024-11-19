import { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

type EditableStampProps = {
  image: HTMLImageElement;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: KonvaEventObject<Event>) => void;
};

export const EditableStamp = ({
  image,
  x,
  y,
  scaleX,
  scaleY,
  rotation,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: EditableStampProps) => {
  const stampRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (stampRef.current && transformerRef.current && isSelected) {
      transformerRef.current.nodes([stampRef.current]);
      stampRef.current.setAttrs({
        width: image.width,
        height: image.height,
      });
    }
  }, [image, isSelected]);

  return (
    <>
      <Image
        ref={stampRef}
        image={image}
        x={x}
        y={y}
        scaleX={scaleX}
        scaleY={scaleY}
        rotation={rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            const minSize = 20;
            if (newBox.width < minSize || newBox.height < minSize) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
