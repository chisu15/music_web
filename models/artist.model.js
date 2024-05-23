const mongoose = require('mongoose');
const slugify = require('slugify');
const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: false
    },
    birthdate: {
        type: Date,
        required: false
    },
    albumCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: false
    }],
    photoUrl: {
        type: String,
        required: false
    },
    public_id: String,
    slug: {
      type: String,
      unique: true,
    },
}, {
    timestamps: true,
});

artistSchema.pre('save', function (next) {
    let name = this.name;
    if (name && typeof name === 'string') {
        this.slug = slugify(name, {
            lower: true,
        });
        next();
    }
});
artistSchema.pre('updateOne', function (next) {
    let name = this._update.name;
    if (name && typeof name === 'string') {
        this._update.$set.slug = slugify(name, {
            lower: true,
        });
        next();
    }
});

// Tạo model từ schema
const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
