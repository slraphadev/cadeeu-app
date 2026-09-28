CREATE TABLE `compromissos` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`periodo_id` text NOT NULL,
	`titulo` text NOT NULL,
	`cor` text,
	`observacao` text,
	FOREIGN KEY (`periodo_id`) REFERENCES `periodos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `compromissos_periodo_idx` ON `compromissos` (`periodo_id`);--> statement-breakpoint
CREATE TABLE `horarios` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`compromisso_id` text NOT NULL,
	`local_id` text NOT NULL,
	`sala_id` text,
	`tipo` text DEFAULT 'semanal' NOT NULL,
	`dia_semana` integer,
	`inicio_min` integer NOT NULL,
	`fim_min` integer NOT NULL,
	`intervalo_semanas` integer DEFAULT 1 NOT NULL,
	`data_unica` text,
	FOREIGN KEY (`compromisso_id`) REFERENCES `compromissos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`local_id`) REFERENCES `locais`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sala_id`) REFERENCES `salas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `horarios_compromisso_idx` ON `horarios` (`compromisso_id`);--> statement-breakpoint
CREATE INDEX `horarios_local_idx` ON `horarios` (`local_id`);--> statement-breakpoint
CREATE INDEX `horarios_sala_idx` ON `horarios` (`sala_id`);--> statement-breakpoint
CREATE TABLE `locais` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`nome` text NOT NULL,
	`apelido` text,
	`observacao` text
);
--> statement-breakpoint
CREATE TABLE `periodos` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`nome` text NOT NULL,
	`data_inicio` text NOT NULL,
	`data_fim` text NOT NULL,
	`ativo` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `salas` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`local_id` text NOT NULL,
	`nome` text NOT NULL,
	`bloco` text,
	`andar` text,
	`observacao` text,
	FOREIGN KEY (`local_id`) REFERENCES `locais`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `salas_local_idx` ON `salas` (`local_id`);