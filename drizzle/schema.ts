import { pgTable, foreignKey, pgEnum, text, timestamp, serial, varchar, numeric, integer, unique, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const userRole = pgEnum("user_role", ['admin', 'user'])
export const orderStatus = pgEnum("order_status", ['accepted', 'delivered', 'shipped', 'pending'])
export const paymentStatus = pgEnum("payment_status", ['cash on delivery', 'fully paid', 'partially paid'])


export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
});

export const item = pgTable("item", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 128 }).notNull(),
	barcode: varchar("barcode", { length: 64 }).notNull(),
	description: text("description"),
	sellingPrice: numeric("selling_price", { precision: 10, scale:  2 }).default('0').notNull(),
	purchasePrice: numeric("purchase_price", { precision: 10, scale:  2 }).default('0').notNull(),
	taxRate: numeric("tax_rate", { precision: 3, scale:  1 }).default('0').notNull(),
	width: numeric("width", { precision: 10, scale:  2 }).default('0').notNull(),
	height: numeric("height", { precision: 10, scale:  2 }).default('0').notNull(),
	depth: numeric("depth", { precision: 10, scale:  2 }).default('0').notNull(),
	dimensionsUnit: varchar("dimensions_unit", { length: 8 }).notNull(),
	weight: numeric("weight", { precision: 10, scale:  2 }).default('0').notNull(),
	sku: varchar("sku", { length: 128 }).notNull(),
	quantity: integer("quantity").notNull(),
	unit: varchar("unit", { length: 8 }).notNull(),
	reorderPoint: integer("reorder_point").notNull(),
	supplier: varchar("supplier", { length: 64 }).notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	categoryId: integer("category_id").notNull().references(() => category.id),
	brandId: integer("brand_id").notNull().references(() => brands.id),
	weightUnit: varchar("weight_unit", { length: 8 }).notNull(),
	warehouseId: integer("warehouse_id").notNull().references(() => warehouse.id),
});

export const category = pgTable("category", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 32 }).notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		categoryNameUnique: unique("category_name_unique").on(table.name),
	}
});

export const unit = pgTable("unit", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 24 }).notNull(),
	abbreviation: varchar("abbreviation", { length: 8 }).notNull(),
},
(table) => {
	return {
		unitNameUnique: unique("unit_name_unique").on(table.name),
		unitAbbreviationUnique: unique("unit_abbreviation_unique").on(table.abbreviation),
	}
});

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	surname: text("surname"),
	username: text("username"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	emailVerificationToken: text("emailVerificationToken"),
	passwordHash: text("passwordHash"),
	resetPasswordToken: text("resetPasswordToken"),
	resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpiry", { mode: 'string' }),
	image: text("image"),
	user: userRole("user"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userUsernameUnique: unique("user_username_unique").on(table.username),
		userEmailUnique: unique("user_email_unique").on(table.email),
		userEmailVerificationTokenUnique: unique("user_emailVerificationToken_unique").on(table.emailVerificationToken),
		userResetPasswordTokenUnique: unique("user_resetPasswordToken_unique").on(table.resetPasswordToken),
	}
});

export const warehouse = pgTable("warehouse", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 32 }).notNull(),
	type: varchar("type", { length: 24 }).notNull(),
	description: text("description"),
	location: varchar("location", { length: 64 }).notNull(),
});

export const brands = pgTable("brands", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	category: varchar("category", { length: 100 }).notNull(),
	categoryId: integer("category_id").notNull().references(() => category.id),
});

export const customer = pgTable("customer", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
	address: text("address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	password: varchar("password", { length: 256 }).notNull(),
	state: varchar("state", { length: 100 }).notNull(),
},
(table) => {
	return {
		customerEmailUnique: unique("customer_email_unique").on(table.email),
		customerPhoneNumberUnique: unique("customer_phone_number_unique").on(table.phoneNumber),
	}
});

export const orderItems = pgTable("order_items", {
	id: serial("id").primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	itemId: integer("item_id").notNull(),
	quantity: integer("quantity").notNull(),
	price: numeric("price", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
	id: serial("id").primaryKey().notNull(),
	customerId: integer("customer_id").notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).default('0').notNull(),
	orderStatus: varchar("order_status", { length: 32 }).default('pending'::character varying).notNull(),
	shippingAddress: text("shipping_address").notNull(),
	paymentStatus: varchar("payment_status", { length: 32 }).default('cash on delivery'::character varying).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const deliveryPartners = pgTable("delivery_partners", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 15 }),
	status: varchar("status", { length: 32 }).default('active'::character varying),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const orderAssignments = pgTable("order_assignments", {
	id: serial("id").primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	deliveryPartnerId: integer("delivery_partner_id").notNull(),
	status: varchar("status", { length: 32 }).default('pending'::character varying),
	assignedAt: timestamp("assigned_at", { mode: 'string' }).defaultNow().notNull(),
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"})
	}
});

export const account = pgTable("account", {
	userId: text("userId").notNull(),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
	}
});