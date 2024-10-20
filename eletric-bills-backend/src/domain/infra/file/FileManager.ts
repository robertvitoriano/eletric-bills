import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import crypto from "crypto";

interface File {
  filename: string;
  originalname: string;
  mimetype: string;
}

class FileManager {
  private static s3: AWS.S3 = new AWS.S3();
  private static tmpDir: string = path.resolve(__dirname, "../../../../tmp/");

  static {
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir, { recursive: true });
    }
  }

  public static async uploadFile(file: File): Promise<{ url: string; path: string }> {
    const filePath = path.resolve(this.tmpDir, file.filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath);
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileKey = `${fileHash}-${file.originalname}`;
    let url = "";

    if (process.env.AWS_ACCESS_KEY_ID) {
      const { Location } = await this.s3
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

  public static readFile(filePath: string): Buffer {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    return fs.readFileSync(filePath);
  }
  public static async deleteFile(filename: string) {
    try {
      await fs.promises.stat(filename);

      await fs.promises.unlink(filename);
    } catch (e) {
      console.error(e);
    }
  }
}

export default FileManager;
