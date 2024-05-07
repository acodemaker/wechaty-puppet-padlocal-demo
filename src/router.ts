module.exports = (controller: any) => {

    return {
        'get /': controller.user.user,
        'get /userinfo': controller.user.userInfo,
        'post /sendMsg': controller.user.sendMsg,
         'post /login': controller.user.login1,
        'get /getStatus' : controller.user.getStatus,
        'get /getAllRoom' : controller.user.getAllRoom,
        'get /getAllTags' : controller.user.getAllTags,
        'get /getContacts' : controller.user.getContacts

    }
};