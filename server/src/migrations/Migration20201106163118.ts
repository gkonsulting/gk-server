import { Migration } from '@mikro-orm/migrations';

export class Migration20201106163118 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "movie" rename column "name" to "title";');
  }

}
