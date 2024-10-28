import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { dynamodb } from "../db";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "myjwtsecret";

const userSignupController = async (req: Request, res: Response) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName || !role) {
    return res
      .status(400)
      .json({ error: "Email, password, and full name are required" });
  }

  try {
    const emailCheckParams = {
      TableName: "aicx_users",
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const existingUser = await dynamodb.query(emailCheckParams).promise();

    if (existingUser.Items && existingUser.Items.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const params = {
      TableName: "aicx_users",
      Item: {
        userId,
        email,
        password: hashedPassword,
        fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    await dynamodb.put(params).promise();

    const token = jwt.sign({ userId }, jwtSecretKey);

    res.status(201).json({ message: "User signed up successfully", token });
  } catch (error: any) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default userSignupController;
