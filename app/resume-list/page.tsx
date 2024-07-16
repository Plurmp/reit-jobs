"use server";

import { ListPaginateWithPathOutput } from "aws-amplify/storage";
import { list } from "aws-amplify/storage/server";
import Files from "@/components/Files";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/lib/amplifyServerUtils";
import { cookies } from "next/headers";

export default async function ResumeList() {
  let resumes: ListPaginateWithPathOutput | undefined;
  let isAdmin = false;
  try {
    resumes = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => list(contextSpec, { path: "resumes/" }),
    });
    const groups = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) =>
        fetchAuthSession(contextSpec).then((response) =>
          response.tokens?.accessToken.payload["cognito:groups"]?.toString()
        ),
    });
    isAdmin = !!groups?.includes("admin");
  } catch (error) {
    resumes = undefined;
  }

  return (
    <div className="p-4">
      <div className="rounded-md bg-white p-4">
        <h1 className="font-bold text-2xl">Resumes</h1>
        <div className="flex justify-center m-4 p-4">
          {!!resumes ? <Files fileList={resumes} canRemove={isAdmin} /> : null}
        </div>
      </div>
    </div>
  );
}