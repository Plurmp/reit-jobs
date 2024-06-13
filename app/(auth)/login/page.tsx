"use client";

import '@aws-amplify/ui-react/styles.css';
import { z } from 'zod';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import Link from 'next/link';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters"
  }).max(32, {
    message: "Password must be at most 32 characters"
  }),
});

export default function Login() {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  // });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   const response = await signIn({
  //     username: values.email,
  //     password: values.password,
  //   });
  //   if (response.isSignedIn) {
  //     redirect("/");
  //   } else {
  //     redirect("/auth/login");
  //   }
  // }

  // return (
  //   <div className='flex justify-center'>
  //     <div className='flex flex-col align-middle bg-white rounded-md p-10 m-4'>
  //       <h1 className='font-bold mb-2 text-center text-xl'>Login</h1>
  //       <Form {...form}>
  //         <form onSubmit={form.handleSubmit(onSubmit)}>
  //           <FormField 
  //             control={form.control}
  //             name="email"
  //             render={({ field }) => 
  //               <FormItem className="mb-2">
  //                 <FormLabel>Email</FormLabel>
  //                 <FormControl>
  //                   <Input type="email" placeholder="Email" {...field} />
  //                 </FormControl>
  //                 <FormMessage/>
  //               </FormItem>
  //             }
  //           />
  //           <FormField
  //             control={form.control}
  //             name="password"
  //             render={({ field }) => 
  //               <FormItem className="mb-2">
  //                 <FormLabel>Password</FormLabel>
  //                 <FormControl>
  //                   <Input type="password" placeholder='Password' {...field} />
  //                 </FormControl>
  //                 <FormDescription>Must be between 8 and 32 characters</FormDescription>
  //                 <FormMessage/>
  //               </FormItem>
  //             }
  //           />
  //           <Button type="submit">Submit</Button>
  //         </form>
  //       </Form>
  //     </div>
  //   </div>
  // );
  return (
    <Authenticator>
      {({ user }) => 
        <div className='flex rounded-md bg-white/90'>
          <h1>You have been logged in with {user?.username}!</h1>
          <Link href="/"><h1>Return to list</h1></Link>
        </div>
      }
    </Authenticator>
  )
};