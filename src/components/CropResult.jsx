import { Button } from 'antd';
import { useEffect, useState } from 'react';
import eventBus, { EventType } from '../utils/eventBus';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function CropResult() {
  const [visible, setVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState(false);

  useEffect(() => {
    eventBus.on(EventType.SHOWDOWNLOADALL, (visible) => {
      setVisible(visible);
    });
    eventBus.on(EventType.SETIMAGELIST, (urls) => {
      setImageUrls(urls);
    });
  }, []);

  const getFormattedTimestamp = () => {
    const now = new Date();
    return (
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0')
    );
  };

  const downLoadAll = async () => {
    const zip = new JSZip();
    const timestamp = getFormattedTimestamp();
    const zipFilename = `Crop-${timestamp}.zip`;

    for (let i = 0; i < imageUrls.length; i++) {
      const imgBlob = await fetch(imageUrls[i]).then((r) => r.blob());
      const filename = `${Date.now()}.jpg`;
      zip.file(filename, imgBlob);
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, zipFilename);
    });
  };

  return (
    <div className="cropResultBox" style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <div>裁剪结果：</div>
      <Button type="primary" onClick={downLoadAll}>
        一键下载
      </Button>
    </div>
  );
}

export default CropResult;
