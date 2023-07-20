const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bannerSchema = schema({
    heading: { type: String, require:true },   
    image: { type: String, require:true },
    description: { type: String, required: true },    
    isDeleted: { type: Boolean, enum: [true, false], default: false },
    isStatus: { type: String, enum: ["Active", "Inactive"], default: "Active"  }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('banner', bannerSchema);