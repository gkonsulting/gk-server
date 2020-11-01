import { Migration } from '@mikro-orm/migrations';

export class Migration20201029093812 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "weight" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "weight" jsonb not null);');
  }

}
