'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { copy, list, ListPaginateWithPathOutput } from 'aws-amplify/storage';
import Files from '@/components/Files';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

export default async function Upload() {
  let previousResumes: ListPaginateWithPathOutput | undefined = undefined;
  try {
    previousResumes = await list({
      path: ({ identityId }) => `userresumes/${identityId}/`,
      options: { listAll: true }
    })
  } catch (error) {
    previousResumes = undefined;
  }

  return (
    <Authenticator>
      {() => 
        <div className='m-4'>
          <div className='rounded-md bg-white/90 mb-4 p-4'>
            <h1 className='font-bold text-2xl'>Previous Resumes</h1>
            <div className='flex justify-center m-4 p-4'>
              {!!previousResumes 
                ? <Files fileList={previousResumes} canRemove={true}/>
                : ""
              }
            </div>
          </div>
          <StorageManager
            acceptedFileTypes={['.doc', '.docx', '.pdf']}
            path={({ identityId }) => `userresumes/${identityId}/`}
            maxFileCount={1}
            isResumable
            autoUpload={false}
            // onUploadSuccess={async ({ key }) => {
            //   await copy({
            //     source: {
            //       path: ({ identityId }) => `userresumes/${identityId}/${key}`
            //     },
            //     destination: {
            //       path: `resumes/${key}`
            //     }
            //   });
            //   window.location.reload();
            // }}
          />
        </div>
      }
    </Authenticator>
  );
}