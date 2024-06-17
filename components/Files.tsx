
import { ListPaginateWithPathOutput, remove, RemoveWithPathInput, downloadData, DownloadDataWithPathInput } from 'aws-amplify/storage';
import { Download, File, Trash2 } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { Button } from './ui/button';

interface FilesProps {
  fileList: ListPaginateWithPathOutput;
}

export default function Files({ fileList }: FilesProps) {
  return (
    <div className='flex flex-col w-2/3 justify-center'>
      {
        fileList.items.map((file, index) =>
          <div className='flex w-full rounded-md bg-white/90 justify-between p-3 align-center' key={index}>
            <div className='align-center'>
              <File />
              <h1>{/.+\/(.+)$/.exec(file.path)?.[1]}</h1>
            </div>
            <h1>Uploaded {file.lastModified?.toLocaleDateString()}</h1>
            <h1>{!!file.size ? prettyBytes(file.size) : null}</h1>
            <div className='align-center'>
              <Button onClick={async () => await remove(file as RemoveWithPathInput)}>
                <Trash2 />
              </Button>
              <Button onClick={async () => downloadData(file as DownloadDataWithPathInput)}>
                <Download />
              </Button>
            </div>
          </div>
        )
      }
    </div>
  );
}