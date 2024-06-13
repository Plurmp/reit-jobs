import React from 'react';
import { columns, Position } from '@/app/columns';
import { readFileSync } from 'fs';
import { DataTable } from '@/components/DataTable';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';


interface TopLevelJson {
  positions: Position[]
}

function getPositions(): Position[] {
  const posData: TopLevelJson = JSON.parse(readFileSync('./positions.json').toString());
  return posData.positions;
}

Amplify.configure(outputs);

const Home = () => {
  const data = getPositions();

  return (
    <div>
      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export default Home