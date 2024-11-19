'use client';

import { useEffect, useRef, useState } from 'react';
import useImage from 'use-image';
import { Canvas } from './Canvas';
import { StampList } from './StampList';
import { KonvaEventObject } from 'konva/lib/Node';
import { ProductList } from './ProductList';

type Stamp = {
  id: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

export const PrImageEditor = () => {
  const STAGE_WIDTH = 1280;
  const STAGE_HEIGHT = 720;

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const [bgImage] = useImage('/pr-image/bg-blue-x.png');
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = window.innerHeight - 180;
        const scaleX = containerWidth / STAGE_WIDTH;
        const scaleY = containerHeight / STAGE_HEIGHT;
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(newScale);
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleAddStamp = (image: HTMLImageElement) => {
    const newStamp: Stamp = {
      id: `stamp-${Date.now()}`,
      image,
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    setStamps((prev) => [...prev, newStamp]);
    setSelectedStampId(newStamp.id);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedStampId(null);
    }
  };

  const handleStampDragEnd = (
    stampId: string,
    e: KonvaEventObject<DragEvent>
  ) => {
    setStamps((prev) =>
      prev.map((stamp) =>
        stamp.id === stampId
          ? {
              ...stamp,
              x: e.target.x(),
              y: e.target.y(),
            }
          : stamp
      )
    );
  };

  const handleStampTransformEnd = (
    stampId: string,
    e: KonvaEventObject<Event>
  ) => {
    const node = e.target;
    setStamps((prev) =>
      prev.map((stamp) =>
        stamp.id === stampId
          ? {
              ...stamp,
              x: node.x(),
              y: node.y(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
              rotation: node.rotation(),
            }
          : stamp
      )
    );
  };

  const handleSave = async () => {
    if (!stageRef.current) return;

    try {
      setSelectedStampId(null);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const stage = stageRef.current;
      const originalScale = {
        x: stage.scaleX(),
        y: stage.scaleY(),
      };

      stage.scale({ x: 1, y: 1 });

      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        imageSmoothingEnabled: true,
      });

      stage.scale(originalScale);

      const response = await fetch(dataURL);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pr-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('画像の保存中にエラーが発生しました:', error);
      alert('画像の保存に失敗しました。');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 min-h-screen bg-gray-100 p-4">
      <div className="w-full flex flex-col gap-4">
        <ProductList onSelectProduct={handleAddStamp} />
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-[1280px]"
        style={{
          height: `${STAGE_HEIGHT * scale}px`,
        }}
      >
        <Canvas
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          scale={scale}
          stageRef={stageRef}
          bgImage={bgImage}
          stamps={stamps}
          selectedStampId={selectedStampId}
          onStageClick={handleStageClick}
          onStampSelect={setSelectedStampId}
          onStampDragEnd={handleStampDragEnd}
          onStampTransformEnd={handleStampTransformEnd}
        />
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-lg font-bold">スタンプを追加する</h2>
        <StampList onSelectStamp={handleAddStamp} />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        画像を保存
      </button>
    </div>
  );
};
