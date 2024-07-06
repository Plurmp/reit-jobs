import { AdminListGroupsForUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "$amplify/env/list-groups-for-user";
import type { Schema } from "../../data/resource";

type Handler = Schema["listGroupsForUser"]["functionHandler"];
const client = new CognitoIdentityProviderClient()

export const handler: Handler = async (event) => {
    const { userId } = event.arguments;
    const command = new AdminListGroupsForUserCommand({
        Username: userId,
        UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    });
    const response = await client.send(command);
    return response;
}