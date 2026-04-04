import mongoose, { Schema, Document } from "mongoose";

export interface ContactUs extends Document {
  name: string;
  email: string;
  number: string;
  content: string;
}

const ContactUsSchema: Schema<ContactUs> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required "],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters length"],
    },
  },
  { timestamps: true }
);

const ContactUsModel =
  (mongoose.models.ContactUs as mongoose.Model<ContactUs>) ||
  mongoose.model<ContactUs>("ContactUs", ContactUsSchema);

export default ContactUsModel;
