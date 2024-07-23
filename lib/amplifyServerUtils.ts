import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '@/amplify_outputs.json';
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api"
import { cookies } from 'next/headers';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs
});

export const cookieBasedClient = generateServerClientUsingCookies({
  config: outputs,
  cookies
})