import { fetchAuthSession } from "@aws-amplify/auth";
import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  await service.login("username", "password");

  const { idToken } = (await fetchAuthSession()).tokens ?? {};

  console.log(idToken?.toString());

  return idToken;
}

testAuth();
