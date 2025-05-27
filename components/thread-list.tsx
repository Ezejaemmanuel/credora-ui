import type { FC } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon, TerminalIcon, Clock3Icon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/tooltip-icon-button";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="flex flex-col items-stretch gap-1.5 px-2">
      <ThreadListNew />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
        className="mt-4"
      >
        <div className="text-xs uppercase tracking-wider font-orbitron text-neonGreen/70 mb-2 flex items-center">
          <Clock3Icon size={12} className="mr-1" />
          <span>Recent Conversations</span>
          <div className="h-px flex-grow ml-2 bg-gradient-to-r from-neonGreen/30 to-transparent"></div>
        </div>
        <ThreadListItems />
      </motion.div>
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <div className="relative mb-1">
        <motion.div
          whileHover={{
            boxShadow: "0 0 15px rgba(0, 255, 0, 0.4)",
            y: -2
          }}
          whileTap={{ scale: 0.98 }}
          className="overflow-hidden relative"
        >
          <Button
            className="w-full bg-black/40 flex items-center justify-center gap-2 rounded-md px-3 py-3 border border-neonGreen text-neonGreen hover:border-neonGreen/90 transition-all duration-300 group relative overflow-hidden"
            variant="ghost"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neonGreen/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <PlusIcon className="mr-1 group-hover:rotate-90 transition-transform duration-300" size={16} />
            <span className="font-orbitron tracking-wider text-sm flex items-center gap-1">
              <Sparkles size={12} className="text-neonGreen/80" />
              NEW
            </span>
          </Button>
        </motion.div>
        <div className="absolute -bottom-0.5 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-neonGreen/40 to-transparent"></div>
      </div>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      animate="show"
    >
      <ThreadListPrimitive.Items components={{ ThreadListItem }} />
    </motion.div>
  );
};

const ThreadListItem: FC = () => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
      }}
    >
      <ThreadListItemPrimitive.Root className="data-[active]:bg-black/40 data-[active]:border-neonGreen/70 hover:bg-black/40 focus-visible:bg-black/40 focus-visible:ring-neonGreen group flex items-center gap-2 rounded-lg border border-neonGreen/30 mb-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 hover:border-neonGreen/50 hover:shadow-[0_0_8px_rgba(0,255,0,0.1)]">
        <div className="flex items-center">
          <TerminalIcon size={14} className="text-neonGreen/70 ml-3" />
        </div>
        <ThreadListItemPrimitive.Trigger className="flex-grow px-2 py-2.5 text-start">
          <ThreadListItemTitle />
        </ThreadListItemPrimitive.Trigger>
        <ThreadListItemArchive />
      </ThreadListItemPrimitive.Root>
    </motion.div>
  );
};

const ThreadListItemTitle: FC = () => {
  return (
    <div className="flex flex-col">
      <p className="text-xs text-white font-spaceGrotesk group-hover:text-neonGreen/90 transition-colors duration-300">
        <ThreadListItemPrimitive.Title fallback="New Conversation" />
      </p>
      <p className="text-[10px] text-neonGreen/50 font-shareTechMono">
        {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="hover:text-neonGreen text-neonGreen/50 ml-auto mr-2 size-4 p-0 transition-colors duration-300"
        variant="ghost"
        tooltip="Archive thread"
      >
        <ArchiveIcon size={14} />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
