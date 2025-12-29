import Link from "next/link";
import { GraduationCap } from "lucide-react";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6 bg-white/[0.02] backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <Link href="/" className="block">
          <div className="mb-4 cursor-pointer">
           <div className="flex items-center gap-1">
  <Image
    src="/icon.png"
    alt="Project X logo"
    width={132}
    height={132}
    className="-mr-1"
  />
  {/* <span className="text-xs px-2 py-0.5 rounded bg-purple-600 text-white">
    AI
  </span> */}
</div>

   
  </div>
</Link>

          {/* Features */}
          {/* <div>
            <h4 className="text-sm font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/attendance" className="hover:text-white transition">
                  Attendance Tracker
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-white transition">
                  Smart Notes
                </Link>
              </li>
              <li>
                <Link href="/placement" className="hover:text-white transition">
                  Placement Prep
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-white transition">
                  Progress Dashboard
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Resources */}
          {/* <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Legal / Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Link</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/analyse-my-resume" className="hover:text-white transition">
                  Analyse My Resume
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Project X. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built for students • Designed for growth
          </p>
        </div>
      </div>
    </footer>
  );
}
