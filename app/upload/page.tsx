'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { list, ListPaginateWithPathOutput } from 'aws-amplify/storage';
import prettyBytes from 'pretty-bytes';
import Files from '@/components/Files';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

export default async function Upload() {
  let previousResumes: ListPaginateWithPathOutput | undefined = undefined;
  try {
    previousResumes = await list({
      path: ({ identityId }) => `resumes/${identityId}/`
    })
  } catch (error) {
    previousResumes = undefined;
  }

  return (
    <Authenticator>
      {() => 
        <div>
          <h1 className='font-bold text-2xl'>Previous Resumes</h1>
          <div className='flex flex-col justify-center m-4'>
            {!!previousResumes 
              ? <Files fileList={previousResumes} />
              : ""
            }
          </div>
          <StorageManager
            acceptedFileTypes={['.doc', '.docx', '.pdf']}
            path={({ identityId }) => `resumes/${identityId}/`}
            maxFileCount={1}
            isResumable
            autoUpload={false}
          />
        </div>
      }
    </Authenticator>
  );
}