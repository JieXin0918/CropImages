import React, { useState, useRef } from 'react';
import { FileImageTwoTone } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import './index.scss';
import eventBus, { EventType } from '../utils/eventBus';

const { Dragger } = Upload;
function UploadImages() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const fileListRef = useRef([]);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const props = {
    name: 'file',
    multiple: true,
    accept: 'image/*',
    beforeUpload: (file, fileList) => {
      fileListRef.current.push(file);
      if (fileListRef.current.length === fileList.length) {
        eventBus.emit(EventType.SETIMAGEFILES, fileListRef.current);
      }
      return false;
    },
    showUploadList: true,
    listType: 'picture-card',
    maxCount: 100,
    onPreview: handlePreview,
    onChange: ({ fileList }) => {
      if (fileListRef.current.length !== fileList.length) {
        const files = fileList.map(({ originFileObj }) => originFileObj);
        eventBus.emit(EventType.SETIMAGEFILES, files);
      }
    },
    onDrop(e) {
      const files = Object.values({ ...e.dataTransfer.files });
      eventBus.emit(EventType.SETIMAGEFILES, files);
    },
  };

  return (
    <div className="UploadImagesBox">
      <p className="ant-upload-text" style={{ fontSize: 24, letterSpacing: 10 }}>
        批量裁剪图片
      </p>
      <p className="ant-upload-hint">将图片裁剪至指定的比例，并缩放到指定尺寸</p>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <FileImageTwoTone />
        </p>
        <p className="ant-upload-text">单击或拖动图片到此区域进行上传</p>
        <p className="ant-upload-hint">支持单次或批量上传, 最多100张</p>
      </Dragger>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default UploadImages;
