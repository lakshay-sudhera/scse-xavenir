
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import PendingPaymentsModel from "@/models/pendingPaymentModel";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
import EventRegistration from "@/models/eventRegistrationModel";
import Visitor from "@/models/visitorModel";
import ContactUs from "@/models/contactUsModel";
import AdminClient from "./AdminClient";


async function getAdminData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("logtok")?.value;
  if (!token) redirect("/login");

  let decoded: any;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
  catch { redirect("/login"); }

  await connectDB();
  const user = await User.findOne({ email: decoded.email }).select("role").lean();  // .lean() -> to return plain JavaScript objects instead of full Mongoose documents - less memory, faster lookup, no save() , populate() functions, no getters/setters
  if (!user || user.role !== "admin") redirect("/");

  const [payments, eventRegs, totalUsers, primeUsers, visitorDoc, confirmedEventRegs, eventRegsByName, contacts] = await Promise.all([
    PendingPaymentsModel.find().sort({ createdAt: -1 }).lean(),
    PendingEventRegistrations.find().sort({ createdAt: -1 }).lean(),
    User.countDocuments(),
    User.countDocuments({ isPrime: true }),
    Visitor.findOne().lean(),
    EventRegistration.countDocuments(),
    EventRegistration.aggregate([
      { $group: { _id: "$eventName", count: { $sum: 1 }, participants: { $sum: { $size: "$members" } } } },
      { $sort: { count: -1 } },
    ]),
    ContactUs.find().sort({ createdAt: -1 }).lean(),
  ]);

  const stats = {
    totalUsers,
    primeUsers,
    visitorCount: (visitorDoc as any)?.count ?? 0,
    pendingPayments: payments.filter((p: any) => !p.status || p.status === "pending").length,
    confirmedEventRegs,
    pendingEventRegs: eventRegs.filter((r: any) => !r.status || r.status === "pending").length,
    contactCount: contacts.length,
    eventRegsByName: JSON.parse(JSON.stringify(eventRegsByName)),
  };

  return {
    payments: JSON.parse(JSON.stringify(payments)),
    eventRegs: JSON.parse(JSON.stringify(eventRegs)),
    contacts: JSON.parse(JSON.stringify(contacts)),
    stats,
  };
}

export default async function AdminPage() {
  const { payments, eventRegs, contacts, stats } = await getAdminData();
  return <AdminClient payments={payments} eventRegs={eventRegs} contacts={contacts} stats={stats} />;
}
