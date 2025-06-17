import { SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { CheckCircle, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
    {/* Your existing animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
      <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-indigo-400/20 rounded-full blur-md animate-bounce delay-700"></div>
    </div>

    {/* Main content */}
    <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 text-center">
      {/* Your existing hero section and feature highlights */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 text-white/90 text-sm font-medium">
          <Star className="w-4 h-4 text-yellow-400" />
          The Ultimate Task Management Experience
        </div>

        <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
          Master Your
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {" "}
            Tasks
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
          Transform chaos into clarity with our intelligent task management
          system
        </p>

        <p className="text-lg text-white/60 mb-12 max-w-lg mx-auto">
          Join thousands who've already revolutionized their productivity
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <CheckCircle className="w-8 h-8 text-green-400 mb-3 mx-auto" />
          <h3 className="text-white font-semibold mb-2">Smart Organization</h3>
          <p className="text-white/70 text-sm">
            AI-powered task categorization and priority management
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <Zap className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
          <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
          <p className="text-white/70 text-sm">
            Add, edit, and complete tasks in milliseconds
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <Star className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
          <h3 className="text-white font-semibold mb-2">Premium Experience</h3>
          <p className="text-white/70 text-sm">
            Beautiful interface designed for focus and flow
          </p>
        </div>
      </div>

      {/* CTA Section - Fixed */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <SignedOut>
          <Link
            to="/signup"
            className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 min-w-[160px]"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            to="/login"
            className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 min-w-[160px]"
          >
            Log In
          </Link>
        </SignedOut>

        <SignedIn>
          <Link
            to="/todos"
            className="group relative bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 min-w-[160px]"
          >
            Go to Todos
          </Link>

          <SignOutButton>
            <button className="group bg-red-500/80 backdrop-blur-sm border-2 border-red-400/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-red-600/90 hover:border-red-300/50 transition-all duration-300 hover:scale-105 min-w-[160px]">
              Sign Out
            </button>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>

    {/* Bottom gradient overlay */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
  </div>
);

export default Home;
