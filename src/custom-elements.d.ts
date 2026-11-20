import "react";

// Web component del avatar de Tavus (cargado en runtime por Avatar.tsx).
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "tavus-embed": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "deployment-id"?: string;
      };
    }
  }
}
