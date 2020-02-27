import { gql } from 'apollo-boost';

export const ALL_COURSES = gql`
  {
    courses {
      id
      title
      code
      description
      deadline
    }
  }
`;

export const CURRENT_USER = gql`
  {
    currentUser {
      id
      firstname
      lastname
      email
      studentNo
      role
      registrations {
        id
        course {
          id
          title
          code
        }
      }
    }
  }
`;

export const COURSE_BY_ID = gql`
  query course($id: String!) {
    course(id: $id) {
      id
      maxGroupSize
      minGroupSize
      title
      description
      code
      deadline
      questions {
        id
        content
        questionType
        questionChoices {
          content
          order
          id
        }
        order
      }
    }
  }
`;
export const CREATE_COURSE = gql`
  mutation createCourse($data: CourseInput!) {
    createCourse(data: $data) {
      id
      maxGroupSize
      minGroupSize
      title
      description
      code
      deadline
    }
  }
`;

export const REGISTER_TO_COURSE = gql`
  mutation createRegistration($data: RegistrationInput!) {
    createRegistration(data: $data) {
      id
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation deleteCourse($id: String!) {
    deleteCourse(id: $id)
  }
`;

export const COURSE_REGISTRATION = gql`
query courseRegistrations($courseId: String!) {
  courseRegistrations(courseId: $courseId){
   id
   student{
     firstname
     lastname
     studentNo
   }
   questionAnswers {
    question {
     content
    }
    id
    content
    answerChoices {
     id
     content
    }
   }
  }
 }
`;
