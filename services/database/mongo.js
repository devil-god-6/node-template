const mongoose = require('mongoose');

class MongoDB {
    #connection;

    #connectionUrl;

    /**
     * this method is used for connect service with mongo server thread
     * @param {String} connectionUrl optional, if you want connect with second database, you can
     * @returns mongoose connection instance
     */
    async connect(connectionUrl = process.env.MONGO_CONNECTION_URL) {
        try {
            if (!this.#connectionUrl) {
                this.#connectionUrl = connectionUrl;
            }

            await mongoose.connect(this.#connectionUrl);
            console.info('Mongodb connected !!');

            mongoose.connection.on('error', (err) => {
                console.error('Mongodb database connection broken for process exit');
                console.error(err);
                process.exit(1);
            });

            this.#connection = mongoose.connection;
            return this.#connection;
        } catch (error) {
            console.error('Error during mongo db connection');
            console.error(error);
            process.exit(1);
        }
    }

    /**
     * this method is used to get mongoose connection instance
     * @returns mongoose connection instance
     */
    async getConnection() {
        if (!this.#connection) {
            this.#connection = await this.connect(this.#connectionUrl);
        }
        return this.#connection;
    }
}

const mongoDbInstance = new MongoDB();
module.exports = mongoDbInstance;
