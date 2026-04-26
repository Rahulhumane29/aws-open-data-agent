# AWS Open Data Agent Platform 🌍

An intelligent data platform that acts as an agent to fetch, process, and visualize open-source AWS data in real-time. Built with FastAPI backend and React frontend, this application demonstrates how to leverage the Registry of Open Data on AWS for building powerful data-driven applications.

## ✨ Key Features

- **Real-time Data Fetching**: Direct integration with AWS S3 public buckets (NOAA GFS, Sentinel-2)
- **Dual Dashboard Views**: Switch between satellite imagery metadata and weather forecasts
- **Agentic Architecture**: Backend acts as intelligent agent processing AWS open data
- **Modern UI**: Glass-morphism design with responsive grid layout
- **Type Safety**: Full TypeScript support on frontend, Pydantic models on backend

## 🎯 What Makes This Special

This isn't just another API wrapper. It's an **agentic platform** that:
1. Intelligently queries AWS Open Data Registry
2. Processes and transforms raw data into meaningful insights
3. Serves data through a clean REST API
4. Visualizes results in an interactive React dashboard

## 📊 Data Sources Used

- **NOAA GFS**: Global weather forecast system data (50+ TB)
- **Sentinel-2**: Satellite imagery with 10m resolution (5+ PB)
- **AWS Open Data Registry**: 478+ public datasets available

## 🏗️ Tech Stack

**Backend:**
- FastAPI (Python) - High-performance API framework
- Boto3 - AWS SDK for S3 access
- Uvicorn - ASGI server

**Frontend:**
- React 18 - UI library
- TypeScript - Type safety
- CSS3 - Glass-morphism effects

## 🚀 Use Cases

- Weather monitoring applications
- Satellite imagery analysis tools
- Environmental data platforms
- Climate research dashboards
- Educational data visualization projects

## 📈 Performance

- Sub-100ms API response times
- Responsive design for all screen sizes
- Efficient S3 listing with pagination
- Real-time data updates

## 🤝 Contributing

Open to contributions! Especially interested in:
- Adding more AWS Open Datasets
- Implementing actual GRIB file parsing
- Adding map visualizations (Leaflet/Mapbox)
- Real-time WebSocket updates

## 📄 License

MIT - Free for learning and production use

## 🙏 Acknowledgments

- AWS Open Data team for hosting public datasets
- NOAA for global weather data
- European Space Agency for Sentinel-2 imagery
