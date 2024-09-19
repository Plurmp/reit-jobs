import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Position } from "../columns";

const client = generateClient<Schema>();

export const dynamic = "force-static";

export async function GET(request: Request) {
  Amplify.configure(outputs, { ssr: true });

  let nextToken = request.headers.get("nextToken");

  const {
    data: rawPositions,
    errors,
    nextToken: newNextToken,
  } = await client.models.Positions.list({
    nextToken,
    selectionSet: [
      "url",
      "positionName",
      "companyName",
      "location",
      "publishDate",
      "description",
    ],
    limit: 100,
  });

  if (!!errors) {
    return Response.json(errors, { status: 500 });
  }

  const positions = rawPositions.map(
    (p) =>
      <Position>{
        url: p.url,
        positionName: p.positionName,
        companyName: p.companyName,
        location: p.location,
        publishDate: !!p.publishDate ? new Date(p.publishDate) : undefined,
        description: p.description,
      }
  );

  return Response.json({
    positions: positions,
    nextToken: newNextToken,
  });
}
