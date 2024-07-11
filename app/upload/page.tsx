'use server';

import '@aws-amplify/ui-react/styles.css';
import { ListPaginateWithPathOutput } from 'aws-amplify/storage';
import { list } from "aws-amplify/storage/server";
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import UploadResumes from '@/components/UploadResumes';
import { runWithAmplifyServerContext } from '@/lib/amplifyServerUtils';
import { cookies } from 'next/headers';

Amplify.configure(outputs, { ssr: true });

export default async function Upload() {
  let previousResumes: ListPaginateWithPathOutput | undefined = undefined;
  try {
    previousResumes = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => list(contextSpec, { path: ({ identityId }) => `resumes/${identityId}/` })
    });
  } catch (error) {
    previousResumes = undefined;
  }

  return (
    <UploadResumes previousResumes={previousResumes} />
  );
}