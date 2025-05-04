import { useSelector } from "react-redux"
import { RootState } from "../../store/store"


const Dashboard = () => {
  const {user} = useSelector((state:RootState)=>state.auth)

    return (
    <div>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt quos fugit quidem animi doloremque alias, ipsam similique, voluptates quis velit voluptate unde quia aspernatur sapiente cupiditate id beatae quae temporibus!
      {user?.email}
    </div>
  )
}

export default Dashboard
