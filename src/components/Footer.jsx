import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

const Footer = () => {
  const user = useSelector((store) => store.user);
  if(!user) return null;
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* left - brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              EMS
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Employee Management System
            </span>
          </div>

          {/* middle - quick links */}
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link
              to="/dashboard"
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Profile
            </Link>
            <a
              href="mailto:support@ems.com"
              className="hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Support
            </a>
          </div>

          {/* right - social/dev links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/uttamvajapara-a16y"
              target="_blank"
              className="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              rel="noopener noreferrer"
            >
              {/* <Github size={16} /> */}
              Github
            </a>

            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {/* <Linkedin size={16} /> */}
              LinkeIn
            </a>
            <a
              href="mailto:you@example.com"
              className="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {/* <Mail size={16} /> */}
              Mail
            </a>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {year} Employee Management System. Built with MERN stack.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer