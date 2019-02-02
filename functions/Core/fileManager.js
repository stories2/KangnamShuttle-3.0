exports.preprocessUploader = function (request, response, savePath, callbackFunc) {
    const admin = global.admin
    const os = require('os')
    const Busboy = require('busboy')
    const path = require('path')
    const fs = require('fs')
    const bucketManager = admin.storage().bucket()
    const uniqueManager = require('../Utils/uniqueManager')

    const busboy = new Busboy({headers: request.headers})
    const tmpdir = os.tmpdir()

    const fields = []
    const uploads = {}
    var saveFile2GoogleStorageFunc = this.saveFile2GoogleStorage
    var userRecordData = request.accountInfo

    busboy.on('field', function (fieldname, val) {
        global.log.debug("FileManager", "preprocessUploader<file>", "processed field: " + fieldname + " / " + val)
        fields[fieldname] = val
    })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        global.log.debug("FileManager", "preprocessUploader<file>", "processed file name: " + filename + " field name: " + fieldname + " encoding: " + encoding + " mimetype: " + mimetype)

        const filePath = path.join(tmpdir, filename)
        // uploads[fieldname] = filePath

        var fileStream = fs.createWriteStream(filePath)
        var fileBuffer = new Buffer('')

        file.on('data', function (data) {
            fileBuffer = Buffer.concat([fileBuffer, data])
        })

        file.on('end', function () {
            const fileObject = {
                fieldname,
                originalname: filename,
                encoding,
                mimetype,
                buffer: fileBuffer,
                uuid: uniqueManager.generateUUID()
            }
            global.log.debug("FileManager", "preprocessUploader<end>", "file object buffer length: " + fileObject.buffer.length + " uuid: " + fileObject.uuid)

            var currentDate = new Date()

            uploads[fieldname] = {
                fieldname: fieldname,
                originalname: filename,
                encoding: encoding,
                mimetype: mimetype,
                uuid: fileObject.uuid,
                length: fileObject.buffer.length,
                uploaderUid: userRecordData.uid,
                uploaderDisplayName: userRecordData.displayName,
                uploadSec: currentDate.getTime() / 1000,
                uploadDateTimeStr: currentDate.toISOString()
            }

            saveFile2GoogleStorageFunc(fileObject, bucketManager, savePath)
                .then(function (signedDownloadUrl) {
                    global.log.debug("FileManager", "preprocessUploader<end>", "file saved and url generated: " + signedDownloadUrl)


                    if(callbackFunc !== undefined) {
                        callbackFunc(signedDownloadUrl, uploads, fields)
                    }
                    else {
                        global.log.warn("FileManager", "preprocessUploader<finish>", "callback func is undefined")
                    }
                })
                .catch(function (error) {
                    global.log.error("FileManager", "preprocessUploader<end>", "cannot save to google storage")
                    callbackFunc(undefined)
                })
            request.file = fileObject
        })

        file.pipe(fileStream)
    })

    busboy.on('finish', function () {
        for(const name in uploads) {
            const file = uploads[name]
            global.log.debug("FileManager", "preprocessUploader<finish>", "file " + file + " upload finished")
        }
    })

    busboy.end(request.rawBody)
    request.pipe(busboy)
}

exports.saveFile2GoogleStorage = function (fileObject, bucketManager, savePath) {
    var util = require('util')
    var convertManager = require('../Utils/ConvertManager')

    var processPromise = new Promise(function (resolve, reject) {
        if(fileObject == null) {
            global.log.warn("FileManager", "saveFile2GoogleStorage", "file object is null, reject this")
            reject(global.define.PROMISE_FILE_UPLOAD_REJECT_EMPTY_FILE)
        }

        global.log.debug("FileManager", "saveFile2GoogleStorage", "file will save as: " + fileObject.uuid)

        var fileSavePath = savePath + fileObject.uuid
        global.log.debug("FileManager", "saveFile2GoogleStorage", "file save path: " + fileSavePath + " mimetype: " + fileObject.mimetype)

        var fileUploader = bucketManager.file(fileSavePath)
        var blobStream = fileUploader.createWriteStream({
            metadata: {
                contentType: fileObject.mimetype
            }
        })

        blobStream.on('error', function (error) {
            global.log.error("FileManager", "saveFile2GoogleStorage", "cannot save file: " + JSON.stringify(error))
            reject(global.define.PROMISE_FILE_UPLOAD_REJECT_SAVE_FILE_ERROR)
        })

        blobStream.on('finish', function () {
            global.log.info("FileManager", "saveFile2GoogleStorage", "file saved")

            var longDate = new Date()
            longDate.setDate(longDate.getDate() + 2000)
            var longDateTimeStr = convertManager.date2FormattedDateTimeStr(longDate, global.define.FORMAT_DATE_TIME_YYYY_MM_DD)
            global.log.debug("FileManager", "saveFile2GoogleStorage", "formatted datetime: " + longDateTimeStr)

            fileUploader.getSignedUrl({
                action: 'read',
                expires: longDateTimeStr
            })
                .then(function (signedDownloadUrl) {
                    global.log.debug("FileManager", "saveFile2GoogleStorage", "download link: " + signedDownloadUrl + " until: " + longDateTimeStr)

                    resolve(signedDownloadUrl)
                })
                .catch(function (error) {
                    global.log.error("FileManager", "saveFile2GoogleStorage", "cannot generate download link: " + JSON.stringify(error))

                    reject(global.define.PROMISE_FILE_UPLOAD_REJECT_DOWNLOAD_URL_ERROR)
                })
        })

        blobStream.end(fileObject.buffer)
    })

    return processPromise
}