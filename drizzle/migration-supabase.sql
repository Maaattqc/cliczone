-- ClicZone — Migration initiale (15 tables)
-- Coller dans Supabase SQL Editor > New query > Run

-- =============================================
-- Tables donnees Quebec
-- =============================================

CREATE TABLE "entrepreneurs_rbq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"licence" varchar(20) NOT NULL,
	"statut" varchar(50) NOT NULL,
	"specialites" jsonb DEFAULT '[]'::jsonb,
	"region" varchar(100),
	"adresse" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "zones_inondables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"geom" text,
	"niveau" varchar(20),
	"source" text,
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "terrains_contamines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"geom" text,
	"adresse" text NOT NULL,
	"statut" varchar(50) NOT NULL,
	"details" jsonb,
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "permis_construction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adresse" text NOT NULL,
	"geom" text,
	"type" varchar(100),
	"date" timestamp,
	"cout_estime" numeric,
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "evaluations_foncieres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adresse" text NOT NULL,
	"geom" text,
	"valeur" numeric,
	"annee" integer,
	"type_batiment" varchar(100),
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "zonage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"geom" text,
	"code_zone" varchar(50),
	"usages_permis" jsonb DEFAULT '[]'::jsonb,
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "inspections_mapaq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"etablissement" text NOT NULL,
	"adresse" text,
	"date" timestamp,
	"infractions" jsonb DEFAULT '[]'::jsonb,
	"score" integer,
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "garderies_cpe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"adresse" text,
	"geom" text,
	"type" varchar(50),
	"places_total" integer,
	"places_dispo" integer,
	"code_postal" varchar(10),
	"ville" varchar(100),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "salaires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metier" text NOT NULL,
	"region" varchar(100),
	"salaire_median" numeric,
	"salaire_min" numeric,
	"salaire_max" numeric,
	"annee" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================
-- Tables business
-- =============================================

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(100),
	"plan" varchar(20) DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);

CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"tool" varchar(100) NOT NULL,
	"input" jsonb NOT NULL,
	"output" jsonb,
	"paid" boolean DEFAULT false NOT NULL,
	"amount" numeric,
	"pdf_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tool" varchar(100) NOT NULL,
	"stripe_sub_id" varchar(100),
	"status" varchar(30) NOT NULL,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tool" varchar(100) NOT NULL,
	"criteria" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"key_hash" varchar(64) NOT NULL,
	"name" varchar(100),
	"rate_limit" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);

CREATE TABLE "api_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_key_id" uuid NOT NULL,
	"endpoint" varchar(200) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);

-- =============================================
-- Foreign keys
-- =============================================

ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "api_usage" ADD CONSTRAINT "api_usage_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX "idx_entrepreneurs_licence" ON "entrepreneurs_rbq" USING btree ("licence");
CREATE INDEX "idx_entrepreneurs_nom" ON "entrepreneurs_rbq" USING btree ("nom");
CREATE INDEX "idx_entrepreneurs_region" ON "entrepreneurs_rbq" USING btree ("region");
CREATE INDEX "idx_zones_ville" ON "zones_inondables" USING btree ("ville");
CREATE INDEX "idx_terrains_ville" ON "terrains_contamines" USING btree ("ville");
CREATE INDEX "idx_terrains_adresse" ON "terrains_contamines" USING btree ("adresse");
CREATE INDEX "idx_permis_ville" ON "permis_construction" USING btree ("ville");
CREATE INDEX "idx_permis_date" ON "permis_construction" USING btree ("date");
CREATE INDEX "idx_eval_ville" ON "evaluations_foncieres" USING btree ("ville");
CREATE INDEX "idx_eval_adresse" ON "evaluations_foncieres" USING btree ("adresse");
CREATE INDEX "idx_zonage_ville" ON "zonage" USING btree ("ville");
CREATE INDEX "idx_mapaq_ville" ON "inspections_mapaq" USING btree ("ville");
CREATE INDEX "idx_mapaq_etablissement" ON "inspections_mapaq" USING btree ("etablissement");
CREATE INDEX "idx_garderies_ville" ON "garderies_cpe" USING btree ("ville");
CREATE INDEX "idx_garderies_code_postal" ON "garderies_cpe" USING btree ("code_postal");
CREATE INDEX "idx_salaires_metier" ON "salaires" USING btree ("metier");
CREATE INDEX "idx_salaires_region" ON "salaires" USING btree ("region");
CREATE INDEX "idx_users_clerk" ON "users" USING btree ("clerk_id");
CREATE INDEX "idx_reports_user" ON "reports" USING btree ("user_id");
CREATE INDEX "idx_reports_tool" ON "reports" USING btree ("tool");
CREATE INDEX "idx_subs_user" ON "subscriptions" USING btree ("user_id");
CREATE INDEX "idx_alerts_user" ON "alerts" USING btree ("user_id");
CREATE INDEX "idx_apikeys_hash" ON "api_keys" USING btree ("key_hash");
CREATE INDEX "idx_usage_key" ON "api_usage" USING btree ("api_key_id");
