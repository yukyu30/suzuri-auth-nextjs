import { Stage, Layer, Image } from 'react-konva';
import { EditableStamp } from './EditableStamp';
import { KonvaEventObject } from 'konva/lib/Node';
import { MutableRefObject } from 'react';

type Stamp = {
  id: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

type CanvasProps = {
  width: number;
  height: number;
  scale: number;
  stageRef: MutableRefObject<any>;
  bgImage: HTMLImageElement | undefined;
  stamps: Stamp[];
  selectedStampId: string | null;
  onStageClick: (e: KonvaEventObject<MouseEvent>) => void;
  onStampSelect: (stampId: string) => void;
  onStampDragEnd: (stampId: string, e: KonvaEventObject<DragEvent>) => void;
  onStampTransformEnd: (stampId: string, e: KonvaEventObject<Event>) => void;
};

export const Canvas = ({
  width,
  height,
  scale,
  stageRef,
  bgImage,
  stamps,
  selectedStampId,
  onStageClick,
  onStampSelect,
  onStampDragEnd,
  onStampTransformEnd,
}: CanvasProps) => {
  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      onClick={onStageClick}
      style={{
        display: 'block',
      }}
    >
      <Layer>
        {bgImage && <Image image={bgImage} width={width} height={height} />}

        {stamps.map((stamp) => (
          <EditableStamp
            key={stamp.id}
            image={stamp.image}
            x={stamp.x}
            y={stamp.y}
            scaleX={stamp.scaleX}
            scaleY={stamp.scaleY}
            rotation={stamp.rotation}
            isSelected={stamp.id === selectedStampId}
            onSelect={() => onStampSelect(stamp.id)}
            onDragEnd={(e) => onStampDragEnd(stamp.id, e)}
            onTransformEnd={(e) => onStampTransformEnd(stamp.id, e)}
          />
        ))}
      </Layer>
    </Stage>
  );
};