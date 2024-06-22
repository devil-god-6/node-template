const fsAsync = require('fs/promises');

module.exports = {
  // /**
  //  * this function is used for create directory if not exists
  //  * @param {String} path
  //  * @param {Boolean} exitOnError it decided whether you want to exit process on error or not
  //  * @returns {Boolean}
  //  */
  async createdDirectoryIfNotExists(path, exitOnError = false) {
    if (path) {
      try {
        await fsAsync.access(path);
        return true;
      } catch (error) {
        try {
          await fsAsync.mkdir(path, { recursive: true });
          return true;
        } catch (err) {
          console.error(`Error while create directory - ${path}`);
          console.error(err);
          if (exitOnError) {
            process.exit(1);
          }
          return false;
        }
      }
    }
    return false;
  },
};
