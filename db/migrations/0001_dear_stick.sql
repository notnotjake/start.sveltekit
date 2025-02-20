PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_auth_attempt` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`credential` text,
	`session_id` text,
	`ip_address` text,
	`user_agent` text,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `user_session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_auth_attempt`("id", "user_id", "type", "credential", "session_id", "ip_address", "user_agent", "expires_at") SELECT "id", "user_id", "type", "credential", "session_id", "ip_address", "user_agent", "expires_at" FROM `auth_attempt`;--> statement-breakpoint
DROP TABLE `auth_attempt`;--> statement-breakpoint
ALTER TABLE `__new_auth_attempt` RENAME TO `auth_attempt`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`credential` text,
	`created_at` integer NOT NULL,
	`updated_at` integer DEFAULT '"2025-02-20T04:59:15.905Z"' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_key`("id", "user_id", "type", "credential", "created_at", "updated_at") SELECT "id", "user_id", "type", "credential", "created_at", "updated_at" FROM `user_key`;--> statement-breakpoint
DROP TABLE `user_key`;--> statement-breakpoint
ALTER TABLE `__new_user_key` RENAME TO `user_key`;