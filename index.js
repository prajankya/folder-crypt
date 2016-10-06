const program = require('commander')
const colors = require('colors')

program
    .version('0.0.1')
    .usage('[-e/-d] [-o <dir>] -p <password> <folder ...>')
    .option('-e, --encrypt', 'Encrypt a folder')
    .option('-d, --decrypt', 'Decrypt a folder')
    .option('-o, --out [dir]', 'The Output Dir Name(default:out)')
    .option('-p, --password <password>', 'Enter password to encrypt or decrypt')
    .parse(process.argv)

program.on('--help', function() {
    console.log('  Examples:')
    console.log('')
    console.log('    $ folder-crypt -e -p password123 ./personal')
    console.log('    $ folder-crypt -d -p password123 ./decrypt')
    console.log('')
})

if (!process.argv.slice(2).length) {
    program.outputHelp(make_red)
}

function make_red(txt) {
    return colors.red(txt) //display the help text in red on the console
}

program.out = program.out || "out"

if (program.encrypt) console.log('  - Encrypting');
if (program.decrypt) console.log('  - Decrypting');
if (program.password) console.log('  - password : ' + program.password);
if (program.out) console.log('  - out: ' + program.out);
