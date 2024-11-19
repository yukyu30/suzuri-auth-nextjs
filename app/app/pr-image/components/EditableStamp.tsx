import { useEffect, useRef } from 'react';
import { Image, Transformer, Group, Circle, Text, Rect } from 'react-konva';
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
  onDelete: () => void;
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
  onDelete,
  onDragEnd,
  onTransformEnd,
}: EditableStampProps) => {
  const stampRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    if (stampRef.current && transformerRef.current && isSelected) {
      transformerRef.current.nodes([groupRef.current]);
      stampRef.current.setAttrs({
        width: image.width,
        height: image.height,
      });
    }
  }, [image, isSelected]);

  return (
    <>
      <Group
        ref={groupRef}
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
      >
        <Image
          ref={stampRef}
          image={image}
          offsetX={image.width / 2}
          offsetY={image.height / 2}
        />
      </Group>
      {isSelected && (
        <>
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              const minSize = 20;
              if (newBox.width < minSize || newBox.height < minSize) {
                return oldBox;
              }
              return newBox;
            }}
            padding={16}
          />
          <Group
            x={x + (image.width / 2) * scaleX + 50}
            y={y - (image.height / 2) * scaleY - 50}
            onClick={(e) => {
              e.cancelBubble = true;
              onDelete();
            }}
          >
            <Rect
              width={50}
              height={30}
              fill="white"
              cornerRadius={4}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
            <Text
              text="削除"
              fill="#4B5563"
              fontSize={16}
              align="center"
              verticalAlign="middle"
              width={50}
              height={30}
              lineHeight={1.8}
            />
          </Group>
        </>
      )}
    </>
  );
};
