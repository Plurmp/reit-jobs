"use server";

import { list, ListPaginateWithPathOutput } from 'aws-amplify/storage';
import Files from '@/components/Files';

export default async function ResumeList() {
  let resumes: ListPaginateWithPathOutput | undefined;
  try {
    resumes = await list({
      path: ""
    });
  } catch (error) {
    resumes = undefined;
  }

  return (
    <div className='p-4'>
      <div className='rounded-md bg-white p-4'>
        <h1 className='font-bold text-2xl'>
          Resumes: {resumes?.items.map(item => item.path)}
        </h1>
        <div className='flex justify-center m-4 p-4'>
          {!!resumes
          ? <Files fileList={resumes}/>
          : null
          }
        </div>
      </div>
    </div>
  );
}