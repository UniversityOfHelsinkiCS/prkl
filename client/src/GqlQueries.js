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
      max_group_size
      min_group_size
      questions {
        name
      }
    }
  }
`
export const CREATE_COURSE = gql`
  mutation createCourse($data: CreateCourseInput) {
    createCourse(data: $data) {
      title
      code
      id
      description
      deadline
      max_group_size
      min_group_size
      questions {
        name
      }
    }
  }
`
