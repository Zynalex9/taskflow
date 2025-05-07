import ChangePassword from "./Edit/ChangePassword";
import UsernameEmail from "./Edit/UsernameEmail";

const EditComp = () => {
 
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <UsernameEmail/>
      <ChangePassword/>
    </div>
  );
};

export default EditComp;
