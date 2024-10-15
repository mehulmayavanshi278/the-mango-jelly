const express = require("express");
const { comicController } = require("../controller/comicController");
const comicSchema = require("../config/validation");
const { validate } = require('../middlewares/validate');
const router = express.Router();


const validateComic = (req, res, next) => {
    const { error } = comicSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  };

router.get("/", comicController.getAllComics);    
router.get("/:id", comicController.getComicById);
router.post("/create", validateComic ,comicController.createComic);
router.post("/update/:id", validateComic , comicController.updateComic);
router.post("/delete/:id", comicController.deleteComic);

module.exports.comicRouter = router;
