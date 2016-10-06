const encryptor = require('file-encryptor')
const mkdirp = require('mkdirp')
const recursive = require('recursive-readdir')
const fs = require('fs')
const colors = require('colors')
const path = require('path')
const crypto = require('crypto')

module.exports = {
    encrypt: function(folder, passphrase, outFolder) {
        let parent_folder = folder.substr(0, folder.lastIndexOf(path.sep))

        global.cur_done = 0

        recursive(folder, function(err, files) {
            if (err) {
                global.g("Folder Not valid !")
                console.error(err)
                process.exit(1)
            }
            let total_nos = files.length
            var relPath_length = (folder.length + 1) //1 for a slash in between
            for (var index in files) {
                var file = files[index]
                var relative_path = file.substr(relPath_length)

                var p = relative_path.split(path.sep)
                for (var i = 0; i < p.length; i++) {
                    var cipher = crypto.createCipher('aes192', passphrase)
                    var e = cipher.update(p[i], 'utf8', 'hex')
                    e += cipher.final('hex')
                    p[i] = e
                }
                relative_path = p.join(path.sep)

                var outfile = path.join(parent_folder, outFolder, relative_path)
                mkdirp.sync(path.dirname(outfile))
                encryptor.encryptFile(file, outfile, passphrase, function(err) {
                    if (err) {
                        console.error(err)
                    }
                    global.cur_done++;
                    global.g("Done " + global.cur_done + " of " + total_nos)
                    if (global.cur_done == total_nos) {
                        global.g("Done Completely..")
                        global.g(global.line)
                        global.g("Output folder '" + outFolder + "'")
                        console.log(colors.green('Done Successfully !'))
                    }
                })
            }
        })
    },
    decrypt: function(folder, passphrase, outFolder) {
        let parent_folder = folder.substr(0, folder.lastIndexOf(path.sep))
        global.cur_done = 0

        recursive(folder, function(err, files) {
            if (err) {
                global.g("Folder Not valid !")
                if (global.verbose) {
                    console.error(err)
                }
                console.error(colors.red('"Folder Not valid !"'))
                process.exit(1)
            }
            let total_nos = files.length
            var relPath_length = (parent_folder.length + outFolder.length + 1) //1 for a slash in between

            global.error = false

            for (var index in files) {
                var file = files[index]
                var relative_path = file.substr(relPath_length)

                var p = relative_path.split(path.sep)
                for (var i = 0; i < p.length; i++) {
                    if (!p[i]) { //for first forward slash
                        continue
                    }
                    var decipher = crypto.createDecipher('aes192', passphrase)
                    var d = decipher.update(p[i] + "", 'hex', 'utf8');
                    try {

                        d += decipher.final('utf8');
                    } catch (e) {
                        if (global.verbose) {
                            console.error(e);
                        }
                    }
                    p[i] = d
                }
                relative_path = p.join(path.sep)

                var outfile = path.join(parent_folder, outFolder, relative_path)
                mkdirp.sync(path.dirname(outfile))

                encryptor.decryptFile(file, outfile, passphrase, function(err) {
                    if (!global.error) {
                        if (err) {
                            global.g("Error Decrypting !")
                            if (global.verbose) {
                                console.error(err)
                            }
                            console.error(colors.red('Error Decrypting ! Wrong Password'))
                            global.error = true
                        } else {
                            global.cur_done++;
                            global.g("Done " + global.cur_done + " of " + total_nos)
                            if (global.cur_done == total_nos) {
                                global.g("Done Completely..")
                                global.g(global.line)
                                global.g("Output folder '" + outFolder + "'")
                                console.log(colors.green('Done Successfully !'))
                            }
                        }
                    }
                })
            }
        })
    }
}
