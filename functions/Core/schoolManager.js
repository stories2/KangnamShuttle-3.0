exports.routineOfCrawlSchoolLifeSchedule = function (request, response, callbackFunc) {
  const loadSchoolLifeSchedulePage = this.loadSchoolLifeSchedulePage
  const crawlCurrentMonthSchedule = this.crawlCurrentMonthSchedule

  loadSchoolLifeSchedulePage(function (schedulePageHtml) {
    if (schedulePageHtml) {
      crawlCurrentMonthSchedule(schedulePageHtml, function (scheduleList) {
        callbackFunc(scheduleList)
      })
    } else {
      global.log.warn('schoolManager', 'routineOfCrawlSchoolLifeSchedule', 'cannot crawl school life schedule page')
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
    Referer: 'http://web.kangnam.ac.kr/',
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

  global.log.debug('schoolManager', 'loadSchoolLifeSchedulePage', 'fake header: ' + JSON.stringify(fakeHeaderOptions))

  httpRequestManager.request(
    fakeHeaderOptions,
    function (reqResponse, reqResponseStr) {
      global.log.debug('schoolManager', 'loadSchoolLifeSchedulePage', 'page html size: ' + reqResponseStr.length)
      callbackFunc(reqResponseStr)
    },
    function (error) {
      global.log.error('schoolManager', 'loadSchoolLifeSchedulePage', 'cannot get page: ' + JSON.stringify(error))
      callbackFunc(undefined)
    }, undefined)
}

exports.crawlCurrentMonthSchedule = function (schedulePageHtml, callbackFunc) {
  const cheerio = require('cheerio')
  const $ = cheerio.load(schedulePageHtml)
  const scrapObj = $('div.com_tab_div.year ul').find('li div.tbl.typeA.calendal_list').children()

  global.log.debug('schoolManager', 'crawlCurrentMonthSchedule', '' + scrapObj.text())
  global.log.debug('schoolManager', 'crawlCurrentMonthSchedule', 'length: ' + scrapObj.length)

  // global.log.debug("schoolManager", "crawlCurrentMonthSchedule", "children: " + JSON.stringify(scrapObj.children()))
  // console.log(scrapObj.children().eq(0).text())

  var schedule = []

  for (var index = global.define.ZERO; index < scrapObj.length; index += 1) {
    const scheduleObj = scrapObj.eq(index).find('tbody tr')
    var currentMonthSchedule = []

    global.log.debug('schoolManager', 'crawlCurrentMonthSchedule', '#' + index + ' founded row: ' + scheduleObj.length)

    for (var row = global.define.ZERO; row < scheduleObj.length; row += 1) {
      var duplicateEvent = false
      const scheduleRowObj = scheduleObj.eq(row)
      var date = scheduleRowObj.find('th').text().replace(/\./g, '-')
      var eventText = scheduleRowObj.find('td').text()

      if (index > global.define.ZERO) {
        for (var checkIndex = global.define.ZERO; checkIndex < index; checkIndex += 1) {
          for (var eventIndex in schedule[checkIndex]) {
            const event = schedule[checkIndex][eventIndex]
            // console.log("event", event)
            if (event.eventText === eventText && event.date === date) {
              duplicateEvent = true
              break
            }
          }
          if (duplicateEvent) {
            break
          }
        }
      }

      if (duplicateEvent != true) {
        var regexpDate = date.match(/([0-9]){2}\-([0-9]){2}/g)
        global.log.debug('schoolManager', 'crawlCurrentMonthSchedule', date + ' : ' + eventText)
        currentMonthSchedule.push({
          date: date,
          regexpDate: regexpDate,
          eventText: eventText
        })
      } else {
        global.log.warn('schoolManager', 'crawlCurrentMonthSchedule', 'duplicate event detected: ' + date + ' : ' + eventText)
      }
    }

    schedule.push(currentMonthSchedule)
  }

  global.log.debug('schoolManager', 'crawlCurrentMonthSchedule', 'ok schedule is: ' + JSON.stringify(schedule))

  callbackFunc(schedule)
}

exports.getAlreadyRegisteredMyCalendarList = function (request, response, callbackFunc) {
  const admin = global.admin
  const util = require('util')
  const accountInfo = request.accountInfo
  const uid = accountInfo.uid
  var dbPath = util.format(global.define.DB_PATH_ACCOUNTS_UID_CALENDAR, uid)

  global.log.debug('schoolManager', 'getAlreadyRegisteredMyCalendarList', 'calendar db path: ' + dbPath)

  var calendarRef = admin.database().ref(dbPath)

  calendarRef.once('value', function (calendarSnapshot) {
    var calendarData = calendarSnapshot.val() || []

    global.log.debug('schoolManager', 'getAlreadyRegisteredMyCalendarList', 'data: ' + calendarData)

    callbackFunc(calendarData)
  })
}

exports.registerNewCalendarList = function (request, response, callbackFunc) {
  const admin = global.admin
  const util = require('util')
  const accountInfo = request.accountInfo
  const uid = accountInfo.uid
  var dbPath = util.format(global.define.DB_PATH_ACCOUNTS_UID_CALENDAR, uid)
  var data = request.body['schedule']

  global.log.debug('schoolManager', 'getAlreadyRegisteredMyCalendarList', 'calendar db path: ' + dbPath)
  global.log.debug('schoolManager', 'getAlreadyRegisteredMyCalendarList', 'data: ' + JSON.stringify(data))

  var calendarRef = admin.database().ref(dbPath)

  calendarRef.set(data, function (error) {
    if (error) {
      global.log.error('schoolManager', 'getAlreadyRegisteredMyCalendarList', 'cannot register new calendar: ' + JSON.stringify(error))
      callbackFunc(false)
    } else {
      global.log.info('schoolManager', 'getAlreadyRegisteredMyCalendarList', 'calendar registered')
      callbackFunc(true)
    }
  })
}

exports.runUpdateLibrarySeatObjects = function(request, response, callbackFunc) {
  const getLatestLibrarySeatObjects = this.getLatestLibrarySeatObjects
  const patchLatestLibrarySeatObjects = this.patchLatestLibrarySeatObjects
  const admin = global.admin
  const roomListRef = admin.database().ref(global.define.DB_PATH_LIBRARY_CONFIG_ROOM_ID)
  roomListRef.once('value', function(roomListSnapshot) {
    const roomListData = roomListSnapshot.val()
    var roomCnt = global.define.ZERO
    var summaryStatus = true
    for(var key in roomListData) {
      const roomID = roomListData[key]["id"]
      const roomName = roomListData[key]["name"]
      global.log.debug('schoolManager', 'runUpdateLibrarySeatObjects', 'room id: ' + roomID + ' name: ' + roomName)

      getLatestLibrarySeatObjects(roomID, function(seatObjects) {
        patchLatestLibrarySeatObjects(roomID, seatObjects, roomName, function(status) {
          roomCnt += 1
          if(status == false) {
            summaryStatus = false
          }
          if(roomCnt == Object.keys(roomListData).length) {
            callbackFunc(summaryStatus)
          }
        })
      })
    }
  })
}

exports.getLatestLibrarySeatObjects = function(roomID, callbackFunc) {
  const functions = require('firebase-functions')
  const envManager = require('../Utils/envManager')
  const util = require('util')
  var request = require('request')
  const apiEndpoint = util.format(envManager.getSchoolInfo(functions)['library_seat_api_endpoint'], roomID)

  global.log.debug('schoolManager', 'getLatestLibrarySeatObjects', 'req to: ' + apiEndpoint)

  request(apiEndpoint, function(error, response, body) {
    if(error) {
      global.log.error('schoolManager', 'getLatestLibrarySeatObjects', 'error: ' + JSON.stringify(error))
      callbackFunc(undefined)
    }
    else {
      const seatObjects = JSON.parse(body)['_Model_lg_clicker_for_compact_object_list']
      global.log.debug('schoolManager', 'getLatestLibrarySeatObjects', 'seat size: ' + seatObjects.length)
  
      callbackFunc(seatObjects)
    }
  })
}

exports.patchLatestLibrarySeatObjects = function(roomID, seatObjects, roomName, callbackFunc) {
  if(seatObjects === undefined || seatObjects === null) {
    global.log.warn('schoolManager', 'patchLatestLibrarySeatObjects', 'seat objects is undefined')
    callbackFunc(false)
    return
  }
  const admin = global.admin
  const util = require('util')
  const datetimeManager = require('../Utils/datetimeManager')
  const seatPath = util.format(global.define.DB_PATH_LIBRARY_SEAT_ROOM_ID, roomID)
  const seatRef = admin.database().ref(seatPath)
  const updateDateTimeStr = datetimeManager.getCurrentTime().toISOString()
  var availableSeatNum = global.define.ZERO
  for(var index in seatObjects) {
    if(seatObjects[index]['l_percent'] === "100") {
      availableSeatNum += 1
    }
  }
  var summary = {
    'allSeat': seatObjects.length,
    'availableSeat': availableSeatNum,
    'name': roomName
  }
  global.log.debug('schoolManager', 'patchLatestLibrarySeatObjects', 'summary: ' + JSON.stringify(summary))
  seatRef.set({
    lastUpdateDateTime: updateDateTimeStr,
    summary: summary,
    seatObjects: seatObjects
  }, function(error) {
    if(error) {
      global.log.error('schoolManager', 'patchLatestLibrarySeatObjects', 'error: ' + JSON.stringify(error))
      callbackFunc(false)
    }
    else {
      global.log.info('schoolManager', 'patchLatestLibrarySeatObjects', 'latest library seat objects updated')
      callbackFunc(true)
    }
  })
}

exports.routineOfCrawlSchoolNotice = function(callbackFunc) {
  const loadSchoolNoticePage = this.loadSchoolNoticePage;
  const crawlNoticeList = this.crawlNoticeList;
  const saveSchoolNoticeList = this.saveSchoolNoticeList;

  loadSchoolNoticePage(function(noticePageHtml) {
    if (noticePageHtml) {
      crawlNoticeList(noticePageHtml, function(noticeList) {
        saveSchoolNoticeList(noticeList, callbackFunc)
      })
    }
    else {
      global.log.warn('schoolManager', 'routineOfCrawlSchoolNotice', 'cannot crawl school life notice page')
      callbackFunc(undefined);
    }
  })
}

exports.loadSchoolNoticePage = function(callbackFunc) {
  const httpRequestManager = require('../Utils/httpRequestManager')

  var fakeHeaderOptions = {
    hostname: global.define.URL_SCHOOL_HOST_NAME,
    path: global.define.URL_SCHOOL_LIFE_NOTICE_PATH,
    port: '80',
    method: 'GET',
    Referer: 'http://web.kangnam.ac.kr/',
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

  global.log.debug('schoolManager', 'loadSchoolNoticePage', 'fake header: ' + JSON.stringify(fakeHeaderOptions))

  httpRequestManager.request(
    fakeHeaderOptions,
    function (reqResponse, reqResponseStr) {
      global.log.debug('schoolManager', 'loadSchoolNoticePage', 'page html size: ' + reqResponseStr.length)
      callbackFunc(reqResponseStr)
    },
    function (error) {
      global.log.error('schoolManager', 'loadSchoolNoticePage', 'cannot get page: ' + JSON.stringify(error))
      callbackFunc(undefined)
    }, undefined)
}

exports.crawlNoticeList = function(noticePageHtml, callbackFunc) {
  const util = require('util')
  const cheerio = require('cheerio')
  const $ = cheerio.load(noticePageHtml)
  const scrapObj = $('div.tbody').children()
  const urlFormat = 'http://web.kangnam.ac.kr/menu/board/info/f19069e6134f8f8aa7f689a4a675e66f.do?scrtWrtiYn=%s&encMenuSeq=%s&encMenuBoardSeq=%s'
  let noticeList = []
  for (let index = global.define.ZERO; index < scrapObj.length; index += 1) {
    if(noticeList.length >= 5) {
      break;
    }
    const notice = scrapObj.eq(index)
    const noticeID = notice.children('li').eq(0).text().trim()
    if(noticeID === '필독') {
      continue;
    }
    const noticeType = notice.children('li').eq(1).text().trim()
    const noticeTitle = notice.children('li').eq(2).text().trim()
    const dataParams = JSON.parse(notice.children('li').eq(2).find('a').attr('data-params'))
    // console.log(noticeID, noticeTitle, dataParams["scrtWrtiYn"], dataParams["encMenuSeq"], dataParams["encMenuBoardSeq"])
    noticeList.push({
      id: noticeID,
      title: noticeTitle,
      url: util.format(urlFormat, dataParams["scrtWrtiYn"], dataParams["encMenuSeq"], dataParams["encMenuBoardSeq"]),
      type: noticeType,
      data: {
        scrtWrtiYn: dataParams["scrtWrtiYn"],
        encMenuSeq: dataParams["encMenuSeq"],
        encMenuBoardSeq: dataParams["encMenuBoardSeq"],
      }
    })
  }
  global.log.debug('schoolManager', 'crawlNoticeList', 'notice list: ' + JSON.stringify(noticeList))
  callbackFunc(noticeList)
}

exports.saveSchoolNoticeList = function(noticeList, callbackFunc) {
  const admin = global.admin
  const schoolNotiRef = admin.database().ref(global.define.DB_PATH_SCHOOL_NOTICE)
  schoolNotiRef.set(noticeList, function(error) {
    if(error) {
      global.log.error('schoolManager', 'saveSchoolNoticeList', 'error: ' + JSON.stringify(error))
      callbackFunc(false)
    }
    else {
      global.log.info('schoolManager', 'saveSchoolNoticeList', 'notice list saved')
      callbackFunc(true)
    }
  })
}

exports.crawlSchoolWorkerList = function() {

  const pageList = [{
    url: 'https://web.kangnam.ac.kr/menu/d32b0ae4b98a62cad835c588275d3407.do',
    form: {
      rmrkNote: 1
    },
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
  }, 
  {
    url: 'https://web.kangnam.ac.kr/menu/d32b0ae4b98a62cad835c588275d3407.do',
    form: {
      rmrkNote: 2
    },
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
]

  const request = require('request');
  const cheerio = require('cheerio');

  const fullWorkerData = {};

  pageList.forEach(page => {
    request.post({
      url: page.url, 
      form: page.form,
      headers: page.headers
    }, function(err,httpResponse,body){
        if(err) {
            global.log.error('schoolManager', 'crawlSchoolWorkerList', `Cannot get school worker page ${err}`);
            return;
        } else {
          const $ = cheerio.load(body)
          const workerDivList = $('div.phone_loop').children()
          // console.log('workerDivList length', workerDivList.length);
          for(var i = 0; i < workerDivList.length; i ++) {
            // console.log('worker', workerDivList.eq(i).text())
            
            const data = {
              area: workerDivList.eq(i).find('span.areaGame').text(),
              name: workerDivList.eq(i).find('span.areaName').text().split(' ')[0],
              tel: workerDivList.eq(i).find('span.f_right').text()
            }

            const telRegexp = [/^[0-9]{4}$/, /^[0-9]{3}-[0-9]{4}$/]

            if (telRegexp[0].test(data.tel)) {
              data.tel = `031-280-${data.tel}`;
              // console.log('worker', JSON.stringify(data));

              fullWorkerData[data.tel] = data;
            } else if (telRegexp[1].test(data.tel)) {
              data.tel = `031-${data.tel}`
              // console.log('worker', JSON.stringify(data));

              fullWorkerData[data.tel] = data;
            } 
          }

          console.log('fullWorkerData', fullWorkerData);
        }
    })
  })
}