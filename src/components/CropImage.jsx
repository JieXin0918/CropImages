import { Button, message } from 'antd';
import useImagesParams from './useImagesParams';
import eventBus, { EventType } from '../utils/eventBus';
function CropImage() {
  const { imageFiles, imageParameter } = useImagesParams();
  const handleCrop = () => {
    const { aspectRatio, removeHeight, finalHeight } = imageParameter;

    if (!imageFiles.length) {
      message.warning('请至少上传一张图片！');
      eventBus.emit(EventType.SETIMAGELIST, []);
      eventBus.emit(EventType.SHOWDOWNLOADALL, false);
      return;
    }

    const promises = imageFiles.map((file) =>
      cropImage(file, aspectRatio, removeHeight, finalHeight)
    );
    Promise.all(promises).then((res) => {
      eventBus.emit(EventType.SETIMAGELIST, res);
      eventBus.emit(EventType.SHOWDOWNLOADALL, true);
    });
  };

  const cropImage = (file, aspectRatio, removeHeight, finalHeight) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const effectiveHeight = image.height - removeHeight;
          let cropWidth, cropHeight;

          if (effectiveHeight * aspectRatio <= image.width) {
            cropHeight = effectiveHeight;
            cropWidth = effectiveHeight * aspectRatio;
          } else {
            cropWidth = image.width;
            cropHeight = image.width / aspectRatio;
          }

          canvas.width = cropWidth;
          canvas.height = cropHeight;

          const sx = (image.width - cropWidth) / 2; // 水平居中
          const sy = removeHeight / 2 + (effectiveHeight - cropHeight) / 2; // 垂直居中（考虑剔除高度）

          ctx.drawImage(image, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

          const finalCanvas = document.createElement('canvas');
          const _ctx = finalCanvas.getContext('2d');

          finalCanvas.width = finalHeight * aspectRatio;
          finalCanvas.height = finalHeight;

          // 清空画布，默认透明背景
          _ctx.clearRect(0, 0, finalHeight * aspectRatio, finalHeight);

          _ctx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            finalHeight * aspectRatio,
            finalHeight
          );

          _ctx.imageSmoothingEnabled = true;
          _ctx.imageSmoothingQuality = 'high';

          // 输出裁剪后的图片 采用 'image/jpeg'(图片压缩格式) 否则默认生成png格式的图片 体积较大
          // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
          resolve(finalCanvas.toDataURL('image/jpeg'));
        };
      };
      reader.readAsDataURL(file);
    });

  return (
    <div className="actionBtns">
      <Button type="primary" style={{ width: '100%' }} onClick={handleCrop}>
        裁剪图片
      </Button>
    </div>
  );
}

export default CropImage;
