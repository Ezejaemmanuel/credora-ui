// import {
//   ActionBarPrimitive,
//   BranchPickerPrimitive,
//   ComposerPrimitive,
//   MessagePrimitive,
//   ThreadPrimitive,
// } from "@assistant-ui/react";
// import type { FC } from "react";
// import { useState, useEffect } from "react";
// import {
//   ArrowDownIcon,
//   CheckIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CopyIcon,
//   PencilIcon,
//   RefreshCwIcon,
//   SendHorizontalIcon,
//   Shield,
//   User,
//   Bot,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// import { Button } from "@/components/ui/button";
// import { MarkdownText } from "@/components/markdown-text";
// import { TooltipIconButton } from "@/components/tooltip-icon-button";
// import { ToolFallback } from "@/components/tool-fallback";

// // Interface for the message object based on ThreadPrimitive.Messages
// interface ThreadMessage {
//   id: string;
//   role: string;
//   content: string;
//   // Add other properties as needed
// }

// export const Thread: FC = () => {
//   // State to track if we should skip the first 3 messages

//   return (
//     <ThreadPrimitive.Root
//       className="bg-background box-border flex h-full flex-col overflow-hidden"
//       style={{
//         ["--thread-max-width" as string]: "42rem",
//       }}
//     >
     

//       <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
//         <ThreadWelcome />

//         <ThreadPrimitive.Messages
//           components={{
//             UserMessage: UserMessage,
//             EditComposer: EditComposer,
//             AssistantMessage: AssistantMessage,
//             SystemMessage: SystemMessage,
//           }}
//         />

//         <ThreadPrimitive.If empty={false}>
//           <div className="min-h-8 flex-grow" />
//         </ThreadPrimitive.If>

//         <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
//           <ThreadScrollToBottom />
//           <Composer />
//         </div>
//       </ThreadPrimitive.Viewport>
//     </ThreadPrimitive.Root>
//   );
// };

// const ThreadScrollToBottom: FC = () => {
//   return (
//     <ThreadPrimitive.ScrollToBottom asChild>
//       <TooltipIconButton
//         tooltip="Scroll to bottom"
//         variant="outline"
//         className="absolute -top-8 rounded-full disabled:invisible"
//       >
//         <ArrowDownIcon />
//       </TooltipIconButton>
//     </ThreadPrimitive.ScrollToBottom>
//   );
// };

// const ThreadWelcome: FC = () => {
//   return (
//     <ThreadPrimitive.Empty>
//       <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
//         <div className="flex w-full flex-grow flex-col items-center justify-center">
//           <p className="mt-4 font-orbitron text-neonGreen text-glow-green text-xs">
//             Welcome to Credora AI Advisor
//           </p>
//         </div>
//         <ThreadWelcomeSuggestions />
//       </div>
//     </ThreadPrimitive.Empty>
//   );
// };

// const ThreadWelcomeSuggestions: FC = () => {
//   return (
//     <div className="mt-3 flex w-full items-stretch justify-center gap-4">
//       <ThreadPrimitive.Suggestion
//         className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
//         prompt="Create a DeFi loan profile for my startup"
//         method="replace"
//         autoSend
//       >
//         <span className="line-clamp-2 text-ellipsis text-xs font-semibold">
//           Create a DeFi loan profile for my startup
//         </span>
//       </ThreadPrimitive.Suggestion>
//       <ThreadPrimitive.Suggestion
//         className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
//         prompt="What are the best loan pools to fund right now?"
//         method="replace"
//         autoSend
//       >
//         <span className="line-clamp-2 text-ellipsis text-xs font-semibold">
//           What are the best loan pools to fund right now?
//         </span>
//       </ThreadPrimitive.Suggestion>
//     </div>
//   );
// };

// const Composer: FC = () => {
//   return (
//     <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
//       <ComposerPrimitive.Input
//         rows={1}
//         autoFocus
//         placeholder="Write a message..."
//         className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-xs outline-none focus:ring-0 disabled:cursor-not-allowed"
//       />
//       <ComposerAction />
//     </ComposerPrimitive.Root>
//   );
// };

// const ComposerAction: FC = () => {
//   return (
//     <>
//       <ThreadPrimitive.If running={false}>
//         <ComposerPrimitive.Send asChild>
//           <TooltipIconButton
//             tooltip="Send"
//             variant="default"
//             className="my-2.5 size-8 p-2 transition-opacity ease-in"
//           >
//             <SendHorizontalIcon />
//           </TooltipIconButton>
//         </ComposerPrimitive.Send>
//       </ThreadPrimitive.If>
//       <ThreadPrimitive.If running>
//         <ComposerPrimitive.Cancel asChild>
//           <TooltipIconButton
//             tooltip="Cancel"
//             variant="default"
//             className="my-2.5 size-8 p-2 transition-opacity ease-in"
//           >
//             <CircleStopIcon />
//           </TooltipIconButton>
//         </ComposerPrimitive.Cancel>
//       </ThreadPrimitive.If>
//     </>
//   );
// };

// const UserMessage: FC = () => {
//   return (
//     <MessagePrimitive.Root className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_1fr_auto] relative w-full max-w-[var(--thread-max-width)] py-4">
//       <UserActionBar />

//       <div className="flex items-center gap-2 col-span-2 col-start-1 row-start-1 my-1.5 ml-2">
//         <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black border border-neonGreen/30">
//           <User size={12} className="text-neonGreen" />
//         </div>
//         <p className="text-xs text-neonGreen/70 font-orbitron">USER</p>
//       </div>

//       <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-4 py-2 col-span-2 col-start-1 row-start-2 ml-10 text-xs">
//         <MessagePrimitive.Content
//           components={{
//             Text: MarkdownText,
//             tools: { Fallback: ToolFallback }
//           }}
//         />
//       </div>

//       <BranchPicker className="col-start-1 row-start-3 ml-10 mr-2" />
//     </MessagePrimitive.Root>
//   );
// };

// const UserActionBar: FC = () => {
//   return (
//     <ActionBarPrimitive.Root
//       hideWhenRunning
//       autohide="not-last"
//       className="flex flex-col items-end col-start-3 row-start-2 justify-self-end self-start mt-1.5 mr-2"
//     >
//       <ActionBarPrimitive.Edit asChild>
//         <TooltipIconButton tooltip="Edit">
//           <PencilIcon />
//         </TooltipIconButton>
//       </ActionBarPrimitive.Edit>
//     </ActionBarPrimitive.Root>
//   );
// };

// const EditComposer: FC = () => {
//   return (
//     <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
//       <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none text-xs" />

//       <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
//         <ComposerPrimitive.Cancel asChild>
//           <Button variant="ghost" size="sm" className="text-xs">Cancel</Button>
//         </ComposerPrimitive.Cancel>
//         <ComposerPrimitive.Send asChild>
//           <Button size="sm" className="text-xs">Send</Button>
//         </ComposerPrimitive.Send>
//       </div>
//     </ComposerPrimitive.Root>
//   );
// };

// const SystemMessage: FC = () => {
//   return (
//     <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
//       <div className="flex items-center gap-2 col-span-2 col-start-2 row-start-1 my-1.5">
//         <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black border border-neonGreen/30">
//           <Shield size={12} className="text-neonGreen" />
//         </div>
//         <p className="text-xs text-neonGreen/70 font-orbitron">SYSTEM</p>
//       </div>

//       <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-relaxed col-span-2 col-start-2 row-start-2 mb-1.5 mt-0 px-4 py-2 bg-black/40 border border-neonGreen/20 rounded-md text-xs">
//         <MessagePrimitive.Content
//           components={{
//             Text: MarkdownText,
//             tools: { Fallback: ToolFallback }
//           }}
//         />
//       </div>
//     </MessagePrimitive.Root>
//   );
// };

// const AssistantMessage: FC = () => {
//   return (
//     <MessagePrimitive.Root className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
//       <div className="flex items-center gap-2 col-span-2 col-start-1 row-start-1 my-1.5 ml-2">
//         <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black border border-neonGreen/30">
//           <Bot size={12} className="text-neonGreen" />
//         </div>
//         <p className="text-xs text-neonGreen/70 font-orbitron">CREDORA AI</p>
//       </div>

//       <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-relaxed col-span-2 col-start-1 row-start-2 my-1.5 ml-10 text-xs">
//         <MessagePrimitive.Content
//           components={{
//             Text: MarkdownText,
//             tools: { Fallback: ToolFallback }
//           }}
//         />
//       </div>

//       <AssistantActionBar />

//       <BranchPicker className="col-start-1 row-start-3 ml-10 mr-2" />
//     </MessagePrimitive.Root>
//   );
// };

// const AssistantActionBar: FC = () => {
//   return (
//     <ActionBarPrimitive.Root
//       hideWhenRunning
//       autohide="not-last"
//       autohideFloat="single-branch"
//       className="text-muted-foreground flex gap-1 col-start-3 row-start-2 justify-self-end self-start mt-1.5 mr-2 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
//     >
//       <ActionBarPrimitive.Copy asChild>
//         <TooltipIconButton tooltip="Copy">
//           <MessagePrimitive.If copied>
//             <CheckIcon />
//           </MessagePrimitive.If>
//           <MessagePrimitive.If copied={false}>
//             <CopyIcon />
//           </MessagePrimitive.If>
//         </TooltipIconButton>
//       </ActionBarPrimitive.Copy>
//       <ActionBarPrimitive.Reload asChild>
//         <TooltipIconButton tooltip="Refresh">
//           <RefreshCwIcon />
//         </TooltipIconButton>
//       </ActionBarPrimitive.Reload>
//     </ActionBarPrimitive.Root>
//   );
// };

// const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
//   className,
//   ...rest
// }) => {
//   return (
//     <BranchPickerPrimitive.Root
//       hideWhenSingleBranch
//       className={cn("text-muted-foreground inline-flex items-center text-[10px]", className)}
//       {...rest}
//     >
//       <BranchPickerPrimitive.Previous asChild>
//         <TooltipIconButton tooltip="Previous">
//           <ChevronLeftIcon />
//         </TooltipIconButton>
//       </BranchPickerPrimitive.Previous>
//       <span className="font-medium">
//         <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
//       </span>
//       <BranchPickerPrimitive.Next asChild>
//         <TooltipIconButton tooltip="Next">
//           <ChevronRightIcon />
//         </TooltipIconButton>
//       </BranchPickerPrimitive.Next>
//     </BranchPickerPrimitive.Root>
//   );
// };

// const CircleStopIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 16 16"
//       fill="currentColor"
//       width="16"
//       height="16"
//     >
//       <rect width="10" height="10" x="3" y="3" rx="2" />
//     </svg>
//   );
// };



import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/markdown-text";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { ToolFallback } from "@/components/tool-fallback";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="bg-background box-border flex h-full flex-col overflow-hidden"
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
    >
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            EditComposer: EditComposer,
            AssistantMessage: AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <p className="mt-4 font-orbitron text-neonGreen text-glow-green text-xs">
            Welcome to Credora AI Advisor
          </p>
        </div>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="mt-3 flex w-full items-stretch justify-center gap-4">
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
        prompt="Create a DeFi loan profile for my startup"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-xs font-semibold">
          Create a DeFi loan profile for my startup
        </span>
      </ThreadPrimitive.Suggestion>
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in"
        prompt="What are the best loan pools to fund right now?"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-xs font-semibold">
          What are the best loan pools to fund right now?
        </span>
      </ThreadPrimitive.Suggestion>
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Write a message..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-xs outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
      <UserActionBar />

      <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-4 py-2 col-start-2 row-start-2 text-xs">
        <MessagePrimitive.Content
          components={{
            Text: MarkdownText,
            tools: { Fallback: ToolFallback }
          }}
        />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none text-xs" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost" size="sm" className="text-xs">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button size="sm" className="text-xs">Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
      <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-relaxed col-span-2 col-start-2 row-start-1 my-1.5 text-xs">
        <MessagePrimitive.Content
          components={{
            Text: MarkdownText,
            tools: { Fallback: ToolFallback }
          }}
        />
      </div>

      <AssistantActionBar />

      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn("text-muted-foreground inline-flex items-center text-[10px]", className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
