import {
	DynamoDBClient,
	GetItemCommand,
	ScanCommand,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_NOT_FOUND,
	HTTP_OK,
} from '../constants';

export async function updateSpace(
	event: APIGatewayProxyEvent,
	ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
	const { queryStringParameters, body } = event;
	const tableName = process.env.TABLE_NAME;

	try {
		if (queryStringParameters && 'id' in queryStringParameters && body) {
			const parsedBody = JSON.parse(event.body);
			const spaceId = queryStringParameters['id'];
			const requestBodyKey = Object.keys(parsedBody)[0];
			const requestBodyValue = parsedBody[requestBodyKey];

			const updateResult = await ddbClient.send(
				new UpdateItemCommand({
					TableName: process.env.TABLE_NAME,
					Key: {
						id: {
							S: spaceId,
						},
					},
					UpdateExpression: 'set #zzzNew = :new',
					ExpressionAttributeValues: {
						':new': {
							S: requestBodyValue,
						},
					},
					ExpressionAttributeNames: {
						'#zzzNew': requestBodyKey,
					},
					ReturnValues: 'UPDATED_NEW',
				})
			);
			return {
				statusCode: 204,
				body: JSON.stringify(updateResult.Attributes),
			};
		}
		return {
			statusCode: 400,
			body: JSON.stringify('Please provide rigth args!!'),
		};
	} catch (error) {
		console.error('Error processing request:', error);
		return {
			statusCode: HTTP_BAD_REQUEST,
			body: JSON.stringify('An error occurred processing your request'),
		};
	}
}
