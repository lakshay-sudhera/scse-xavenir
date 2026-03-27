import Notification from "@/models/notificationModel";

interface NotifyPayload {
  userID: string;
  type: "team_invite_response" | "team_confirmed" | "payment_verified" | "prime_granted" | "announcement";
  title: string;
  message: string;
  meta?: Record<string, any>;
}

export async function notify(payload: NotifyPayload | NotifyPayload[]) {
  const docs = Array.isArray(payload) ? payload : [payload];
  await Notification.insertMany(docs);
}
