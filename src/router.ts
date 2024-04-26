module.exports = (controller: any) => {

    return {
        'get /': controller.user.user,
        'get /userinfo': controller.user.userInfo,
        'post /sendMsg': controller.user.sendMsg,
         'post /login1': controller.user.login1

    }
};