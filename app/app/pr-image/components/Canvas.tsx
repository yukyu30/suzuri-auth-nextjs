import { Stage, Layer, Image, Rect } from 'react-konva';
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

type LayerItem = {
  id: string;
  type: 'stamp' | 'product' | 'background';
  label: string;
  name: string;
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
  backgroundColor: string;
  onStampDelete: () => void;
  isBgFront: boolean;
  layers: LayerItem[];
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
  backgroundColor,
  onStampDelete,
  isBgFront,
  layers,
}: CanvasProps) => {
  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={scale < 1 ? scale : 1}
      scaleY={scale < 1 ? scale : 1}
      onClick={onStageClick}
    >
      <Layer>
        <Rect width={width} height={height} fill={backgroundColor} />

        {layers?.map((layer) => {
          if (layer.type === 'background') {
            return (
              bgImage && (
                <Image
                  key={layer.id}
                  image={bgImage}
                  width={width}
                  height={height}
                  listening={false}
                />
              )
            );
          } else {
            const stamp = stamps.find((s) => s.id === layer.id);
            return (
              stamp && (
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
                  onDelete={onStampDelete}
                  onDragEnd={(e) => onStampDragEnd(stamp.id, e)}
                  onTransformEnd={(e) => onStampTransformEnd(stamp.id, e)}
                />
              )
            );
          }
        })}
      </Layer>
    </Stage>
  );
};
