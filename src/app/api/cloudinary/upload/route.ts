import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import busboy, { FileInfo } from "busboy";
import { Readable } from "stream";

export const runtime = "nodejs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 415 }
      );
    }

    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const bb = busboy({ headers: { "content-type": contentType } });
    const nodeStream = Readable.fromWeb(req.body as any);

    const fields: Record<string, string> = {};
    const uploads: Record<string, UploadApiResponse | { error: string }> = {};
    const uploadPromises: Promise<void>[] = [];

    
    // Handle file streams
    bb.on(
      "file",
      (
        fieldname: string,
        fileStream: NodeJS.ReadableStream,
        info: FileInfo
      ) => {
        const promise = new Promise<void>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "nextjs_uploads" },
            (error: Error | undefined, result?: UploadApiResponse) => {
              if (error || !result) {
                uploads[fieldname] = {
                  error: error?.message || "Upload failed",
                };
                return reject(error);
              }

              uploads[fieldname] = result;
              resolve();
            }
          );

          fileStream.pipe(uploadStream);
        });

        uploadPromises.push(promise);
      }
    );

    // Handle text fields
    bb.on("field", (fieldname: string, value: string) => {
      fields[fieldname] = value;
    });

    // Wait for busboy to finish parsing
    const finished = new Promise<void>((resolve, reject) => {
      bb.on("close", resolve);
      bb.on("error", reject);
    });

    nodeStream.pipe(bb);

    await finished;
    await Promise.all(uploadPromises);

    return NextResponse.json(
      {
        success: true,
        fields,
        uploads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}