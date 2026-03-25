import mongoose, { Schema, Document } from "mongoose";

export interface PendingPayments extends Document {
  email: string;
  scseId: string;
  paymentProof: string;
  isPending: boolean;
  transactionId1: string;
  transactionId2?: string;
  transactionId3?: string;
  isSpam: boolean;
  status: "pending" | "verified" | "rejected";
}

const PendingPaymentsSchema: Schema<PendingPayments> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
        "Please use a valid email address",
      ],
    },
    scseId: {
      type: String,
      required: [true, "SCSE ID is required"],
    },
    paymentProof: {
      type: String,
      required: [true, "Email proof is required"],
    },
    isPending: {
      type: Boolean,
      required: true,
      default: true,
    },
    isSpam: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    transactionId1: {
      type: String,
      required: [true, "Transaction ID 1 is required"],
    },
    transactionId2: {
      type: String,
      required: false,
    },
    transactionId3: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
  }
);

const PendingPaymentsModel =
  (mongoose.models.PendingPayments as mongoose.Model<PendingPayments>) ||
  mongoose.model<PendingPayments>("PendingPayments", PendingPaymentsSchema);

export default PendingPaymentsModel;
