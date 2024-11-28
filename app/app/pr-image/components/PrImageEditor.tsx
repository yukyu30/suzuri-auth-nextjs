'use client';

import { useEffect, useRef, useState } from 'react';
import useImage from 'use-image';
import { Canvas } from './Canvas';
import { StampList } from './StampList';
import { KonvaEventObject } from 'konva/lib/Node';
import { ProductList } from './ProductList';
import { ColorPalette } from './ColorPalette';
import { Sidebar } from './Sidebar';
import { BackgroundSelector } from './BackgroundSelector';
import { LayerPanel } from './LayerPanel';

type Stamp = {
  id: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

type Size = 'x' | 'story' | 'post';

type Tool =
  | 'products'
  | 'stamps'
  | 'background-image'
  | 'background-color'
  | 'download';

type BgColor = 'blue' | 'red' | 'yellow';

// debounce関数の実装
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return debounced as T & { cancel: () => void };
}

export const PrImageEditor = () => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const [bgSize, setBgSize] = useState<Size>('x');
  const [bgImageColor, setBgImageColor] = useState<BgColor>('blue');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const bgImagePath = `/pr-image/bg-${bgImageColor}-${bgSize}.png`;
  const [bgImage] = useImage(bgImagePath);

  const getStageSize = () => {
    switch (bgSize) {
      case 'x':
        return { width: 1280, height: 720 };
      case 'story':
        return { width: 1080, height: 1920 };
      case 'post':
        return { width: 1080, height: 1080 };
    }
  };

  const { width: STAGE_WIDTH, height: STAGE_HEIGHT } = getStageSize();

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [isBgFront, setIsBgFront] = useState(false);

  useEffect(() => {
    const handleResize = debounce(() => {
      if (containerRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const sidebarWidth = activeTool ? 368 : 56;
        const headerHeight = 64;
        const padding = 24;

        const availableWidth = windowWidth - sidebarWidth - padding * 2;
        const availableHeight = windowHeight - headerHeight - padding * 2;

        const scaleX = availableWidth / STAGE_WIDTH;
        const scaleY = availableHeight / STAGE_HEIGHT;
        const newScale = Math.min(scaleX, scaleY);

        setScale(newScale);
      }
    }, 100);

    // 初期サイズの設定
    handleResize();

    // イベントリスナーの追加
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [activeTool, STAGE_WIDTH, STAGE_HEIGHT]);

  const handleAddStamp = (image: HTMLImageElement) => {
    if (!image) return;

    const newStamp: Stamp = {
      id: `stamp-${Date.now()}`,
      image,
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      scaleX: 0.5,
      scaleY: 0.5,
      rotation: 0,
    };
    setStamps((prev) => [...prev, newStamp]);
    setSelectedStampId(newStamp.id);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnStage = e.target === e.target.getStage();
    if (clickedOnStage) {
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

      await new Promise((resolve) => setTimeout(resolve, 100));

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

  const handleDeleteStamp = () => {
    if (!selectedStampId) return;

    setStamps((prev) => prev.filter((stamp) => stamp.id !== selectedStampId));
    setSelectedStampId(null);
  };

  const handleToolSelect = (toolId: Tool | null) => {
    if (toolId === 'download') {
      handleSave();
    } else {
      setActiveTool(toolId);
    }
  };

  const getToolPanel = () => {
    switch (activeTool) {
      case 'products':
        return (
          <ProductList
            onSelectProduct={handleAddStamp}
            onClose={() => setActiveTool(null)}
          />
        );
      case 'stamps':
        return (
          <StampList
            onSelectStamp={handleAddStamp}
            onClose={() => setActiveTool(null)}
          />
        );
      case 'background-image':
        return (
          <BackgroundSelector
            onClose={() => setActiveTool(null)}
            onSelect={({ size, bgColor }) => {
              setBgSize(size);
              setBgImageColor(bgColor);
              setActiveTool(null);
            }}
            currentSetting={{ size: bgSize, bgColor: bgImageColor }}
          />
        );
      case 'background-color':
        return (
          <div className="p-4">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-lg font-bold">透過部分の色を設定</h2>
              <button
                onClick={() => setActiveTool(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <ColorPalette
              color={backgroundColor}
              onChange={(color) => {
                setBackgroundColor(color);
              }}
            />
          </div>
        );
      case 'layers':
        return (
          <LayerPanel
            onClose={() => setActiveTool(null)}
            isBgFront={isBgFront}
            onBgFrontChange={setIsBgFront}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`mx-auto`}>
      <div className="fixed left-0 top-16 bottom-0 my-12 flex z-10">
        <div className="bg-white rounded-full overflow-hidden mr-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] border-r border-gray-200">
          <Sidebar
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            onDownload={handleSave}
          />
        </div>

        <div
          className={`bg-white overscroll-none transition-all duration-300 ease-in-out h-full shadow-[2px_0_10px_rgba(0,0,0,0.1)] ${
            activeTool && activeTool !== 'download' ? 'w-80 border' : 'w-0'
          } overflow-hidden`}
        >
          <div className="w-80 h-full overf">{getToolPanel()}</div>
        </div>
      </div>

      <div
        className={` ${
          activeTool && activeTool !== 'download' ? 'ml-[368px]' : 'ml-[56px]'
        }`}
        ref={containerRef}
      >
        <Canvas
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          scale={scale}
          stageRef={stageRef}
          bgImage={bgImage}
          backgroundColor={backgroundColor}
          stamps={stamps}
          selectedStampId={selectedStampId}
          onStageClick={handleStageClick}
          onStampSelect={setSelectedStampId}
          onStampDelete={handleDeleteStamp}
          onStampDragEnd={handleStampDragEnd}
          onStampTransformEnd={handleStampTransformEnd}
          isBgFront={isBgFront}
        />
      </div>
    </div>
  );
};
