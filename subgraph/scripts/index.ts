import yargs from 'yargs';
import handlebars from 'handlebars';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

yargs
  .command(
    'generateSubgraph',
    'Generate subgraph.yaml from subgraph.template.yaml',
    (yargs) => {
      return yargs.option('deployment', { type: 'string', default: 'hardhat' });
    },
    async (args) => {
      const deploymentsPath = 'src/generated/config';
      const subgraphPath = join(__dirname, '..');
      const templateSubgraphFilePath = join(subgraphPath, 'templates/subgraph.template.yaml');
      const subgraphFilePath = join(subgraphPath, 'subgraph.yaml');
      const templateSubgraphFile = readFileSync(templateSubgraphFilePath, 'utf-8');
      const contentJson = JSON.parse(
        readFileSync(join(subgraphPath, deploymentsPath, args.deployment + '.json'), 'utf-8')
      );
      const compile = handlebars.compile(templateSubgraphFile);
      const filledSubgraph = compile(contentJson);
      writeFileSync(subgraphFilePath, filledSubgraph);
      console.log(`  ✓ subgraph.yaml has been generated from subgraph.template.yaml and copied to ${subgraphPath}`);
    }
  )
  .help().argv;
