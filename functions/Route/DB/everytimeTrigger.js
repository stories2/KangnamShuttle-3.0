exports.articleCreated = (snapshot, context) => {
    global.log.debug('everytimeTrigger', 'articleCreated', 'params: ' + JSON.stringify(context.params))
}