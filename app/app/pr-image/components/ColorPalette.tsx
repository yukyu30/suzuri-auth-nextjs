import { useState } from 'react';

type ColorPaletteProps = {
  color: string;
  onChange: (color: string) => void;
};

const PRESET_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#808080',
];

export const ColorPalette = ({ color, onChange }: ColorPaletteProps) => {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {PRESET_COLORS.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => onChange(presetColor)}
            className={`aspect-square rounded-lg border-2 transition-transform hover:scale-105 ${
              color === presetColor ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div
              className="w-full h-full rounded-lg"
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 p-1 rounded border border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={color.toUpperCase()}
            onChange={(e) => {
              const newColor = e.target.value;
              if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                onChange(newColor);
              }
            }}
            placeholder="#FFFFFF"
            className="flex-1 px-3 py-2 border rounded-lg font-mono"
          />
        </div>
      </div>
    </div>
  );
};
