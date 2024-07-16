import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { Position } from "../columns";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { z } from "zod";

const client = generateClient<Schema>();

const parseJsonPreprocessor = (value: any, ctx: z.RefinementCtx) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message: (error as Error).message,
      });
    }
  }

  return value;
}

const positionShapeSchema = z.array(
  z.object({
    url: z.string().url(),
    positionName: z.string(),
    companyName: z.string().max(5),
    location: z.array(z.string()).optional(),
    publishDate: z.date().optional(),
    description: z.string().optional(),
  })
);

const positionsSchema = z.preprocess(parseJsonPreprocessor, positionShapeSchema);

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
    const {success, error, data: positions} = positionsSchema.safeParse(positionsStr);
    if (!success) {
      errorMessage = `Zod Error: ${error}`
      return;
    }
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
      <h3>{ errorMessage }</h3>
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
