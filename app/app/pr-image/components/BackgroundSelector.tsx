import { useState } from 'react';

type Size = 'square' | 'rectangle';

type BackgroundSetting = {
  size: Size;
};

const SIZES: {
  id: Size;
  label: string;
  dimensions: string;
  aspectRatio: string;
}[] = [
  {
    id: 'square',
    label: '正方形',
    dimensions: '1200×1200',
    aspectRatio: '1:1',
  },
  {
    id: 'rectangle',
    label: '縦長',
    dimensions: '1080×1920',
    aspectRatio: '9:16',
  },
];

type BackgroundSelectorProps = {
  onClose: () => void;
  onSelect: (setting: BackgroundSetting) => void;
  currentSetting: BackgroundSetting;
};

export const BackgroundSelector = ({
  onClose,
  onSelect,
  currentSetting,
}: BackgroundSelectorProps) => {
  const [selectedSize, setSelectedSize] = useState<Size>(currentSetting.size);

  const handleApply = () => {
    onSelect({ size: selectedSize });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">背景画像を設定</h2>
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

      <div className="flex-1 p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">サイズを選択</h3>
          <div className="space-y-2">
            {SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedSize === size.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{size.label}</div>
                <div className="text-sm text-gray-500">{size.aspectRatio}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleApply}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          適用する
        </button>
      </div>
    </div>
  );
};
