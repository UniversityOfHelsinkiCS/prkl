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
          deleted
        }
      }
      groups {
        id
        students {
          id
          firstname
          lastname
          email
        }
        course {
          id
          title
          code
          deleted
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
    courseRegistrations(courseId: $courseId) {
      id
      student {
        firstname
        lastname
        studentNo
        email
      }
      questionAnswers {
        question {
          content
          order
          questionType
          questionChoices {
            content
            order
          }
        }
        id
        content
        answerChoices {
          id
          content
          order
        }
      }
    }
  }
`;

export const COURSE_GROUPS = gql`
  query courseGroups($courseId: String!) {
    courseGroups(courseId: $courseId) {
      id
      courseId
      students {
        id
        firstname
        lastname
        studentNo
        email
      }
    }
  }
`;

export const GENERATE_GROUPS = gql`
  mutation createGroups($data: GroupListInput!) {
    createGroups(data: $data) {
      id
      courseId
      students {
        id
        firstname
        lastname
      }
    }
  }
`;

export const EDIT_MIN_MAX_COURSE = gql`
  mutation editMinMaxCourse($id: String!, $min: Float!, $max: Float!) {
    editMinMaxCourse(id: $id, min: $min, max: $max) {
      id
      title
      maxGroupSize
      minGroupSize
    }
  }
`;
