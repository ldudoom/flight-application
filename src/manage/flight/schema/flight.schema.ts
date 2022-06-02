import * as mongoose from 'mongoose';

export const FlightSchema = new mongoose.Schema({
    pilot:{
        type: String,
        required: true
    },
    airplane:{
        type: String,
        required: true
    },
    destinationCity:{
        type: String,
        required: true
    },
    flightDate:{
        type: Date,
        required: true
    }
}, {
    timestamps: true
});