exports.routineOfCrawlSchoolLifeSchedule = function(request, response, callbackFunc) {
    const loadSchoolLifeSchedulePage = this.loadSchoolLifeSchedulePage
    const crawlCurrentMonthSchedule = this.crawlCurrentMonthSchedule

    loadSchoolLifeSchedulePage(function (schedulePageHtml) {

        if(schedulePageHtml) {
            crawlCurrentMonthSchedule(schedulePageHtml, function (scheduleList) {
                callbackFunc(scheduleList)
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

    var schedule = []

    for(var index = ZERO; index < scrapObj.length; index += 1) {
        const scheduleObj = scrapObj.eq(index).find('tbody tr')
        var currentMonthSchedule = []

        global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "#" + index + " founded row: " + scheduleObj.length)

        for(var row = ZERO; row < scheduleObj.length; row += 1) {
            var duplicateEvent = false
            const scheduleRowObj = scheduleObj.eq(row)
            var date = scheduleRowObj.find('th').text().replace(/\./g, "-")
            var eventText = scheduleRowObj.find('td').text()

            if(index > ZERO) {
                for(var eventIndex in schedule[index - 1]) {
                    const event = schedule[index - 1][eventIndex]
                    // console.log("event", event)
                    if(event.eventText === eventText) {
                        duplicateEvent = true
                        break;
                    }
                }
            }

            if(duplicateEvent != true) {
                var regexpDate = date.match(/([0-9]){2}\-([0-9]){2}/g)
                global.log.debug("schoolManager", "crawlCurrentMonthSchedule", date + " : " + eventText)
                currentMonthSchedule.push({
                    date: date,
                    regexpDate: regexpDate,
                    eventText: eventText
                })
            }
            else {
                global.log.warn("schoolManager", "crawlCurrentMonthSchedule", "duplicate event detected: " + date + " : " + eventText)
            }
        }

        schedule.push(currentMonthSchedule)
    }

    global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "ok schedule is: " + JSON.stringify(schedule))

    callbackFunc(schedule)
}

exports.getAlreadyRegisteredMyCalendarList = function (request, response, callbackFunc) {
    const admin = global.admin
    const util = require('util')
    const accountInfo = request.accountInfo
    const uid = accountInfo.uid
    var dbPath = util.format(global.define.DB_PATH_ACCOUNTS_UID_CALENDAR, uid)

    global.log.debug("schoolManager", "getAlreadyRegisteredMyCalendarList", "calendar db path: " + dbPath)

    var calendarRef = admin.database().ref(dbPath)

    calendarRef.once("value", function (calendarSnapshot) {
        var calendarData = calendarSnapshot.val() || []

        global.log.debug("schoolManager", "getAlreadyRegisteredMyCalendarList", "data: " + calendarData)

        callbackFunc(calendarData)
    })
}

exports.registerNewCalendarList = function (request, response, callbackFunc) {
    const admin = global.admin
    const util = require('util')
    const accountInfo = request.accountInfo
    const uid = accountInfo.uid
    var dbPath = util.format(global.define.DB_PATH_ACCOUNTS_UID_CALENDAR, uid)
    var data = request.body["schedule"]

    global.log.debug("schoolManager", "getAlreadyRegisteredMyCalendarList", "calendar db path: " + dbPath)
    global.log.debug("schoolManager", "getAlreadyRegisteredMyCalendarList", "data: " + JSON.stringify(data))

    var calendarRef = admin.database().ref(dbPath)

    calendarRef.set(data, function (error) {
        if(error) {
            global.log.error("schoolManager", "getAlreadyRegisteredMyCalendarList", "cannot register new calendar: " + JSON.stringify(error))
            callbackFunc(false)
        }
        else {
            global.log.info("schoolManager", "getAlreadyRegisteredMyCalendarList", "calendar registered")
            callbackFunc(true)
        }
    })
}