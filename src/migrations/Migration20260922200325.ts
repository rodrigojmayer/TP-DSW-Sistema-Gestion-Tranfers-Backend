import { Migration } from '@mikro-orm/migrations';

export class Migration20260922200325 extends Migration {

  override name = 'Migration20260922200325';

  override up(): void | Promise<void> {
    this.addSql(`alter table "ruta" drop constraint "ruta_destino_id_foreign";`);
    this.addSql(`alter table "ruta" drop constraint "ruta_origen_id_foreign";`);

    this.addSql(`alter table "punto_ruta" drop constraint "punto_ruta_punto_id_fkey";`);
    this.addSql(`alter table "punto_ruta" drop constraint "punto_ruta_ruta_id_fkey";`);

    this.addSql(`alter table "reserva" drop constraint "reserva_ruta_id_foreign";`);

    this.addSql(`alter table "punto" alter column "latitud" type varchar(255) using ("latitud"::varchar(255));`);
    this.addSql(`alter table "punto" alter column "latitud" set not null;`);
    this.addSql(`alter table "punto" alter column "longitud" type varchar(255) using ("longitud"::varchar(255));`);
    this.addSql(`alter table "punto" alter column "longitud" set not null;`);
    this.addSql(`alter table "punto" alter column "direccion" type varchar(255) using ("direccion"::varchar(255));`);
    this.addSql(`alter table "punto" alter column "direccion" set not null;`);

    this.addSql(`alter table "ruta" drop column "created_at";`);
    this.addSql(`alter table "ruta" add constraint "ruta_destino_id_foreign" foreign key ("destino_id") references "punto" ("id") on delete set null;`);
    this.addSql(`alter table "ruta" add constraint "ruta_origen_id_foreign" foreign key ("origen_id") references "punto" ("id") on delete set null;`);

    this.addSql(`alter table "punto_ruta" drop column "created_at";`);
    this.addSql(`alter table "punto_ruta" alter column "id" drop default;`);
    this.addSql(`alter table "punto_ruta" add constraint "punto_ruta_ruta_id_foreign" foreign key ("ruta_id") references "ruta" ("id") on delete cascade;`);
    this.addSql(`alter table "punto_ruta" add constraint "punto_ruta_punto_id_foreign" foreign key ("punto_id") references "punto" ("id") on delete cascade;`);
    this.addSql(`alter table "punto_ruta" disable row level security;`);

    this.addSql(`alter table "usuarios" alter column "usuario" set not null;`);
    this.addSql(`alter table "usuarios" alter column "nombre" type varchar(255) using ("nombre"::varchar(255));`);
    this.addSql(`alter table "usuarios" alter column "nombre" set not null;`);
    this.addSql(`alter table "usuarios" alter column "apellido" type varchar(255) using ("apellido"::varchar(255));`);
    this.addSql(`alter table "usuarios" alter column "apellido" set not null;`);
    this.addSql(`alter table "usuarios" alter column "dni" type varchar(255) using ("dni"::varchar(255));`);
    this.addSql(`alter table "usuarios" alter column "telefono" type varchar(255) using ("telefono"::varchar(255));`);
    this.addSql(`alter table "usuarios" alter column "nro_licencia" type varchar(255) using ("nro_licencia"::varchar(255));`);
    this.addSql(`alter table "usuarios" alter column "vencimiento_licencia" type varchar(255) using ("vencimiento_licencia"::varchar(255));`);
    this.addSql(`alter table "usuarios" drop constraint "usuarios_usuario_key";`);
    this.addSql(`alter table "usuarios" add constraint "usuarios_usuario_unique" unique ("usuario");`);

    this.addSql(`alter table "reserva" drop column "fecha_viaje", drop column "estado";`);
    this.addSql(`alter table "reserva" add "tipo" varchar(255) not null, add "fecha_hora_inicio" timestamptz not null, add "fecha_hora_fin" timestamptz not null, add "cant_pasajeros" int not null, add "cant_valijas" int not null, add "habilitado" boolean not null default true, add "precio" real not null, add "pago_abonado" boolean not null default false, add "origen" varchar(255) null, add "destino" varchar(255) null;`);
    this.addSql(`alter table "reserva" alter column "ruta_id" drop not null;`);
    this.addSql(`alter table "reserva" add constraint "reserva_ruta_id_foreign" foreign key ("ruta_id") references "ruta" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "punto_ruta" drop constraint "punto_ruta_ruta_id_foreign";`);
    this.addSql(`alter table "punto_ruta" drop constraint "punto_ruta_punto_id_foreign";`);

    this.addSql(`alter table "reserva" drop constraint "reserva_ruta_id_foreign";`);

    this.addSql(`alter table "ruta" drop constraint "ruta_origen_id_foreign";`);
    this.addSql(`alter table "ruta" drop constraint "ruta_destino_id_foreign";`);

    this.addSql(`alter table "punto" alter column "latitud" type varchar using ("latitud"::varchar);`);
    this.addSql(`alter table "punto" alter column "latitud" drop not null;`);
    this.addSql(`alter table "punto" alter column "longitud" type varchar using ("longitud"::varchar);`);
    this.addSql(`alter table "punto" alter column "longitud" drop not null;`);
    this.addSql(`alter table "punto" alter column "direccion" type varchar using ("direccion"::varchar);`);
    this.addSql(`alter table "punto" alter column "direccion" drop not null;`);

    this.addSql(`alter table "punto_ruta" add "created_at" timestamptz(6) not null default now();`);
    this.addSql(`alter table "punto_ruta" alter column "id" set default gen_random_uuid();`);
    this.addSql(`alter table "punto_ruta" add constraint "punto_ruta_punto_id_fkey" foreign key ("punto_id") references "punto" ("id") on update no action on delete no action;`);
    this.addSql(`alter table "punto_ruta" add constraint "punto_ruta_ruta_id_fkey" foreign key ("ruta_id") references "ruta" ("id") on update no action on delete no action;`);
    this.addSql(`alter table "punto_ruta" enable row level security;`);

    this.addSql(`alter table "reserva" drop column "tipo", drop column "fecha_hora_inicio", drop column "fecha_hora_fin", drop column "cant_pasajeros", drop column "cant_valijas", drop column "habilitado", drop column "precio", drop column "pago_abonado", drop column "origen", drop column "destino";`);
    this.addSql(`alter table "reserva" add "fecha_viaje" date not null, add "estado" varchar(255) not null default 'PENDIENTE';`);
    this.addSql(`alter table "reserva" alter column "ruta_id" set not null;`);
    this.addSql(`alter table "reserva" add constraint "reserva_ruta_id_foreign" foreign key ("ruta_id") references "ruta" ("id") on update no action on delete no action;`);

    this.addSql(`alter table "ruta" add "created_at" timestamptz(6) not null default now();`);
    this.addSql(`alter table "ruta" add constraint "ruta_origen_id_foreign" foreign key ("origen_id") references "punto" ("id") on update no action on delete no action;`);
    this.addSql(`alter table "ruta" add constraint "ruta_destino_id_foreign" foreign key ("destino_id") references "punto" ("id") on update no action on delete no action;`);

    this.addSql(`alter table "usuarios" alter column "usuario" drop not null;`);
    this.addSql(`alter table "usuarios" alter column "nombre" type varchar using ("nombre"::varchar);`);
    this.addSql(`alter table "usuarios" alter column "nombre" drop not null;`);
    this.addSql(`alter table "usuarios" alter column "apellido" type varchar using ("apellido"::varchar);`);
    this.addSql(`alter table "usuarios" alter column "apellido" drop not null;`);
    this.addSql(`alter table "usuarios" alter column "dni" type varchar using ("dni"::varchar);`);
    this.addSql(`alter table "usuarios" alter column "telefono" type varchar using ("telefono"::varchar);`);
    this.addSql(`alter table "usuarios" alter column "nro_licencia" type varchar using ("nro_licencia"::varchar);`);
    this.addSql(`alter table "usuarios" alter column "vencimiento_licencia" type date using ("vencimiento_licencia"::date);`);
    this.addSql(`alter table "usuarios" drop constraint "usuarios_usuario_unique";`);
    this.addSql(`alter table "usuarios" add constraint "usuarios_usuario_key" unique ("usuario");`);
  }

}
