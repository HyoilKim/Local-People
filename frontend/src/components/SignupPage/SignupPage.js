import React, {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import firebase from '../../firebase';

function SignupPage() {

    const {register, watch, formState:{errors}, handleSubmit} = useForm({mode: "onChange"});
    const [errorFromSubmit, setErrorFromSubmit] = useState("");
    const [loading, setLoading] = useState(false);

    const password = useRef();
    password.current = watch("password");

    const onSubmit = async (data) => {

        try{
            setLoading(true)
            //firebase에서 이메일과 비밀번호로 유저 생성
            let createdUser = await firebase
                .auth() //auth 접근
                .createUserWithEmailAndPassword(data.email, data.password)
            //firebase에서 생성한 유저에 추가 정보 입력 (위치인증 기능 추가 시 사용 예정)
            
            /*
            await createdUser.user.updateProfile({
                    displayName: data.email
            })
            */

            //firebase 데이터베이스에 저장 (이메일 통해)
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                email: createdUser.user.email
            })

            console.log('createdUser', createdUser)
            setLoading(false)
        } catch (error) {
            // 이미 생성된 이메일일 때 에러 메세지 (***영어 -> 한국어 필요***)
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 5000);
        }


    }

    return (
        // 회원가입 제출 시 로그인 창으로 다시 이동하는 기능 필요
        <div className="auth-wrapper">
            <div className="form">
                <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                    <h3>회원가입</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>이메일</label>
                    <input
                        name = "email"
                        type = "email"
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    />
                    {errors.email && errors.email.type === "required" && <span>이메일을 입력해주세요.</span>}
        
                    <label>비밀번호</label>
                    <input
                        name = "password"
                        type = "password"
                        {...register("password", { required: true, minLength: 6})}
                    />
                    {errors.password && errors.password.type === "required" && <span>비밀번호를 입력해주세요.</span>}
                    {errors.password && errors.password.type === "minLength" && <span>비밀번호는 6자 이상이어야 합니다.</span>}
                    
                    <label>비밀번호 확인</label>
                    <input
                        name = "password_confirm"
                        type = "password"
                        {...register("password_confirm", {
                            required: true,
                            validate: (value) =>
                                value === password.current
                        })}
                    />
                    {errors.password_confirm && errors.password_confirm.type === "required" && <span>비밀번호를 입력해주세요.</span>}
                    {errors.password_confirm && errors.password_confirm.type === "validate" && <span>비밀번호가 일치하지 않습니다.</span>}                
                    
                    {errorFromSubmit && 
                        <span>{errorFromSubmit}</span>}
    
                    <input type="submit" style = {{ marginTop: '40px'}} disabled={loading}/>
                    <Link style={{ textAlign: 'center', color:'gray', textDecoration: 'none'}} to="login">계정이 있으신가요?</Link>
                </form>
            </div>
        </div>
    )
}

export default SignupPage
