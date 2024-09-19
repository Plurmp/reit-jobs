import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export const dynamic = "force-static";

export async function GET(_: Request) {
  Amplify.configure(outputs, { ssr: true });

  let thisToken: string | null | undefined = undefined;
  let total = 0;
  const { data, nextToken } = await client.models.Positions.list({
    nextToken: thisToken,
    selectionSet: ["companyName"],
    limit: 5000,
  });
  thisToken = nextToken;
  total += data.length;
  while (!!thisToken) {
    const { data, nextToken } = await client.models.Positions.list({
      nextToken: thisToken,
      selectionSet: ["companyName"],
      limit: 5000,
    });
    thisToken = nextToken;
    total += data.length;
  }

  return Response.json({ total: total });
}
