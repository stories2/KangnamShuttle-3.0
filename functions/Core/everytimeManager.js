exports.loginToEverytime = function(userid, password, callbackFunc) {
    const request = require('request');
    request.post({
        url:'https://everytime.kr/user/login', 
        form: {
            userid,
            password
        }
    }, function(err,httpResponse,body){
        if(err) {
            global.log.error('everytimeManager', 'loginToEverytime', `Everytime login error ${err}`);
            callbackFunc(null);
            return;
        } else if (httpResponse.headers["set-cookie"] && httpResponse.headers["set-cookie"].length > 0) {
            callbackFunc(httpResponse.headers["set-cookie"][0]);
        } else {
            callbackFunc(null);
        }
    })
}

exports.getLatestArticles = function(cookie, boardID, callbackFunc) {
    const request = require('request');
    request.post({
        headers: {
            'Cookie': cookie,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: 'https://everytime.kr/find/board/article/list',
        form: {
            id: boardID,
            limit_num: 20,
            start_num: 0,
            moiminfo: false
        }
    }, function(err,httpResponse,body){
        if (err) {
            global.log.error('everytimeManager', 'getLatestArticles', `Everytime login error ${err}`);
            callbackFunc(null);
            return;
        } else {
            var parser = require('xml2json');
            var json = parser.toJson(body);
            console.log('xml2json', json);
            callbackFunc(json);
            // console.log('body', body);
        }
    })
}

exports.updateArticlesToDB = function(articles, boardID, callbackFunc) {
    
}

exports.routineOfCrawlArticle = function(callbackFunc) {
    const functions = require('firebase-functions')
    const envManager = require('../Utils/envManager')

    const loginToEverytime = this.loginToEverytime;
    const getLatestArticles = this.getLatestArticles;
    const updateArticlesToDB = this.updateArticlesToDB;

    const everytimeData = envManager.getEverytimeInfo(functions);

    loginToEverytime(everytimeData.id, everytimeData.pw, (cookie) => {
        if (cookie) {
            everytimeData.boards.forEach(boardID => {
                getLatestArticles(cookie, boardID, (articles) => {
                    global.log.debug('everytimeManager', 'routineOfCrawlArticle', `Board ID: ${boardID}, cookie: ${cookie}`);
                    if (articles) {
                        updateArticlesToDB(articles, boardID, (result) => {
                            global.log.debug('everytimeManager', 'routineOfCrawlArticle', `Board ID: ${boardID}, update to db result: ${result}`);
                        })
                    } else {
                        global.log.warn('everytimeManager', 'routineOfCrawlArticle', `Article is null ${boardID}`);
                    }
                })
            })
        } else {
            global.log.warn('everytimeManager', 'routineOfCrawlArticle', `Cookie is null`);
        }
    })

    callbackFunc();
}