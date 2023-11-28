import { handler } from "../src/services/spaces/handler";

handler(
  {
    httpMethod: "POST",
    /*     queryStringParameters: {
      id: "44a8519b-cafe-41ae-8f38-9606049076b4",
    }, */

    body: JSON.stringify({
      location: "Dublin",
    }),
  } as any,
  {} as any
);
