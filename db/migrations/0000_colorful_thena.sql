CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`secure_key` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`invalidated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`identifier` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`label` text,
	`email` text NOT NULL,
	`phone` text(11),
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`short_id` text(2) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`primary_contact_id` text,
	`address_line1` text NOT NULL,
	`address_line2` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip_code` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`primary_contact_id`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_short_id_unique` ON `customer` (`short_id`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action
);
