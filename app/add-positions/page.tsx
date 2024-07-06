import { Authenticator } from "@aws-amplify/ui-react";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import type { AdminListGroupsForUserResponse } from "@aws-sdk/client-cognito-identity-provider";
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { fetchAuthSession } from "aws-amplify/auth/server";

const client = generateClient<Schema>()

export default async function AddPositions() {
  let isAdmin = false;
  let groups: string[] = []
  try {
    groups = (await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec).then(output => output.tokens?.accessToken.payload["cognito:groups"])
    })) as string[];
    isAdmin = groups.findIndex((group) => group === "admin") !== -1
  } catch (error) {
    isAdmin = false;
    groups = []
  }

  return (
    <div className="rounded-md bg-white text-center font-medium text-3xl">
      {groups.length > 0
      ? groups.map((group, i) => 
        <p key={i}>{group}</p>
      )
      : <p>no groups</p>
      } 
    </div>
  );
}
