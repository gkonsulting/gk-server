import { Migration } from '@mikro-orm/migrations';

export class Migration20201029093929 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "weight" drop constraint if exists "weight_weight_check";');
    this.addSql('alter table "weight" alter column "weight" type int4 using ("weight"::int4);');
  }

}
