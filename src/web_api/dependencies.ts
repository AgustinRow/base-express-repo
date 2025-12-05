import { ContainerModule, decorate, injectable } from 'inversify';
import { IDBBuilder, KnexBuilder } from './3rd_party/db_provider/knex.js';
import DBConfigProvider, { IDBConfigProvider } from './3rd_party/db_provider/config.js';

decorate(injectable(), DBConfigProvider);
decorate(injectable(), KnexBuilder);

const dependencyContainer = new ContainerModule(bind => {
  bind<IDBConfigProvider>('IDBConfigProvider').to(DBConfigProvider).inSingletonScope();
  bind<IDBBuilder>('IDBBuilder').to(KnexBuilder).inSingletonScope();
});

export default dependencyContainer;
