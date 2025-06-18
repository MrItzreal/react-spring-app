import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <SignIn redirectUrl="/todos" afterSignInUrl="/todos" />
    </div>
  );
};

export default Login;
