import { isBoolean, isEmpty, isNumber } from 'lodash-es';
import logger from '../utils/logger.js';
import * as constants_common from './constants_common.js';
import * as constants_db from './constants_db.js';
import * as constant_urls from './constant_api.js';

const OPTIONAL_CONSTANTS: string[] = ['EMULATOR_BUCKET_HOST', ...(constants_common.IS_LOCAL ? ['PORT'] : [])];
const undefinedConstants: string[] = [];

function validateConstantGroup(groupName: string, constants: any): void {
  logger.info(`  ${groupName} constants group started`);
  for (const [constant, value] of Object.entries(constants)) {
    if (OPTIONAL_CONSTANTS?.includes(constant)) continue;

    if (isEmpty(value) && !isNumber(value) && !isBoolean(value)) {
      logger.info(`      - ${constant} is undefined`);
      undefinedConstants.push(constant);
    } else {
      logger.info(`    - ${constant} ok`);
    }
  }
}

logger.info('Validating constants...');

logger.info(`Optional constants: ${OPTIONAL_CONSTANTS.join(', ')}`);

validateConstantGroup('COMMON', constants_common);
validateConstantGroup('DB', constants_db);
validateConstantGroup('URLS', constant_urls);

if (!isEmpty(undefinedConstants)) {
  throw new Error(
    'Cannot start server with undefined constants:\n' + undefinedConstants.map(constant => `\t- ${constant}`).join('\n')
  );
}
