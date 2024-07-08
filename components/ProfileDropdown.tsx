"use server";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { User } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'aws-amplify/auth';
import { fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/lib/amplifyServerUtils';
import { cookies } from 'next/headers';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import ProfileDropdownLoggedOut from './ProfileDropdownLoggedOut';
import ProfileDropdownLoggedIn from './ProfileDropdownLoggedIn';

// Amplify.configure(outputs, { ssr: true });

export default async function ProfileDropdown() {
  let email: string | undefined;
  let isAdmin = false
  try {
    email = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchUserAttributes(contextSpec).then(attrs => attrs.email)
    });
    const groups = (await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) =>
        fetchAuthSession(contextSpec).then(
          (output) => output.tokens?.accessToken.payload["cognito:groups"]
        ),
    })) as string[];
    isAdmin = groups.includes("admin");
  } catch (error) {
    email = undefined;
    isAdmin = false;
  }
  if (email === undefined) {
    return <ProfileDropdownLoggedOut/>
  } else {
    return <ProfileDropdownLoggedIn email={email} isAdmin/>
  }
}