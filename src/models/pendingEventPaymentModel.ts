import mongoose, { Document, Schema } from "mongoose";

export interface PendingEventRegistration extends Document {
  eventName: string;
  teamName: string;
  paymentProof: string;
  members: string[];
  isPending: boolean;
  isSpam: boolean;
  status: "pending" | "verified" | "rejected";
  transactionId1: string;
  transactionId2?: string;
  transactionId3?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PendingEventRegistrationSchema: Schema<PendingEventRegistration> = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
    },
    paymentProof: {
      type: String,
      required: [true, "Payment proof is required"],
    },
    members: {
      type: [String],
      required: [true, "Members are required"],
    },
    isPending: {
      type: Boolean,
      default: true,
    },
    isSpam: {
      type: Boolean,
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
  { timestamps: true }
);

const PendingEventRegistrationsModel =
  (mongoose.models.PendingEventRegistrations as mongoose.Model<PendingEventRegistration>) ||
  mongoose.model<PendingEventRegistration>(
    "PendingEventRegistrations",
    PendingEventRegistrationSchema
  );

export default PendingEventRegistrationsModel;
