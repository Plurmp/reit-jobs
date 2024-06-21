'use server';

import { Authenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { copy, list, ListPaginateWithPathOutput } from 'aws-amplify/storage';
import Files from '@/components/Files';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import UploadResumes from '@/components/UploadResumes';
import { runWithAmplifyServerContext } from '@/lib/amplifyServerUtils';
import { cookies } from 'next/headers';

Amplify.configure(outputs, { ssr: true });

export default async function Upload() {
  let previousResumes: ListPaginateWithPathOutput | undefined = undefined;
  try {
    previousResumes = await list({
      path: ({ identityId }) => `resumes/${identityId}/`
    })
  } catch (error) {
    previousResumes = undefined;
  }

  // try {
  //   previousResumes = await runWithAmplifyServerContext({
  //     nextServerContext: { cookies },
  //     operation: (contextSpec) => list({
  //       path: ({identityId}) => `resumes/${identityId}/`,
  //       options: { listAll: true }
  //     })
  //   })
  // } catch (error) {
  //   previousResumes = undefined;
  // }

  return (
    <UploadResumes previousResumes={previousResumes} />
  );
}