'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

import styles from './ImageCompositeForm.module.css';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SiteUrlInput from './SiteUrlInput';

const ImageCompositeForm = () => {
  const [image, setImage] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        <SiteUrlInput setQrUrl={setQrUrl} />

        <div className="flex justify-center">
          <Button
            disabled={!image || !qrUrl || isLoading}
            type="button"
            onClick={() => {
              setIsLoading(true);
              const imageArea = document.getElementById('imageArea');
              if (imageArea) {
                html2canvas(imageArea, {
                  windowWidth: 1063,
                  windowHeight: 1559,
                  backgroundColor: null,
                }).then((canvas: any) => {
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
                });
              }
            }}
          >
            {isLoading ? '作ってるよ！まっててね' : 'SUZURIでグッズにする'}
          </Button>
        </div>
      </div>
      <hr className="my-4" />
      <div
        className={`w-full md:w-1/2 lg:w-1/4 w-max-[1000px] mx-auto ${styles.guide}`}
      >
        <div id="imageArea" className={styles.imageCompositeForm}>
          <div className={styles.printableArea}>
            <div className="h-[80%] w-auto mx-auto flex items-center justify-center">
              {image && (
                <img src={image} alt="画像" className={styles.imageArea} />
              )}
            </div>
            {qrUrl && (
              <QRCodeCanvas
                className="mx-auto"
                style={{ height: '15%', marginTop: '5%', width: 'auto' }}
                value={qrUrl}
                fgColor="#000000"
                bgColor="#ffffff"
                level={'L'}
                includeMargin={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompositeForm;
