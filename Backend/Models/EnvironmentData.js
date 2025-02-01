import mongoose from 'mongoose';

const environmentDataSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true, index: true },
    temperature: Number,
    humidity: Number,
    wind_speed: Number,
    precipitation: Number,
    vegetation_index: Number,
    human_activity_index: Number,
    latitude: Number,
    longitude: Number
});

export default mongoose.model('EnvironmentData', environmentDataSchema);