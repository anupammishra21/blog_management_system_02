const mongoose = require('mongoose');
const schema = mongoose.Schema;

const contactSchema = schema({
    name: { type: String, require:true },  
    email: { type: String, require:true },   
    subject: { type: String, require:true },     
    message: { type: String, require:true },   
    isDeleted: { type: Boolean, enum: [true, false], default: false },
    isStatus: { type: String, enum: ["Active", "Inactive"], default: "Active"  }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('contact', contactSchema);