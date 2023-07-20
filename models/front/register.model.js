const mongoose = require('mongoose');
const schema = mongoose.Schema;

const registerSchema = schema({
    fname: { type: String, require:true },
    lname: { type: String, require:true }, 
    fullname: { type: String, require:true }, 
    email: { type: String, require:true },   
    password: { type: String, require:true },     
    role_id: { type: schema.Types.ObjectId , default : null}, 
    isDeleted: { type: Boolean, enum: [true, false], default: false },
    isStatus: { type: String, enum: ["Active", "Inactive"], default: "Active"  }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('user_register', registerSchema);