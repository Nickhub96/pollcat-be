const connection = require("../db/connection");
const { emptyArrayIfQuestionsExists } = require("../models/questions-model");

exports.insertAnswer = ({
  question_id,
  userUid,
  answerIndex,
  townName,
  countyName
}) => {
  return connection("answers")
    .insert({
      question_id,
      userUid,
      answerIndex,
      townName,
      countyName
    })
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else return res[0];
    });
};

exports.selectAnswers = ({ question_id }, { answerIndex }) => {
  return connection("answers")
    .select("answers.*")
    .from("answers")
    .where("answers.question_id", question_id)
    .modify(function(query) {
      if (answerIndex) query.where("answers.answerIndex", answerIndex);
    })
    .then(res => {
      if (res.length === 0 && question_id) {
        return emptyArrayIfQuestionsExists(question_id);
      } else {
        return res;
      }
    });
};

exports.selectAnswersByLocation = ({ townName, countyName }) => {
  return connection("answers")
    .select("answers.*")
    .from("answers")
    .modify(function(query) {
      if (townName) query.where("answers.townName", townName);
      if (countyName) query.where("answers.countyName", countyName);
    })
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        console.log(res, "models");
        return res;
      }
    });
};
