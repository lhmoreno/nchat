export class UserNameAlreadyExistsError extends Error {
  constructor(username: string) {
    super(`Username "${username}" already exists.`);
  }
}
