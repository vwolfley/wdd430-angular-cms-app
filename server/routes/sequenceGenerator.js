const Sequence = require('../models/sequence');

class SequenceGenerator {
  constructor() {
    this.maxDocumentId = 0;
    this.maxMessageId = 0;
    this.maxContactId = 0;
    this.sequenceId = null;

    this.init();
  }

  // Initialize sequence values from DB
  async init() {
    try {
      const sequence = await Sequence.findOne();
      if (sequence) {
        this.sequenceId = sequence._id;
        this.maxDocumentId = sequence.maxDocumentId;
        this.maxMessageId = sequence.maxMessageId;
        this.maxContactId = sequence.maxContactId;
      } else {
        // If no sequence exists, create one
        const newSeq = new Sequence({
          maxDocumentId: 0,
          maxMessageId: 0,
          maxContactId: 0,
        });
        const savedSeq = await newSeq.save();
        this.sequenceId = savedSeq._id;
      }
    } catch (err) {
      console.error('Error initializing sequence generator:', err);
    }
  }

  // Get next ID for a collection
  async nextId(collectionType) {
    if (!this.sequenceId) {
      console.error('Sequence not initialized yet.');
      return -1;
    }

    let updateObject = {};
    let nextId;

    switch (collectionType) {
      case 'documents':
        this.maxDocumentId++;
        updateObject = { maxDocumentId: this.maxDocumentId };
        nextId = this.maxDocumentId;
        break;
      case 'messages':
        this.maxMessageId++;
        updateObject = { maxMessageId: this.maxMessageId };
        nextId = this.maxMessageId;
        break;
      case 'contacts':
        this.maxContactId++;
        updateObject = { maxContactId: this.maxContactId };
        nextId = this.maxContactId;
        break;
      default:
        return -1;
    }

    try {
      await Sequence.updateOne({ _id: this.sequenceId }, { $set: updateObject });
    } catch (err) {
      console.error('Error updating sequence:', err);
      return null;
    }

    return nextId;
  }
}

module.exports = new SequenceGenerator();
