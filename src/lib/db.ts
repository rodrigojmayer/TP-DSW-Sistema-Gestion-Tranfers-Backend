import { MikroORM, EntityManager } from '@mikro-orm/postgresql';

let orm: MikroORM;

export async function initORM() {
  if (!orm) {
    const configModule = await import('../../mikro-orm.config.js');
    orm = await MikroORM.init(configModule.default || configModule);
  }
  return orm;
}

export function getEM(): EntityManager {
  if (!orm) {
    throw new Error('ORM no inicializado.');
  }
  return orm.em.fork();
}