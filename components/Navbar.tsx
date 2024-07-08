"use client";

import Link from 'next/link';
import React from 'react'
import '@aws-amplify/ui-react/styles.css';
import ProfileDropdown from './ProfileDropdown';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import Image from 'next/image';

Amplify.configure(outputs, { ssr: true });

const Navbar = ({children}: Readonly<{children: React.ReactNode}>) => {
    return (
        <header className='w-full bg-gradient-to-r from-blue-600 to-blue-400 border-b-2'>
            <nav className='flex justify-between items-center px-10 py-4'>
                <Link href='/' className='flex items-center gap-2 text-white' title='Go Home'>
                    <div className='flex rounded-sm bg-black h-10 w-10 p-[2px] justify-center'>
                        <Image
                            width={30}
                            height={30}
                            src="/img/all-the-reit-jobs.png"
                            alt='AllTheREITJobs logo'
                        />
                    </div>
                    <h1 className='text-xl font-bold'>AllTheREITJobs</h1>
                    <p className='text-xs font-extralight italic'>Every REIT job<br/>in one place</p>
                </Link>
                <p className='text-md font-semibold text-red-700'>
                    THIS WEBSITE IS A WORK IN PROGRESS. JOBS ARE NOT BEING UPDATED LIVE.
                </p>
                {children}
            </nav>
        </header>
    )
}

export default Navbar