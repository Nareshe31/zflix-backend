const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const MONGO_URI =process.env.MONGO_URI;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required:true
    },
    password: {
      type: String,
      required:true
    },
    watchlist: [
      {
        data: {
          type: Schema.Types.ObjectId,
          ref: "MovieTv",
        },
        added_at: { type: Date, default: Date.now },
      },
    ],
    recently_watched_movie: [
      {
        movie: {
          type: Schema.Types.ObjectId,
          ref: "MovieTv",
        },
        watched_at: { type: Date, default: Date.now },
      },
    ],
    recently_watched_tv_show: [
      {
        tv: {
          type: Schema.Types.ObjectId,
          ref: "MovieTv",
        },
        season: Number,
        episode: Number,
        watched_at: { type: Date, default: Date.now },
      },
    ],
    recently_searched_movie: [
      {
        movie: {
          type: Schema.Types.ObjectId,
          ref: "MovieTv",
        },
        searched_at: { type: Date, default: Date.now },
      },
    ],
    recently_searched_tv: [
      {
        tv: {
          type: Schema.Types.ObjectId,
          ref: "MovieTv",
        },
        searched_at: { type: Date, default: Date.now },
      },
    ],
    search: [
      {
        keyword: String,
        searched_at: { type: Date, default: Date.now },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    resetToken:{
      type:String
    },
    resetTokenExpire:{
      type:Number
    },
    lastLogin: { type: Date, default: Date.now },
    lastUsed: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "User" }
);

const pageRequestSchema = new Schema({
  url: { type: String },
  requested_at: { type: Date, default: Date.now },
},{ collection: "PageRequestInfo" });

const dailyPageRequestSchema = new Schema({
  date: { type: String },
  total_requests: { type: Number, default: 0 },
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "PageRequestInfo",
    },
  ],
  created_at: { type: Date, default: Date.now },
});

// {
//   "id":"6184b7a8b71477944d122a7a",
//   "watchlist": {
//       "id": 833425,
//       "poster_path": "/5cnLoWq9o5tuLe1Zq4BTX4LwZ2B.jpg",
//       "name": "No Exit",
//       "year": "2022-02-25",
//       "type": "movie"
//   }
// }
const movieTvSchema = new Schema(
  {
    id: {
      type: Number,
    },
    poster_path: {
      type: String,
      default: null,
    },
    name: {
      type: String,
    },
    year: {
      type: String,
    },
    type: {
      type: String,
    },
    overview: {
      type: String,
    },
  },
  { collection: "MovieTv" }
);

const appInfoSchema = new Schema({
  updateAvailable: { type: Boolean },
  version: { type: String },
  url: { type: String },
  new: [{ type: String }],
},{ collection: "AppInfo" });

const listSchema = new Schema({
  title:{type:String},
  desc:{type:String},
  cover_pic:{type:String},
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: "MovieTv",
      },
      added_at: { type: Date, default: Date.now },
    },
  ],
  public: {
    type: Boolean,
    default: true,
  },
  created_by: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
},{ collection: "List" });
let collection = {};

collection.getUserCollection = async () => {
  try {
    return (
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).model("User", userSchema);
  } catch (error) {
    let err = new Error("Cannot connect to mongodb");
    err.status = 400;
    throw err;
  }
};

collection.getMovieTvCollection = async () => {
  try {
    return (
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).model("MovieTv", movieTvSchema);
  } catch (error) {
    let err = new Error("Cannot connect to mongodb");
    err.status = 400;
    throw err;
  }
};

collection.getListCollection = async () => {
  try {
    return (
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).model("List", listSchema);
  } catch (error) {
    let err = new Error("Cannot connect to mongodb");
    err.status = 400;
    throw err;
  }
};

collection.getAppInfoCollection = async () => {
  try {
    return (
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).model("AppInfo", appInfoSchema);
  } catch (error) {
    let err = new Error("Cannot connect to mongodb");
    err.status = 400;
    throw err;
  }
};

collection.getPageRequestInfoCollection = async () => {
  try {
    return (
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).model("PageRequestInfo", pageRequestSchema);
  } catch (error) {
    let err = new Error("Cannot connect to mongodb");
    err.status = 400;
    throw err;
  }
};

collection.getDailyPageRequestCollection = async () => {
  try {
    return (
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).model("DailyPageRequest", pageRequestSchema);
  } catch (error) {
    let err = new Error("Cannot connect to mongodb");
    err.status = 400;
    throw err;
  }
};

// collection.getTvCollection = async () => {
//   try {
//     return (await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     })).model("Tv", tvSchema);
//   } catch (error) {
//     let err = new Error("Cannot connect to mongodb");
//     err.status = 400;
//     throw err;
//   }
// };

module.exports = collection;
