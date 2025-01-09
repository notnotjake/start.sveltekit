CREATE TABLE `customer` (
	`id` text PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`address_line1` text NOT NULL,
	`address_line2` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip_code` text NOT NULL,
	`phone_number` text NOT NULL,
	`email_address` text NOT NULL,
	`contact_name` text NOT NULL,
	`short_id` text(2) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_short_id_unique` ON `customer` (`short_id`);