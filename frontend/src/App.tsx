import React, { useState, useEffect } from 'react';
import './src/App.css';

interface SatelliteScene {
  scene_id: string;
  tile_number: string;
  cloud_cover: number;
  acquisition_date: string;
  file_size?: string;
  preview_url?: string;
}

interface Forecast {
  date: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  cloud_cover: number;
}

interface CurrentWeather {
  location: { lat: number; lon: number };
  temperature: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  cloud_cover: number;
  timestamp: string;
}

function App() {
  const [scenes, setScenes] = useState<SatelliteScene[]>([]);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<SatelliteScene | null>(null);
  const [activeTab, setActiveTab] = useState<'satellite' | 'weather'>('satellite');
  const [backendStatus, setBackendStatus] = useState<string>('checking');

  // Check backend health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (err) {
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  // Fetch satellite data
  useEffect(() => {
    const fetchScenes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/sentinel-scenes?limit=12');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setScenes(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Cannot connect to backend. Make sure FastAPI server is running.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'satellite') {
      fetchScenes();
    }
  }, [activeTab]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch('http://localhost:8000/api/weather/current?lat=37.7749&lon=-122.4194'),
          fetch('http://localhost:8000/api/weather/forecast?days=5')
        ]);
        
        if (currentRes.ok && forecastRes.ok) {
          const currentData = await currentRes.json();
          const forecastData = await forecastRes.json();
          setCurrentWeather(currentData);
          setForecast(forecastData);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    };

    if (activeTab === 'weather') {
      fetchWeather();
    }
  }, [activeTab]);

  const handleSceneClick = (scene: SatelliteScene) => {
    setSelectedScene(scene);
  };

  const closeSceneDetail = () => {
    setSelectedScene(null);
  };

  const getCloudCoverColor = (cover: number) => {
    if (cover < 30) return '#4caf50';
    if (cover < 60) return '#ff9800';
    return '#f44336';
  };

  const getWeatherIcon = (cloudCover: number) => {
    if (cloudCover < 20) return '☀️';
    if (cloudCover < 50) return '⛅';
    if (cloudCover < 80) return '☁️';
    return '🌧️';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛰️ AWS Open Data Agent Platform</h1>
        <p className="subtitle">Real-time Satellite & Weather Data from AWS Open Registry</p>
        
        {/* Backend Status */}
        <div className={`status-badge status-${backendStatus}`}>
          {backendStatus === 'connected' ? '✅ Backend Connected' : 
           backendStatus === 'checking' ? '⏳ Connecting...' : 
           '❌ Backend Offline - Run: uvicorn main:app --reload --port 8000'}
        </div>

        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'satellite' ? 'active' : ''}`}
            onClick={() => setActiveTab('satellite')}
          >
            🛰️ Satellite Data
          </button>
          <button 
            className={`tab ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            🌤️ Weather Dashboard
          </button>
        </div>

        {/* Weather Dashboard */}
        {activeTab === 'weather' && currentWeather && (
          <div className="weather-dashboard">
            <div className="current-weather">
              <h2>Current Weather - San Francisco</h2>
              <div className="weather-grid">
                <div className="weather-card">
                  <div className="weather-icon">{getWeatherIcon(currentWeather.cloud_cover)}</div>
                  <div className="weather-value">{currentWeather.temperature}°C</div>
                  <div className="weather-label">Temperature</div>
                </div>
                <div className="weather-card">
                  <div className="weather-icon">💧</div>
                  <div className="weather-value">{currentWeather.humidity}%</div>
                  <div className="weather-label">Humidity</div>
                </div>
                <div className="weather-card">
                  <div className="weather-icon">💨</div>
                  <div className="weather-value">{currentWeather.wind_speed} km/h</div>
                  <div className="weather-label">Wind Speed</div>
                </div>
                <div className="weather-card">
                  <div className="weather-icon">📊</div>
                  <div className="weather-value">{currentWeather.pressure} hPa</div>
                  <div className="weather-label">Pressure</div>
                </div>
              </div>
            </div>

            <div className="forecast">
              <h3>5-Day Forecast</h3>
              <div className="forecast-grid">
                {forecast.map((day, idx) => (
                  <div key={idx} className="forecast-card">
                    <div className="forecast-date">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="forecast-icon">{getWeatherIcon(day.cloud_cover)}</div>
                    <div className="forecast-temp">{day.temperature}°C</div>
                    <div className="forecast-detail">💧 {day.humidity}%</div>
                    <div className="forecast-detail">💨 {day.wind_speed} km/h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Satellite Data */}
        {activeTab === 'satellite' && (
          <>
            {loading && (
              <div className="loader">
                <div className="spinner"></div>
                <p>Loading satellite data from AWS...</p>
              </div>
            )}
            
            {error && (
              <div className="error">
                <strong>⚠️ Error:</strong> {error}
              </div>
            )}
            
            {!loading && !error && scenes.length > 0 && (
              <>
                <div className="stats">
                  <div className="stat-card">
                    <span className="stat-value">{scenes.length}</span>
                    <span className="stat-label">Satellite Scenes</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      {scenes.filter(s => s.cloud_cover < 30).length}
                    </span>
                    <span className="stat-label">Clear Scenes</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      {(scenes.reduce((sum, s) => sum + s.cloud_cover, 0) / scenes.length).toFixed(1)}%
                    </span>
                    <span className="stat-label">Avg Cloud Cover</span>
                  </div>
                </div>
                
                <div className="scenes-grid">
                  <h2>Available Satellite Scenes from NOAA GFS</h2>
                  <div className="grid">
                    {scenes.map((scene, idx) => (
                      <div 
                        key={idx} 
                        className="scene-card"
                        onClick={() => handleSceneClick(scene)}
                      >
                        <div className="scene-icon">🛰️</div>
                        <h3>{scene.tile_number}</h3>
                        <p className="scene-id">{scene.scene_id}</p>
                        <div className="cloud-cover">
                          <span 
                            className="cloud-indicator"
                            style={{ backgroundColor: getCloudCoverColor(scene.cloud_cover) }}
                          ></span>
                          Cloud Cover: {scene.cloud_cover}%
                        </div>
                        <p className="date">
                          📅 {new Date(scene.acquisition_date).toLocaleString()}
                        </p>
                        {scene.file_size && (
                          <p className="size">💾 {scene.file_size}</p>
                        )}
                        <button className="view-btn">View Details →</button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Modal */}
        {selectedScene && (
          <div className="modal" onClick={closeSceneDetail}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeSceneDetail}>×</button>
              <h2>🛰️ Scene Details</h2>
              <div className="detail-item">
                <strong>Scene ID:</strong> {selectedScene.scene_id}
              </div>
              <div className="detail-item">
                <strong>Tile Number:</strong> {selectedScene.tile_number}
              </div>
              <div className="detail-item">
                <strong>Cloud Cover:</strong> 
                <span style={{ color: getCloudCoverColor(selectedScene.cloud_cover), fontWeight: 'bold' }}>
                  {selectedScene.cloud_cover}%
                </span>
              </div>
              <div className="detail-item">
                <strong>Acquisition Date:</strong> {new Date(selectedScene.acquisition_date).toLocaleString()}
              </div>
              {selectedScene.file_size && (
                <div className="detail-item">
                  <strong>File Size:</strong> {selectedScene.file_size}
                </div>
              )}
              <div className="detail-item">
                <strong>Data Source:</strong> NOAA Global Forecast System (AWS Open Data)
              </div>
              <button className="close-btn" onClick={closeSceneDetail}>Close</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;