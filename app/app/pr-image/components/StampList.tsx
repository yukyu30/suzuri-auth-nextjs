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
};

export const StampList = ({ onSelectStamp }: StampListProps) => {
  return (
    <div className="flex gap-2 p-4 bg-white rounded-lg shadow overflow-x-auto max-w-full">
      <div className="flex gap-2">
        {STAMPS.map((stamp) => (
          <StampButton
            key={stamp.id}
            src={stamp.src}
            onSelect={onSelectStamp}
          />
        ))}
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
      className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 flex-shrink-0"
    >
      {image && (
        <img src={src} alt="stamp" className="w-8 h-8 object-contain" />
      )}
    </button>
  );
};
