require('ts-node/register');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { migrator } = require('./umzug.ts');

migrator
  .runAsCLI()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Error occurred during migration:', error);
    process.exit(1);
  });
