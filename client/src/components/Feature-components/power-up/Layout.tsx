import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className='w-full bg-[#1D2125] min-h-screen flex text-white font-charlie-text-r'>
      <div className="w-[20%] p-4">
        <Sidebar/>
      </div>
      <div className="w-[80%] p-4">
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
