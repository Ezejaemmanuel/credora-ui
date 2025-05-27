import { ToolCallContentPartComponent } from "@assistant-ui/react";
import {
  CheckCircle,
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchIcon,
  AlertTriangle,
  Loader2,
  XCircle,
  Terminal,
  Code
} from "lucide-react";
import { useState, useEffect, JSX } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingCard } from "./ui/GlowingCard";
import { cn } from "@/lib/utils";
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "./credenza";

// Helper function to format JSON with syntax highlighting
const formatJSON = (json: any): JSX.Element => {
  if (!json) return <></>;

  // Convert to string if it's an object
  const jsonStr = typeof json === 'string' ? json : JSON.stringify(json, null, 2);

  try {
    // Try to parse the JSON to make sure it's valid
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;

    // Format the JSON with syntax highlighting
    return (
      <pre className="relative">
        {jsonStr.split('\n').map((line: string, i: number) => {
          // Add syntax highlighting based on content
          let formattedLine = line;

          // Highlight keys
          formattedLine = formattedLine.replace(
            /"([^"]+)":/g,
            '<span class="text-neonGreen">"$1"</span>:'
          );

          // Highlight string values
          formattedLine = formattedLine.replace(
            /: "([^"]*)"/g,
            ': <span class="text-neonRed">"$1"</span>'
          );

          // Highlight numbers
          formattedLine = formattedLine.replace(
            /: (\d+)/g,
            ': <span class="text-[#00FFFF]">$1</span>'
          );

          // Highlight booleans
          formattedLine = formattedLine.replace(
            /: (true|false)/g,
            ': <span class="text-[#FFFF00]">$1</span>'
          );

          return (
            <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
          );
        })}
      </pre>
    );
  } catch (e) {
    // If parsing fails, just return the original
    return <pre>{jsonStr}</pre>;
  }
};

export const ToolFallback: ToolCallContentPartComponent = ({
  toolName,
  argsText,
  result,
  status
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Determine status type with proper defaults
  const statusType = status?.type || "incomplete";

  // Get status info based on type
  const statusInfo = {
    running: {
      icon: <Loader2 className="size-4 text-neonGreen animate-spin" />,
      label: "EXECUTING",
      variant: "green" as const
    },
    complete: {
      icon: <CheckCircle className="size-4 text-neonGreen" />,
      label: "COMPLETED",
      variant: "green" as const
    },
    incomplete: {
      icon: <Terminal className="size-4 text-neonRed" />,
      label: "QUEUED",
      variant: "red" as const
    },
    "requires-action": {
      icon: <AlertTriangle className="size-4 text-[#FFFF00]" />,
      label: "ACTION_REQUIRED",
      variant: "red" as const
    },
    error: {
      icon: <XCircle className="size-4 text-neonRed" />,
      label: "FAILED",
      variant: "red" as const
    }
  };

  // Current status display
  const currentStatus = statusInfo[statusType as keyof typeof statusInfo] || statusInfo.incomplete;

  // Parse JSON result if it's a string containing JSON
  const formattedResult = (() => {
    if (!result) return undefined;

    if (typeof result === 'string') {
      try {
        // Try to parse as JSON to check validity
        JSON.parse(result);
        return result;
      } catch (e) {
        // If not valid JSON, return as is
        return result;
      }
    }

    // If already an object, stringify with formatting
    return JSON.stringify(result, null, 2);
  })();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "mb-3 flex w-full flex-col gap-1 rounded-lg border bg-black/40 py-2 overflow-hidden",
          currentStatus.variant === "green" ? "border-neonGreen/30" : "border-neonRed/30"
        )}
      >
        <div className="flex items-center gap-2 px-3">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              "p-1 rounded-full",
              currentStatus.variant === "green" ? "bg-neonGreen/10" : "bg-neonRed/10"
            )}
          >
            {currentStatus.icon}
          </motion.div>
          <p className="font-orbitron text-[10px] text-neonGreen flex gap-2 items-center">
            <span className={cn(
              currentStatus.variant === "green" ? "text-neonGreen" : "text-neonRed"
            )}>
              {currentStatus.label}
            </span>
            <span className="text-white/50">|</span>
            <span className="text-white font-spaceGrotesk">{toolName}</span>
          </p>
          <div className="flex-grow" />

          {formattedResult && (
            <Credenza open={isFullscreen} onOpenChange={setIsFullscreen}>
              <CredenzaTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0.5 h-5 w-5 hover:bg-neonGreen/10 border border-neonGreen/20 hover:border-neonGreen/50"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Code className="size-3 text-neonGreen" />
                </Button>
              </CredenzaTrigger>
              <CredenzaContent className="border-neonGreen border-2 bg-black p-0 w-[90vw] max-w-4xl max-h-[80vh] [box-shadow:0_0_35px_7px_rgba(0,255,0,0.25)]">
                <CredenzaHeader className="bg-black/60 p-4 border-b border-neonGreen/30">
                  <CredenzaTitle className="text-neonGreen font-orbitron text-xs tracking-widest">
                    TOOL_OUTPUT: {toolName}
                  </CredenzaTitle>
                </CredenzaHeader>

                <div className="overflow-auto max-h-[60vh] p-4">
                  <div className="text-xs whitespace-pre-wrap rounded bg-black/40 p-3 border border-neonGreen/20 overflow-auto text-white/90 font-shareTechMono">
                    {formatJSON(formattedResult)}
                  </div>
                </div>
              </CredenzaContent>
            </Credenza>
          )}

          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            className="p-0.5 h-5 w-5 hover:bg-neonGreen/10 border border-neonGreen/20 hover:border-neonGreen/50"
          >
            {isCollapsed ?
              <ChevronDownIcon className="size-3 text-neonGreen" /> :
              <ChevronUpIcon className="size-3 text-neonGreen" />
            }
          </Button>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1 border-t border-neonGreen/20 pt-1"
            >
              {argsText && (
                <div className="px-3">
                  <p className="text-[9px] text-neonGreen mb-0.5 font-orbitron">INPUT:</p>
                  <div className="text-[10px] whitespace-pre-wrap rounded-sm bg-black/30 p-2 border border-neonGreen/10 overflow-auto max-h-[150px] text-white/90 font-shareTechMono leading-tight">
                    {formatJSON(argsText)}
                  </div>
                </div>
              )}

              {formattedResult !== undefined && (
                <div className="border-t border-dashed border-neonGreen/20 px-3 pt-1">
                  <p className="text-[9px] text-neonGreen mb-0.5 font-orbitron">OUTPUT:</p>
                  <motion.div
                    className="text-[10px] whitespace-pre-wrap rounded-sm bg-black/30 p-2 border border-neonGreen/10 overflow-auto max-h-[150px] text-white/90 font-shareTechMono leading-tight"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                  >
                    {formatJSON(formattedResult)}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
