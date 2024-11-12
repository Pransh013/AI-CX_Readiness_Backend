import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIAXWMA6JNFUIFP2U3B",
  secretAccessKey: "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",
  region: 'ap-south-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const item = {
  TableName: "cx_questions",
  Item: {
    role: "CXO",
    questionData: [
      {
        topicName: "CX-CXO-Demand Forecasting and Inventory Management",
        questions: [
          {
            questionId: "0-0",
            questionText:
              "How does demand forecasting impact inventory management?",
          },
          {
            questionId: "0-1", 
            questionText:
              "What are the key factors to consider when forecasting demand?",
          },
        ],
      },
      {
        topicName: "Supply Chain Management",
        questions: [
          {
            questionId: "1-0",
            questionText: "What is a supply chain?",
          },
          {
            questionId: "1-1",
            questionText: "What are the key components of a supply chain?",
          },
        ],
      },
    ],
  },
};

async function insertData() {
  try {
    const result = await dynamodb.put(item).promise();
    console.log("Data added successfully:", result);
  } catch (error) {
    console.error("Error adding data:", error);
  }
}

insertData();
