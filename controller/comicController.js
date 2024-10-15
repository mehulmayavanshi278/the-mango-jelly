const { comicServices } = require("../Services/comicServices");

class ComicController {
  getAllComics = async (req, res) => {
    try {
      const { page = 1, limit = 10, sort, author, year, price, condition } = req.query;

      const filter = {};
      if (author) filter.authorName = author;
      if (year) filter.yearOfPublication = year;
      if (price) filter.price = { $lte: price }; 
      if (condition) filter.condition = condition;

      const options = {
        sort: sort ? { [sort]: 1 } : {},
        page: parseInt(page), 
        limit: parseInt(limit), 
      };
      console.log(options);
      const comics = await comicServices.findWithPaginationAndSorting(filter, options);

      return res.status(200).json({
        total: comics.length,
        page: options.page,
        limit: options.limit,
        data: comics,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching comics." });
    }
  };

  getComicById = async (req, res) => {
    try {
      const comic = await comicServices.findById(req.params.id);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found." });
      }
      return res.status(200).json(comic);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching comic." });
    }
  };

  createComic = async (req, res) => {
    try {
      const comic = await comicServices.create(req.body);
      return res.status(201).json(comic);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error creating comic." });
    }
  };

  updateComic = async (req, res) => {
    try {
      const comic = await comicServices.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!comic) {
        return res.status(404).json({ message: "Comic not found." });
      }
      return res.status(200).json(comic);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error updating comic." });
    }
  };

  deleteComic = async (req, res) => {
    try {
      const comic = await comicServices.findByIdAndDelete(req.params.id);
      if (!comic) {
        return res.status(404).json({ message: "Comic not found." });
      }
      return res.status(204).send({message:'Deleted successfully'});
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error deleting comic." });
    }
  };
}

module.exports.comicController = new ComicController();
