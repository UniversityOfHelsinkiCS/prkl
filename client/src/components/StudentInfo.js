import React, { useState } from "react"
import { FormattedMessage } from "react-intl"

const StudentInfo = () => {
  const [user, setUser] = useState({
    username: "TestU",
    name: "Test User",
    studentNo: 123456789,
    email: "test@user.com"
  })
  return (
    <div>
      <h3>
        <FormattedMessage id="studentInfo.header"></FormattedMessage>
      </h3>
      <div>
        <FormattedMessage
          id="studentInfo.fullname"
          values={{ fullname: user.name }}
        ></FormattedMessage>
      </div>
      <div>
        <FormattedMessage
          id="studentInfo.username"
          values={{ username: user.username }}
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
    </div>
  )
}
export default StudentInfo
