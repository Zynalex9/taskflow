import { Plus } from "lucide-react"

const AddList = () => {
  return (
    <div className="font-charlie-display-sm backdrop-blur-3xl  shadow-xl shadow-gray-400 hover:bg-gray-50/30 bg-gray-50/50 w-58 rounded p-2">
      <button className="text-xl flex items-center justify-center gap-3"><span><Plus className="size-4"/></span> Add a list</button>
    </div>
  )
}

export default AddList
