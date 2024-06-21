import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "resumes",
    access: (allow) => ({
        "resumes/{entity_id}/*": [
            allow.entity("identity").to(['read', 'write', 'delete']),
            allow.groups(["admin"]).to(["read", "write", "delete"]),
            allow.groups(["employer"]).to(["read"]),
            allow.authenticated.to(["write"]),
        ],
    }),
})