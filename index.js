const program = require('commander')
const colors = require('colors')

program
    .version('0.0.1')
    .usage('[-e/-d] [-o <dir>] -p <password> <folder>')
    .option('-e, --encrypt', 'Encrypt a folder')
    .option('-d, --decrypt', 'Decrypt a folder')
    .option('-o, --out [dir]', 'The Output Dir Name(default:out)')
    .option('-p, --password <password>', 'Enter password to encrypt or decrypt')
    .parse(process.argv)

program.on('--help', function() {
    console.log(colors.green('  Examples:'))
    console.log('')
    console.log(colors.green('    $ folder-crypt -e -p password123 ./personal'))
    console.log(colors.green('    $ folder-crypt -d -p password123 ./decrypt'))
    console.log('')
})

if (!process.argv.slice(2).length) {
    program.outputHelp(make_color)
}

function make_color(txt) {
    return colors.yellow(txt)
}

function fatalError(er) {
    console.log('')

    console.log(colors.red('    ' + er))
    console.log('')

    program.outputHelp(make_color)
    process.exit(1)

}

program.out = program.out || "out"

if (!program.encrypt && !program.decrypt) {
    fatalError('Need to give -e or -d for either encrypt or decrypt')
}

if (!program.password) {
    fatalError('Need to give -p <password> to encrypt or decrypt')
}
if (!program.folder) {
    fatalError('Need to give Input Folder to encrypt or decrypt')
}

if (program.encrypt) console.log('  - Encrypting')
if (program.decrypt) console.log('  - Decrypting')
if (program.password) console.log('  - password : ' + program.password)
if (program.out) console.log('  - out: ' + program.out)
