import './App.css';
import UploadImages from './components/UploadImages';
import CropImage from './components/CropImage';
import ImageSize from './components/ImageSize';
import PreviewImages from './components/PreviewImages';
import CropResult from './components/CropResult';

function App() {
  return (
    <div className="App">
      <UploadImages />
      <ImageSize />
      <CropImage />
      <CropResult />
      <PreviewImages />
    </div>
  );
}

export default App;
