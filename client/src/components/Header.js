import React, { useState } from "react"
import { Menu, Button } from "semantic-ui-react"
import { FormattedMessage } from "react-intl"

const Header = () => {
  const [activeItem, setActiveItem] = useState(null)

  const handleItemClick = (e, { name }) => setActiveItem(name)
  return (
    <Menu className="mainHeader" size="massive" stackable borderless attached>
      <Menu.Item>PRKL</Menu.Item>

      <Menu.Item
        name="Courses"
        active={activeItem === "Courses"}
        onClick={handleItemClick}
      >
        <FormattedMessage id="Header.courses"></FormattedMessage>
      </Menu.Item>

      <Menu.Item
        name="personalInfo"
        active={activeItem === "personalInfo"}
        onClick={handleItemClick}
      >
        <FormattedMessage id="menu.personalInfo"></FormattedMessage>
      </Menu.Item>

      <Menu.Item position="right">
        <Button>
          <FormattedMessage id="Header.logout"></FormattedMessage>
        </Button>
      </Menu.Item>
    </Menu>
  )
}
export default Header
