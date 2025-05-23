import NavBar from './Navbar/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer/Footer'
import ScrollToTop from './ScrollToTop'

const LandingLayout = () => {
  return (
    <>
    <ScrollToTop/>
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow mt-2 lg:mt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
    </>
  )
}

export default LandingLayout
