exports.uploadShuttlePic = function (request, response) {
    const fileManager = require('../../Core/fileManager')
    var responseManager = require('../../Utils/ResponseManager')

    fileManager.preprocessUploader(request, response, "BusSchedule/",
        function (fileSignedDownloadUrl, uploads, fields) {
            global.log.debug("fileRoute", "fileUpload<preprocessUploader>", "file upload process finished: " + fileSignedDownloadUrl)
            global.log.debug("fileRoute", "fileUpload<preprocessUploader>", "uploads: " + JSON.stringify(uploads) + " fields: " + JSON.stringify(fields))

            responseManager.ok(response, uploads)
        })
}