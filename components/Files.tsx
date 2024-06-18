"use client"

import { ListPaginateWithPathOutput, remove, RemoveWithPathInput, downloadData, DownloadDataWithPathInput } from 'aws-amplify/storage';
import { Download, File, Trash2 } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { Button } from './ui/button';

interface FilesProps {
  fileList: ListPaginateWithPathOutput;
}

export default function Files({ fileList }: FilesProps) {
  return (
    <div className='flex flex-col w-2/3 justify-center p-3'>
      {
        fileList.items.map((file, index) =>
          <div className='flex w-full rounded-md bg-white/90 justify-between p-3 items-center border' key={index}>
            <div className='flex align-center gap-2'>
              <File />
              <h1 className='font-semibold'>{/.+\/(.+)$/.exec(file.path)?.[1]}</h1>
            </div>
            <h1>Uploaded {file.lastModified?.toLocaleDateString()}</h1>
            <h1>{!!file.size ? prettyBytes(file.size) : null}</h1>
            <div className='align-center gap-1'>
              <Button onClick={async () => await remove(file as RemoveWithPathInput)}>
                <Trash2 />
              </Button>
              <Button onClick={() => downloadData(file as DownloadDataWithPathInput)}>
                <Download />
              </Button>
            </div>
          </div>
        )
      }
    </div>
  );
}