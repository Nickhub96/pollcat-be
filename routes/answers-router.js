const answersRouter = require("express").Router();
const {
  postAnswer,
  getAnswersForQuest,
  getAnswersByLocation
} = require("../controllers/answers-controller");

answersRouter
  .route("/")
  .get(getAnswersByLocation)
  .post(postAnswer);
answersRouter.route("/:question_id").get(getAnswersForQuest);

module.exports = answersRouter;
