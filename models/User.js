import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
    // Authentication fields
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    profilePic: {
        type: String, // Profile picture URL
        default: null
    },
    coverPic: {
        type: String, // Cover picture URL
        default: null
    },
    // Personal Information
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        maxLength: 500,
        trim: true
    },
    role: {
        type: String,
        default: "User",
        trim: true
    },
    
    // Address Information
    country: {
        type: String,
        trim: true
    },
    cityState: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true
    },
    
    // Social Media Links
    socialMedia: {
        facebook: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        },
        instagram: {
            type: String,
            trim: true
        },
        github: {
            type: String,
            trim: true
        },
        youtube: {
            type: String,
            trim: true
        }
    },
    createdAt: {type:Date ,default:Date.now },
    updatedAt: {type:Date ,default:Date.now }
});


const User = model('User', UserSchema);

export default mongoose.models.User || User;