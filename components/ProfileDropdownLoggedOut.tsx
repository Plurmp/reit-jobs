"use client";

import { User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function ProfileDropdownLoggedOut() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-accent/50 rounded-md p-1'>
                <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem><a href='/login'>Login/Sign Up</a></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}