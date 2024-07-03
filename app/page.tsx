import React from 'react';
import { columns, Position } from '@/app/columns';
import { readFileSync } from 'fs';
import { DataTable } from '@/components/DataTable';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import _positions from '@/positions.json';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
Amplify.configure(outputs, { ssr: true });

const client = generateClient<Schema>();

let positionsFromFile = (_positions as TopLevelJson).positions;
positionsFromFile = [
  ...new Map(
    positionsFromFile.map((position) => [position.url, position])
  ).values()
];

interface TopLevelJson {
  positions: Position[];
}

// positionsFromFile.forEach(
//   async (position) => {
//     if ((await client.models.Positions.list(
//       { filter: { url: { contains: position.url } } }
//     )).data.length === 0) {
//       await client.models.Positions.create({
//         url: position.url,
//         positionName: position.positionName,
//         companyName: position.companyName,
//         location: position.location,
//         publishDate: position.publishDate?.toString(),
//         description: position.description,
//       });
//     }
//   }
// );

const { data: rawPositions } = await client.models.Positions.list();

const positions = rawPositions.map(
  ({ url, positionName, companyName, location, publishDate, description }): Position => {
    return {
      url,
      positionName,
      companyName,
      location: !!location ? location : undefined,
      publishDate: !!publishDate
        ? new Date(publishDate)
        : undefined,
      description: !!description
        ? description
        : undefined,
    };
  });

const Home = () => {
  const data = positionsFromFile;

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Home;