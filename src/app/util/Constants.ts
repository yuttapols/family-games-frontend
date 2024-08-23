export const APP = {
    PROJECT_NAME: "MIX-SALE",
    API_VERSION : "/api/v1",
    MAX_SIZE_IMAGE : 1048576,
    FILE_TYPE : ["jpg","jpeg","png","gif", "jfif"],

    STATUS_OF_CURRENT : "CURRENT",
    STATUS_OF_WEEK : "WEEK",
    STATUS_OF_MONTH : "MONTH",

    ROLE_ALL : 0,
    ROLE_ADMIN : 1,
    ROLE_EMPOLYEE : 2,
    ROLE_CUSTOMER : 3,
};

export const CALL_SERVICE = {
    AUTHENTICATION : {
        LOGIN : "/authentication/login",
        REFRESH_TOKEN : "/authentication/refreshToken"
    },USER:{
        UPDATE_IMAGES_PROFILE : "/user/updateImageProfile",
        GET_IMAGES : "/user/getImageByte",
        UPDATE_PROFILE : "/user/updateProfile",
        GET_BYID : "/user/getById",
        GET_USER_BYUSERID : "/user/getUserByUserId",
        GET_CUSTOMERALL : "/user/getCustomerAll",
        DELETE : "/user/delete",
        CHECK_USERNAME : "/user/checkUsreName",
        SAVE_CUSTOMER : "/user/saveCustomer",
    },RESERVATION:{
        GETALL_BYSTATUS_WAITING : "/reservation/getAllRevByStatusWaiting",
        GET_SEATTYPEALL : "/reservation/getSeatTypeAll",
        GET_BYUSERID_WAITING : "/reservation/getRevByUserIdStatusWaiting",
        GETALL_REASON_CANCEL : "/reservation/getReasonCancelAll",
        CHECK_MAXIMUM_CANCELREV : "/reservation/checkMaximumCancelRev",
        GETALL_REV_BYUSERID : "/reservation/getAllRevByUserId",
        GETALL_REV : "/reservation/getRevAll",
        SAVE_REV : "/reservation/saveRev",
        UPDATE_REV : "/reservation/updateRev",
    },REPORT:{
      DOWNLOAD_EXCEL_RESERVATION : "/report/reservation/download/excel",
  }
};
