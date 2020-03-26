const {
  insertAnswer,
  selectAnswers,
  selectAnswersByLocation
} = require("../models/answers-model");

exports.postAnswer = (req, res, next) => {
  insertAnswer(req.body)
    .then(answer => {
      res.status(201).send({ answer });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAnswersForQuest = (req, res, next) => {
  selectAnswers(req.params, req.query)
    .then(answers => {
      res.status(200).send({ answers });
    })
    .catch(err => {
      next(err);
    });
};

exports.getAnswersByLocation = (req, res, next) => {
  selectAnswersByLocation(req.query)
    .then(answers => {
      res.status(200).send({ answers });
    })
    .catch(err => {
      next(err);
    });
};
