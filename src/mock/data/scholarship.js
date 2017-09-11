import Mock from 'mockjs';

const Scholarships = [];

for (let i = 0; i < 86; i++) {
    Scholarships.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.ctitle(5,10),
        'money|100-10000.2': 1.23,
        type: Mock.Random.integer(1, 2),
        level: '一等奖',
        number: Mock.Random.integer(1, 10),
        restNum: Mock.Random.integer(1, 10),
        usedNum: Mock.Random.integer(1, 10),
        availableNum : Mock.Random.integer(1, 10),
        studentStartDate: Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss'),
        studentEndDate: Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss'),
        collegeEndDate: Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss'),
  }));
}

const ScholarshipTemplates = [];

for (let i = 0; i < 86; i++) {
    ScholarshipTemplates.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.ctitle(5,10)
    }));
}

const ScholarshipForApply = [];

for (let i = 0; i < 86; i++) {
    ScholarshipForApply.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.ctitle(5,10),
        level: '一等奖',
        applyStatus: Mock.Random.integer(0, 3),
        fileStatus: Mock.Random.integer(0, 3),
        awardStatus: Mock.Random.integer(0, 3),
        studentEndDate: Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss')
    }));
}

export {Scholarships, ScholarshipTemplates,ScholarshipForApply };
