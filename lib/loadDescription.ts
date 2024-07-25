"use server";

import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "@/amplify_outputs.json"

export async function loadDescription(url: string) {
    Amplify.configure(outputs);

    const client = generateClient<Schema>();
    const { data: dataPosition } = await client.models.Positions.list({
        filter: {
          url: {
            eq: url,
          },
        },
        selectionSet: ["description"],
      });
    const description = dataPosition[0].description ?? "";

    return description;
}