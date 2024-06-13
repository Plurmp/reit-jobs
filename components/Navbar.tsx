"use client";

import Link from 'next/link';
import React from 'react'
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser, AuthUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { Button } from './ui/button';


const Navbar = async () => {
    let currentUser: AuthUser | undefined;
    try {
        currentUser = await getCurrentUser();
    } catch (error) {
        currentUser = undefined;
}
    async function handleSignOut() {
        await signOut();
    }

    return (
        <header className='w-full bg-gradient-to-r from-blue-600 to-blue-400 border-b-2'>
            <nav className='flex justify-between items-center px-10 py-4'>
                <Link href='/' className='flex items-center gap-2 text-white' title='Go Home'>
                    <h1 className='text-xl font-bold'>REIT Jobs</h1>
                    <p className='text-xs font-extralight italic'>All the <br/> REIT Jobs</p>
                </Link>
                <p className='text-md font-semibold text-red-700'>
                    THIS WEBSITE IS A WORK IN PROGRESS. JOBS ARE NOT BEING UPDATED LIVE.
                </p>
                {currentUser === undefined ? (
                    <div className='flex gap-x-2'>
                        <Link href={'/login'}><Button>Login/Sign Up</Button></Link>
                    </div>
                ) : (
                    <div>
                        <p className='truncate'>{
                            (await fetchUserAttributes()).email
                        }</p>
                        <Button onClick={handleSignOut}>Logout</Button>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar