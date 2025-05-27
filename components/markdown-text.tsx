"use client";

import "@assistant-ui/react-markdown/styles/dot.css";

import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { cn } from "@/lib/utils";

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md text-xs"
      components={defaultComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-3 py-1 text-[10px] font-semibold text-white">
      <span className="lowercase [&>span]:text-[9px]">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy} className="h-5 w-5">
        {isCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-4 scroll-m-20 text-sm font-extrabold tracking-tight last:mb-0", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mb-3 mt-6 scroll-m-20 text-xs font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mb-3 mt-4 scroll-m-20 text-xs font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mb-2 mt-4 scroll-m-20 text-xs font-semibold tracking-tight first:mt-0 last:mb-0", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("my-2 text-xs font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn("my-2 text-xs font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mb-3 mt-3 leading-relaxed text-xs first:mt-0 last:mb-0", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a className={cn("text-primary text-xs font-medium underline underline-offset-4", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("border-l-2 pl-4 text-xs italic", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-3 ml-5 text-xs list-disc [&>li]:mt-1", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-3 ml-5 text-xs list-decimal [&>li]:mt-1", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-3 border-b", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <table className={cn("my-3 w-full text-[10px] border-separate border-spacing-0 overflow-y-auto", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("bg-muted px-2 py-1 text-left text-[10px] font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border-b border-l px-2 py-1 text-left text-[10px] last:border-r [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-b p-0 text-[10px] first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg", className)} {...props} />
  ),
  sup: ({ className, ...props }) => (
    <sup className={cn("[&>a]:text-[9px] [&>a]:no-underline", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("overflow-x-auto rounded-b-lg bg-black p-2 text-[10px] text-white", className)} {...props} />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(!isCodeBlock && "bg-muted rounded text-[11px] border font-semibold", className)}
        {...props}
      />
    );
  },
  CodeHeader,
});
