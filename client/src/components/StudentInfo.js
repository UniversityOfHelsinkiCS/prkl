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
        <FormattedMessage id="StudentInfo.header"></FormattedMessage>
      </h3>
      <div>
        <FormattedMessage
          id="StudentInfo.fullname"
          values={{ fullname: user.name }}
        ></FormattedMessage>
      </div>
      <div>
        <FormattedMessage
          id="StudentInfo.username"
          values={{ username: user.username }}
        ></FormattedMessage>
      </div>
      <div>
        <FormattedMessage
          id="StudentInfo.studentNo"
          values={{ studentNo: user.studentNo }}
        ></FormattedMessage>
      </div>
      <div>
        <FormattedMessage
          id="StudentInfo.email"
          values={{ email: user.email }}
        ></FormattedMessage>
      </div>
    </div>
  )
}
export default StudentInfo
