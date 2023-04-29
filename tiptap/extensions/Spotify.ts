import { Node, mergeAttributes } from "@tiptap/react";

type SetSpotifyPlaylistOptions = { src: string };

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spotify: {
      /**
       * Insert a youtube video
       */
      setYoutubeVideo: (options: SetSpotifyPlaylistOptions) => ReturnType;
    };
  }
}

const Spotify = Node.create({
  name: "spotify",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  inline() {
    return this.options.inline;
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        // default: "352px",
        default: "152px",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      // @ts-ignore
      setSpotifyPlaylist:
        (options: any) =>
        // @ts-ignore
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ({ editor, node }) => {
      // const div = document.createElement("div");
      const iframe = document.createElement("iframe");
      iframe.className = "w-full";
      // div.className = "w-full ",
      // iframe.width = "100%";
      // iframe.height = "360px";
      iframe.height = "152px";
      iframe.width = node.attrs.width;
      iframe.height = node.attrs.height;
      // iframe.allowFullscreen = true;
      iframe.src = node.attrs.src;
      // div.append(iframe);
      return {
        dom: iframe,
      };
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["iframe", mergeAttributes(HTMLAttributes)];
  },
});

export default Spotify;