exports.routineOfCrawlSchoolLifeSchedule = function(request, response, callbackFunc) {
    const loadSchoolLifeSchedulePage = this.loadSchoolLifeSchedulePage
    const crawlCurrentMonthSchedule = this.crawlCurrentMonthSchedule

    loadSchoolLifeSchedulePage(function (schedulePageHtml) {

        // crawlCurrentMonthSchedule(schedulePageHtml, function () {
        //
        // })
    })
}

exports.loadSchoolLifeSchedulePage = function (callbackFunc) {
    const httpRequestManager = require('../Utils/httpRequestManager')

    var fakeHeaderOptions = {
        hostname: global.define.URL_SCHOOL_HOST_NAME,
        path: global.define.URL_SCHOOL_LIFE_SCHEDULE_PATH,
        port: '80',
        method: 'GET',
        Referer: "http://web.kangnam.ac.kr/",
        headers: {
            'Referer': 'http://web.kangnam.ac.kr/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
            'Host': 'web.kangnam.ac.kr',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8'
        }
    }

    global.log.debug("schoolManager", "loadSchoolLifeSchedulePage", "fake header: " + JSON.stringify(fakeHeaderOptions))

    httpRequestManager.request(
        fakeHeaderOptions,
        function (reqResponse, reqResponseStr) {
            global.log.debug("schoolManager", "loadSchoolLifeSchedulePage", "page html size: " + reqResponseStr.length)
            callbackFunc(reqResponseStr)
        },
        function (error) {
            global.log.error("schoolManager", "loadSchoolLifeSchedulePage", "cannot get page: " + JSON.stringify(error))
            callbackFunc(undefined)
        }, undefined)
}

exports.crawlCurrentMonthSchedule = function (schedulePageHtml, callbackFunc) {

}