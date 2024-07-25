"use server";

import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";

export async function loadDescription(url: string) {
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