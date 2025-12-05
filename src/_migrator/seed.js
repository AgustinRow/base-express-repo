require('ts-node/register');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { seeder } = require('./umzug.ts');

seeder
  .runAsCLI()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Error occurred during seeds:', error);
    process.exit(1);
  });
