import { useAddDescriptionMutation } from "@/store/cardApi";
import React from "react";
import { useForm } from "react-hook-form";

interface IProps {
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>;
  cardId: string;
}
interface IData {
  description: string;
}
const Description: React.FC<IProps> = ({ setShowDescription, cardId }) => {
  const { register, handleSubmit, reset } = useForm<IData>();
  const [addDescription] = useAddDescriptionMutation();
  const onSubmit = async (data: IData) => {
    const body = {
      description: data.description,
      cardId,
    };
    await addDescription(body);
    reset();
    setShowDescription(false);
  };

  return (
    <div className="ml-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="w-full bg-[#0D0F11] text-start p-4 mt-1 rounded-sm font-charlie-display-sm text-textP cursor-pointer"
          autoFocus
          {...register("description")}
        />
        <div>
          <button
            className="m-1 px-3 py-2 bg-fprimary/60 rounded font-charlie-text-r"
            onClick={() => setShowDescription(false)}
          >
            Close
          </button>
          <button
            type="submit"
            className="m-1 px-3 py-2 bg-primary rounded font-charlie-text-r"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Description;
