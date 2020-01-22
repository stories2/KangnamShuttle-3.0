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
            var convert = require('xml-js');
            var result1 = convert.xml2json(body, {compact: true, spaces: 4});
            callbackFunc(JSON.parse(result1).response.article);
        }
    })
}

exports.updateArticlesToDB = function(articles, boardID, callbackFunc) {
    const util = require('util')

    const admin = global.admin

    articles.forEach(item => {
        const article = item['_attributes'];
        files = [];
        
        if (item.attach) {
            if (!Array.isArray(item.attach)) {
                files.push({
                    filename: item.attach["_attributes"].filename,
                    filesize: item.attach["_attributes"].filesize,
                    id: item.attach["_attributes"].id,
                    fileurl: item.attach["_attributes"].fileurl
                })
            } else {
                item.attach.forEach(fileItem => {
                    
                    const file = fileItem["_attributes"]
                    files.push({
                        filename: file.filename,
                        filesize: file.filesize,
                        id: file.id,
                        fileurl: file.fileurl
                    })
                })
            }
        }

        const data = {
            title: article.title,
            text: article.text,
            created_at: article.created_at,
            posvote: article.posvote,
            comment: article.comment,
            scrap_count: article.scrap_count,
            files
        }

        const everytimeBoardDBPath = util.format(global.define.DB_PATH_EVERY_TIME, boardID, article.id)

        global.log.debug('everytimeManager', 'updateArticlesToDB', `Everytime db path ${everytimeBoardDBPath}`);

        const everytimeRef = admin.database().ref(everytimeBoardDBPath)

        everytimeRef.set(data, (err) => {
            if (err) {
                global.log.error('everytimeManager', 'updateArticlesToDB', `Everytime login error #${boardID} - ${article.id} ${err}`);
                callbackFunc(false);
            } else {
                global.log.info('everytimeManager', 'updateArticlesToDB', `Update ok #${boardID} - ${article.id}`);
                callbackFunc(true);
            }
        })
    })
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

exports.routineOfAddComment = function(articleID, text) {

    const functions = require('firebase-functions')
    const envManager = require('../Utils/envManager')

    const loginToEverytime = this.loginToEverytime;
    const addCommentToArticle = this.addCommentToArticle;

    const everytimeData = envManager.getEverytimeInfo(functions);

    loginToEverytime(everytimeData.id, everytimeData.pw, (cookie) => {
        if (cookie) {
            addCommentToArticle(cookie, articleID, text);
        } else {
            global.log.warn('everytimeManager', 'routineOfCrawlArticle', `Cookie is null`);
        }
    })
}

exports.addCommentToArticle = function(cookie, articleID, text) {
    const request = require('request');
    setTimeout(() => {
        const payload = {
            text,
            is_anonym: 1,
            id: articleID
        }
        request.post({
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: 'https://everytime.kr/save/board/comment',
            form: payload
        }, function(err,httpResponse,body){
            if (!err) {
                global.log.debug('everytimeManager', 'addCommentToArticle', `#${articleID} comment ${text} added`);
                global.log.debug('everytimeManager', 'addCommentToArticle', `body: ${body}, payload: ${JSON.stringify(payload)}`)
            } else {
                global.log.error('everytimeManager', 'addCommentToArticle', `#${articleID} error ${err}`);
            }
        })
    }, Math.floor(Math.random() * (1000 - 500)) + 500)
}