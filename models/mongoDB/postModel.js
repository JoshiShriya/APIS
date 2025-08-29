const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['linkedin', 'twitter', 'instagram', 'facebook', 'youtube'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: {
      type: String,
      enum: ['ai', 'manual'],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    aiModel: String
  },
  metrics: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 }
  },
  sentimentScore: { type: Number, min: -1, max: 1 },
  readabilityScore: Number,
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    publishedAt: Date,
    scheduledFor: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
postSchema.index({ platform: 1, 'author.type': 1 });
postSchema.index({ tenantId: 1, platform: 1 });
postSchema.index({ 'timestamps.publishedAt': 1 });

module.exports = mongoose.model('Post', postSchema);