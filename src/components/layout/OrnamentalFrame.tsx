import { cn } from "@/lib/utils";

type OrnamentalFrameProps = {
    className?: string;
    children: React.ReactNode;
};

export function OrnamentalFrame({ className, children }: OrnamentalFrameProps) {
    return <section className={cn("ornamental-frame p-5 md:p-6", className)}>{children}</section>;
}
