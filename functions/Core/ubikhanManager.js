exports.updateLocation = function (request, response, callbackFunc) {
    
}

exports.signInUbikhan = function(signInData) {
    const httpRequestManager = require('../Utils/httpRequestManager')
    const fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/member/login',
        port: '80',
        method: 'POST',
        // referer: "http://new.ubikhan.com/member/login?request_url=map",
        Referer: "http://new.ubikhan.com/member/login?request_url=map",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(signInData,'utf8'),
            'Referer': "http://new.ubikhan.com/member/login?request_url=map",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            // "Cookie": sessionId
        }
    }
    global.log.debug("ubikhanManager", "signInUbikhan", "sign in as: " + JSON.stringify(signInData))


}

exports.getLocation = function (request, response, callbackFunc) {
    
}