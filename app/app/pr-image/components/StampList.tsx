import useImage from 'use-image';

type Stamp = {
  id: string;
  src: string;
};

const STAMPS: Stamp[] = [
  { id: 'star', src: '/pr-image/stamp-star.png' },
  { id: 'simile', src: '/pr-image/stamp-smile.png' },
  { id: 'heart', src: '/pr-image/stamp-heart.png' },
  { id: 'share', src: '/pr-image/stamp-share.png' },
  { id: 'low-price', src: '/pr-image/stamp-low-price.png' },
  { id: 'good', src: '/pr-image/stamp-good.png' },
];

type StampListProps = {
  onSelectStamp: (image: HTMLImageElement) => void;
  onClose: () => void;
};

export const StampList = ({ onSelectStamp, onClose }: StampListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">スタンプを追加</h2>
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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {STAMPS.map((stamp) => (
            <StampButton
              key={stamp.id}
              src={stamp.src}
              onSelect={onSelectStamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type StampButtonProps = {
  src: string;
  onSelect: (image: HTMLImageElement) => void;
};

const StampButton = ({ src, onSelect }: StampButtonProps) => {
  const [image] = useImage(src);

  return (
    <button
      onClick={() => image && onSelect(image)}
      className="aspect-square flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {image && (
        <img src={src} alt="stamp" className="w-2/3 h-2/3 object-contain" />
      )}
    </button>
  );
};
