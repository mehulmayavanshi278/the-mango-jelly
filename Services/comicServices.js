const { BasicService } = require("./BasicService");
const Comic = require("../models/Comic.model");

class ComicServices extends BasicService {
  constructor() {
    super(Comic);
  }

  async findWithPaginationAndSorting(filter = {}, options = {}) {
    console.log('enter')
    const { page = 1, limit = 10, sort = {} } = options;
    const skip = (page - 1) * limit;

    try {
      const comics = await this.model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const totalCount = await this.model.countDocuments(filter); // Get total count for pagination
      return {
        comics,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      };
    } catch (error) {
      throw new Error(`Failed to fetch comics: ${error.message}`);
    }
  }
}

module.exports.comicServices = new ComicServices();
