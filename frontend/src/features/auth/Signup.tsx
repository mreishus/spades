import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/basic/Button";
import Card from "../../components/basic/Card";

interface Props {}

export const Signup: React.FC<Props> = () => {
  return (
    <Card>
      {/* <Logo src={logoImg} /> */}
      <form>
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <input type="password" placeholder="password again" />
        <Button>Sign Up</Button>
      </form>
      <Link to="/login">Already have an account?</Link>
    </Card>
  );
};
export default Signup;
