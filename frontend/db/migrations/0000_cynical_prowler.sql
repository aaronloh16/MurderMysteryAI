CREATE TABLE "contexts" (
	"id" serial PRIMARY KEY NOT NULL,
	"background" text NOT NULL,
	"personality" text NOT NULL,
	"alibi" text NOT NULL,
	"suspect_id" text NOT NULL,
	CONSTRAINT "contexts_suspect_id_unique" UNIQUE("suspect_id")
);
--> statement-breakpoint
CREATE TABLE "secrets" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"suspect_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_context" (
	"id" text PRIMARY KEY DEFAULT 'main' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"victim" text NOT NULL,
	"murder_weapon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suspects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"description" text NOT NULL,
	"is_guilty" boolean NOT NULL,
	"gender" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contexts" ADD CONSTRAINT "contexts_suspect_id_suspects_id_fk" FOREIGN KEY ("suspect_id") REFERENCES "public"."suspects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secrets" ADD CONSTRAINT "secrets_suspect_id_suspects_id_fk" FOREIGN KEY ("suspect_id") REFERENCES "public"."suspects"("id") ON DELETE no action ON UPDATE no action;