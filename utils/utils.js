var utils = (function () {

    var _utils = {};

    /**
     * Helper function to send a success (200 OK) response
     *
     * @param res {object} - response object
     * @param content {object} - content to send
     */
    _utils.sendSuccessResponse = function(res, content) {
        res.status(200).json({
            success: true,
            content: content
        }).end();
    };

    /**
     * Helper function to send a failure response
     *
     * @param res {object} - response object
     * @param errcode {number} - HTTP status code to send
     * @param content {err} - err message to send
     */
    _utils.sendErrResponse = function(res, errcode, err) {
        res.status(errcode).json({
            success: false,
            err: err
        }).end();
    };

    Object.freeze(_utils);
    return _utils;

})();

module.exports = utils;