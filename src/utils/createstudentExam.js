import CourseModel from "../../DB/models/course.model.js";
import studentExamModel from "../../DB/models/studentExams.model.js";

export const createStudentExams = async (userId) => {
  console.log(userId);
  try {
    if (!userId) {
      throw new Error("User Id not sent");
    }

    const addstudentExams = {
      StudentId: userId,
      CoursesExamed: [],
      TotalGpa: 0,
    };
    const result = await studentExamModel.create(addstudentExams);
    if (!result) {
      throw new Error("Failed to create student exams");
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllValidCourses = async (passedCoursesIds) => {
  console.log(passedCoursesIds);
  const newCourses = await CourseModel.find({
    _id: { $nin: passedCoursesIds },
  });
  const validCourses = newCourses.filter((course) => {
    if (!course?.Prerequisites || course.Prerequisites.length === 0) {
      return true;
    } else {
      return course.Prerequisites.every((ele) =>
        passedCoursesIds.toString().includes(ele.toString())
      );
    }
  });

  let validCoursesIds = [];
  for (const course of validCourses) {
    validCoursesIds.push(course._id);
  }

  return { validCoursesIds, validCourses };
};
