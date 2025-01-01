const mongoose = require('mongoose');
const passwordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user
    name: { type: String, required: true },
    url: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

// Create a compound index for unique user-url combinations
passwordSchema.index({ userId: 1, url: 1 }, { unique: true });

const Password = mongoose.model('Password', passwordSchema);
module.exports = Password;
// module.exports = mongoose.model('Password', passwordSchema);
