import {
	DynamoDBClient,
	GetItemCommand,
	ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_NOT_FOUND,
	HTTP_OK,
} from '../constants';

export async function getSpaces(
	event: APIGatewayProxyEvent,
	ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
	const { queryStringParameters } = event;
	const tableName = process.env.TABLE_NAME;

	try {
		if (queryStringParameters && 'id' in queryStringParameters) {
			const { id: spaceId } = queryStringParameters;
			const getItemResponse = await ddbClient.send(
				new GetItemCommand({
					TableName: tableName,
					Key: { id: { S: spaceId } },
				})
			);

			if (getItemResponse.Item) {
				const unmarshalledItem = unmarshall(getItemResponse.Item);
				return {
					statusCode: HTTP_OK,
					body: JSON.stringify(unmarshalledItem),
				};
			} else {
				return {
					statusCode: HTTP_NOT_FOUND,
					body: JSON.stringify(`Space with id ${spaceId} not found!`),
				};
			}
		}

		const scanResult = await ddbClient.send(
			new ScanCommand({ TableName: tableName })
		);
		const unmarshalledItems = scanResult.Items.map((item) =>
			unmarshall(item)
		);
		return {
			statusCode: HTTP_CREATED,
			body: JSON.stringify(unmarshalledItems),
		};
	} catch (error) {
		console.error('Error processing request:', error);
		return {
			statusCode: HTTP_BAD_REQUEST,
			body: JSON.stringify('An error occurred processing your request'),
		};
	}
}
