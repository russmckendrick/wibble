import * as React from "react"
import { motion } from "framer-motion"
import { IPDisplay } from "./IPDisplay"
import { Toaster } from "./retroui/Sonner"
import { text } from "@/config/text"

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-cyan-300 flex flex-col items-center justify-center p-8">
      <motion.div 
        className="w-full max-w-2xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <motion.h1 
            className="font-black text-white mb-6 break-words leading-tight text-[clamp(1.75rem,8vw,3.5rem)] md:text-[clamp(2.5rem,6vw,4rem)] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] [text-shadow:3px_3px_0px_rgba(0,0,0,1)]"
            animate={{
              rotate: [1, -1, 1],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            {text.app.title}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl font-bold text-black bg-white px-6 py-3 rounded-lg border-2 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl"
            animate={{
              rotate: [-1, 1, -1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.05,
              rotate: 0,
              transition: { duration: 0.2 }
            }}
          >
            {text.app.subtitle}
          </motion.p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <IPDisplay />
        </motion.div>
        
        <motion.footer 
          className="text-center text-sm font-bold text-black bg-white px-6 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
            transition: { duration: 0.2 }
          }}
        >
          {text.app.poweredByPrefix}{" "}
          <a 
            href={text.links.publicIp.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:no-underline font-black"
          >
            {text.links.publicIp.label}
          </a>
          {" "}{text.app.poweredByAnd}{" "}
          <a 
            href={text.links.retroUi.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 underline hover:no-underline font-black"
          >
            {text.links.retroUi.label}
          </a>
          {" "}🚀
        </motion.footer>
      </motion.div>
      <Toaster />
    </div>
  )
}