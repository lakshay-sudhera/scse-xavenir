import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import busboy, { FileInfo } from "busboy";
import { Readable } from "stream";

export const runtime = "nodejs"; //run this route in nodejs runtime not edge runtime(busboy and nodestreams work only in nodejs)

// Cloudinary config (read secret keys from env var -> cloudinary SDK)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {    //multipart/form-data -> encoding type used to send FormData over HTTP. tells the server that this req has both text + binary files
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

    const bb = busboy({ headers: { "content-type": contentType } });   // bb = busboy instance
    const nodeStream = Readable.fromWeb(req.body as any);   //Readable.fromWeb() takes a Web ReadableStream and wraps it in a Node.js Readable object
    //A Web stream is pull-based ( explicitly pull each chunk), A Node stream is push-based (Once you attach a listener, chunks are pushed at you automatically)
    const fields: Record<string, string> = {}; //dynamic object for text fields
    const uploads: Record<string, UploadApiResponse | { error: string }> = {}; //stores upload results
    const uploadPromises: Promise<void>[] = []; //tracks async uploads to run in parallel

    
    // Handle file streams
    bb.on(  
    // bb = busboy instance,  .on -> event listener
      "file",
      (
        fieldname: string,
        fileStream: NodeJS.ReadableStream,
        info: FileInfo
      ) => {
        const promise = new Promise<void>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(  // cloudinary.uploader.upload_stream() creates a writable stream to receive file bytes and sends them live to Cloudinary.
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

          fileStream.pipe(uploadStream); //as busboy reads bytes from the incoming HTTP request, they flow directly into Cloudinary's stream
        });

        uploadPromises.push(promise);  //tracks async uploads to run in parallel
      }
    );
    //Client → HTTP request → Busboy → fileStream → Cloudinary

    // Handle text fields
    bb.on("field", (fieldname: string, value: string) => {
      fields[fieldname] = value;
    });

    // Wait for busboy to finish parsing
    const finished = new Promise<void>((resolve, reject) => {
      bb.on("close", resolve); //no incoming data
      bb.on("error", reject);
    });

    nodeStream.pipe(bb); // incoming HTTP request stream -> pipe it into Busboy

    await finished;  // Busboy parsing done, (all fields and files discovered)
    await Promise.all(uploadPromises);   // Actual uploads finished

    return NextResponse.json(
      {
        success: true,
        fields,     //text inputs
        uploads,   //url returned by cloudinary, object with all the uploaded entries
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