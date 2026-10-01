import { Migration } from '@mikro-orm/migrations';

export class Migration20260923221323 extends Migration {

  override name = 'Migration20260923221323';

  override up(): void | Promise<void> {
    this.addSql(`alter table "viaje" add "chofer_id" uuid null;`);
    this.addSql(`alter table "viaje" add constraint "viaje_chofer_id_foreign" foreign key ("chofer_id") references "usuarios" ("id") on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "viaje" drop constraint "viaje_chofer_id_foreign";`);

    this.addSql(`alter table "viaje" drop column "chofer_id";`);
  }

}
