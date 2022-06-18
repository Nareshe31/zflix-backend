const express = require("express");
const router = express.Router();
const TorrentSearchApi = require("torrent-search-api");
TorrentSearchApi.enablePublicProviders("Yts",
"1337x",
"Eztv",
"KickassTorrents",
"Limetorrents",
"Rarbg",
"ThePirateBay",
"TorrentProject",
"Torrentz2");
const axios = require("axios");
const cheerio = require("cheerio");


const providers = [
  "Yts"
];
const providers2 = [
  "Yts",
  "1337x",
  "Eztv",
  "KickassTorrents",
  "Limetorrents",
  "Rarbg",
  "ThePirateBay",
  "TorrentProject",
  "Torrentz2",
];
// "1337x",
//   "Eztv",
//   "KickassTorrents",
//   "Limetorrents",
//   "Rarbg",
//   "ThePirateBay",
//   "TorrentProject",
//   "Torrentz2",

// let TorrentSearch = require('torrent-search')
// const ts = new TorrentSearch()

// let imdbID = 'tt123456'
// let title = 'Deadpool'

// router.get('/search-t',(req,res,next)=>{
//   try{
//     ts.getTorrents(imdbID, title, 'movies' || 'series').then(torrents => {
//     res.send(torrents)
// }).catch(err => next(err))
//   }
//   catch(error){
    
//   }
// })

// console.log(providersl)

async function getTorrents(query, page) {
  try {
    const { data } = await axios.get(
      `https://bitsearch.to/search?q=${query}&page=${page}`
    );
    const $ = cheerio.load(data);
    var torrents = { result: [] };
    $(".w3-bar .w3-bar-item b").each((index, el) => {
      if (index == 0) {
        torrents.total_results = $(el).text();
        torrents.total_pages = Math.ceil(Number($(el).text()) / 20);
      }
    });
    $(".info .title ").each((index, el) => {
      torrents.result.push({
        title: $(el)
          .text()
          .toString()
          .trim()
      });
    });
    $(".search-result > .info > div > .stats ").each((indexParent, ele) => {
      $(ele)
        .children()
        .each((index, el) => {
          switch (index) {
            case 0:
              torrents.result[Math.floor(indexParent)].downloads = $(el).text();
              break;
            case 1:
              torrents.result[Math.floor(indexParent)].size = $(el).text();
              break;
            case 2:
              torrents.result[Math.floor(indexParent)].seeds = $(el)
                .text()
                .toString()
                .trim();
              break;
            case 3:
              torrents.result[Math.floor(indexParent)].peers = $(el)
                .text()
                .toString()
                .trim();
              break;
            case 4:
              torrents.result[Math.floor(indexParent)].date = $(el).text();
              break;

            default:
              break;
          }
        });
    });
    $(".dl-torrent").each((index, el) => {
      torrents.result[index].torrent = $(el).attr("href");
    });
    $(".dl-magnet").each((index, el) => {
      torrents.result[index].magnet = $(el).attr("href");
    });
    torrents.response = true;
    return torrents;
  } catch (error) {
    throw new Error("Cannot find torrents "+error.message);
  }
}

router.get("/torrent/movie/:query", async (req, res, next) => {
  try {
    let result = await TorrentSearchApi.search(
      providers,
      req.params.query,
      "Movies",
      500
    );
    res.json({
      result: result,
      total_results: result.length,
      url: "https://yts.unblockit.biz/torrent/download/"
    });
  } catch (error) {
    next(error);
  }
});

router.get("/torrent/tv/:query", async (req, res, next) => {
  try {
    let result = await TorrentSearchApi.search(
      providers2,
      req.params.query,
      "TV",
      500
    );
    res.json({
      result: result,
      total_results: result.length,
      url: "https://yts.unblockit.biz/torrent/download/"
    });
  } catch (error) {
    next(error);
  }
});

router.get("/torrent/all/:query", async (req, res, next) => {
  try {
    let result = await TorrentSearchApi.search(
      providers2,
      req.params.query,
      "All"
    );
    res.json({
      result: result,
      total_results: result.length,
      url: "https://yts.unblockit.biz/torrent/download/"
    });
  } catch (error) {
    next(error);
  }
});

router.post("/torrent/all", async (req, res, next) => {
  try {
    let page=req.body.page?req.body.page:1
    let result = await TorrentSearchApi.search(
      req.body.providers,
      req.body.query,
      "All",
      page*20
    );
    res.json({
      result: result.slice((page-1)*20,page*20),
      total_results: result.length,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/torrent", async (req, res, next) => {
  try {
    TorrentSearchApi.enablePublicProviders(
      "Yts",
      "1337x",
      "Eztv",
      "KickassTorrents",
      "Limetorrents",
      "Rarbg",
      "ThePirateBay",
      "TorrentProject",
      "Torrentz2");
      let {providers,query,type}=req.body
      if (!(providers && query && type )) {
          let error=new Error("Parameters are required")
          throw error
      }
      let result = await TorrentSearchApi.search(
          providers,
          query,
          type
      );
      res.json({
          results: result,
          total_results: result.length,
          query:query
      });
  } catch (error) {
    next(error);
  }
});


router.get("/torrent-providers",async(req,res,next)=>{
  try {
    let providers = TorrentSearchApi.getActiveProviders();
    res.send({results:providers,total_results:providers.length})
  } catch (error) {
    next(error)
  }
})

router.get("/torrent/search/:query/:page", async (req, res, next) => {
  try {
    const torrents = await getTorrents(req.params.query, req.params.page);
    res.json(torrents);
  } catch (error) {
    next(error);
  }
});

router.get("/torrent-search", async (req, res, next) => {
  try {
    const torrents = await getTorrents(
      req.query.query,
      req.query.page ? req.query.page : 1
    );
    // res.json(torrents)
    if (req.query.query)
      res.render("index", {
        ...torrents,
        query: req.query.query,
        page: req.query.page
      });
    else res.render("torrent-search");
  } catch (error) {
    next(error);
  }
});

router.get("/torrent/search/:query", async (req, res, next) => {
  try {
    const torrents = await getTorrents(req.params.query, 1);
    res.json(torrents);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
