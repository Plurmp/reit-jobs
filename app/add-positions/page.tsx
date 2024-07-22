import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { z } from "zod";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json"

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
};

const positionShapeSchema = z.array(
  z.object({
    url: z.string().url(),
    positionName: z.string(),
    companyName: z.string().max(5),
    location: z.array(z.string()).optional(),
    publishDate: z.string().datetime().optional(),
    description: z.string().optional(),
  })
);

const positionsSchema = z.preprocess(
  parseJsonPreprocessor,
  positionShapeSchema
);

let errorMessage = "";
export default async function Add() {
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

  async function createPositions(formData: FormData) {
    "use server";

    Amplify.configure(outputs, {
      API: {
        GraphQL: {
          headers: async () => {
            const currentSession = await runWithAmplifyServerContext({
              nextServerContext: { cookies },
              operation: (contextSpec) => fetchAuthSession(contextSpec),
            })
            if (currentSession.tokens) {
              const idToken = currentSession.tokens.idToken?.toString();
              return { Authorization: idToken }
            } else {
              return { Authorization: undefined };
            }
          }
        }
      }, 
      ssr: true
    });

    try {
      const groups = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) =>
          fetchAuthSession(contextSpec).then(
            (output) => output.tokens?.accessToken.payload["cognito:groups"]
          ),
      }) as string[];
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
    const positionsStr = formData.get("positions")?.toString();
    if (!positionsStr) return;
    const {
      success,
      error,
      data: positions,
    } = positionsSchema.safeParse(positionsStr);
    if (!success) {
      errorMessage = `Zod Error: ${error}`;
      return;
    } else errorMessage = "";
    const { data: oldData } = await client.models.Positions.list({
      selectionSet: ["url"],
    });
    const oldUrls = new Set(oldData.map((position) => position.url));
    console.log(oldUrls);
    const positionsToInsert = positions.filter(({ url }) => !oldUrls.has(url));
    // console.log(positionsToInsert);

    const errors = await Promise.all(
      positionsToInsert.map(
        async ({
          url,
          positionName,
          companyName,
          location,
          publishDate,
          description,
        }) => {
          const { errors } = await client.models.Positions.create(
            {
              url,
              positionName,
              companyName,
              location,
              publishDate: !!publishDate ? publishDate.toString() : null,
              description,
            },
            {
              authMode: "userPool",
            }
          );
          return errors;
        }
      )
    );
    console.log(errors);
  }

  return (
    <div className="flex flex-col rounded-md bg-white text-center items-center font-medium text-3xl m-4 p-4">
      <h3 className="text-red-700">{errorMessage}</h3>
      {!isAdmin ? (
        <p>Access Denied</p>
      ) : (
        <form action={createPositions}>
          <div className="flex flex-col items-center w-full gap-2">
            <textarea
              name="positions"
              id="positions"
              rows={40}
              cols={150}
              className="resize border overflow-scroll text-nowrap text-sm"
            />
            <div className="border-purple-400 rounded-md bg-blue-500 p-2 text-white">
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
