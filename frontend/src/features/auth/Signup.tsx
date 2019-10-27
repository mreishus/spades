import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import Button from "../../components/basic/Button";

import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";

interface Props {}

export const Login: React.FC<Props> = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, Array<string>>
  >({});
  const { setAuthAndRenewToken } = useAuth();

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
      // Not that secure, if you found this, congrats. :)
      if (inputs.signuppw !== "77yh") {
        alert("Wrong sign up code.  Signups should be open in a month or two.");
        return;
      }
      setIsLoading(true);
      setIsError(false);
      const data = {
        user: {
          email: inputs.email,
          password: inputs.password,
          confirm_password: inputs.confirm_password,
          alias: inputs.alias
        }
      };
      const res = await axios.post("/be/api/v1/registration", data);
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
        console.log("Signed up successfully");
        console.log({ renew_token, token });
        setAuthAndRenewToken(token, renew_token);
        setLoggedIn(true);
      } else {
        throw new Error("Invalid response from Register API");
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
      if (
        res != null &&
        res.data != null &&
        res.data.error != null &&
        res.data.error.errors != null
      ) {
        setValidationErrors(res.data.error.errors);
      } else {
        setValidationErrors({});
      }
    }
  });

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="mx-auto max-w-xs mt-20 p-8 bg-gray-100 rounded-lg shadow-lg">
      {/* <Logo src={logoImg} /> */}
      <h1 className="font-semibold text-green-900 mb-4">Sign Up</h1>
      <form action="POST" onSubmit={handleSubmit}>
        <fieldset disabled={isLoading} aria-busy={isLoading}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              email
            </label>
            <input
              type="email"
              name="email"
              placeholder="email"
              className="form-control block mt-2 w-full"
              onChange={handleInputChange}
              value={inputs.email || ""}
              ref={emailRef}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              password
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="form-control block mt-2 w-full"
              onChange={handleInputChange}
              value={inputs.password || ""}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              confirm password
            </label>
            <input
              type="password"
              name="confirm_password"
              placeholder="confirm password"
              className="form-control block mt-2 w-full"
              onChange={handleInputChange}
              value={inputs.confirm_password || ""}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              nickname
            </label>
            <input
              type="text"
              name="alias"
              placeholder="nickname"
              className="form-control block mt-2 w-full"
              onChange={handleInputChange}
              value={inputs.alias || ""}
            />
            <div className="mt-2 text-xs italic text-gray-600">
              This will be visible to all users on the system.
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              sign up code
            </label>
            <input
              type="text"
              name="signuppw"
              placeholder="signuppw"
              className="form-control block mt-2 w-full"
              onChange={handleInputChange}
              value={inputs.signuppw || ""}
            />
          </div>
          <Button isSubmit isPrimary className="mt-2">
            Sign Up
          </Button>
        </fieldset>
      </form>
      {isError && (
        <div className="alert alert-danger mt-4">
          <span className="text-xl">{errorMessage}</span>

          {Object.keys(validationErrors)
            .filter(field => field !== "password_hash")
            .map((field: string) =>
              validationErrors[field].map((message: string) => (
                <div key={field + message}>
                  <span className="font-semibold">{field}</span>: {message}
                </div>
              ))
            )}
        </div>
      )}
      <Link
        className="mt-4 block text-blue-300 hover:text-blue-500"
        to="/login"
      >
        Already have an account?
      </Link>
    </div>
  );
};
export default Login;
