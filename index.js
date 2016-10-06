const program = require('commander')
const colors = require('colors')
const myCore = require('./core')

program
    .version('0.0.1')
    .usage('-e/-d [-o <dir> [-v]] -p <password> <input_Folder>')
    .option('-e, --encrypt', 'Encrypt a folder')
    .option('-d, --decrypt', 'Decrypt a folder')
    .option('-o, --out <dir>', 'The Output Dir Name(default:out)')
    .option('-v, --verbose', 'Increase the verbosity of the program')
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
    fatalError('No Arguments found')
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
global.g = function(msg) {
    if (program.verbose)
        console.log(colors.green(msg))
}

global.line = '-----------------------------------------------------'

program.out = program.out || "out"

if (!program.encrypt && !program.decrypt) {
    fatalError('Need to give -e or -d for either encrypt or decrypt')
}

if (!program.password) {
    fatalError('Need to give -p <password> to encrypt or decrypt')
}

if (!program.args) {
    fatalError('Need to give Input Folder to encrypt or decrypt')
}

var inFolder = program.args[0]
var passphrase = program.password

global.g(global.line)
global.g('Processing Folder : ' + inFolder)
global.g('Password : ' + passphrase)

if (program.encrypt) {
    global.g('Encrypting')
    global.g(global.line)
    myCore.encrypt(inFolder, passphrase, program.out)
}

if (program.decrypt) {
    global.g('Decrypting')
    global.g(global.line)

}
