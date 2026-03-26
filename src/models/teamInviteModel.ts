import mongoose, { Schema, Document } from "mongoose";

export interface TeamInvite extends Document {
  teamName: string;
  eventName: string;
  invitedBy: string;       // userID of the team creator
  invitedUser: string;     // userID of the invited member
  status: "pending" | "accepted" | "rejected";
  // store the full team context so we can register once all accept
  allMembers: string[];
  registrationPayload: Record<string, any>; // razorpay ids / payment proof etc.
  registrationType: "free" | "razorpay" | "manual";
}

const TeamInviteSchema: Schema<TeamInvite> = new Schema(
  {
    teamName:    { type: String, required: true },
    eventName:   { type: String, required: true },
    invitedBy:   { type: String, required: true },
    invitedUser: { type: String, required: true },
    status:      { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    allMembers:  { type: [String], required: true },
    registrationPayload: { type: Schema.Types.Mixed, default: {} },
    registrationType: { type: String, enum: ["free", "razorpay", "manual"], default: "free" },
  },
  { timestamps: true }
);

const TeamInviteModel =
  (mongoose.models.TeamInvite as mongoose.Model<TeamInvite>) ||
  mongoose.model<TeamInvite>("TeamInvite", TeamInviteSchema);

export default TeamInviteModel;
