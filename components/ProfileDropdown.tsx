import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator} from './ui/dropdown-menu';
import { User } from 'lucide-react';
import Link from 'next/link';
import { signOut, fetchUserAttributes } from 'aws-amplify/auth';

Amplify.configure(outputs, { ssr: true });

export default async function ProfileDropdown() {
  let email: string | undefined;
  try {
    email = (await fetchUserAttributes())?.email;
  } catch (error) {
    email = undefined;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='hover:bg-accent/50 rounded-md p-1'>
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {email === undefined
          ?
          <DropdownMenuItem>
            <Link href={'/login'}>Login/Sign Up</Link>
          </DropdownMenuItem>
          :
          <>
            <DropdownMenuLabel>{email}</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem>
              <Link href={'/upload'}>Upload Resume</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut();
                window.location.reload();
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}