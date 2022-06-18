const db = require("../connection.js");
let model = {};

function getFullDate() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();
    return date + "-" + month + "-" + year;
}

model.addPageRequest = async (data) => {
    let pageRequestModel = await db.getPageRequestInfoCollection();
    let dailyPageRequestModel = await db.getDailyPageRequestCollection();
    let res = await pageRequestModel.insertMany([data]);
    if (res) {
        // let d = getFullDate();
        // let res1 = await dailyPageRequestModel.findOne({ date: d });
        // if (res1) {
        //     let resupdate = await dailyPageRequestModel.findByIdAndUpdate(res1._id, {
        //         $push: { requests: res[0]._id },
        //         $inc: { total_requests: 1 },
        //     });
        //     console.log('====================================');
        //     console.log("12",resupdate);
        //     console.log('====================================');
        // } else {
        //     let resadd = await dailyPageRequestModel.insertMany([
        //         { date: d, requests: [res[0]._id], total_requests: 1 },
        //     ]);
        //     console.log('====================================');
        //     console.log(resadd);
        //     console.log('====================================');
        // }
        return res;
    }
    return null;
};

module.exports = model;
