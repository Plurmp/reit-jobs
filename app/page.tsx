import React, { Suspense } from "react";
import { columns, Position } from "@/app/columns";
import { readFileSync } from "fs";
import { DataTable } from "@/components/DataTable";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import _positions from "@/oldVersionPositions.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { FullDescription } from "@/components/FullDescription";
import FullDescriptionPlaceholder from "@/components/FullDescriptionPlaceholder";

Amplify.configure(outputs, { ssr: true });

const client = generateClient<Schema>();

let positionsFromFile = (_positions as TopLevelJson).positions;
positionsFromFile = [
  ...new Map(
    positionsFromFile.map((position) => [position.url, position])
  ).values(),
];

export interface TopLevelJson {
  positions: Position[];
}

export type Props = {
  searchParams: Record<string, string> | null | undefined;
}

const Home = async (props: Props) => {
  const modal = props.searchParams?.fullDesc === "true";
  const rowUrl = props.searchParams?.url;

  const { data: thesePositions, errors, nextToken } = await client.models.Positions.list({
    selectionSet: [
      "url",
      "positionName",
      "companyName",
      "location",
      "publishDate",
    ],
    limit: 5000
  });
  let rawPositions = [...thesePositions]
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
      ],
      limit: 5000,
      nextToken: token
    });
    rawPositions = rawPositions.concat(thesePositions);
    // console.log("number of positions: " + rawPositions.length);
    // console.log("next token: " + thisToken);
    token = thisToken;
  }

  const positions = rawPositions.map(
    ({ url, positionName, companyName, location, publishDate }): Position => {
      return {
        url,
        positionName,
        companyName,
        location: !!location ? location : undefined,
        publishDate: !!publishDate ? new Date(publishDate) : undefined,
      };
    }
  );

  const data = positions;

  return (
    <div>
      <DataTable columns={columns} data={data} />
      
      {modal && rowUrl && (
        <Suspense fallback={<FullDescriptionPlaceholder />}>
          <FullDescription rowUrl={rowUrl} />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
