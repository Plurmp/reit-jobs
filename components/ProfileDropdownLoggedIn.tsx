"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { User } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'aws-amplify/auth';

interface ProfileDropdownProps {
    email: string;
}

export default function ProfileDropdownLoggedIn({ email }: ProfileDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-accent/50 rounded-md p-1'>
                <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}