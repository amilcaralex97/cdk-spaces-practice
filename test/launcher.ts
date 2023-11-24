import { handler } from '../src/services/spaces/handler';

handler(
	{
		httpMethod: 'POST',
		body: JSON.stringify({
			location: 'London',
		}),
	} as any,
	{} as any
);
