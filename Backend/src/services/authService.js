import { signInUser } from '../repositories/usersRepository.js';

export function signIn({ userId, name }) {
  return signInUser(userId, name.trim());
}
