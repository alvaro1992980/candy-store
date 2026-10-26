CREATE TYPE "public"."category" AS ENUM('Dulces', 'Chicles', 'Galletas', 'Chocolates', 'Gelatinas');--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" "category" NOT NULL,
	"price" integer NOT NULL,
	"image_url" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
