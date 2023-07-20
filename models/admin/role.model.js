const mongoose = require('mongoose');
const schema = mongoose.Schema;

const roleSchema = schema({
    role_display_name: { type: String },
    role_group: { type: String },   
    isDeleted: { type: Boolean, enum: [true, false], default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('role', roleSchema);