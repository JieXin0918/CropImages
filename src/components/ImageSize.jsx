import { InputNumber } from 'antd';
import { useEffect, useRef } from 'react';
import eventBus, { EventType } from '../utils/eventBus';
function ImageSize() {
  useEffect(() => {
    setTimeout(() => {
      eventBus.emit(EventType.SETIMAGEPARAMETER, getSize());
    }, 100);
  }, []);

  const aspectRatioRef = useRef(null);
  const removeHeightRef = useRef(null);
  const finalHeightRef = useRef(null);
  const setWidth = (aspectRatio) => {
    eventBus.emit(EventType.SETIMAGEPARAMETER, { ...getSize(), aspectRatio });
  };

  const setRemoveHeight = (removeHeight) => {
    eventBus.emit(EventType.SETIMAGEPARAMETER, { ...getSize(), removeHeight });
  };

  const setFinalHeightRef = (finalHeight) => {
    eventBus.emit(EventType.SETIMAGEPARAMETER, { ...getSize(), finalHeight });
  };

  const getSize = () => {
    const aspectRatio = aspectRatioRef.current.value * 1;
    const removeHeight = removeHeightRef.current.value * 1;
    const finalHeight = finalHeightRef.current.value * 1;
    return { aspectRatio, removeHeight, finalHeight };
  };

  return (
    <div className="imageSize">
      <InputNumber
        ref={aspectRatioRef}
        prefix="宽高比例"
        suffix="%"
        min="0"
        max="1"
        step="0.001"
        onChange={setWidth}
        defaultValue={0.462}
        style={{
          width: '30%',
        }}
      />
      <InputNumber
        ref={removeHeightRef}
        prefix="剔除高度"
        suffix="px"
        max={60}
        min={0}
        onChange={setRemoveHeight}
        defaultValue={0}
        style={{
          width: '30%',
        }}
      />
      <InputNumber
        ref={finalHeightRef}
        prefix="最终高度"
        suffix="px"
        max={3840}
        min={400}
        onChange={setFinalHeightRef}
        defaultValue={1920}
        style={{
          width: '35%',
        }}
      />
    </div>
  );
}

export default ImageSize;
