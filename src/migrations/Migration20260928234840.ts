import { Migration } from '@mikro-orm/migrations';

export class Migration20260928234840 extends Migration {

  override name = 'Migration20260928234840';

  override up(): void | Promise<void> {
    this.addSql(`alter table "usuarios" add "es_invitado" boolean not null default false;`);
    this.addSql(`alter table "usuarios" alter column "password" drop not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "usuarios" drop column "es_invitado";`);
    this.addSql(`alter table "usuarios" alter column "password" set not null;`);
  }

}
