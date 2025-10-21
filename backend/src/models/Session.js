import mongoose from "mongoose";

//Session speichert refresh Token
const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true
        },
        expireAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('Session', sessionSchema);