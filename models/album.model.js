const mongoose = require('mongoose');
const slugify = require('slugify');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    like: {
        type: Number,
        default: 0,
        required: false
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music',
        required: false
    }],
    createdBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "private",
        required: true
    },
    coverImageUrl: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
});

albumSchema.pre('save', function (next) {
    let title = this.title;
    if (title && typeof title === 'string') {
        this.slug = slugify(title, {
            lower: true,
        });
        next();
    }
});

albumSchema.pre('updateOne', function (next) {
    let title = this._update.title;
    if (title && typeof title === 'string') {
        this._update.$set.slug = slugify(title, {
            lower: true,
        });
        next();
    }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
