"use client";

import '@aws-amplify/ui-react/styles.css';
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
        <div className='flex justify-center'>
          <div className='flex flex-col rounded-md bg-white/90 p-4 m-4'>
            <h1>You have been logged in!</h1>
            <Link href="/"><Button>Return to List</Button></Link>
          </div>
        </div>
      }
    </Authenticator>
  )
};