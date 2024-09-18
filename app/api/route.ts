import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Position } from "../columns";

const client = generateClient<Schema>();

export const dynamic = "force-static";

export async function GET(_: Request) {
  Amplify.configure(outputs, { ssr: true });

  const {
    data: thesePositions,
    errors,
    nextToken,
  } = await client.models.Positions.list({
    selectionSet: [
      "url",
      "positionName",
      "companyName",
      "location",
      "publishDate",
      "description",
    ],
    limit: 5000,
  });
  let rawPositions = [...thesePositions];
  let token = nextToken;
  // console.log("number of positions: " + rawPositions.length);
  // console.log("next token: " + nextToken);
  while (!!token) {
    const {
      data: thesePositions,
      errors,
      nextToken: thisToken,
    } = await client.models.Positions.list({
      selectionSet: [
        "url",
        "positionName",
        "companyName",
        "location",
        "publishDate",
        "description",
      ],
      limit: 5000,
      nextToken: token,
    });
    rawPositions = rawPositions.concat(thesePositions);
    // console.log("number of positions: " + rawPositions.length);
    // console.log("next token: " + thisToken);
    token = thisToken;
  }
  const positions: Position[] = rawPositions.map((p): Position => {
    return {
      url: p.url,
      positionName: p.positionName,
      companyName: p.companyName,
      location: p.location ?? undefined,
      publishDate: !!p.publishDate ? new Date(p.publishDate) : undefined,
      description: p.description ?? undefined,
    };
  });
  const data = {
    positions: positions,
  };

  return Response.json({ data });
}
