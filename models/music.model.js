const mongoose = require('mongoose');
const slugify = require('slugify');
const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    lyrics: {
        type: String,
        required: false
    },
    like:{
        type: Number,
        default: 0,
        require: false
    },
    genre: {
        type: String,
        required: false
    },
    fileUrl: {
        type: String,
        required: true
    },
    coverImageUrl: {
        type: String,
        required: false
    },
    public_id: String,
    slug: {
      type: String,
      slug: 'title',
      unique: true,
    },
}, {
    timestamps: true,
});

musicSchema.pre('save', function (next) {
    let title = this.title;
    if (title && typeof title === 'string') {
        this.slug = slugify(title, {
            lower: true,
        });
        next();
    }
});
musicSchema.pre('updateOne', function (next) {
    let title = this._update.title;
    if (title && typeof title === 'string') {
        this._update.$set.slug = slugify(title, {
            lower: true,
        });
        next();
    }
});

// Tạo model từ schema
const Music = mongoose.model('Music', musicSchema);

module.exports = Music;