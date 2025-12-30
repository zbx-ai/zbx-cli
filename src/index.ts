import { Command } from 'commander';
import { addCommand } from './commands/add';
import pkg from '../package.json';

const program = new Command();

program
  .name('zbx')
  .description('CLI for managing shared utils and libs')
  .version(pkg.version);

program.addCommand(addCommand);

program.parse(process.argv);
