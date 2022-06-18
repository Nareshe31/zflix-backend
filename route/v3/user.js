const express = require("express");
const router = express.Router();
const service = require("../../service/v3/auth.js");

router.get("/search/:name", async (req, res, next) => {
    try {
        let response = await service.searchUser(req.params.name);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.get("/user-details", async (req, res, next) => {
    try {
        let token=req.headers?.authorization?.split(' ')[1]
        let response = await service.getUser(token);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/add-to-watchlist", async (req, res, next) => {
    try {
        let response = await service.addToWatchlist(req.body);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/remove-from-watchlist", async (req, res, next) => {
    try {
        let response = await service.removeFromWatchlist(req.body);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/remove-multiple-from-watchlist", async (req, res, next) => {
    try {
        let response = await service.removeMultipleFromWatchlist(req.body);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/add-to-search", async (req, res, next) => {
    try {
        let response = await service.addToSearch(req.body);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/add-to-recent-searched-movie", async (req, res, next) => {
    try {
        let response = await service.addToRecentMovie(
            req.body,
            "recently_searched_movie"
        );
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/add-to-recent-watched-movie", async (req, res, next) => {
    try {
        let response = await service.addToRecentMovie(
            req.body,
            "recently_watched_movie"
        );
        res.send(response);
    } catch (error) {
        next(error);
    }
});

//List
router.post("/create-list", async (req, res, next) => {
    try {
        let response = await service.createList(req.body);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

router.post("/add-to-list", async (req, res, next) => {
    try {
        let response = await service.addToList(req.body);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;