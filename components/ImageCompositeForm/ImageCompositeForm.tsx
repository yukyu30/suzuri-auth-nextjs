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
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            SUZURIでグッズにする
          </button>

          <button
            onClick={() => {
              if (!image || !siteUrl) {
                return;
              }
              const imageArea = document.getElementById('imageArea');
              if (imageArea) {
                const originalWidth = imageArea.style.width;
                imageArea.style.width = '2000px';
                html2canvas(imageArea, { backgroundColor: null }).then(
                  (canvas: any) => {
                    const link = document.createElement('a');
                    link.download = 'image.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    imageArea.style.width = originalWidth; // 元の幅に戻す
                  }
                );
              }
            }}
            disabled={!image || !siteUrl}
            className="py-2.5 px-5 me-2 mb-2 text-sm items-center font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
              <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
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
