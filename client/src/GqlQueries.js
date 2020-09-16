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

export const ALL_USERS = gql`
  {
    users {
      id
      firstname
      lastname
      studentNo
      email
      role
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
      published
    }
  }
`;

export const EDIT_USER_ROLE = gql`
  mutation editUserRole($id: String!, $role: Float!) {
    editUserRole(id: $id, role: $role) {
      id
      firstname
      lastname
      studentNo
      email
      role
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
      workingTimes {
        id
        startTime
        endTime
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
        studentNo
        email
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

export const GROUP_TIMES = gql`
  query groupTimes($studentId: String!) {
    groupTimes(studentId: $studentId) {
      id
      students {
        firstname
        registrations {
          studentId
          workingTimes {
            startTime
            endTime
            registrationId
          }
        }
      }
    }
  }
`;
