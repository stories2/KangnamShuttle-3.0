exports.uploadShuttlePic = function (request, response) {
    const fileManager = require('../../Core/fileManager')
    const shuttleManager = require('../../Core/shuttleManager')
    var responseManager = require('../../Utils/responseManager')

    fileManager.preprocessUploader(request, response, global.define.SHUTTLE_SCHEDULE_PIC_BUCKET_DIR,
        function (fileSignedDownloadUrl, uploads, fields) {
            global.log.debug("fileRoute", "fileUpload<preprocessUploader>", "file upload process finished: " + fileSignedDownloadUrl)
            global.log.debug("fileRoute", "fileUpload<preprocessUploader>", "uploads: " + JSON.stringify(uploads) + " fields: " + JSON.stringify(fields))

            shuttleManager.registerShuttleSchedulePic(uploads["file"], function (status) {
                responseManager.ok(response, {
                    "success": status
                })
            })
        })
}