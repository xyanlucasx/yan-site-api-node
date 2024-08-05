const mongoose = require('mongoose');


const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    countryParentCode: { type: String }
}, { timestamps: true });

const State = mongoose.model('State', stateSchema);

module.exports = State;
