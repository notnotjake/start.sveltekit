### Architecture:

Core API: these are the utility functions and functions that interact with the database and handle different actions

Auth API: functions frontend can call to do things (these use core api to get it done). this will be api you call from the Auth object as well as using svelte RPC functions
- start login
for each resource users, sessions, auth attempts, and keys we need basically CRUD functions for each.

on /login:
if they are logged in, then redirect
if they have a magic link, we evaluate and redirect or display codes
if they were signed out because session was invalid, then we prefill identifier and display special message
if they were sent to login for step-up auth, then lock identifier to user and display special message
first we try a form with identifier and server returns options: might be email link, might be email code, might be passkey, might be password - or some combination of these.
next we have a form for each:
- identifier with password
- identifier with email/phone 6-digit code
for passkeys we have a call for options, then a call to verify
magic link tokens are handled by the page load function

when using email magic link or when using email/phone 6-digit codes we need to store a temporary hash of a token in auth_attempts so we can come back to it later
i believe we also have to do this for passkeys

Users: 

Keys:
	passkeys:
		get passkeys
		add passkey
		edit passkey name
		remove passkey
	passwords:
		get password (metadata)
		verify password
		add password
		change password
		remove password

auth attempt:
	short codes:
		get short code
		verify short code

Database Adapter: the core api would use these database adapter(s) in order to talk to the database in a way that we are not stuck to just Drizzle (able to support other ORM's)

Components: Encapsulate functionality into components that can be brought into your svelte project and composed/customized
- Passkey Button
- Passkey Auto
- Login with Email
- Logout Button
- etc.

would need to have user create an auth.ts file in lib/server which would also have all their options but that way we can mount that code into the server directory so that it can be run server side safely.
the more we use RPC, the less this is a concern.
