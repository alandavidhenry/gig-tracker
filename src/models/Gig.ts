import mongoose from 'mongoose'

const GigSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    employer: { type: String, required: true },
    location: { type: String, required: true },
    payment_amount: { type: Number, required: true },
    payment_date: { type: Date },
    payment_method: { type: String }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Gig || mongoose.model('Gig', GigSchema)
