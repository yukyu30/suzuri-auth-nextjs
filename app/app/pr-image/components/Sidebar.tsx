import { ReactNode } from 'react';

type Tool =
  | 'background-image'
  | 'background-color'
  | 'products'
  | 'stamps'
  | 'download';

type MenuItem = {
  id: Tool;
  label: string;
  icon: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'background-image', label: '背景画像', icon: '🖼️' },
  { id: 'background-color', label: '背景色', icon: '🎨' },
  { id: 'products', label: '商品', icon: '🛍️' },
  { id: 'stamps', label: 'スタンプ', icon: '✨' },
  { id: 'download', label: 'ダウンロード', icon: '💾' },
];

type SidebarProps = {
  activeTool: Tool | null;
  onToolSelect: (tool: Tool | null) => void;
  onDownload?: () => void;
};

export const Sidebar = ({
  activeTool,
  onToolSelect,
  onDownload,
}: SidebarProps) => {
  const handleToolClick = (toolId: Tool) => {
    if (toolId === 'download') {
      onDownload?.();
    } else {
      onToolSelect(activeTool === toolId ? null : toolId);
    }
  };

  return (
    <div className="w-14 bg-white border-r">
      <div className="flex flex-col py-4">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleToolClick(item.id)}
            className={`w-full flex flex-col items-center py-3 px-1 space-y-1 transition-colors ${
              activeTool === item.id ? 'bg-blue-100' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
