import dbConnect from "@/server/utils/dbConnect";
import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {

    // get api key from bear token
    const token = request.headers.get("authorization");

    // if key is not process.env.MERSE_API_KEY
    if (token !== `Bearer ${process.env.MERSE_API_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const db = await dbConnect();
    const body = await request.json();

    // error guards
    if (!body) throw new Error("Missing body.");

    console.log("body: ", body);

    if (
      !process.env.AMAZON_S3_ACCESS_KEY_ID ||
      !process.env.AMAZON_S3_SECRET_ACCESS_KEY
    ) {
      throw new Error("Missing Amazon S3 credentials.");
    }

    if (!process.env.AMAZON_S3_BUCKET_NAME) {
      throw new Error("Missing Amazon S3 bucket name.");
    }

    console.log("access keys: ", process.env.AMAZON_S3_ACCESS_KEY_ID);
    console.log("secret keys: ", process.env.AMAZON_S3_SECRET_ACCESS_KEY);

    const s3 = new S3Client({
      region: "us-west-2",
      credentials: {
        accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_S3_SECRET_ACCESS_KEY,
      },
    });

    // const params: PutObjectCommandInput = {
    //   Bucket: process.env.AMAZON_S3_BUCKET_NAME,
    //   Key: `images/${file.name}`,
    //   Body: file,
    //   ContentType: file.type,
    //   ACL: "public-read",
    // };

    // const command = new PutObjectCommand(params);
    // const response = await s3.send(command);
    // console.log("Reponse from S3", response);

  } catch (error: any) {
    console.log(
      "Failed to upload file from middleware function, message: ",
      error.message
    );
  }
}
