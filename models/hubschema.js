const { Schema, model } = require('mongoose');

const HubSchema = new Schema({
  adminId: { type: Number, unique: true },
  adminName: String,
  hubName: String,
  hubID: { type: String, unique: true },
  hubTopic: String,
  hubCode: {
    type: String,
    default: ''
  },
  isPublic: Boolean,
  users: []
});

module.exports = model('hubshcema', HubSchema);
