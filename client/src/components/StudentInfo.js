import React, { useState } from "react"

const StudentInfo = () => {
  const [user, setUser] = useState({
    username: "TestU",
    name: "Test User",
    studentNo: 123456789,
    email: "test@user.com"
  })
  return (
    <div>
      <div></div>
    </div>
  )
}
export default StudentInfo
