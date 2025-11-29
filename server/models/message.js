const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    subject: { type: String },
    msgText: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
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

module.exports = mongoose.model('Message', messageSchema);
