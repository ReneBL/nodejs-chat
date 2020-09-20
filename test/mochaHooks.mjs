const db = require('../helpers/db');

export const mochaHooks = {
    afterAll(done) {
        db.dropDatabase().then(() => {
            db.closeConnection().then(() => {
                r.close();
                done();
            });
        });
    }
}