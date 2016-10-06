const encryptor = require('file-encryptor')
const mkdirp = require('mkdirp')
const recursive = require('recursive-readdir')
const fs = require('fs')
const colors = require('colors')
const path = require('path')

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
                var outfile = path.join(path.join(parent_folder, outFolder), relative_path)
                mkdirp.sync(path.dirname(outfile))
                encryptor.encryptFile(file, outfile, passphrase, function(err) {
                    if (err) {
                        console.error(err)
                    }
                    global.cur_done++
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
    }
}
