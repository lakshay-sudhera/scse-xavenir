export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Rverify from "@/models/registrationFeesModel";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(req: NextRequest) {
  await connectDB();

  // ── Auth ──────────────────────────────────────────────
  const logtok = req.cookies.get("logtok")?.value;
  if (!logtok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(logtok, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const email  = decoded.email;
  const scseId = decoded.userID;

  // ── Fetch records ─────────────────────────────────────
  const [user, rverify] = await Promise.all([
    User.findOne({ email }),
    Rverify.findOne({ email }),
  ]);

  if (!user)    return NextResponse.json({ error: "User not found" },          { status: 404 });
  if (!rverify) return NextResponse.json({ error: "No payment record found" }, { status: 404 });

  const paidAt = rverify.createdAt
    ? new Date(rverify.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // ── Build PDF with pdf-lib (no font files needed) ─────
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  // Embed built-in fonts (no .afm files, works everywhere)
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ── Colors ──
  const DARK  = rgb(0.04, 0.04, 0.10);
  const CYAN  = rgb(0.00, 0.71, 0.80);
  const WHITE = rgb(1, 1, 1);
  const GREY  = rgb(0.33, 0.33, 0.40);
  const GREEN = rgb(0.00, 0.80, 0.40);
  const LIGHT = rgb(0.94, 0.96, 1.00);

  // ── Header band ──
  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: DARK });

  page.drawText("SCSE", {
    x: 50, y: height - 42,
    size: 28, font: fontBold, color: CYAN,
  });
  page.drawText("Society of Computer Science & Engineering", {
    x: 50, y: height - 60,
    size: 9, font: fontRegular, color: rgb(0.67, 0.73, 0.80),
  });
  page.drawText("NIT Jamshedpur", {
    x: 50, y: height - 73,
    size: 9, font: fontRegular, color: rgb(0.67, 0.73, 0.80),
  });
  page.drawText("PAYMENT RECEIPT", {
    x: width - 180, y: height - 45,
    size: 16, font: fontBold, color: WHITE,
  });

  // ── Paid badge ──
  page.drawRectangle({ x: width - 130, y: height - 75, width: 80, height: 22, color: GREEN });
  page.drawText("PAID", {
    x: width - 108, y: height - 67,
    size: 10, font: fontBold, color: WHITE,
  });

  // ── Divider ──
  page.drawLine({
    start: { x: 50, y: height - 100 },
    end:   { x: width - 50, y: height - 100 },
    thickness: 1.5, color: CYAN,
  });

  // ── Meta row ──
  page.drawText(`Receipt No: ${rverify.razorpay_payment_id}`, {
    x: 50, y: height - 120,
    size: 8, font: fontRegular, color: GREY,
  });
  page.drawText(`Date: ${paidAt}`, {
    x: width - 250, y: height - 120,
    size: 8, font: fontRegular, color: GREY,
  });

  // ── Billed To header ──
  page.drawRectangle({ x: 50, y: height - 158, width: width - 100, height: 22, color: LIGHT });
  page.drawText("BILLED TO", {
    x: 58, y: height - 149,
    size: 9, font: fontBold, color: DARK,
  });

  // ── User info ──
  page.drawText(user.fullName || "—", {
    x: 50, y: height - 178,
    size: 13, font: fontBold, color: DARK,
  });

  const userFields = [
    `SCSE ID: ${scseId}`,
    user.email,
    user.collegeName || "NIT Jamshedpur",
    `Phone: ${user.phone || "—"}`,
  ];
  userFields.forEach((line, i) => {
    page.drawText(line, {
      x: 50, y: height - 196 - i * 16,
      size: 10, font: fontRegular, color: GREY,
    });
  });

  // ── Payment Details header ──
  const tableTop = height - 300;
  page.drawRectangle({ x: 50, y: tableTop, width: width - 100, height: 22, color: LIGHT });
  page.drawText("PAYMENT DETAILS", {
    x: 58, y: tableTop + 8,
    size: 9, font: fontBold, color: DARK,
  });

  // ── Table rows ──
  const rows: [string, string][] = [
    ["Description",    "Registration Fees — Xavenir '26 (Prime Access)"],
    ["Amount",         "Rs. 900"],
    ["Payment ID",     rverify.razorpay_payment_id],
    ["Order ID",       rverify.razorpay_order_id],
    ["Payment Method", "Razorpay"],
    ["Status",         "SUCCESS"],
  ];

  rows.forEach(([label, value], i) => {
    const rowY = tableTop - 20 - i * 24;
    if (i % 2 === 0) {
      page.drawRectangle({ x: 50, y: rowY - 6, width: width - 100, height: 22, color: rgb(0.98, 0.98, 1) });
    }
    page.drawText(label, { x: 58,  y: rowY, size: 9, font: fontBold,    color: GREY });
    page.drawText(value, { x: 220, y: rowY, size: 9, font: fontRegular, color: DARK });
  });

  // ── Total box ──
  const totalY = tableTop - 20 - rows.length * 24 - 20;
  page.drawRectangle({ x: width - 200, y: totalY, width: 150, height: 40, color: DARK });
  page.drawText("TOTAL PAID", {
    x: width - 192, y: totalY + 24,
    size: 9, font: fontBold, color: CYAN,
  });
  page.drawText("Rs. 900", {
    x: width - 192, y: totalY + 8,
    size: 16, font: fontBold, color: WHITE,
  });

  // ── Footer ──
  page.drawLine({
    start: { x: 50, y: 80 }, end: { x: width - 50, y: 80 },
    thickness: 0.5, color: rgb(0.87, 0.87, 0.93),
  });
  [
    "This is a system-generated receipt and does not require a signature.",
    "For support: scse@nitjsr.ac.in  |  +91 97986 87024",
    "© 2026 Xavenir — SCSE, NIT Jamshedpur",
  ].forEach((line, i) => {
    const textWidth = fontRegular.widthOfTextAtSize(line, 8);
    page.drawText(line, {
      x: (width - textWidth) / 2, y: 62 - i * 14,
      size: 8, font: fontRegular, color: GREY,
    });
  });

  // ── Serialize ──
  const pdfBytes = await pdfDoc.save();
  // it is node only, it is converting to buffer and sending file as response
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=receipt_${rverify.razorpay_payment_id}.pdf`,
    },
  });
}