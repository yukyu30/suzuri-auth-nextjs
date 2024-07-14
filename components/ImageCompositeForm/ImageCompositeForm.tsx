'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

import styles from './ImageCompositeForm.module.css';

const QRCode = ({ url }: { url: string }) => {
  return (
    <QRCodeCanvas
      value={url}
      size={128}
      bgColor={'#FF0000'}
      fgColor={'#FFC0CB'}
      level={'L'}
      includeMargin={false}
      imageSettings={{
        src: '',
        x: undefined,
        y: undefined,
        height: 24,
        width: 24,
        excavate: true,
      }}
    />
  );
};
const ImageCompositeForm = () => {
  const [image, setImage] = useState('');
  const [siteUrl, setSiteUrl] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.value);
  };
  const handleSiteUrlChange = (e) => {
    setSiteUrl(e.target.value);
  };

  return (
    <div>
      <input
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
        placeholder="画像を選択してください"
      />
      <input
        type="text"
        value={siteUrl}
        onChange={handleSiteUrlChange}
        placeholder="自分のサイトURLを入力してください"
      />
      <div
        id="imageArea"
        className={`${styles.imageCompositeForm} px-14 pb-16 pt-14`}
      >
        {image && <img src={image} alt="画像" className="object-contain" />}
        <div className="pt-4 pb-12 flex justify-center items-center">
          <QRCode url={siteUrl} />
        </div>
      </div>

      <button
        onClick={() => {
          const imageArea = document.getElementById('imageArea');
          if (imageArea) {
            html2canvas(imageArea, { backgroundColor: null }).then(
              (canvas: any) => {
                const link = document.createElement('a');
                link.download = 'image.png';
                link.href = canvas.toDataURL();
                link.click();
              }
            );
          }
        }}
      >
        ダウンロード
      </button>
    </div>
  );
};

export default ImageCompositeForm;
