
import { React, useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../css/registerform.css';
export default function Register() {

    const getRegister = JSON.parse(localStorage.getItem("userRegister"));


    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState(
        {
            userFullname: "",
            userEmail: "",
            userPassword: ""
        }
    );
    const [errors, setError] = useState([]);


    const stopFIrst = useRef(true);
    useEffect(() => {

        if (stopFIrst.current === true) {
            stopFIrst.current = false;
            return;
        }
        else {

            if (registerData['userFullname'].trim() !== "" || registerData['userEmail'].trim() !== "" || registerData.userPassword.trim() !== "") {
                setError((c) => {
                    const { field_email_empty, ...rest } = c;
                    return rest;
                })
                setError((c) => {
                    const { field_password_empty, ...rest } = c;
                    return rest;
                })
                setError((c) => {
                    const { field_username_empty, ...rest } = c;
                    return rest;
                })
            }
        }
    }, [registerData])

    const handleSubmit = (e) => {

        if (registerData.length === 0 || registerData['userFullname'].trim() === "" || registerData['userEmail'].trim() === "" || registerData.userPassword.trim() === "") {
            setError({ ...errors, field_email_empty: "Please Fill Email", field_password_empty: "Please Fill Password", field_username_empty: "Please Fill Username" });
            e.preventDefault();
        }
        else {
            if (Object.keys(errors).length > 0) {
                e.preventDefault();
            }
            else {
                setLocaleStorage();

            }
        }


    }
    console.log(errors.length)

    const setLocaleStorage = () => {

        if (getRegister !== null) {
            getRegister.push(registerData);
            localStorage.setItem("userRegister", JSON.stringify(getRegister));
            navigate('/login');
        }
        else {
            localStorage.setItem("userRegister", JSON.stringify([registerData]));
            navigate('/login');

        }
    }


    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        const regex_psw = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
        switch (name) {
            case 'userEmail':
                if (!regex.test(value)) {
                    setError({ ...errors, email_wrong: 'Email is not valid' })
                }
                else {
                    setError((c) => {
                        const { email_wrong, ...rest } = c;
                        return rest;
                    });
                    getRegister.map(({ userEmail }) => {
                        if (value === userEmail) {
                            setError({ ...errors, email_wrong: 'This Email is already exist' })
                        }
                        return 0;
                    })

                }
                break;

            case 'userPassword':
                console.log(value);
                if (!regex_psw.test(value)) {
                    setError({ ...errors, password_wrong: 'Password must be Minimum eight characters, at least one Capital and Small letter, one number and one special character' })
                }
                else {
                    setError((c) => {
                        const { password_wrong, ...rest } = c
                        return rest;
                    })
                }
                break;
            default:

                break;

        }


        setRegisterData({ ...registerData, [name]: value });
    }

    return (
        <div className='form_container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Fullname :</label>
                    <input type="text" name='userFullname' class="form-control" onChange={handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Fullname' />
                    <div><span className='error_msg '>{errors.field_username_empty}</span></div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address :</label>
                    <input type="text" name='userEmail' className="form-control" onChange={handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='test@gmail.com' />
                    <span className='error_msg '>{errors.email_wrong}</span>
                    <div><span className='error_msg'>{errors.field_email_empty}</span></div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password :</label>
                    <input type="password" name='userPassword' className="form-control error_msg" onChange={handleChange} id="exampleInputPassword1" placeholder='password' />
                    <span className='error_msg mb-3'>{errors.password_wrong}</span>
                    <div><span className='error_msg'>{errors.field_password_empty}</span></div>

                </div>
                <button type="submit" class="my-2 btn btn-primary">Submit</button>
            </form>
            <span>Already Register </span><Link to={'/login'}> Click For Login</Link>

        </div>
    )
}
