import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { Position } from "../columns";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { z } from "zod";

const client = generateClient<Schema>();

const positionSchema = z.array(
  z.object({
    url: z.string(),
    positionName: z.string(),
    companyName: z.string().min(1).max(5),
    publishDate: z.date().optional(),
    location: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
);

export default async function AddPositions() {
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

  let errorMessage = "";

  async function createPositions(formData: FormData) {
    "use server";

    const positionsStr = formData.get("positions")?.toString();
    if (!positionsStr) return;
    const positions: Position[] = JSON.parse(positionsStr);
    const { data: oldData } = await client.models.Positions.list();
    const oldUrls = new Set(oldData.map((position) => position.url));
    const positionsToInsert = positions.filter(({ url }) => !oldUrls.has(url));

    await Promise.all(
      positionsToInsert.map(
        async ({
          url,
          positionName,
          companyName,
          location,
          publishDate,
          description,
        }) => {
          await client.models.Positions.create({
            url,
            positionName,
            companyName,
            location,
            publishDate: !!publishDate ? publishDate.toString() : null,
            description,
          });
        }
      )
    );
  }

  return (
    <div className="rounded-md bg-white text-center font-medium text-3xl">
      {!isAdmin ? (
        <p>Access Denied</p>
      ) : (
        <form action={createPositions}>
          <input
            type="text"
            name="positions"
            id="positions"
            className="resize"
          />
          <input type="submit" value="submit" />
        </form>
      )}
    </div>
  );
}
