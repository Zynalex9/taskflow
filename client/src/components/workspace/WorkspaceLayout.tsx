import { Outlet } from 'react-router-dom'

const WorkspaceLayout = () => {
  return (
    <div>
      <h1>This is side bar</h1>
      <Outlet/>
    </div>
  )
}

export default WorkspaceLayout
