import { createCanvas, registerFont } from "canvas";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Register fonts once at module load
const fontsDir = path.join(process.cwd(), "src/lib/fonts");
try {
  registerFont(path.join(fontsDir, "Orbitron.ttf"),   { family: "Orbitron",   weight: "400 900" });
  registerFont(path.join(fontsDir, "Roboto.ttf"),     { family: "Roboto",     weight: "100 900" });
  registerFont(path.join(fontsDir, "RobotoMono.ttf"), { family: "RobotoMono", weight: "100 700" });
} catch { /* fonts already registered or not found — fall back gracefully */ }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// 1120×790 — matches the HTML reference exactly
const W = 1120;
const H = 790;

const CYAN    = "#00e5ff";
const MAGENTA = "#ff0080";
const WHITE   = "#e8f4f8";
const BG      = "#040c14";

function hex(h: string, a = 1) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function cx(ctx: any, text: string, y: number) {
  ctx.fillText(text, W / 2, y);
}

function drawGrid(ctx: any) {
  ctx.strokeStyle = hex(CYAN, 0.04);
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function drawBorders(ctx: any) {
  // outer
  ctx.strokeStyle = hex(CYAN, 0.22);
  ctx.lineWidth = 1;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  // inner
  ctx.strokeStyle = hex(CYAN, 0.09);
  ctx.lineWidth = 1;
  ctx.strokeRect(22, 22, W - 44, H - 44);
}

function drawCornerAccents(ctx: any) {
  // cyan squares TL & BR
  ctx.fillStyle = CYAN;
  ctx.shadowColor = hex(CYAN, 0.6); ctx.shadowBlur = 10;
  ctx.fillRect(8, 8, 18, 18);
  ctx.fillRect(W - 26, H - 26, 18, 18);
  // magenta squares TR & BL
  ctx.fillStyle = MAGENTA;
  ctx.shadowColor = hex(MAGENTA, 0.6);
  ctx.fillRect(W - 26, 8, 18, 18);
  ctx.fillRect(8, H - 26, 18, 18);
  ctx.shadowBlur = 0;
}

function drawLBracket(ctx: any, x: number, y: number, flipX: boolean, flipY: boolean) {
  const len = 32; const thick = 2;
  ctx.fillStyle = CYAN;
  ctx.shadowColor = hex(CYAN, 0.6); ctx.shadowBlur = 8;
  // horizontal
  ctx.fillRect(flipX ? x - len : x, flipY ? y - thick : y, len, thick);
  // vertical
  ctx.fillRect(flipX ? x - thick : x, flipY ? y - len : y, thick, len);
  ctx.shadowBlur = 0;
}

function drawCornerBrackets(ctx: any) {
  drawLBracket(ctx, 12, 12, false, false);
  drawLBracket(ctx, W - 12, 12, true, false);
  drawLBracket(ctx, 12, H - 12, false, true);
  drawLBracket(ctx, W - 12, H - 12, true, true);
}

function drawSideBars(ctx: any) {
  // left bar
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0,   hex(CYAN, 0.06));
  grad.addColorStop(0.5, hex(MAGENTA, 0.05));
  grad.addColorStop(1,   hex(CYAN, 0.06));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 38, H);
  ctx.strokeStyle = hex(CYAN, 0.12); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(38, 0); ctx.lineTo(38, H); ctx.stroke();
  // right bar
  ctx.fillStyle = grad;
  ctx.fillRect(W - 38, 0, 38, H);
  ctx.beginPath(); ctx.moveTo(W - 38, 0); ctx.lineTo(W - 38, H); ctx.stroke();
  // magenta dots
  ctx.fillStyle = MAGENTA;
  ctx.shadowColor = hex(MAGENTA, 0.6); ctx.shadowBlur = 10;
  [0.2, 0.5, 0.8].forEach(t => {
    ctx.beginPath(); ctx.arc(19, H * t, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 19, H * t, 4, 0, Math.PI * 2); ctx.fill();
  });
  ctx.shadowBlur = 0;
}

function drawScanlines(ctx: any) {
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.fillRect(0, y + 3, W, 1);
  }
}

