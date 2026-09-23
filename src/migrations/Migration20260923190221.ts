import { Migration } from '@mikro-orm/migrations';

export class Migration20260923190221 extends Migration {

  override name = 'Migration20260923190221';

  override up(): void | Promise<void> {
    this.addSql(`create table "viaje" ("id" uuid not null, primary key ("id"));`);

    this.addSql(`alter table "reserva" drop constraint "reserva_ruta_id_foreign";`);

    this.addSql(`alter table "reserva" drop column "fecha_hora_fin", drop column "fecha_hora_inicio", drop column "ruta_id", drop column "tipo";`);
    this.addSql(`alter table "reserva" add "viaje_id" uuid not null;`);
    this.addSql(`alter table "reserva" add constraint "reserva_viaje_id_foreign" foreign key ("viaje_id") references "viaje" ("id");`);
    this.addSql(`alter table "reserva" alter column "created_at" drop not null;`);
    this.addSql(`alter table "reserva" alter column "destino" set not null;`);
    this.addSql(`alter table "reserva" alter column "origen" set not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "reserva" drop constraint "reserva_viaje_id_foreign";`);

    this.addSql(`drop table if exists "viaje" cascade;`);

    this.addSql(`alter table "reserva" drop column "viaje_id";`);
    this.addSql(`alter table "reserva" add "fecha_hora_fin" timestamptz(6) not null, add "fecha_hora_inicio" timestamptz(6) not null, add "ruta_id" uuid null, add "tipo" varchar(255) not null;`);
    this.addSql(`alter table "reserva" add constraint "reserva_ruta_id_foreign" foreign key ("ruta_id") references "ruta" ("id") on delete set null;`);
    this.addSql(`alter table "reserva" alter column "origen" drop not null;`);
    this.addSql(`alter table "reserva" alter column "destino" drop not null;`);
    this.addSql(`alter table "reserva" alter column "created_at" set not null;`);
  }

}
