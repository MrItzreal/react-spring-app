import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Todos from "./components/Todos";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {/* Public routes for signed-out users */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />

    {/* Protected route for signed-in users */}
    <Route
      path="/todos"
      element={
        <>
          <SignedIn>
            <Todos />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }
    />
  </Routes>
);

export default App;
