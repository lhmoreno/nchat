import { faker } from '@faker-js/faker';

import { User, UserProps } from '@/domain/entities/user';

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      ...override,
    },
    id,
  );

  return user;
}
