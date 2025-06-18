import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="mx-auto h-screen flex items-center justify-center  bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <div className="flex justify-center">
        <SignUp />
      </div>
    </div>
  );
};

export default Signup;
