import { hoverLift } from "@/lib/animations";
import { motion } from "framer-motion";
import { Link } from "lucide-react";

export function SocialLink({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={hoverLift}
      whileTap={{ scale: 0.9 }}
    >
      <Link
        href={href}
        target="_blank"
        className="block p-2 border border-gray-300 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-gray-700 text-lg"
      >
        {icon}
      </Link>
    </motion.div>
  );
}