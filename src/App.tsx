import { useState } from 'react';
import './App.css';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

interface Prediction {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      const imgElement = new Image();
      imgElement.src = imageUrl;

      imgElement.onload = async () => {
        // Load the COCO-SSD model
        const model = await cocoSsd.load();
        const detectedObjects = await model.detect(imgElement);

        // Filter out predictions with low confidence score
        const filteredPredictions = detectedObjects.filter(
          (prediction) => prediction.score > 0.5 // Set your desired threshold here
        );

        setPredictions(filteredPredictions);
        console.log('Filtered Predictions:', filteredPredictions);
      };
    }
  };

  return (
    <div className="App">
      <h1>Object Detection</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />}
      <div>
        <h2>Predictions:</h2>
        <ul>
          {predictions.map((prediction, index) => (
            <li key={index}>
              {prediction.class} - {Math.round(prediction.score * 100)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
