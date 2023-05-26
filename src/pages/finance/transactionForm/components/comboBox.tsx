import { UseFormRegister } from "react-hook-form";
import { TransactionType } from "../../../../model/transactionInterface";

type ComboType = {
  name: string;
  id: string;
  option: { [key: string]: string }[];
  register: UseFormRegister<TransactionType>;
};

export default function Selectcombo({ name, id, option, register }: ComboType) {
  return (
    <select {...register(name)} name={name} id={id}>
      {option.map((item, index) => {
        return (
          <option value={item.value} key={index}>
            {item.key}
          </option>
        );
      })}
    </select>
  );
}
