import { connectDB } from "@/dbConfig/dbConfig";
import EventRegistrationModel from "@/models/eventRegistrationModel";
import CertificateModel from "@/models/certificateModel";
import User from "@/models/userModel";
import { buildCertificateImage, uploadCertificateToCloudinary } from "./generateCertificate";

export type WinnerEntry = {
  userID: string;
  type: "winner" | "runner_up";
  position: number;
};

export type GenerateResult = {
  success: number;
  skipped: number;
  failed: number;
  errors: string[];
};

export async function generateCertificatesForEvent(
  eventName: string,
  winners: WinnerEntry[] = []
): Promise<GenerateResult> {
  await connectDB();

  const result: GenerateResult = { success: 0, skipped: 0, failed: 0, errors: [] };

  // Build winner lookup map for O(1) lookup while issuing participation certificate
  const winnerMap = new Map<string, WinnerEntry>();
  for (const w of winners) winnerMap.set(w.userID, w);

  // Get all registered members for this event
  const registrations = await EventRegistrationModel.find({ eventName });
  const allUserIDs = [...new Set(registrations.flatMap((r) => r.members))]; // flatten the array -> convert to set to remove duplicates -> convert to array 

  if (allUserIDs.length === 0) {
    result.errors.push(`No registrations found for event: ${eventName}`);
    return result;
  }

  //  Step 1: Generate winner / runner up certificates first 
  for (const w of winners) {
    try {
      const exists = await CertificateModel.findOne({ userID: w.userID, eventName, type: w.type });
      if (exists) { result.skipped++; continue; }  //if a certificate already exists in MongoDB, skip it.

      const user = await User.findOne({ userID: w.userID });
      if (!user) { result.errors.push(`User not found: ${w.userID}`); result.failed++; continue; }

      const imageBuffer = await buildCertificateImage(user.fullName, eventName, w.type, w.position, w.userID);   //buildCertificateImage → returns a PNG as a Buffer
      const url = await uploadCertificateToCloudinary(imageBuffer, w.userID, eventName, w.type);   //sends the buffer to Cloudinary → returns a public URL
      await CertificateModel.create({ userID: w.userID, eventName, type: w.type, position: w.position, certificateUrl: url });   //stores the certificate record in MongoDB
      result.success++;
    } catch (err: any) {
      result.failed++;
      result.errors.push(`${w.userID} (winner): ${err.message}`);
    }
  }

  //  Step 2: Participation certificates for everyone else
  for (const userID of allUserIDs) {
    // Skip winners — they already have a higher-tier cert
    if (winnerMap.has(userID)) continue;

    try {
      const exists = await CertificateModel.findOne({ userID, eventName, type: "participation" });
      if (exists) { result.skipped++; continue; }

      const user = await User.findOne({ userID });
      if (!user) { result.errors.push(`User not found: ${userID}`); result.failed++; continue; }

      const imageBuffer = await buildCertificateImage(user.fullName, eventName, "participation", undefined, userID);
      const url = await uploadCertificateToCloudinary(imageBuffer, userID, eventName, "participation");
      await CertificateModel.create({ userID, eventName, type: "participation", certificateUrl: url });
      result.success++;
    } catch (err: any) {
      result.failed++;
      result.errors.push(`${userID}: ${err.message}`);
    }
  }

  return result;
}
