'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { list, ListPaginateWithPathOutput } from 'aws-amplify/storage'

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
          {previousResumes !== undefined 
            ?
              previousResumes.items.map((resume) => 
                <ul>
                  <li>{resume.path}</li>
                  <li>{resume.lastModified?.toLocaleDateString() ?? "unknown date"}</li>
                  <li>{resume.size}</li>
                </ul>
              )
            : ""
          }
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