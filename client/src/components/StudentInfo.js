import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
import { useStore } from "react-hookstore"

const StudentInfo = ({ userLoading }) => {
  const [user] = useStore("userStore")
  console.log("user:", user)

  return (
    <div>
      <h3>
        <FormattedMessage id="studentInfo.header"></FormattedMessage>
      </h3>
      <div>
        <FormattedMessage
          id="studentInfo.fullname"
          values={{ fullname: `${user.firstname} ${user.lastname}` }}
        ></FormattedMessage>
      </div>

      <div>
        <FormattedMessage
          id="studentInfo.studentNo"
          values={{ studentNo: user.studentNo }}
        ></FormattedMessage>
      </div>
      <div>
        <FormattedMessage
          id="studentInfo.email"
          values={{ email: user.email }}
        ></FormattedMessage>
      </div>
      {user.registrations && !userLoading ?
        <div>
          <h3>
            <FormattedMessage id="studentInfo.course"></FormattedMessage>
          </h3>
          <ul>
            {user.registrations.map(reg =>
              <li key={reg.id}>{reg.course.title} {reg.course.code}</li>)}
          </ul>
        </div> : null
      }
    </div>
  )
}
export default StudentInfo
