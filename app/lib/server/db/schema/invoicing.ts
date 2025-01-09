import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'

const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
}

/**
 * Represents a business customer
 * Each customer can have multiple contacts but only one primary contact.
 * - Maintains active status for archiving purposes
 * - Uses shortId for human-readable reference
 *
 * Key relationships:
 * - Has one primary contact (primaryContactId -> contact.id)
 * - Has many contacts (one-to-many with contact table)
 */
export const customerTable = sqliteTable('customer', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	shortId: text('short_id', { length: 2 }).notNull().unique(),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	primaryContactId: text('primary_contact_id').references((): AnySQLiteColumn => contactTable.id, {
		onDelete: 'set null'
	}),
	// Address
	addressLine1: text('address_line1').notNull(),
	addressLine2: text('address_line2'), // Optional
	city: text('city').notNull(),
	state: text('state').notNull(),
	zipCode: text('zip_code').notNull(),
	// Created_at and updated_at
	...timestamps
})
export type Customer = InferSelectModel<typeof customerTable>
export type NewCustomer = InferInsertModel<typeof customerTable>

/**
 * Represents an individual contact person associated with a customer
 * Each contact belongs to exactly one customer, but a customer can have multiple contacts.
 * The same person with multiple customers requires separate contact entries.
 *
 * Key relationships:
 * - Belongs to one customer (customerId -> customer.id)
 * - May be referenced as primary contact by customer table
 *
 * Notable features:
 * - Optional label field for role (ie office, billing, updates)
 * - Cascading delete: contacts are removed when their customer is deleted
 * - Requires email but phone is optional
 */
export const contactTable = sqliteTable('contact', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	customerId: text('customer_id')
		.notNull()
		.references((): AnySQLiteColumn => customerTable.id, {
			onDelete: 'cascade' // If customer is deleted, delete all their contacts
		}),
	name: text('name').notNull(),
	label: text('label'),
	email: text('email').notNull(),
	phone: text('phone', { length: 11 }),
	// Created_at and updated_at
	...timestamps
})
export type Contact = InferSelectModel<typeof contactTable>
export type NewContact = InferInsertModel<typeof contactTable>

export const projectTable = sqliteTable('project', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	customerId: text('customer_id')
		.notNull()
		.references(() => customerTable.id),
	name: text('name').notNull(),
	status: text('status').notNull(), // active, completed, cancelled
	// Created_at and updated_at
	...timestamps
})
export type Project = InferSelectModel<typeof projectTable>
export type NewProject = InferInsertModel<typeof projectTable>
