import { SignInOutput, signIn } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "XX-XXXX-X_abcd1234",
      userPoolClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const result = (await signIn({
      username,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    })) as SignInOutput;
    return result;
  }
}
