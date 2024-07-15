import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SiteUrlInputProps {
  setQrUrl: (url: string) => void;
}

const SiteUrlInput: React.FC<SiteUrlInputProps> = ({ setQrUrl }) => {
  const [siteUrl, setSiteUrl] = useState('');
  return (
    <div className="flex space-x-4">
      <Input
        type="text"
        value={siteUrl}
        onChange={(e) => setSiteUrl(e.target.value)}
        placeholder="QRコードにしたいURLを入れてください"
        className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
      />
      <Button onClick={() => setQrUrl(siteUrl)}>QRコードを作成</Button>
    </div>
  );
};

export default SiteUrlInput;
