import { defineAuth } from '@aws-amplify/backend';
import { listGroupsForUser } from '../functions/list-groups-for-user/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['admin', 'employer'],
  access: (allow) => [
    allow.resource(listGroupsForUser).to(["listGroupsForUser"])
  ]
});
