import React, { useState } from "react"
import { Menu, Button } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"
import { Link } from "react-router-dom"
import { useStore } from "react-hookstore"

const Header = () => {
  const [activeItem, setActiveItem] = useState(null)
  const [user] = useStore("userStore")

  const handleItemClick = (e, { name }) => {
    setActiveItem(name)
  }
  return (
    <Menu className="mainHeader" size="massive" stackable borderless attached>
      <Menu.Item as={Link} to="/" name="Home" active={activeItem === "Home"}>
        PRKL
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/courses"
        name="Courses"
        active={activeItem === "Courses"}
        onClick={handleItemClick}
      >
        <FormattedMessage id="header.courses"></FormattedMessage>
      </Menu.Item>

      {user && user.role === 3 ? (
        <Menu.Item
          as={Link}
          to="/addcourse"
          name="AddCourse"
          active={activeItem === "AddCourse"}
          onClick={handleItemClick}
        >
          <FormattedMessage id="header.addCourse"></FormattedMessage>
        </Menu.Item>
      ) : null}

      <Menu.Item
        as={Link}
        to="/user"
        name="personalInfo"
        active={activeItem === "personalInfo"}
        onClick={handleItemClick}
      >
        <FormattedMessage id="header.personalInfo"></FormattedMessage>
      </Menu.Item>

      <Menu.Item position="right">
        <Button>
          <FormattedMessage id="header.logout"></FormattedMessage>
        </Button>
      </Menu.Item>
    </Menu>
  )
}
export default Header
