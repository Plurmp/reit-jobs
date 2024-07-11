"use client";

import * as React from 'react';
import { ListPaginateWithPathOutput } from "aws-amplify/storage";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import Files from "./Files";
import { copy } from "aws-amplify/storage";
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs, { ssr: true });

interface UploadProps {
  previousResumes?: ListPaginateWithPathOutput,
}

export default function UploadResumes(
  { previousResumes }: UploadProps
) {
  return (
    <Authenticator>
      <div className='m-4'>
        <div className='rounded-md bg-white/90 mb-4 p-4'>
          <h1 className='font-bold text-2xl'>Previous Resumes</h1>
          <div className='flex justify-center m-4 p-4'>
            {!!previousResumes
              ? <Files fileList={previousResumes} canRemove={true} />
              : ""
            }
          </div>
        </div>
        <StorageManager
          acceptedFileTypes={['.doc', '.docx', '.pdf']}
          path={({ identityId }) => `resumes/${identityId}/`}
          maxFileCount={1}
          isResumable
          autoUpload={false}
        />
      </div>
    </Authenticator>
  );
}