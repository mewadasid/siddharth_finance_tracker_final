import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Protected({ Cmp }) {

    const token = localStorage.getItem('loginToken');
    const navigate = useNavigate();
    useEffect(() => {

        if (!token) {
            return navigate('/login')
        }

    }, [])
    return Cmp;

}

