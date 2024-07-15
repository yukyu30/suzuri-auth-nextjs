'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

import styles from './ImageCompositeForm.module.css';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const ImageCompositeForm = () => {
  const [image, setImage] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteUrl(e.target.value);
  };

  return (
    <div className="mx-4">
      <div className="grid gap-6">
        <Input
          id="picture"
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result) {
                  setImage(e.target.result as string);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <Input
          type="text"
          value={siteUrl}
          onChange={handleSiteUrlChange}
          placeholder="QRコードにしたいURLを入れてください"
        />

        <div className="flex justify-center">
          <Button
            disabled={!image || !siteUrl || isLoading}
            type="button"
            onClick={() => {
              setIsLoading(true);
              const imageArea = document.getElementById('imageArea');
              if (imageArea) {
                const originalWidth = imageArea.style.width;
                imageArea.style.width = '2000px';
                html2canvas(imageArea, { backgroundColor: null }).then(
                  (canvas: any) => {
                    const base64 = canvas.toDataURL();

                    fetch('/api/suzuri/materials', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ texture: base64 }),
                    }).then(async (response) => {
                      const data = await response.json();
                      window.location.href = data.url;
                      setIsLoading(false);
                    });
                    imageArea.style.width = originalWidth; // 元の幅に戻す
                  }
                );
              }
            }}
          >
            {isLoading ? '作ってるよ！まっててね' : 'SUZURIでグッズにする'}
          </Button>
        </div>
      </div>
      <hr className="my-4" />
      <div id="imageArea" className={`${styles.imageCompositeForm} my-4`}>
        <div className={styles.printableArea}>
          <div className="h-[80%] w-auto mx-auto flex items-center justify-center">
            {image && (
              <img src={image} alt="画像" className={styles.imageArea} />
            )}
          </div>

          <QRCodeCanvas
            className="mx-auto"
            style={{ height: '15%', marginTop: '5%', width: 'auto' }}
            value={siteUrl}
            fgColor="#000000"
            bgColor="#ffffff"
            level={'L'}
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCompositeForm;
