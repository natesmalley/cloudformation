// index.js
const { App } = require('aws-cdk-lib');
const blueprint = require('./lib/main'); // default export = function(app)

exports.handler = async () => {
  const app   = new App();
  blueprint.default(app);     // builds the blueprint
  await app.synth();          // emits cloud assembly
  // CDK CLI deploys, but from Lambda we need Cloud Assembly → CFN
  // easiest: exec "npx cdk deploy --require-approval never"
  const { execSync } = require('child_process');
  execSync('npx cdk deploy --all --require-approval never', { stdio: 'inherit' });

  return { status: 'CDK deploy triggered' };
};