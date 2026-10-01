import { Migration } from '@mikro-orm/migrations';

export class Migration20260927170014 extends Migration {

  override name = 'Migration20260927170014';

  override up(): void | Promise<void> {
    this.addSql(`alter table "usuarios" add "habilitado" boolean not null default true;`);
    this.addSql(`alter table "usuarios" alter column "rol" type text using ("rol"::text);`);
    this.addSql(`alter table "usuarios" add constraint "usuarios_rol_check" check ("rol" in ('ADMIN', 'OPERADOR', 'CLIENTE', 'CHOFER'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "usuarios" drop constraint "usuarios_rol_check";`);
    this.addSql(`alter table "usuarios" drop column "habilitado";`);
    this.addSql(`alter table "usuarios" alter column "rol" type varchar(255) using ("rol"::varchar(255));`);
  }

}
