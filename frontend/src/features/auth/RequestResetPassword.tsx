import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
//import cx from "classnames";
import Container from "../../components/basic/Container";
import Button from "../../components/basic/Button";
import Card from "../../components/basic/Card";

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
      <Card className="mt-20 p-4 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="font-semibold text-green-900">Reset Password</h1>

        {isSuccess && (
          <div className="alert alert-info mt-4">
            Email sent with password reset link.
          </div>
        )}
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
      </Card>
    </Container>
  );
};
export default RequestResetPassword;