function drawLogoBox(ctx: any, x: number, y: number, size: number, isMagenta: boolean) {
  const color = isMagenta ? MAGENTA : CYAN;
  // octagon clip via polygon path
  const s = size;
  const cut = s * 0.12;
  ctx.beginPath();
  ctx.moveTo(x + cut, y);
  ctx.lineTo(x + s - cut, y);
  ctx.lineTo(x + s, y + cut);
  ctx.lineTo(x + s, y + s - cut);
  ctx.lineTo(x + s - cut, y + s);
  ctx.lineTo(x + cut, y + s);
  ctx.lineTo(x, y + s - cut);
  ctx.lineTo(x, y + cut);
  ctx.closePath();
  ctx.strokeStyle = hex(color, 0.3); ctx.lineWidth = 1;
  ctx.fillStyle = hex(color, 0.04);
  ctx.fill(); ctx.stroke();
}

function drawTopDivider(ctx: any, y: number) {
  const grad = ctx.createLinearGradient(38, 0, W - 38, 0);
  grad.addColorStop(0,   "transparent");
  grad.addColorStop(0.2, CYAN);
  grad.addColorStop(0.8, CYAN);
  grad.addColorStop(1,   "transparent");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.shadowColor = hex(CYAN, 0.3); ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(38, y); ctx.lineTo(W - 38, y); ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawHexSeal(ctx: any, cx: number, cy: number, r: number) {
  function hexPath(radius: number) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  // outer ring
  hexPath(r);
  ctx.strokeStyle = CYAN; ctx.lineWidth = 2;
  ctx.shadowColor = hex(CYAN, 0.45); ctx.shadowBlur = 18;
  ctx.stroke();
  // inner ring
  hexPath(r * 0.72);
  ctx.strokeStyle = hex(CYAN, 0.25); ctx.lineWidth = 1;
  ctx.stroke();
  ctx.shadowBlur = 0;
  // text
  ctx.fillStyle = CYAN;
  ctx.font = "bold 11px RobotoMono, monospace";
  ctx.textAlign = "center";
  ctx.fillText("SCSE", cx, cy - 4);
  ctx.fillText("NITJSR", cx, cy + 10);
}

export async function buildCertificateImage(
  fullName: string,
  eventName: string,
  type: "participation" | "winner" | "runner_up",
  position?: number,
  userID?: string
): Promise<Buffer> {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext("2d") as any;

  const isWinner = type !== "participation";
  const accentColor = type === "winner" ? "#ffd700" : type === "runner_up" ? "#c0c0c0" : CYAN;

  // ── Background ──
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Radial glows
  const g1 = ctx.createRadialGradient(W * 0.12, H * 0.18, 50, W * 0.12, H * 0.18, 400);
  g1.addColorStop(0, hex(CYAN, 0.07)); g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W * 0.88, H * 0.82, 50, W * 0.88, H * 0.82, 350);
  g2.addColorStop(0, hex(MAGENTA, 0.06)); g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

  drawGrid(ctx);
  drawSideBars(ctx);
  drawBorders(ctx);
  drawCornerAccents(ctx);
  drawCornerBrackets(ctx);

  // ── HEADER ──
  const contentL = 38 + 60; // left edge of content area
  const contentR = W - 38 - 60;
  const contentW = contentR - contentL;

  // Logo boxes
  drawLogoBox(ctx, contentL, 48, 68, false);
  ctx.fillStyle = hex(CYAN, 0.8);
  ctx.font = "bold 11px RobotoMono, monospace";
  ctx.textAlign = "center";
  ctx.fillText("</SCSE>", contentL + 34, 82);
  ctx.fillText("NITJSR", contentL + 34, 97);

  drawLogoBox(ctx, contentR - 68, 48, 68, true);
  ctx.fillStyle = hex(MAGENTA, 0.8);
  ctx.font = "bold 11px RobotoMono, monospace";
  ctx.fillText("SCSE", contentR - 34, 82);
  ctx.fillText("2026", contentR - 34, 97);

  // Fest title — draw once, centered, two-tone
  ctx.font = "bold 52px Roboto, sans-serif";
  ctx.textAlign = "left";
  const part1 = "XAVENIR ";
  const part2 = "'26";
  const p1W = ctx.measureText(part1).width;
  const p2W = ctx.measureText(part2).width;
  const titleStartX = (W - p1W - p2W) / 2;

  ctx.fillStyle = WHITE;
  ctx.shadowColor = hex(WHITE, 0.2); ctx.shadowBlur = 5;
  ctx.fillText(part1, titleStartX, 90);
  ctx.shadowBlur = 0;

  ctx.fillStyle = CYAN;
  ctx.shadowColor = hex(CYAN, 0.6); ctx.shadowBlur = 14;
  ctx.fillText(part2, titleStartX + p1W, 90);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.fillStyle = hex(CYAN, 0.45);
  ctx.font = "12px RobotoMono, monospace";
  ctx.textAlign = "center";
  ctx.fillText("THE ANNUAL TECHNO-MANAGEMENT FEST  ·  NIT JAMSHEDPUR", W / 2, 110);

  // Top divider
  drawTopDivider(ctx, 130);

  // ── CERTIFICATE LABEL ──
  const certTitle =
    type === "winner"    ? "Certificate of Excellence"   :
    type === "runner_up" ? "Certificate of Achievement"  :
                           "Certificate of Participation";

  ctx.fillStyle = WHITE;
  ctx.font = "bold 34px Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.22em";
  cx(ctx, certTitle.toUpperCase(), 195);

  ctx.fillStyle = hex(WHITE, 0.48);
  ctx.font = "italic 300 18px Roboto, sans-serif";
  cx(ctx, "This Certificate is Presented to", 225);

  // ── NAME ──
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 52px Roboto, sans-serif";
  ctx.shadowColor = hex(WHITE, 0.22); ctx.shadowBlur = 8;
  cx(ctx, fullName.toUpperCase(), 305);
  ctx.shadowBlur = 0;

  // Name underline
  const nameW2 = ctx.measureText(fullName.toUpperCase()).width;
  const nlX = (W - 520) / 2;
  const grad3 = ctx.createLinearGradient(nlX, 0, nlX + 520, 0);
  grad3.addColorStop(0, "transparent");
  grad3.addColorStop(0.5, hex(WHITE, 0.28));
  grad3.addColorStop(1, "transparent");
  ctx.strokeStyle = grad3; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(nlX, 318); ctx.lineTo(nlX + 520, 318); ctx.stroke();

  // User ID
  if (userID) {
    ctx.fillStyle = CYAN;
    ctx.shadowColor = hex(CYAN, 0.6); ctx.shadowBlur = 6;
    ctx.font = "bold 15px RobotoMono, monospace";
    ctx.textAlign = "center";
    cx(ctx, userID, 345);
    ctx.shadowBlur = 0;
  }

  // ── WINNER BADGE (if applicable) ──
  if (isWinner) {
    const suffix = position === 1 ? "1ST" : position === 2 ? "2ND" : "3RD";
    const badgeLabel = type === "winner" ? `${suffix} PLACE` : `${suffix} RUNNER UP`;
    ctx.fillStyle = accentColor;
    ctx.font = "bold 36px RobotoMono, monospace";
    ctx.shadowColor = hex(accentColor, 0.7); ctx.shadowBlur = 20;
    ctx.textAlign = "center";
    cx(ctx, badgeLabel, 400);
    ctx.shadowBlur = 0;
  }

  // ── BODY TEXT ──
  const bodyY = isWinner ? 460 : 415;
  const bodyFont = "19px Roboto, sans-serif";
  const bodyFontBold = "bold 19px Roboto, sans-serif";

  ctx.font = bodyFont;
  const line1 = type === "participation"
    ? "for successfully participating in "
    : "for securing the above position in ";
  const midText  = " conducted under the banner of ";
  const xavenirText = "Xavenir 2026.";

  // measure all parts with consistent font before drawing
  ctx.font = bodyFont;
  const line1W   = ctx.measureText(line1).width;
  const midW     = ctx.measureText(midText).width;
  ctx.font = bodyFontBold;
  const eventW2  = ctx.measureText(eventName).width;
  const xavenirW = ctx.measureText(xavenirText).width;

  const totalLineW = line1W + eventW2 + midW + xavenirW;
  let lx = (W - totalLineW) / 2;

  ctx.font = bodyFont;
  ctx.fillStyle = hex(WHITE, 0.72);
  ctx.textAlign = "left";
  ctx.fillText(line1, lx, bodyY);
  lx += line1W;

  ctx.font = bodyFontBold;
  ctx.fillStyle = CYAN;
  ctx.fillText(eventName, lx, bodyY);
  lx += eventW2;

  ctx.font = bodyFont;
  ctx.fillStyle = hex(WHITE, 0.72);
  ctx.fillText(midText, lx, bodyY);
  lx += midW;

  ctx.font = bodyFontBold;
  ctx.fillStyle = MAGENTA;
  ctx.fillText(xavenirText, lx, bodyY);

  // Mid divider
  const mdX = (W - 340) / 2;
  const grad4 = ctx.createLinearGradient(mdX, 0, mdX + 340, 0);
  grad4.addColorStop(0, "transparent");
  grad4.addColorStop(0.5, hex(CYAN, 0.2));
  grad4.addColorStop(1, "transparent");
  ctx.strokeStyle = grad4; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(mdX, bodyY + 28); ctx.lineTo(mdX + 340, bodyY + 28); ctx.stroke();

  // Commendation
  ctx.fillStyle = hex(WHITE, 0.38);
  ctx.font = "italic 300 16px Roboto, sans-serif";
  ctx.textAlign = "center";
  const commend1 = type === "participation"
    ? "We commend their active engagement, eagerness to learn, and valuable"
    : "We commend their outstanding performance, dedication, and excellence";
  const commend2 = "contributions throughout the event.";
  cx(ctx, commend1, bodyY + 58);
  cx(ctx, commend2, bodyY + 80);

  // ── SIGNATURES ──
  const sigY = H - 115;
  const sigCenters = [W / 4, W / 2, (W * 3) / 4];

  // Left sig
  ctx.fillStyle = hex(WHITE, 0.35);
  ctx.font = "italic 28px Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("~~~", sigCenters[0], sigY);
  const slX = sigCenters[0] - 75;
  const grad5 = ctx.createLinearGradient(slX, 0, slX + 150, 0);
  grad5.addColorStop(0, "transparent");
  grad5.addColorStop(0.5, hex(CYAN, 0.4));
  grad5.addColorStop(1, "transparent");
  ctx.strokeStyle = grad5; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(slX, sigY + 10); ctx.lineTo(slX + 150, sigY + 10); ctx.stroke();
  ctx.fillStyle = hex(CYAN, 0.5);
  ctx.font = "12px RobotoMono, monospace";
  ctx.fillText("F/I TECHNICAL ACTIVITIES", sigCenters[0], sigY + 28);

  // Hex seal center
  drawHexSeal(ctx, sigCenters[1], sigY - 5, 43);

  // Right sig
  ctx.fillStyle = hex(WHITE, 0.35);
  ctx.font = "italic 28px Roboto, sans-serif";
  ctx.fillText("~~~", sigCenters[2], sigY);
  const slX2 = sigCenters[2] - 75;
  const grad6 = ctx.createLinearGradient(slX2, 0, slX2 + 150, 0);
  grad6.addColorStop(0, "transparent");
  grad6.addColorStop(0.5, hex(CYAN, 0.4));
  grad6.addColorStop(1, "transparent");
  ctx.strokeStyle = grad6; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(slX2, sigY + 10); ctx.lineTo(slX2 + 150, sigY + 10); ctx.stroke();
  ctx.fillStyle = hex(CYAN, 0.5);
  ctx.font = "12px RobotoMono, monospace";
  ctx.fillText("DEAN S/W", sigCenters[2], sigY + 28);

  // ── BOTTOM STRIP ──
  const issued = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  ctx.fillStyle = hex(CYAN, 0.28);
  ctx.font = "9px RobotoMono, monospace";
  ctx.textAlign = "left";
  ctx.fillText(`XAVENIR 2026  ·  NIT JAMSHEDPUR  ·  SCSE`, 78, H - 22);
  ctx.textAlign = "right";
  ctx.fillText(`ISSUED: ${issued.toUpperCase()}`, W - 78, H - 22);

  drawScanlines(ctx);

  return canvas.toBuffer("image/png");
}

export async function uploadCertificateToCloudinary(
  imageBuffer: Buffer,
  userID: string,
  eventName: string,
  type: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const safeEvent = eventName.replace(/\s+/g, "_").toLowerCase();
    const publicId  = `${safeEvent}/${type}/${userID}`;

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "certificates", public_id: publicId, overwrite: true },
      (err, result) => {
        if (err || !result) return reject(err || new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );

    const { Readable } = require("stream");
    Readable.from(imageBuffer).pipe(stream);
  });
}
