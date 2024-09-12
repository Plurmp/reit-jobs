import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Position } from "../columns";
import { saveAs } from "file-saver";

const client = generateClient<Schema>();

export default async function Export() {
  async function exportPositions(_: FormData) {
    "use server";

    Amplify.configure(outputs, { ssr: true });

    const { data: thesePositions, errors, nextToken } = await client.models.Positions.list({
      selectionSet: [
        "url",
        "positionName",
        "companyName",
        "location",
        "publishDate",
        "description"
      ],
      limit: 5000
    });
    let rawPositions = [...thesePositions];
    let token = nextToken;
    // console.log("number of positions: " + rawPositions.length);
    // console.log("next token: " + nextToken);
    while (!!token) {
      const { data: thesePositions, errors, nextToken: thisToken } = await client.models.Positions.list({
        selectionSet: [
          "url",
          "positionName",
          "companyName",
          "location",
          "publishDate",
          "description",
        ],
        limit: 5000,
        nextToken: token
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
      "positions": positions
    };
    const fileToSave = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(fileToSave, "positions.json");
  }

  return (
    <div className="flex flex-col rounded-md bg-white text-center items-center font-medium text-3xl m-4 p-4">
      <form action={exportPositions}>
        <div className="border-purple-400 rounded-md bg-blue-500 p-2 text-white">
          <button type="submit">Normalize Positions</button>
        </div>
      </form>
    </div>
  );
}