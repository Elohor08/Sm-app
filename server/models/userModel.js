const {Schema, model} = require('mongoose');
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePhotos: {
        type: String,
        default: "https://res.cloudinary.com/dabxux4uj/image/upload/v1747646919/Sample_User_Icon_wtdinn.png",
    },
    bio: {
        type: String,
        default: "This is a sample bio",
    },
    followers: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    bookmarks: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
}, {timestamps: true});


module.exports = model("User", userSchema);
