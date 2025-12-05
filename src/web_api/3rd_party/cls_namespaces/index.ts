// TODO: cls-hooked it is going to be deprecated, needs to be moved
// probably wont need it since we are using knex
import cls from 'cls-hooked';
import { SEQUELIZE_NAMESPACE, REQUEST_NAMESPACE } from './constants.js';

const sequelizeNamespace = cls.createNamespace(SEQUELIZE_NAMESPACE);
const requestNamespace = cls.createNamespace(REQUEST_NAMESPACE);

export { sequelizeNamespace, requestNamespace };
