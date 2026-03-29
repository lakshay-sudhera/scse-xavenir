import mongoose, { Schema, Document } from "mongoose";

export interface Rverify extends Document {
  email: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  createdAt: Date; // ← added: timestamps:true writes this but interface was missing it
  updatedAt: Date; // ← added: good practice to declare both
}

const RverifySchema: Schema<Rverify> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
        "Please use a valid email address",
      ],
    },
    razorpay_order_id: {
      type: String,
      required: [true, "Order id missing"],
      unique: true,
    },
    razorpay_payment_id: {
      type: String,
      required: [true, "Payment id missing"],
      unique: true,
    },
    razorpay_signature: { type: String, required: [true, "Signature missing"] },
  },
  { timestamps: true }
);

const RverifyModel =
  (mongoose.models.Rverify as mongoose.Model<Rverify>) ||
  mongoose.model<Rverify>("Rverify", RverifySchema);

export default RverifyModel;