import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

const LoggedInLayout = () => {
  return (
    <div>
      <Topbar/>
      <Outlet/>
    </div>
  )
}

export default LoggedInLayout
