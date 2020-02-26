const apiRouter = require("express").Router();
const questionsRouter = require("./questions-router");
const { sendApiEndpoints } = require("../controllers/api-controller");
const answersRouter = require("./answers-router");

apiRouter.route("/").get(sendApiEndpoints);
apiRouter.use("/questions", questionsRouter);
apiRouter.use("/answers", answersRouter);

module.exports = apiRouter;
