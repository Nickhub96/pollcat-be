const connection = require("../db/connection");

exports.selectQuestions = ({ order, questionStatus }) => {
  return connection("questions")
    .select("questions.*")
    .orderBy("startTime", order || "desc")
    .modify(query => {
      if (questionStatus) query.where({ questionStatus });
    })
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return res;
      }
    });
};

exports.selectQuestionById = ({ question_id }) => {
  return connection("questions")
    .select("questions.*")
    .where("questions.question_id", question_id)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return res;
      }
    });
};

exports.updateQuestionById = (
  { question_id },
  { question, questionStatus, img, answerArray }
) => {
  return connection("questions")
    .where("questions.question_id", question_id)
    .update({ question, questionStatus, img, answerArray })
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return res;
      }
    });
};

exports.removeQuestionById = ({ question_id }) => {
  return connection("questions")
    .where("questions.question_id", question_id)
    .del()
    .then(res => {
      if (res === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return true;
      }
    });
};

exports.insertQuestion = ({
  question,
  startTime,
  img,
  questionStatus,
  answerArray
}) => {
  return connection("questions")
    .insert({
      question,
      startTime,
      img,
      questionStatus,
      answerArray
    })
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else return res[0];
    });
};

exports.selectAnswersByQID = ({ question_id }, { userUid }) => {
  return connection("answers")
    .select("answers.*")
    .from("answers")
    .where("answers.question_id", question_id)
    .modify(function(query) {
      if (userUid) query.where("answers.userUid", userUid);
    })
    .then(res => {
      if (res.length === 0 && question_id) {
        return exports.emptyArrayIfQuestionExists(question_id);
      } else {
        return res;
      }
    });
};

exports.emptyArrayIfQuestionExists = question_id => {
  return connection("answers")
    .select("*")
    .where("answers.question_id", question_id)
    .then(res => {
      return [{}];
    });
};
