// @flow

import api from '@/api/brightId';
import { connection_levels } from './constants';

export const connectFakeUsers = async (
  fakeUser1: FakeUser,
  fakeUser2: FakeUser,
) => {
  let timestamp = Date.now();

  let level = connection_levels.JUST_MET;
  let flagReason;

  // Connect user1 -> user2
  const user1Promise = api.addConnection(
    fakeUser1.id,
    fakeUser2.id,
    level,
    flagReason,
    timestamp,
    fakeUser1,
  );

  // Connect user2 -> user1
  const user2Promise = api.addConnection(
    fakeUser2.id,
    fakeUser1.id,
    level,
    flagReason,
    timestamp,
    fakeUser2,
  );

  await Promise.all([user1Promise, user2Promise]);
};
