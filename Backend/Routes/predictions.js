import express from 'express';
import axios from 'axios';
import EnvironmentData from '../Models/EnvironmentData.js';

const router = express.Router();

router.post('/predict-range', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        
        // Fetch data from MongoDB
        const data = await EnvironmentData.find({
            timestamp: {
              $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
              $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
          }).sort({ timestamp: 1 }).lean();

        if (!data.length) {
            return res.status(404).json({ error: "No data found" });
        }

        // Get predictions
        const response = await axios.post(
            `${process.env.ML_SERVICE_URL}/predict`,
            data.map(d => ({
                ...d,
                timestamp: d.timestamp.toISOString()
            }))
        );

        // Validate ML response
        if (!response.data?.predictions || !Array.isArray(response.data.predictions)) {
            throw new Error('Invalid response format from ML service');
        }
        
        if (response.data.predictions.length !== data.length) {
            throw new Error('Prediction count mismatch with input data');
        }

        // Format response
        const results = data.map((entry, index) => ({
            timestamp: entry.timestamp.toISOString(),
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

export default router;