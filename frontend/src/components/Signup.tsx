import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      <div className="flex justify-center">
        <SignUp />
      </div>
    </div>
  );
};

export default Signup;
