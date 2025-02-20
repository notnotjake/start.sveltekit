ALTER TABLE `auth_attempt` RENAME COLUMN "user_id" TO "identifier";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`credential` text,
	`created_at` integer NOT NULL,
	`updated_at` integer DEFAULT '"2025-02-20T05:03:30.431Z"' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_key`("id", "user_id", "type", "credential", "created_at", "updated_at") SELECT "id", "user_id", "type", "credential", "created_at", "updated_at" FROM `user_key`;--> statement-breakpoint
DROP TABLE `user_key`;--> statement-breakpoint
ALTER TABLE `__new_user_key` RENAME TO `user_key`;--> statement-breakpoint
PRAGMA foreign_keys=ON;