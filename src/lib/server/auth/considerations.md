proposed supported auth methods
- email and magic link
- email and password
- email and password with 2FA TOTP
- email and password with 2FA SMS
- OAUth through Google
- OAuth through Apple
- OAUth through GitHub
- passkey
- login relay: login with another device

How to handle new accounts:
- when using email, if you enter an email without a user created yet, we send a magic link email to verify the email address and create an account. temporarily this is stored where?

OAuth and Email accounts collision:
- if a user creates an account from oauth that collides with an account that already uses that email, then we need to confirm a merge by sending a confirmation email
- this ensures that the oauth account really is associated with that email
