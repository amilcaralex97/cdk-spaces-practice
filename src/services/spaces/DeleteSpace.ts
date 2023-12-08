import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../constants";
import { hasAdminGroup } from "../shared/Utils";

export async function deleteSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify(`Not authorized!`),
    };
  }
  const { queryStringParameters } = event;
  const tableName = process.env.TABLE_NAME;

  try {
    if (queryStringParameters && "id" in queryStringParameters) {
      const { id: spaceId } = queryStringParameters;
      await ddbClient.send(
        new DeleteItemCommand({
          TableName: tableName,
          Key: { id: { S: spaceId } },
        })
      );

      return {
        statusCode: HTTP_OK,
        body: JSON.stringify(`Deleted ${spaceId}`),
      };
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: HTTP_BAD_REQUEST,
      body: JSON.stringify("An error occurred processing your request"),
    };
  }
}
