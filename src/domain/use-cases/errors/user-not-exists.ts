export class UserNotExists extends Error {
  constructor(identifier: string) {
    super(`User "${identifier}" not exists.`);
  }
}
