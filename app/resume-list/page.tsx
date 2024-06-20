"use server";

import { list, ListAllWithPathOutput } from 'aws-amplify/storage';
import Files from '@/components/Files';
import { fetchAuthSession } from 'aws-amplify/auth';

export default async function ResumeList() {
  let resumes: ListAllWithPathOutput | undefined;
  try {
    resumes = await list({
      path: "",
      options: {
        listAll: true
      }
    });
  } catch (error) {
    resumes = undefined;
  }

  const isAdmin = (await fetchAuthSession())
    .tokens
    ?.accessToken
    .payload["cognito:groups"]
    ?.toString()
    .includes("admin");

  return (
    <div className='p-4'>
      <div className='rounded-md bg-white p-4'>
        <h1 className='font-bold text-2xl'>
          Resumes
        </h1>
        <div className='flex justify-center m-4 p-4'>
          {!!resumes
          ? <Files fileList={resumes} canRemove={isAdmin}/>
          : null
          }
        </div>
      </div>
    </div>
  );
}