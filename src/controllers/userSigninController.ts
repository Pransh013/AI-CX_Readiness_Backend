import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { dynamodb } from "../db";
import { signinSchema } from "../schema";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "myjwtsecret";

const userSigninController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { success } = signinSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }

  try {
    const params = {
      TableName: "aicx_users",
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const result = await dynamodb.query(params).promise();

    if (!result.Items || result.Items.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.Items[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.userId }, jwtSecretKey);

    console.log(user);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        teamRole: user.teamRole
      },
    });
    
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default userSigninController;
