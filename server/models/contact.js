const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    imageUrl: { type: String },
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  },
  {
    toJSON: {
      versionKey: false, // removes __v
      transform: function (doc, ret) {
        delete ret._id; // removes _id
      },
    },
  }
);

module.exports = mongoose.model('Contact', contactSchema);
