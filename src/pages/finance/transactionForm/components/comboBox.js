export default function Selectcombo({ name, id, option, onchange, classType, formValues }) {
    return (
        <select className={classType} name={name} id={id} onChange={onchange}>
            {option.map((item, index) => {

                return <option selected={formValues === item.value} value={item.value} key={index} >{item.value}</option>
            })
            }
        </select>
    )
}