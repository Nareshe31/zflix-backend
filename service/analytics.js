const model = require("../model/analytics.js");

let service={}

service.addPageRequest = async (data) => {
    try {
      let info = await model.addPageRequest(data);
      if (info) {
        return { info};
      } else {
          throw Error
      }
    } catch (error) {
      let err = new Error("Cannot find latest version");
      err.status = 400;
      throw err;
    }
  };

  module.exports = service;