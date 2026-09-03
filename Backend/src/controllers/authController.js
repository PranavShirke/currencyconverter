import { signIn } from '../services/authService.js';

export function signInController(req, res) {
  const user = signIn({ userId: req.userId, name: req.body.name });
  res.json(user);
}

export function getMe(req, res) {
  res.json(req.user);
}
