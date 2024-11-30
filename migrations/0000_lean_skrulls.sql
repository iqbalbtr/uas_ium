CREATE TYPE "public"."order_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'installment');--> statement-breakpoint
CREATE TYPE "public"."receipt_status" AS ENUM('accepted', 'rejected', 'pending');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('full', 'partial');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apotek" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "apotek_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(55) NOT NULL,
	"email" varchar(55),
	"phone" varchar(30),
	"alamat" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"token" text,
	"last_logged" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medicine_reminder" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medicine_reminder_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"medicine_id" integer,
	"min_stock" integer,
	"max_stock" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medicines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medicines_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"dosage" varchar(100),
	"active_ingredients" varchar(255) NOT NULL,
	"expired" integer NOT NULL,
	"indication" text NOT NULL,
	"price" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"side_effect" text,
	"medicine_code" varchar(255) NOT NULL,
	"medicine_type" varchar(100) NOT NULL,
	"medicine_category" varchar(100) NOT NULL,
	CONSTRAINT "medicines_medicine_code_unique" UNIQUE("medicine_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_medicine" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_medicine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"medicine_id" integer,
	"quantity" integer NOT NULL,
	"sub_total" integer NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_code" varchar(100) NOT NULL,
	"order_date" timestamp DEFAULT now(),
	"supplier" varchar(100) NOT NULL,
	"order_status" "order_status" DEFAULT 'pending',
	"total" integer NOT NULL,
	"tax" integer NOT NULL,
	"discount" integer DEFAULT 0,
	CONSTRAINT "orders_order_code_unique" UNIQUE("order_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription_medicine" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prescription_medicine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"prescription_id" integer NOT NULL,
	"medicine_id" integer,
	"quantity" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prescriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code_prescription" varchar(100) NOT NULL,
	"prescription_date" timestamp NOT NULL,
	"name" varchar(55) NOT NULL,
	"description" text,
	"doctor_name" varchar(50),
	"price" integer NOT NULL,
	"discount" integer DEFAULT 0,
	"fee" integer DEFAULT 0,
	"tax" integer DEFAULT 0,
	"instructions" text,
	CONSTRAINT "prescriptions_code_prescription_unique" UNIQUE("code_prescription")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "receipts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "receipts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"receipt_code" varchar(100) NOT NULL,
	"payment_method" "payment_method" DEFAULT 'cash',
	"payment_expired" timestamp NOT NULL,
	"receipt_status" "receipt_status" DEFAULT 'pending',
	"request_status" "request_status" DEFAULT 'full',
	"order_id" integer NOT NULL,
	CONSTRAINT "receipts_receipt_code_unique" UNIQUE("receipt_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(55) NOT NULL,
	"access_rights" json,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transaction_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"quantity" integer NOT NULL,
	"sub_total" integer NOT NULL,
	"medicine_id" integer,
	"transaction_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"transaction_date" timestamp DEFAULT now(),
	"code_transaction" varchar(50) NOT NULL,
	"buyer" varchar(100) DEFAULT 'guest' NOT NULL,
	"user_id" integer,
	"total" integer NOT NULL,
	"payment_method" "payment_method" DEFAULT 'cash',
	"payment_expired" timestamp,
	"transaction_status" "transaction_status" DEFAULT 'completed',
	"tax" integer DEFAULT 0,
	"discount" integer DEFAULT 0,
	CONSTRAINT "transactions_code_transaction_unique" UNIQUE("code_transaction")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"username" varchar(55) NOT NULL,
	"phone" varchar(30),
	"email" varchar(255),
	"password" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'available',
	"role_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medicine_reminder" ADD CONSTRAINT "medicine_reminder_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_medicine" ADD CONSTRAINT "order_medicine_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_medicine" ADD CONSTRAINT "order_medicine_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prescription_medicine" ADD CONSTRAINT "prescription_medicine_prescription_id_prescriptions_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prescription_medicine" ADD CONSTRAINT "prescription_medicine_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "receipts" ADD CONSTRAINT "receipts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_item" ADD CONSTRAINT "transaction_item_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_item" ADD CONSTRAINT "transaction_item_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
