import { Request, Response } from "express";
import { dynamodb } from "../db"; // DynamoDB client
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// Save AI Marks by Pillar
export const saveAIMarksController = async (req: Request, res: Response) => {
  const { userId, aiMarksByPillar } = req.body;

  if (!userId || !aiMarksByPillar) {
    return res
      .status(400)
      .json({ message: "userId and aiMarksByPillar are required." });
  }

  const params: DocumentClient.UpdateItemInput = {
    TableName: "UserMarks",
    Key: { userId },
    UpdateExpression: "set aiMarksByPillar = :aiMarks",
    ExpressionAttributeValues: {
      ":aiMarks": aiMarksByPillar,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamodb.update(params).promise();
    return res.status(200).json({ message: "AI marks saved successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error saving AI marks." });
  }
};

// Save CX Marks by Pillar
export const saveCXMarksController = async (req: Request, res: Response) => {
  const { userId, cxMarksByPillar } = req.body;

  if (!userId || !cxMarksByPillar) {
    return res
      .status(400)
      .json({ message: "userId and cxMarksByPillar are required." });
  }

  const params: DocumentClient.UpdateItemInput = {
    TableName: "UserMarks",
    Key: { userId },
    UpdateExpression: "set cxMarksByPillar = :cxMarks",
    ExpressionAttributeValues: {
      ":cxMarks": cxMarksByPillar,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamodb.update(params).promise();
    return res.status(200).json({ message: "CX marks saved successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error saving CX marks." });
  }
};

// Get AI Marks by Pillar
export const getAIMarksController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const params: DocumentClient.GetItemInput = {
    TableName: "UserMarks",
    Key: { userId },
  };

  try {
    const data = await dynamodb.get(params).promise();

    if (!data.Item) {
      return res.status(404).json({ message: "User not found." });
    } else if (!data.Item?.aiMarksByPillar) {
      return res
        .status(200)
        .json({ message: "No AI marks data", aiMarksByPillar: {} });
    }
    return res.status(200).json(data.Item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving AI marks." });
  }
};

// Get CX Marks by Pillar
export const getCXMarksController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const params: DocumentClient.GetItemInput = {
    TableName: "UserMarks",
    Key: { userId },
  };

  try {
    const data = await dynamodb.get(params).promise();

    if (!data.Item) {
      return res.status(404).json({ message: "User not found." });
    } else if (!data.Item?.cxMarksByPillar) {
      return res
        .status(200)
        .json({ message: "No CX marks data", cxMarksByPillar: {} });
    }
    return res.status(200).json(data.Item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving CX marks." });
  }
};
