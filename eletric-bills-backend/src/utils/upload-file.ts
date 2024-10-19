import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { deleteFile } from "./file";

export async function uploadFile({ file }): Promise<{ url: string; path: string }> {
  const s3 = new AWS.S3();
  const tmpDir = path.resolve(__dirname, "../../tmp/");

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const filePath = path.resolve(tmpDir, file.filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath);
  const fileHash = crypto.randomBytes(16).toString("hex");
  const fileKey = `${fileHash}-${file.originalname}`;
  let url = "";
  if (process.env.AWS_ACCESS_KEY_ID) {
    const { Location } = await s3
      .upload({
        ACL: "public-read",
        ContentDisposition: "attachment",
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: file.mimetype,
      })
      .promise();
    url = Location;
  }

  return { url, path: filePath };
}
