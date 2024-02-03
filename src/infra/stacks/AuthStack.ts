import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import {
	CfnIdentityPool,
	CfnUserPoolGroup,
	UserPool,
	UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
	public userPool: UserPool;
	private userPoolClient: UserPoolClient;
	private idenitityPool: CfnIdentityPool;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		this.createUserPool();
		this.createUserPoolClient();
		this.createAdminsGroup();
		this.createIdentityPool();
	}

	private createUserPool() {
		this.userPool = new UserPool(this, 'SpaceUserPool', {
			selfSignUpEnabled: true,
			signInAliases: {
				username: true,
				email: true,
			},
		});

		new CfnOutput(this, 'SpaceUserPoolId', {
			value: this.userPool.userPoolId,
		});
	}
	private createUserPoolClient() {
		this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
			authFlows: {
				adminUserPassword: true,
				custom: true,
				userPassword: true,
				userSrp: true,
			},
		});
		new CfnOutput(this, 'SpaceUserPoolClientId', {
			value: this.userPoolClient.userPoolClientId,
		});
	}

	private createAdminsGroup() {
		new CfnUserPoolGroup(this, 'SpaceAdmins', {
			userPoolId: this.userPool.userPoolId,
			groupName: 'admins',
		});
	}

	getUserPool(): UserPool {
		return this.userPool;
	}

	private createIdentityPool() {
		this.idenitityPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
			allowUnauthenticatedIdentities: true,
			cognitoIdentityProviders: [
				{
					clientId: this.userPoolClient.userPoolClientId,
					providerName: this.userPool.userPoolProviderName,
				},
			],
		});
		new CfnOutput(this, 'SpaceIdenitityPool', {
			value: this.idenitityPool.ref,
		});
	}
}
