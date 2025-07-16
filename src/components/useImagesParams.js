import { useEffect, useState } from 'react';
import eventBus, { EventType } from '../utils/eventBus';

export default function useImagesParams() {
  const [imageFiles, setImageFiles] = useState([]);
  const [imageParameter, setImageParameter] = useState({});

  useEffect(() => {
    const setFiles = (files) => {
      setImageFiles(files);
    };

    const setParameter = (params) => {
      setImageParameter(params);
    };

    eventBus.on(EventType.SETIMAGEFILES, setFiles);
    eventBus.on(EventType.SETIMAGEPARAMETER, setParameter);

    return () => {
      eventBus.off(EventType.SETIMAGEFILES, setFiles);
      eventBus.off(EventType.SETIMAGEPARAMETER, setParameter);
    };
  }, []);

  return { imageFiles, imageParameter };
}
