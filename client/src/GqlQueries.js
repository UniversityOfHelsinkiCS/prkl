import { gql } from "apollo-boost"

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
`

export const CURRENT_USER = gql`
  {
    currentUser {
      id
      firstname
      lastname
      email
      studentNo
      role
    }
  }
`

export const COURSE_BY_ID = gql`
  query course($id: String!) {
    course(id: $id) {
      id
      title
      code
      description
      deadline
      maxGroupSize
      minGroupSize
      questions {
        content
      }
    }
  }
`
export const CREATE_COURSE = gql`
  mutation createCourse($data: CourseInput!) {
    createCourse(data: $data) {
      title
      code
      id
      description
      deadline
      maxGroupSize
      minGroupSize
      questions {
        content
      }
    }
  }
`

export const DELETE_COURSE = gql`
  mutation deleteCourse($id: String!) {
    deleteCourse(id: $id)
  }
`
