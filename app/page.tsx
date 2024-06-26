import React from 'react';
import { columns, Position } from '@/app/columns';
import { readFileSync } from 'fs';
import { DataTable } from '@/components/DataTable';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import _positions from '@/positions.json';
let positions = (_positions as TopLevelJson).positions;
positions = [
  ...new Map(
    positions.map((position) => [position.url, position])
  ).values()
]

Amplify.configure(outputs, { ssr: true });

interface TopLevelJson {
  positions: Position[]
}

const Home = () => {
  const data = positions;

  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export default Home