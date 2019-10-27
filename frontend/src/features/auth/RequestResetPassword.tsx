import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
//import cx from "classnames";
import Container from "../../components/basic/Container";
import Button from "../../components/basic/Button";

import useForm from "../../hooks/useForm";

interface Props {}

export const RequestResetPassword: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(false);
      const data = {
        user: {
          email: inputs.email,
          password: inputs.password
        }
      };
      const res = await axios.post("/be/api/v1/reset-password", data);
      setIsLoading(false);
      setIsSuccess(true);
      console.log("got res");
      console.log(res);
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
    }
  });

  return (
    <Container>
      <div className="mx-auto max-w-sm mt-20 p-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="font-semibold text-green-900 mb-4">Reset Password</h1>

        {isSuccess && (
          <div className="alert alert-info mt-4">
            Email sent with password reset link (if that account exists).
          </div>
        )}
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
            <Button isSubmit isPrimary className="mt-4">
              Reset Password
            </Button>
          </fieldset>
        </form>
        {isError && (
          <div className="alert alert-danger mt-4">
            Error contacting server.
          </div>
        )}
      </div>
    </Container>
  );
};
export default RequestResetPassword;
