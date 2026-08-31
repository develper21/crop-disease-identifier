import { pgTable, serial, text, timestamp, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    fullName: varchar('full_name', { length: 255 }),
    preferredLanguage: varchar('preferred_language', { length: 10 }).default('hi'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const scans = pgTable('scans', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    imageUrl: text('image_url').notNull(),
    prediction: jsonb('prediction').notNull(),
    confidence: integer('confidence').notNull(),
    notes: text('notes'),
    isLowConf: boolean('is_low_conf').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    description: text('description'),
    price: integer('price'), // in cents/paise
    imageUrl: text('image_url'),
    targetDiseases: jsonb('target_diseases'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const diseaseSolutions = pgTable('disease_solutions', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    commonNames: jsonb('common_names'),
    solutions: jsonb('solutions'),
    createdAt: timestamp('created_at').defaultNow(),
});
