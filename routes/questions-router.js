const questionsRouter = require("express").Router();
const {
  getQuestions,
  getQuestionById,
  postQuestion,
  patchQuestionById,
  deleteQuestionById,
  getAnswerByQID
} = require("../controllers/questions-controller");

questionsRouter
  .route("/")
  .get(getQuestions)
  .post(postQuestion);

questionsRouter
  .route("/:question_id")
  .get(getQuestionById)
  .patch(patchQuestionById)
  .delete(deleteQuestionById);

questionsRouter.route("/:question_id/answers").get(getAnswerByQID);

module.exports = questionsRouter;
