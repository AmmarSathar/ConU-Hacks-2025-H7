import express from 'express';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data'; 
import EnvironmentData from '../Models/EnvironmentData.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/predict-range', async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const start = new Date(new Date(startDate).setHours(0, 0, 0));
      const end = new Date(new Date(endDate).setHours(23, 59, 59));
  
      // Use aggregation to convert the string timestamp to a Date
      const data = await EnvironmentData.aggregate([
        {
          $addFields: {
            timestampDate: { $toDate: "$timestamp" }
          }
        },
        {
          $match: {
            timestampDate: { $gte: start, $lte: end }
          }
        },
        {
          $sort: { timestampDate: 1 }
        }
      ]);
  
      if (!data.length) {
        return res.status(404).json({ error: "No data found" });
      }
  
      // Get predictions from the ML service
      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        data.map(d => ({
          ...d,
          timestamp: d.timestampDate.toISOString() // use the converted date
        }))
      );
  
      if (!response.data?.predictions || !Array.isArray(response.data.predictions)) {
        throw new Error('Invalid response format from ML service');
      }
      
      if (response.data.predictions.length !== data.length) {
        throw new Error('Prediction count mismatch with input data');
      }
  
      // Format response: merge our original data with predictions
      const results = data.map((entry, index) => ({
        timestamp: entry.timestampDate.toISOString(),
        temperature: entry.temperature,
        humidity: entry.humidity,
        wind_speed: entry.wind_speed,
        precipitation: entry.precipitation,
        vegetation_index: entry.vegetation_index,
        human_activity_index: entry.human_activity_index,
        latitude: entry.latitude,
        longitude: entry.longitude,
        fire_risk: response.data.predictions[index]
      }));
  
      res.json({
        data: results,
        columns: [
          'timestamp', 'temperature', 'humidity', 'wind_speed',
          'precipitation', 'vegetation_index', 'human_activity_index',
          'latitude', 'longitude', 'fire_risk'
        ]
      });
      
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({
        error: 'Prediction failed',
        details: error.response?.data || error.message
      });
    }
  });

  router.post('/optimize', upload.single('csv_file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Create FormData-like structure for FastAPI
        const formData = new FormData();
        formData.append('csv_file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post(
            `${process.env.ML_SERVICE_URL}/optimize-resources`,
            formData.getBuffer(),
            {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Length': formData.getLengthSync()
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Optimization error:', error);
        res.status(500).json({
            error: 'Optimization failed',
            details: error.response?.data || error.message
        });
    }
});

export default router;