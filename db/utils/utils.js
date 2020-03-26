exports.formatAnswerDates = list => {
  /* This utility function should be able to take an array (`list`) of objects and return a new array. 
  Each item in the new array must have its timestamp converted into a Javascript date object. Everything else in each item must be maintained.
   */
  const formatDates = list.map(obj => {
    const copyObj = { ...obj };
    copyObj.timePosted = new Date(copyObj.timePosted * 1000);
    return copyObj;
  });
  return formatDates;
};

exports.formatQuestionDates = list => {
  const formatDates = list.map(obj => {
    const copyObj = { ...obj };
    copyObj.startTime = new Date(copyObj.startTime * 1000);
    return copyObj;
  });
  return formatDates;
};

exports.questionRefObj = list => {
  const newObj = {};
  list.forEach(data => {
    newObj[data.question] = data.question_id;
  });
  return newObj;
};

exports.answerFormatter = (list, questionRef) => {
  const newAnswer = [];
  list.forEach(data => {
    const duplicate = { ...data };
    duplicate.question_id = questionRef[duplicate.question];
    delete duplicate.question;
    newAnswer.push(duplicate);
  });
  return newAnswer;
};
