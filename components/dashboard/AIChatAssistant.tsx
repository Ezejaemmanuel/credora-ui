"use client";

import { MessageCircle, List, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import { AssistantRuntimeProvider, CompositeAttachmentAdapter, SimpleImageAttachmentAdapter, SimpleTextAttachmentAdapter } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "../thread";
import { ThreadList } from "../thread-list";
import { useCredoraFactoryData } from "@/hooks/useCredoraFactoryData";
import { LoanStatus } from "@/types/credora";
import { toast } from "sonner";

const AIChatAssistant = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
  const [showThreadList, setShowThreadList] = useState(false);
  const { address } = useAccount();


  const runtime = useChatRuntime({
    api: "/api/chat",
    
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
    headers: {
      'X-User-Address': address || 'unknown' // This will be used by the backend once the user provides their address
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Error: " + error.message);
    },
  });

  const toggleThreadList = () => setShowThreadList(prev => !prev);

  const threadListButton = (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)" }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleThreadList}
      className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-black border border-neonGreen flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.3)]"
    >
      <List className="text-neonGreen" size={12} />
    </motion.button>
  );

  const threadListPanel = (
    <AnimatePresence>
      {showThreadList && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "20%", opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            bounce: 0.2
          }}
          className="absolute inset-y-0 right-0 z-20 w-4/5 bg-black border-l border-neonGreen backdrop-blur-sm"
          style={{
            boxShadow: "-5px 0 20px rgba(0, 255, 0, 0.2)",
            backgroundImage: "radial-gradient(circle at 100% 0%, rgba(0, 255, 0, 0.05) 0%, transparent 25%)"
          }}
        >
          <div className="flex justify-between items-center p-3 border-b border-neonGreen/30">
            <h3 className="text-neonGreen font-orbitron text-xs tracking-widest">
              <span className="relative inline-block">
                <span className="relative z-10">CONVERSATION_HISTORY</span>
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-neonGreen to-transparent"></span>
              </span>
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleThreadList}
              className="text-neonGreen hover:text-white transition-colors duration-200"
            >
              ✕
            </motion.button>
          </div>
          <div className="overflow-auto h-full pb-20 px-2">
            <ThreadList />
          </div>

          {/* Redesigned floating close button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.button
              whileHover={{
                x: -2,
                boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleThreadList}
              className="relative w-8 h-24 flex flex-col items-center justify-center bg-black border-y border-r border-neonGreen rounded-r-md shadow-[0_0_10px_rgba(0,255,0,0.2)]"
            >
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-neonGreen/50 to-transparent"></div>
              <ArrowLeft className="text-neonGreen mb-2" size={12} />
              <div className="flex flex-col items-center">
                {["B", "A", "C", "K"].map((letter, i) => (
                  <span key={i} className="text-[9px] font-orbitron text-neonGreen leading-tight">{letter}</span>
                ))}
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const chatContent = (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="relative h-full">
        <Thread />
        {threadListButton}
        {threadListPanel}
      </div>
    </AssistantRuntimeProvider>
  );

  // For mobile: Drawer from bottom
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)" }}
              className="w-10 h-10 rounded-full bg-black border-2 border-neonGreen flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.3)]"
            >
              <MessageCircle className="text-neonGreen" size={18} />
            </motion.button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh] bg-black border-t-2 border-neonGreen text-white p-0 flex flex-col">
            <DrawerHeader className="border-b border-neonGreen/30 p-3">
              <DrawerTitle className="text-neonGreen font-orbitron text-xs">CREDORA_AI_ADVISOR</DrawerTitle>
            </DrawerHeader>
            <div className="relative flex-1 overflow-hidden">
              {chatContent}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // For tablet: Sheet from right
  if (isTablet) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)" }}
              className="w-10 h-10 rounded-full bg-black border-2 border-neonGreen flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.3)]"
            >
              <MessageCircle className="text-neonGreen" size={18} />
            </motion.button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] h-full bg-black border-l-2 border-neonGreen text-white p-0 flex flex-col">
            <SheetHeader className="border-b border-neonGreen/30 p-3">
              <SheetTitle className="text-neonGreen font-orbitron text-xs">CREDORA_AI_ADVISOR</SheetTitle>
            </SheetHeader>
            <div className="relative flex-1 overflow-hidden">
              {chatContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // For desktop: fixed sidebar
  return (
    <div className="h-full bg-black border-l border-neonGreen/30 flex flex-col w-full">
      <div className="p-3 border-b border-neonGreen/30">
        <h2 className="text-neonGreen font-orbitron text-xs tracking-wide">CREDORA_AI_ADVISOR</h2>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {chatContent}
      </div>
    </div>
  );
};

export default AIChatAssistant;
