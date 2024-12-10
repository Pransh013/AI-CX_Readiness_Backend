import { Request, Response } from "express";
import { dynamodb } from "../db";
import { formatDate } from "../utils";

const getInvitedMembersController = async (req: Request, res: Response) => {
  const { managerId } = req.params;

  try {
    const managerParams = {
      TableName: "aicx_users",
      Key: { userId: managerId },
    };

    const manager = await dynamodb.get(managerParams).promise();
    if (!manager.Item) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const invitedMembers = manager.Item.invited_members;
    if (!invitedMembers || invitedMembers.length === 0) {
      return res.status(200).json({ members: [] });
    }

    const memberDetailsPromises = invitedMembers.map((email: string) => {
      const employeeParams = {
        TableName: "aicx_users",
        IndexName: "email-index", // Ensure you have a secondary index on email
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      };

      return dynamodb.query(employeeParams).promise();
    });

    const memberDetailsResults = await Promise.all(memberDetailsPromises);

    const members = memberDetailsResults
      .map((result) => result.Items?.[0]) // Extract the first result from the query
      .filter((member) => member) // Remove any null or undefined results
      .map((member) => ({
        userId: member.userId,
        fullName: member.fullName,
        email: member.email,
        role: member.role,
        teamRole: member.teamRole,
        invitedAt: formatDate(member.created_at),
      }));

    res.status(200).json({ members });
  } catch (error) {
    console.error("Error fetching invited members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getInvitedMembersController;
