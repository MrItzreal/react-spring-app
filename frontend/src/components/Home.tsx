import { Link } from "react-router-dom";

const Home = () => (
  <>
    <div className="flex justify-center">Home</div>
    <div className="flex justify-center gap-2">
      <Link to="/signup" className="text-amber-300">
        Signup
      </Link>
      <Link to="/login" className="text-amber-300">
        Login
      </Link>
    </div>
  </>
);

export default Home;
