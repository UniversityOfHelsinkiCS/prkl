import { gql } from 'apollo-boost';

export const ALL_COURSES = gql`
  {
    courses {
      id
      title
      code
      maxGroupSize
      minGroupSize
      description
      deadline
      published
      teachers {
        id
        firstname
        lastname
        email
      }
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
      shibbolethUid
    }
  }
`;

export const FACULTY_USERS = gql`
  {
    facultyUsers {
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
        groupName
        groupMessage
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
      published
      groupsPublished
      questions {
        id
        content
        questionType
        optional
        useInGroupCreation
        questionChoices {
          content
          order
          id
        }
        order
      }
      teachers {
        id
        firstname
        lastname
        studentNo
        email
        role
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
      groupsPublished
      teachers {
        id
      }
    }
  }
`;

export const PUBLISH_COURSE_GROUPS = gql`
  mutation publishCourseGroups($id: String!) {
    publishCourseGroups(id: $id)
  }
`;

export const UPDATE_COURSE = gql`
  mutation updateCourse($id: String!, $data: CourseInput!) {
    updateCourse(id: $id, data: $data) {
      id
      maxGroupSize
      minGroupSize
      title
      description
      code
      deadline
      published
      groupsPublished
      teachers {
        id
      }
      questions {
        id
        content
        questionType
        optional
        useInGroupCreation
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

export const DELETE_REGISTRATION = gql`
  mutation deleteRegistration($studentId: String!, $courseId: String!) {
    deleteRegistration(studentId: $studentId, courseId: $courseId)
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
        id
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
      groupName
      groupMessage
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
  mutation createSampleGroups($data: GenerateGroupsInput!) {
    createSampleGroups(data: $data) {
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

export const FIND_GROUP_FOR_GROUPLESS_STUDENTS = gql`
  mutation findGroupForGrouplessStudents(
    $data: GroupListInput!
    $maxGroupSize: Float!
    $groupless: GroupListInput!
  ) {
    findGroupForGrouplessStudents(data: $data, maxGroupSize: $maxGroupSize, groupless: $groupless) {
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

export const SAVE_GROUPS = gql`
  mutation saveGeneratedGroups($data: GroupListInput!) {
    saveGeneratedGroups(data: $data) {
      courseId
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
