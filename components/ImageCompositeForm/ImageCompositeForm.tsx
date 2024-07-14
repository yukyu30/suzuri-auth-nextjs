'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

import styles from './ImageCompositeForm.module.css';

const ImageCompositeForm = () => {
  const [image, setImage] = useState('');
  const [siteUrl, setSiteUrl] = useState('');

  const handleSiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteUrl(e.target.value);
  };

  return (
    <div className="mx-4">
      <div className="grid gap-6">
        <input
          type="file"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
          placeholder="画像を選択してください"
        />
        <input
          type="text"
          value={siteUrl}
          onChange={handleSiteUrlChange}
          placeholder="QRコードにしたいURLを入れてください"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="flex justify-center">
          <button
            disabled={!image || !siteUrl}
            type="button"
            className={`${
              (!image || !siteUrl) && 'opacity-50 cursor-not-allowed'
            } text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
            onClick={() => {
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
                    });
                    imageArea.style.width = originalWidth; // 元の幅に戻す
                  }
                );
              }
            }}
          >
            SUZURIでグッズにする
          </button>
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
