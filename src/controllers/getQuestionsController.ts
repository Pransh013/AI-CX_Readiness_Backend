import { Request, Response } from "express";
import { dynamodb } from "../db";

export const getAIQuestionsController = async (req: Request, res: Response) => {
  const { role } = req.params;
  
  try {
    const params = {
      TableName: "ai_questions",
      Key: { role: role },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return res
        .status(404)
        .json({ message: `No AI questions found for role: ${role}` });
    }

    return res.status(200).json(result.Item.questionData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching AI questions", error });
  }
};

export const getCXQuestionsController = async (req: Request, res: Response) => {
  const { role } = req.params;

  try {
    const params = {
      TableName: "cx_questions",
      Key: { role: role },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return res
        .status(404)
        .json({ message: `No CX questions found for role: ${role}` });
    }

    return res.status(200).json(result.Item.questionData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching CX questions", error });
  }
};