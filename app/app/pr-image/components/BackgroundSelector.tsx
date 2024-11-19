import { useState } from 'react';

type Size = 'x' | 'story' | 'post';
type BgColor = 'blue' | 'red' | 'yellow';

type BackgroundSetting = {
  size: Size;
  bgColor: BgColor;
};

const SIZES: {
  id: Size;
  label: string;
  dimensions: string;
  aspectRatio: string;
}[] = [
  { id: 'x', label: 'X用', dimensions: '1280×720', aspectRatio: '16:9' },
  {
    id: 'story',
    label: 'Instagram Story用',
    dimensions: '1080×1920',
    aspectRatio: '9:16',
  },
  { id: 'post', label: '正方形', dimensions: '1936×1936', aspectRatio: '1:1' },
];

const BG_COLORS: { id: BgColor; label: string }[] = [
  { id: 'blue', label: 'ブルー' },
  { id: 'red', label: 'レッド' },
  { id: 'yellow', label: 'イエロー' },
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
  const [selectedBgColor, setSelectedBgColor] = useState<BgColor>(
    currentSetting.bgColor
  );

  const handleApply = () => {
    onSelect({ size: selectedSize, bgColor: selectedBgColor });
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

        <div>
          <h3 className="text-sm font-medium mb-3">背景画像の色を選択</h3>
          <div className="grid grid-cols-3 gap-2">
            {BG_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedBgColor(color.id)}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  selectedBgColor === color.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {color.label}
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
