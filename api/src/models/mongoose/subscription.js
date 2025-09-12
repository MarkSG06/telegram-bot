module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: String,
      description: String,
      tag: String,
      formTitle: String,
      formDescription: String,
      inputPlaceholder: String,
      buttonText: String,
      buttonLink: String,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Subscription = mongoose.model('Subscription', schema, 'subscription')
  return Subscription
}
