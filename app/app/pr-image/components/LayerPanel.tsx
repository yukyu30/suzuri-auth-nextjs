type LayerPanelProps = {
  onClose: () => void;
  isBgFront: boolean;
  onBgFrontChange: (value: boolean) => void;
};

export const LayerPanel = ({
  onClose,
  isBgFront,
  onBgFrontChange,
}: LayerPanelProps) => {
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
      <div className="p-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isBgFront}
            onChange={(e) => onBgFrontChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">背景画像を最前面に表示</span>
        </label>
      </div>
    </div>
  );
};
