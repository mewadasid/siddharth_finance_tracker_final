export default function Selectcombo({
  name,
  id,
  option,
  onchange,
  classType,
  formValues,
  register,
}) {
  return (
    <select {...register(name)} className={classType} name={name} id={id}>
      {option.map((item, index) => {
        return (
          <option
            defaultValue={formValues === item.value}
            value={item.value}
            key={index}
          >
            {item.key}
          </option>
        );
      })}
    </select>
  );
}
