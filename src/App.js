import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import News from "./components/News";
import LoadingBar from 'react-top-loading-bar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from './components/About';
import Footer from './components/Footer'; // Import Footer

// List of API keys
const apiKeys = [
  process.env.REACT_APP_API_KEY_1,
  process.env.REACT_APP_API_KEY_2,
  process.env.REACT_APP_API_KEY_3,
  process.env.REACT_APP_API_KEY_4
];

const country = 'in';

const App = (props) => {
  const [progress, setProgress] = useState(0);
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);

  const switchApiKey = () => {
    setCurrentApiKeyIndex((prevIndex) => (prevIndex + 1) % apiKeys.length);
  };

  useEffect(() => {
    setProgress(props.progress);
  }, [props.progress]);

  return (
    <div>
      <Router>
        <Navbar />
        <LoadingBar
          color='white'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Routes>
          <Route exact path="/" element={<News setProgress={setProgress} pgSize={5} key="general" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="general" switchApiKey={switchApiKey} />} />
          <Route exact path="/business" element={<News setProgress={setProgress} pgSize={5} key="business" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="business" switchApiKey={switchApiKey} />} />
          <Route exact path="/entertainment" element={<News setProgress={setProgress} pgSize={5} key="entertainment" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="entertainment" switchApiKey={switchApiKey} />} />
          <Route exact path="/health" element={<News setProgress={setProgress} pgSize={5} key="health" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="health" switchApiKey={switchApiKey} />} />
          <Route exact path="/science" element={<News setProgress={setProgress} pgSize={5} key="science" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="science" switchApiKey={switchApiKey} />} />
          <Route exact path="/sports" element={<News setProgress={setProgress} pgSize={5} key="sports" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="sports" switchApiKey={switchApiKey} />} />
          <Route exact path="/technology" element={<News setProgress={setProgress} pgSize={5} key="technology" apiKey={apiKeys[currentApiKeyIndex]} country={country} category="technology" switchApiKey={switchApiKey} />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
        <Footer /> 
      </Router>
    </div>
  );
};

export default App;
