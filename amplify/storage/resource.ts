import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "resumes",
    access: (allow) => ({
        "resumes/*": [
            allow.groups(['employer']).to(['read']),
            allow.groups(['admin']).to(['read', 'write', 'delete']),
        ],
    })
})