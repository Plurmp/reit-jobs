import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { cookies } from "next/headers";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";
import { normalizeLocation } from "@/lib/utils";

Amplify.configure(outputs, { ssr: true });

export default async function Normalize() {
  let isAdmin = false;
  let groups: string[] = [];

  try {
    groups = (await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) =>
        fetchAuthSession(contextSpec).then(
          (output) => output.tokens?.accessToken.payload["cognito:groups"]
        ),
    })) as string[];
    isAdmin = groups.includes("admin");
  } catch (error) {
    isAdmin = false;
    groups = [];
  }

  async function normalizePositions(_: FormData) {
    "use server";

    Amplify.configure(outputs, { ssr: true });

    try {
      const groups = (await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) =>
          fetchAuthSession(contextSpec).then(
            (output) => output.tokens?.accessToken.payload["cognito:groups"]
          ),
      })) as string[];
      const currentUser = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => getCurrentUser(contextSpec),
      });
      console.log(groups);
      console.log(currentUser.username);
    } catch (e) {
      console.log(`could not get current user`);
    }
    const client = generateClient<Schema>();
    const { data } = await client.models.Positions.list();
    let previousUrls = new Set<string>();
    let filteredData: typeof data = []
    console.log(data.map(p => p.url).toSorted());
    console.log(`Length of data: ${data.length}`);
    data.forEach(async (position) => {
      if (previousUrls.has(position.url)) {
        console.log(`Deleting ${position.id}`);
        await client.models.Positions.delete({ id: position.id });
        return;
      }
      console.log(`Unique position ${position.positionName}: ${position.id}`);
      previousUrls.add(position.url);
      filteredData.push(position);
    })
    // console.log(filteredData);
    filteredData.forEach(async (position) => {
      if (position.location !== null) {
        const newLocation = normalizeLocation(position.location);
        await client.models.Positions.update({ id: position.id, location: newLocation })
      }
    })
  }
  return (
    <div className="flex flex-col rounded-md bg-white text-center items-center font-medium text-3xl m-4 p-4">
      {!isAdmin ? (
        <p>Access Denied</p>
      ) : (
        <form action={normalizePositions}>
            <div className="border-purple-400 rounded-md bg-blue-500 p-2 text-white">
              <button type="submit">Normalize Positions</button>
            </div>
        </form>
      )}
    </div>
  )
}
