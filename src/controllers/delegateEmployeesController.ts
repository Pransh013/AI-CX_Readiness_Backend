import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { dynamodb } from "../db";
import { generateSecurePassword, sendEmailInvitation } from "../utils";
import { DelegateEmployeesRequestBody } from "../schema";

const delegateEmployeesController = async (req: Request, res: Response) => {
  const {
    managerId,
    invitedEmails,
  }: DelegateEmployeesRequestBody = req.body;

  try {
    const managerParams = {
      TableName: "aicx_users",
      Key: { userId: managerId },
    };

    const manager = await dynamodb.get(managerParams).promise();
    if (!manager.Item) {
      return res.status(404).json({ error: "Manager not found" });
    }
    console.log("manager", manager);
    
    const managerRole = manager.Item.role;
    if (["employee"].includes(managerRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delegate employees" });
    }

    const updateManagerParams = {
      TableName: "aicx_users",
      Key: { userId: managerId },
      UpdateExpression:
        "SET invited_members = list_append(if_not_exists(invited_members, :empty_list), :invitedEmails)",
      ExpressionAttributeValues: {
        ":invitedEmails": invitedEmails,
        ":empty_list": [],
      },
    };

    await dynamodb.update(updateManagerParams).promise();
    
    for (const email of invitedEmails) {
      const temporaryPassword = generateSecurePassword(); 
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      const employeeParams = {
        TableName: "aicx_users",
        Item: {
          userId: uuidv4(),
          email,
          password: hashedPassword,
          fullName: email,
          role: "employee",
          teamRole: managerRole,
          companyName: manager.Item.companyName,
          invited_members: null,
          managerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      await dynamodb.put(employeeParams).promise();

      const resetPasswordToken = uuidv4(); // Secure token
      const resetPasswordUrl = `https://yourapp.com/reset-password?email=${email}&token=${resetPasswordToken}`;

      await sendEmailInvitation({
        email,
        temporaryPassword,
        resetPasswordUrl,
      });
    }

    res.status(200).json({
      message: "Employees successfully invited and accounts created",
    });
  } catch (error) {
    console.error("Error delegating employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default delegateEmployeesController;
