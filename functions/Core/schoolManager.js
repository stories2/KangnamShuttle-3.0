exports.routineOfCrawlSchoolLifeSchedule = function(request, response, callbackFunc) {
    const loadSchoolLifeSchedulePage = this.loadSchoolLifeSchedulePage
    const crawlCurrentMonthSchedule = this.crawlCurrentMonthSchedule

    loadSchoolLifeSchedulePage(function (schedulePageHtml) {

        if(schedulePageHtml) {
            crawlCurrentMonthSchedule(schedulePageHtml, function () {

            })
        }
        else {
            global.log.warn("schoolManager", "routineOfCrawlSchoolLifeSchedule", "cannot crawl school life schedule page")
            callbackFunc(undefined)
        }
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
    const cheerio = require('cheerio')
    const $ = cheerio.load(schedulePageHtml)
    const scrapObj = $('div.com_tab_div.year ul').find('li div.tbl.typeA.calendal_list').children()

    global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "" + scrapObj.text())
    global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "length: " + scrapObj.length)

    // global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "children: " + JSON.stringify(scrapObj.children()))
    // console.log(scrapObj.children().eq(0).text())

    for(var index = 0; index < scrapObj.length; index += 1) {
        const scheduleObj = scrapObj.eq(index).find('tbody tr')

        global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "#" + index + " founded row: " + scheduleObj.length)

        for(var row = 0; row < scheduleObj.length; row += 1) {
            const scheduleRowObj = scheduleObj.eq(row)
            global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "" + scheduleRowObj.find('th').text() + " : " + scheduleRowObj.find('td').text())
        }
    }
}