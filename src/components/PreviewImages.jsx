import React, { useEffect, useState } from 'react';
import eventBus, { EventType } from '../utils/eventBus';
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, Space } from 'antd';

function PreviewImages() {
  const [current, setCurrent] = React.useState(0);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    eventBus.on(EventType.SETIMAGELIST, (imageList) => {
      setImageList(imageList);
    });
  }, []);

  const onDownload = () => {
    const url = imageList[current];
    const filename = Date.now();
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="previewImagesBox">
      <Image.PreviewGroup
        preview={{
          toolbarRender: (
            _,
            {
              transform: { scale },
              actions: {
                onActive,
                onFlipY,
                onFlipX,
                onRotateLeft,
                onRotateRight,
                onZoomOut,
                onZoomIn,
                onReset,
              },
            }
          ) => (
            <Space size={12} className="toolbar-wrapper">
              <LeftOutlined onClick={() => onActive?.(-1)} />
              <RightOutlined onClick={() => onActive?.(1)} />
              <DownloadOutlined onClick={onDownload} />
              <SwapOutlined rotate={90} onClick={onFlipY} />
              <SwapOutlined onClick={onFlipX} />
              <RotateLeftOutlined onClick={onRotateLeft} />
              <RotateRightOutlined onClick={onRotateRight} />
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              <UndoOutlined onClick={onReset} />
            </Space>
          ),
          onChange: (index) => {
            setCurrent(index);
          },
        }}
      >
        {imageList.map((image, index) => (
          <Image key={index} src={image} width={400} height={867} />
        ))}
      </Image.PreviewGroup>
    </div>
  );
}

export default PreviewImages;
