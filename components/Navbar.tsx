"use client";

import Link from 'next/link';
import React from 'react'
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser, AuthUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User } from 'lucide-react'


const Navbar = async () => {
    let email: string | undefined;
    try {
        email = (await fetchUserAttributes()).email
    } catch (error) {
        email = undefined;
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
            </nav>
        </header>
    )
}

export default Navbar