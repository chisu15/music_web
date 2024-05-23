const mongoose = require('mongoose');
const slugify = require('slugify');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: false
    },
    genre: {
        type: String,
        required: false
    },
    coverImageUrl: {
        type: String,
        required: false
    },
    public_id: String,
    slug: {
        type: String,
        unique: true,
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music',
        required: false
    }],
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
