import { Migration } from '@mikro-orm/migrations';

export class Migration20260923193859 extends Migration {

  override name = 'Migration20260923193859';

  override up(): void | Promise<void> {
    this.addSql(`alter table "viaje" add "tipo" varchar(255) not null default 'COMPARTIDO', add "fecha_hora_inicio" timestamptz not null, add "fecha_hora_fin" timestamptz not null, add "capacidad_pasajeros" int not null, add "capacidad_valijas" int not null, add "pasajeros_ocupados" int not null default 0, add "valijas_ocupadas" int not null default 0, add "precio_base" real null, add "ruta_id" uuid null, add "created_at" timestamptz null default now();`);
    this.addSql(`alter table "viaje" add constraint "viaje_ruta_id_foreign" foreign key ("ruta_id") references "ruta" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "viaje" drop constraint "viaje_ruta_id_foreign";`);

    this.addSql(`alter table "viaje" drop column "tipo", drop column "fecha_hora_inicio", drop column "fecha_hora_fin", drop column "capacidad_pasajeros", drop column "capacidad_valijas", drop column "pasajeros_ocupados", drop column "valijas_ocupadas", drop column "precio_base", drop column "ruta_id", drop column "created_at";`);
  }

}
