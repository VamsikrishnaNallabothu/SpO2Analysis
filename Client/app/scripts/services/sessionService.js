angular.module('sbAdminApp').factory('Session', function() {

    var access_token;
    var expires_in;
    var account_user_id;

    if (JSON.parse(window.localStorage.getItem("fitbit"))) {
        access_token = JSON.parse(window.localStorage.getItem("fitbit")).oauth.access_token;
        expires_in = JSON.parse(window.localStorage.getItem("fitbit")).oauth.expires_in;
        account_user_id = JSON.parse(window.localStorage.getItem("fitbit")).oauth.account_user_id;
    }
    
    return {
       accessToken: access_token,
       expiresIn: expires_in,
       accountUserId: account_user_id
    }
});