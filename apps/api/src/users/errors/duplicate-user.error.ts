export class DuplicateUserError extends Error {
  constructor(message = 'User with this email already exists') {
    super(message);
  }
}
