
import { React, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import '../css/registerform.css';
import { setItem } from '../../requests/localstorage';


export default function Registerform() {
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const getRegister = JSON.parse(localStorage.getItem("userRegister"));

    const validationSchema = yup.object({
        userFullname: yup.string().required('Please Fill Fullname'),
        userEmail: yup.string().required('Please Fill Email').matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Entered Email Format is not valid'),
        userPassword: yup.string().required('Please Fill Password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must be Minimum eight characters, at least one Capital and Small letter, one number and one special character')
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        reValidateMode: 'onSubmit'
    });



    // const stopFIrst = useRef(true);
    const submit = (data) => {

        if (getRegister !== null) {
            for (let key in getRegister) {
                if (getRegister[key].userEmail === data.userEmail) {
                    setError({ email_exists: "This email is already exist" })
                    break;
                }
                else {
                    setError((c) => {
                        const { email_exists, ...rest } = c;
                        return rest;
                    })
                    if (getRegister !== null) {
                        getRegister.push(data);
                        setItem("userRegister", getRegister);
                        navigate('/login');
                    }
                    else {
                        setItem("userRegister", [data]);
                        navigate('/login');

                    }
                }
            }
        }
        else {
            setItem("userRegister", [data]);
            navigate('/login');

        }

    }





    return (
        <div className='form_container'>
            <form onSubmit={handleSubmit(submit)}>
                <div className="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Fullname :</label>
                    <input {...register('userFullname')} type="text" name='userFullname' class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Fullname' />
                    <div><span className='error_msg '>{errors.userFullname?.message}</span></div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address :</label>
                    <input {...register('userEmail')} type="text" name='userEmail' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='test@gmail.com' />
                    {/* <span className='error_msg '>{errors.email_wrong}</span> */}
                    <div><span className='error_msg'>{errors.userEmail?.message}</span></div>
                    <div><span className='error_msg'>{error.email_exists}</span></div>

                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password :</label>
                    <input {...register('userPassword')} type="password" name='userPassword' className="form-control error_msg" id="exampleInputPassword1" placeholder='password' />
                    {/* <span className='error_msg mb-3'>{errors.password_wrong}</span> */}
                    <div><span className='error_msg'>{errors.userPassword?.message}</span></div>
                </div>
                <button type="submit" class="my-2 btn btn-primary">Submit</button>
            </form>
            <span>Already Register </span><Link to={'/login'}> Click For Login</Link>

        </div>
    )
}
