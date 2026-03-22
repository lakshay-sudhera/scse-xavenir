//fetch db data
import PendingEventRegistrationsModel from "@/models/pendingEventPaymentModel";
import { connectDB } from "@/dbConfig/dbConfig";
import AdminClient from "./AdminClient";

async function getData() {
  await connectDB();
  const data = await PendingEventRegistrationsModel.find().lean();
  return JSON.parse(JSON.stringify(data));
}

export default async function AdminPage() {
  const payments = await getData();

  return <AdminClient payments={payments} />; 
}