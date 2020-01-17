import React, { useState } from "react"
import { Menu } from "semantic-ui-react"

const Header = () => {
  const [activeItem, setActiveItem] = useState(null)

  const handleItemClick = (e, { name }) => setActiveItem(name)
  return (
    <Menu
      className="mainHeader"
      size="massive"
      stackable
      borderless
      color="blue"
      inverted
      attached
    >
      <Menu.Item>PRKL</Menu.Item>

      <Menu.Item
        name="features"
        active={activeItem === "features"}
        onClick={handleItemClick}
      >
        Features
      </Menu.Item>

      <Menu.Item
        name="Courses"
        active={activeItem === "Courses"}
        onClick={handleItemClick}
      >
        Courses
      </Menu.Item>

      <Menu.Item
        position="right"
        name="sign-in"
        active={activeItem === "sign-in"}
        onClick={handleItemClick}
      >
        Sign-in
      </Menu.Item>
    </Menu>
  )
}
export default Header
