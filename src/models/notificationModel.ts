import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  userID: string;       // recipient
  type: "team_invite_response" | "team_confirmed" | "payment_verified" | "prime_granted" | "announcement";
  title: string;
  message: string;
  read: boolean;
  meta?: Record<string, any>;
}

const NotificationSchema: Schema<Notification> = new Schema(
  {
    userID:  { type: String, required: true, index: true },
    type:    { type: String, required: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
    meta:    { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<Notification>) ||
  mongoose.model<Notification>("Notification", NotificationSchema);

export default NotificationModel;
