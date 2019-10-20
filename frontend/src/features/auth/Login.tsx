import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import Button from "../../components/basic/Button";
import Card from "../../components/basic/Card";

import useForm from "../../hooks/useForm";
import { useAuth } from "../../contexts/AuthContext";

interface Props {}

export const Login: React.FC<Props> = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthToken, setRenewToken } = useAuth();

  // Autofocus effect
  const emailRef = useRef(null);
  useEffect(() => {
    if (emailRef != null && emailRef.current != null) {
      // @ts-ignore: Object is possibly 'null'.
      emailRef.current.focus();
    }
  }, []);

  const { inputs, handleSubmit, handleInputChange } = useForm(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = {
        user: {
          email: inputs.email,
          password: inputs.password
        }
      };
      const res = await axios.post("/be/api/v1/session", data);
      console.log("got res");
      console.log(res);
      setIsLoading(false);

      if (
        res.status === 200 &&
        res.data.data != null &&
        res.data.data.renew_token != null &&
        res.data.data.token != null
      ) {
        const { renew_token, token } = res.data.data;
        console.log("Logged in successfully");
        console.log({ renew_token, token });
        setAuthToken(token);
        setRenewToken(renew_token);
        setLoggedIn(true);
      } else {
        throw new Error("Invalid response from Login API");
      }
    } catch (e) {
      console.log("catch response");
      console.log(e.response);
      setIsLoading(false);
      setIsError(true);
      const res = e.response;
      if (
        res != null &&
        res.data != null &&
        res.data.error != null &&
        res.data.error.message != null
      ) {
        setErrorMessage(res.data.error.message);
      } else {
        setErrorMessage(e.message);
      }
    }
  });

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Card>
      {/* <Logo src={logoImg} /> */}
      <form action="POST" onSubmit={handleSubmit}>
        <fieldset disabled={isLoading} aria-busy={isLoading}>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="form-control block mt-2"
            onChange={handleInputChange}
            value={inputs.email || ""}
            ref={emailRef}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            className="form-control block mt-2"
            onChange={handleInputChange}
            value={inputs.password || ""}
          />
          <Button isPrimary className="mt-2">
            Sign In
          </Button>
        </fieldset>
      </form>
      {isError && <div className="alert alert-danger mt-4">{errorMessage}</div>}
      <Link className="mt-2" to="/signup">
        Don't have an account?
      </Link>
    </Card>
  );
};
export default Login;
