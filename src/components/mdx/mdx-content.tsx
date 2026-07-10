import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import type { ReactNode } from "react";
import { ScanCompare } from "@/components/media/scan-compare";

/* Case-study building blocks — available inside every .mdx body. */

function Figure({
  src,
  width,
  height,
  alt,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <div className="border border-line">
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className="w-full"
        />
      </div>
      {caption ? (
        <figcaption className="annotation mt-2">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="my-10 grid gap-6 sm:grid-cols-2">{children}</div>;
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="my-10 border-s-2 border-accent bg-accent-soft p-6 text-fg">
      {children}
    </aside>
  );
}

function Video({ src, title }: { src: string; title: string }) {
  return (
    <div className="my-10 aspect-video border border-line">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

const components = {
  Figure,
  Grid,
  Callout,
  Video,
  Compare: ScanCompare,
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-14 mb-4 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-10 mb-3 text-xl font-medium" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-4 leading-relaxed text-fg-muted" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-4 list-disc ps-6 text-fg-muted" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-4 list-decimal ps-6 text-fg-muted" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="my-1" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent underline underline-offset-4 hover:no-underline"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="border border-line bg-surface px-1.5 py-0.5 font-mono text-sm"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-6 border-s-2 border-line ps-6 text-fg-muted italic"
      {...props}
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
