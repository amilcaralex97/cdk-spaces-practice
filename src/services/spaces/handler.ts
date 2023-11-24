import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from 'aws-lambda';
import { postSpaces } from './PostSpaces';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({});

async function handler(
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> {
	let message: string;

	try {
		switch (event.httpMethod) {
			case 'GET':
				message = 'Hello from GET!';
				break;
			case 'POST':
				const response = postSpaces(event, ddbClient);
				return response;
				break;
			default:
				break;
		}
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify(error.message),
		};
	}

	const response: APIGatewayProxyResult = {
		statusCode: 200,
		body: JSON.stringify(message),
	};

	return response;
}

export { handler };
