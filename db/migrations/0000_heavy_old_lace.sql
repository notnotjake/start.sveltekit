CREATE TABLE `auth_attempt` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`session_id` text NOT NULL,
	`type` text NOT NULL,
	`credential` text,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `user_session`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`name` text,
	`credential` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`last_auth_at` integer,
	`expires_at` integer NOT NULL,
	`invalidated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`identifier` text NOT NULL,
	`last_seen_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_identifier_unique` ON `user` (`identifier`);--> statement-breakpoint
CREATE UNIQUE INDEX `emailUniqueIndex` ON `user` (lower("identifier"));