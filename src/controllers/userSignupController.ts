import { v4 as uuidv4 } from "uuid"; // UUID for generating unique ids
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { dynamodb } from "../db";
import { signupSchema } from "../schema";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "myjwtsecret";

const userSignupController = async (req: Request, res: Response) => {
  const { email, password, fullName, role, companyName } = req.body;

  const { success } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
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

    const companyCheckParams = {
      TableName: "aicx_companies",
      IndexName: "companyName-index",
      KeyConditionExpression: "companyName = :companyName",
      ExpressionAttributeValues: {
        ":companyName": companyName,
      },
    };

    const existingCompany = await dynamodb.query(companyCheckParams).promise();

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    if (!existingCompany.Items || existingCompany.Items.length === 0) {
      const companyParams = {
        TableName: "aicx_companies",
        Item: {
          companyId: uuidv4(),
          companyName,
          userIds: [userId],
        },
      };
      await dynamodb.put(companyParams).promise();
    } else {
      const company = existingCompany.Items[0];
      const companyId = company.companyId;
      company.userIds.push(userId);

      const updateCompanyParams = {
        TableName: "aicx_companies",
        Key: {
          companyId,
        },
        UpdateExpression: "SET userIds = :userIds",
        ExpressionAttributeValues: {
          ":userIds": company.userIds,
        },
      };
      await dynamodb.update(updateCompanyParams).promise();
    }

    const userParams = {
      TableName: "aicx_users",
      Item: {
        userId,
        email,
        password: hashedPassword,
        fullName,
        role,
        teamRole: role,
        companyName,
        invitations: [],
        managerId: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    await dynamodb.put(userParams).promise();

    const token = jwt.sign({ userId }, jwtSecretKey);

    res.status(201).json({
      message: "User signed up successfully",
      token,
      user: {
        userId,
        fullName,
        teamRole: role,
        role,
      },
    });
  } catch (error: any) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default userSignupController;
