process.env.NODE_ENV = "development";

const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const endpoints = require("../endpoints.json");

describe("app", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe("/api", () => {
    it("GET:200 responds with endpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.eql(endpoints);
        });
    });
    describe("/questions", () => {
      it("GET:200 responds with an array of all the questions", () => {
        return request(app)
          .get("/api/questions")
          .expect(200)
          .then(res => {
            expect(res.body.questions).to.be.an("array");
            expect(res.body.questions[0]).to.have.keys(
              "question_id",
              "question",
              "startTime",
              "img",
              "questionStatus",
              "answerArray"
            );
          });
      });
      it("GET:200 responds with an array of all the questions with a questionStatus query", () => {
        return request(app)
          .get("/api/questions?questionStatus=past")
          .expect(200)
          .then(res => {
            const output = res.body.questions.every(question => {
              return question.questionStatus === "past";
            });
            expect(output).to.be.true;
          });
      });
      it("POST:201 responds with the posted question", () => {
        return request(app)
          .post("/api/questions")
          .send({
            question: "new question",
            startTime: new Date(1582110398),
            img: "new_img",
            questionStatus: "future",
            answerArray: ["img1", "img2"]
          })
          .expect(201)
          .then(res => {
            expect(res.body.question).to.be.an("object");
            expect(res.body.question).to.have.keys(
              "question_id",
              "question",
              "startTime",
              "img",
              "questionStatus",
              "answerArray"
            );
            expect(res.body.question.question).to.equal("new question");
            //expect(res.body.question.startTime).to.equal("");
          });
      });
    });
    describe("/:question_id", () => {
      it("GET:200 responds with an object of a single question", () => {
        return request(app)
          .get("/api/questions/2")
          .expect(200)
          .then(res => {
            expect(res.body.question).to.be.an("object");
            expect(res.body.question.question_id).to.equal(2);
            expect(res.body.question).to.have.keys(
              "question_id",
              "question",
              "startTime",
              "img",
              "questionStatus",
              "answerArray"
            );
          });
      });
      it("PATCH:200 responds with the question that has been updated", () => {
        return request(app)
          .patch("/api/questions/3")
          .send({
            question: "KFC or Mcdonalds",
            questionStatus: "past",
            img: "new_img_url",
            answerArray: ["new_pic1", "new_pic2"]
          })
          .expect(200)
          .then(res => {
            expect(res.body.question).to.be.an("object");
            expect(res.body.question.question).to.equal("KFC or Mcdonalds");
            expect(res.body.question.questionStatus).to.equal("past");
            expect(res.body.question.img).to.equal("new_img_url");
            expect(res.body.question.answerArray).to.deep.equal([
              "new_pic1",
              "new_pic2"
            ]);
          });
      });
      it("DELETE:204 deletes a question by id", () => {
        return request(app)
          .delete("/api/questions/3")
          .expect(204);
      });
      describe("/answers", () => {
        it("GET:200 responds with a single answer of a given user", () => {
          return request(app)
            .get(
              "/api/questions/1/answers?userUid=9wYP0SqImSYOlwnWWOXkFPzpFvu1"
            )
            .expect(200)
            .then(res => {
              expect(res.body.answer).to.be.an("object");
              expect(res.body.answer).to.have.keys(
                "answer_id",
                "answerIndex",
                "userUid",
                "question_id",
                "townName",
                "countyName",
                "timePosted"
              );
              expect(res.body.answer.question_id).to.equal(1);
              expect(res.body.answer.userUid).to.equal(
                "9wYP0SqImSYOlwnWWOXkFPzpFvu1"
              );
            });
        });
        it("GET:200 responds with an empty object if the answer does not exist", () => {
          return request(app)
            .get("/api/questions/3/answers?userUid=55")
            .expect(200)
            .then(res => {
              expect(res.body.answer).to.be.an("object");
            });
        });
      });
    });
    describe("/answers", () => {
      it("responds with the posted answer", () => {
        request(app)
          .post("/api/answers")
          .send({
            question_id: 1,
            userUid: "9wYP0SqImSYOlwnWWOXkFPzpFvu4",
            answerIndex: 0,
            townName: "Oldham",
            countyName: "Greater Manchester"
          })
          .expect(201)
          .then(res => {
            // console.log(res.body.answer);
            expect(res.body.answer).to.be.an("object");
            expect(res.body.answer).to.have.keys(
              "question_id",
              "userUid",
              "answerIndex",
              "townName",
              "countyName",
              "answer_id",
              "timePosted"
            );
            expect(res.body.answer.question_id).to.equal(1);
          });
      });
      it.only("responds with an array of all the answers from a given location", () => {
        request(app)
          .get("/api/answers?townName=Oldham&countyName=Greater%20Manchester")
          .expect(200)
          .then(res => {
            const output = res.body.answers.every(answer => {
              return answer.townName === "Oldham";
            });
            expect(output).to.be.true;
            expect(res.body.answers).to.be.an("array");
            expect(res.body.answers[0]).to.have.keys(
              "question_id",
              "userUid",
              "answerIndex",
              "townName",
              "countyName",
              "answer_id",
              "timePosted"
            );
          });
      });
      describe("/:question_id", () => {
        it("return an array of all the answers for that question", () => {
          request(app)
            .get("/api/answers/1")
            .expect(200)
            .then(res => {
              expect(res.body.answers).to.be.an("array");
              expect(res.body.answers[0]).to.have.keys(
                "question_id",
                "userUid",
                "answerIndex",
                "townName",
                "countyName",
                "answer_id",
                "timePosted"
              );
            });
        });
        it("return an array of all the answers for that question filtered by the answer", () => {
          request(app)
            .get("/api/answers/1?answerIndex=0")
            .expect(200)
            .then(res => {
              expect(res.body.answers).to.be.an("array");
              expect(res.body.answers[0]).to.have.keys(
                "question_id",
                "userUid",
                "answerIndex",
                "townName",
                "countyName",
                "answer_id",
                "timePosted"
              );
              const output = res.body.answers.every(answer => {
                return answer.answerIndex === 0;
              });
              expect(output).to.be.true;
            });
        });
      });
    });
  });
});
