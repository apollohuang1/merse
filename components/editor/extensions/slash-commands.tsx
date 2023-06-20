import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
} from "react";
import { Editor, Range, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { useCompletion } from "ai/react";
import tippy from "tippy.js";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  MessageSquarePlus,
  CaseSensitive,
} from "lucide-react";
// import LoadingCircle from "@/ui/shared/loading-circle";
import { toast } from "sonner";
// import va from "@vercel/analytics";
// import Magic from "@/ui/shared/magic";
import { Spinner } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { IoText } from "react-icons/io5";
import { BsQuote, BsSpotify } from "react-icons/bs";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface Command {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    // {
    //   title: "Continue writing",
    //   description: "Use AI to expand your thoughts.",
    //   // icon: <Magic className="w-7 text-black" />,
    //   icon: <FiEdit className="w-7" />,
    // },
    // text
    {
      title: "Text",
      description: "Writing with plain text.",
      icon: <IoText size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setParagraph().run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          // .setNode("heading", { level: 1 })
          .setHeading({ level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          // .setNode("heading", { level: 2 })
          .setHeading({ level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          // .setNode("heading", { level: 3 })
          .setHeading({ level: 3 })
          .run();
      },
    },
    {
      title: "Bold",
      description: "Make text bold.",
      icon: <Bold size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    {
      title: "Italic",
      description: "Make text italic.",
      icon: <Italic size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      icon: <List size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Blockquote",
      description: "Create a blockquote.",
      icon: <BsQuote size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    // {
    //   title: "Spotify",
    //   description: "Embed a Spotify playlist or track.",
    //   icon: <BsSpotify size={18} />,
    //   command: ({ editor, range }: Command) => {
    //     // window prompt to fill spotify embed url
    //     const inputSpotifyLink = window.prompt("Enter Spotify Embed URL");

    //     if (!inputSpotifyLink) {
    //       return;
    //     }

    //     const spotifyLinkRegex =
    //       /^https:\/\/open\.spotify\.com\/(playlist|track)\/[a-zA-Z0-9?=._-]+$/;

    //     if (spotifyLinkRegex.test(inputSpotifyLink)) {
    //       const embedLink = inputSpotifyLink
    //         .replace("open.spotify.com", "open.spotify.com/embed")
    //         .replace("?", "?utm_source=generator&");
    //       // @ts-ignore
    //       editor?.commands?.setSpotifyEmbed({ embedLink });
    //     } else {
    //       toast.error("Invalid Spotify embed URL.");
    //     }
    //   },
    // },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
  // .slice(0, 10);
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  items,
  command,
  editor,
  range,
}: {
  items: CommandItemProps[];
  command: any;
  editor: any;
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { complete, isLoading } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        // va.track("Rate Limit Reached");
        return;
      }
      editor.chain().focus().deleteRange(range).run();
    },
    onFinish: (_prompt, completion) => {
      // highlight the generated text
      editor.commands.setTextSelection({
        from: range.from,
        to: range.from + completion.length,
      });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      // va.track("Slash Command Used", {
      //   command: item.title,
      // });
      if (item) {
        command(item);
        // if (item.title === "Continue writing") {
        //   const text = editor.getText();
        //   complete(text);
        // } else {
        //   command(item);
        // }
      }
    },
    [command, editor, items]
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      ref={commandListContainer}
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-lg border border-light-divider dark:border-dark-divider bg-light-background-primary dark:bg-dark-background-primary px-1 py-2 shadow-md transition-all drop-shadow-2xl"
    >
      {/* <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary p-2 font-medium">Basic Blocks</span> */}
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-2 text-left text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary ${
              index === selectedIndex
                ? "bg-light-background-secondary dark:bg-dark-background-tertiary"
                : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-light-divider dark:border-dark-divider">
              {item.title === "Continue writing" && isLoading ? (
                // <LoadingCircle />
                <Spinner className="w-4 h-4" />
              ) : (
                item.icon
              )}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-stone-500">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
