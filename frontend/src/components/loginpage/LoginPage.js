import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase from "../firebase/firebase";
import "./LoginPage.css";
import { Height } from "@material-ui/icons";


function LoginPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" });
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      //이메일과 비밀번호 통해 로그인
      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);

      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  };

  return (
    <div className="login">
      <div className="auth-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          <h1>로그인</h1>
        </div>
        <div style={{marginBottom: "30px"}}>
          <hr></hr>
        </div>
        <label>이메일</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && errors.email.type === "required" && (
          <span>이메일을 입력해주세요.</span>
        )}

        <label>비밀번호</label>
        <input
          name="password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <span>비밀번호를 입력해주세요.</span>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <span>비밀번호는 6자 이상이어야 합니다.</span>
        )}

        {errorFromSubmit && <span>{errorFromSubmit}</span>}

        <input value="로그인" type="submit" disabled={loading} />
        <Link
          style={{ paddingTop:"40px", paddingLeft:"80px", textAlign: "center", color: "white", textDecoration: "none"}}
          to="signup"
          >
          계정이 없으신가요? 회원가입
          
        </Link>
      </form>
    </div>
  </div>
  );
}
//update
export default LoginPage;
