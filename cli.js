const { Command } = require('commander');
const program = new Command();
const api = require('./index.js');

program
    .command('add')
    .description('add a task')
    .action(function (...args) {
        api.add(args.slice(0,-1));
    });
program
    .command('clear')
    .description('clear')
    .action(function () {
       api.clear()
    });

program.parse(process.argv);

if(process.argv.length === 2) {
    void api.showAll()
}


