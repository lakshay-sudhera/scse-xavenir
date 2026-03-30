import mongoose, { Schema, Document } from "mongoose";

export interface Certificate extends Document {
  userID: string;
  eventName: string;
  type: "participation" | "winner" | "runner_up";
  position?: number;
  certificateUrl: string;
  issuedAt: Date;
}

const CertificateSchema = new Schema<Certificate>(
  {
    userID:         { type: String, required: true },
    eventName:      { type: String, required: true },
    type:           { type: String, enum: ["participation", "winner", "runner_up"], required: true },
    position:       { type: Number },
    certificateUrl: { type: String, required: true },
    issuedAt:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CertificateSchema.index({ userID: 1, eventName: 1, type: 1 }, { unique: true });

const CertificateModel =
  (mongoose.models.Certificate as mongoose.Model<Certificate>) ||
  mongoose.model<Certificate>("Certificate", CertificateSchema);

export default CertificateModel;
