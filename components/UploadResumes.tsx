"use client";

import { ListAllWithPathOutput } from "aws-amplify/storage";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import Files from "./Files";
import { copy } from "aws-amplify/storage";

interface UploadProps {
  previousResumes?: ListAllWithPathOutput,
}

export default function UploadResumes({ previousResumes }: UploadProps) {
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
            path={({ identityId }) => `user-resumes/${identityId}/`}
            maxFileCount={1}
            isResumable
            autoUpload={false}
            // onUploadSuccess={async ({ key }) => {
            //   await copy({
            //     source: {
            //       path: ({ identityId }) => `user-resumes/${identityId}/${key}`
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
  )
}