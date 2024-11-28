import React, { useState } from 'react';

type LayerItem = {
  id: string;
  type: 'stamp' | 'product' | 'background';
  label: string;
  name: string;
};

type LayerPanelProps = {
  onClose: () => void;
  stamps: {
    id: string;
    image: HTMLImageElement;
    name: string;
    type: 'stamp' | 'product';
  }[];
  onLayerOrderChange: (sourceIndex: number, targetIndex: number) => void;
  bgImage: HTMLImageElement | undefined;
  layers: LayerItem[];
};

export const LayerPanel = ({
  onClose,
  stamps,
  onLayerOrderChange,
  bgImage,
  layers,
}: LayerPanelProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (index === draggedIndex) {
      setDropTargetIndex(null);
      return;
    }

    if (y < height / 2) {
      if (dropTargetIndex !== index) {
        setDropTargetIndex(index);
      }
    } else {
      if (dropTargetIndex !== index + 1) {
        setDropTargetIndex(index + 1);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (
      e.currentTarget.contains(e.relatedTarget as Node) ||
      e.currentTarget === e.relatedTarget
    ) {
      return;
    }
    setDropTargetIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const finalTargetIndex = dropTargetIndex ?? index;

    if (sourceIndex !== finalTargetIndex && finalTargetIndex !== null) {
      const adjustedTargetIndex =
        sourceIndex > finalTargetIndex
          ? finalTargetIndex
          : Math.max(0, finalTargetIndex - 1);

      onLayerOrderChange(sourceIndex, adjustedTargetIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">レイヤー設定</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="閉じる"
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
      <div className="p-4 space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="text-sm font-medium text-gray-700">
              レイヤーの順序
            </h3>
          </div>
          <div className="relative">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center justify-between p-3 bg-white
                  border-b
                  transition-colors duration-150 ease-in-out
                  ${draggedIndex === index ? 'opacity-50 bg-gray-50' : ''}
                  ${
                    dropTargetIndex === index
                      ? 'border-t-2 border-t-blue-500'
                      : dropTargetIndex === index + 1
                        ? 'border-b-2 border-b-blue-500'
                        : ''
                  }
                  cursor-move hover:bg-gray-50
                `}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{layer.label}</span>
                    <span className="text-sm text-gray-700">{layer.name}</span>
                  </div>
                </div>
              </div>
            ))}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (dropTargetIndex !== layers.length) {
                  setDropTargetIndex(layers.length);
                }
              }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, layers.length)}
              className={`
                h-10 transition-colors duration-150 ease-in-out
                ${
                  dropTargetIndex === layers.length
                    ? 'border-t-2 border-t-blue-500'
                    : ''
                }
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
