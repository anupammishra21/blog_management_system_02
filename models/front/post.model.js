const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = schema({    
    heading: { type: String, require:true },   
    post: { type: String, require:true },     
    image: { type: String, require:true },
    category_id: { type: schema.Types.ObjectId , default : null}, 
    user_register_id: { type: schema.Types.ObjectId , default : null},   
    isDeleted: { type: Boolean, enum: [true, false], default: false },
    isStatus: { type: String, enum: ["Active", "Inactive"], default: "Inactive"  }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('post', postSchema);