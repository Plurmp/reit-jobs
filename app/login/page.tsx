"use client";

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import Link from 'next/link';
import { Authenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';

Amplify.configure(outputs, { ssr: true });

export default function Login() {
  return (
    <Authenticator>
      <div className='flex justify-center'>
        <div className='flex flex-col rounded-md bg-white/90 p-4 m-4 gap-8 justify-items-center'>
          <h1 className='font-semibold text-xl'>You have been logged in!</h1>
          {/* <p>{user?.username}</p> */}
          <a href="/" className='flex justify-center'><Button>Return to List</Button></a>
        </div>
      </div>
    </Authenticator>
  )
};