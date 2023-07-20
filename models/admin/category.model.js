const mongoose = require('mongoose');
const schema = mongoose.Schema;

const catSchema = schema({
    name: { type: String, require:true },    
    isDeleted: { type: Boolean, enum: [true, false], default: false },
    isStatus: { type: String, enum: ["Active", "Inactive"], default: "Active"  }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('category', catSchema);