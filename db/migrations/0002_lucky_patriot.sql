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
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customer` (
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
INSERT INTO `__new_customer`("id", "name", "short_id", "is_active", "primary_contact_id", "address_line1", "address_line2", "city", "state", "zip_code", "created_at", "updated_at") SELECT "id", "business_name", "short_id", "is_active", NULL, "address_line1", "address_line2", "city", "state", "zip_code", "created_at", "updated_at" FROM `customer`;--> statement-breakpoint
DROP TABLE `customer`;--> statement-breakpoint
ALTER TABLE `__new_customer` RENAME TO `customer`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `customer_short_id_unique` ON `customer` (`short_id`);
