"use client";

import '@aws-amplify/ui-react/styles.css';
import { z } from 'zod';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import Link from 'next/link';
import { Authenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';

Amplify.configure(outputs);

export default function Login() {
  
  return (
    <Authenticator>
      {({ user }) => 
        <div className='flex rounded-md bg-white/90'>
          <h1>You have been logged in with {user?.username}!</h1>
          <Link href="/"><Button>Return to List</Button></Link>
        </div>
      }
    </Authenticator>
  )
};