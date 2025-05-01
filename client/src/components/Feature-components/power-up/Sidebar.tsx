import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div>
      Hola Amigo
      <Link to="/feature/power-ups">A</Link>
      <Link to="/feature/power-ups/automation">B</Link>
      <Link to="/feature/power-ups/abc">C</Link>
      <Link to="/feature/power-ups/abC2">D</Link>
    </div>
  )
}

export default Sidebar

