const mongoose = require('mongoose');
const schema = mongoose.Schema;

const faqSchema = schema({
    question: { type: String, require:true },
    answer: { type: String, require:true },   
    isDeleted: { type: Boolean, enum: [true, false], default: false },
    isStatus: { type: String, enum: ["Active", "Inactive"], default: "Active"  }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('faq', faqSchema);