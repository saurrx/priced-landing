interface TweetCardProps {
  author: string;
  handle: string;
  text: string;
  avatar: string;
  timestamp?: string;
}

export default function TweetCard({
  author,
  handle,
  text,
  avatar,
  timestamp = "2h",
}: TweetCardProps) {
  return (
    <div className="rounded-2xl border border-[#2f3336] bg-[#16181c] p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated text-lg">
            {avatar}
          </div>
        </div>
        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-[15px] font-bold text-white">
              {author}
            </span>
            <svg
              className="h-[18px] w-[18px] flex-shrink-0 text-[#1d9bf0]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
            </svg>
            <span className="truncate text-[15px] text-[#71767b]">
              @{handle}
            </span>
            <span className="text-[15px] text-[#71767b]">· {timestamp}</span>
          </div>
          <p className="mt-1 text-[15px] leading-5 text-[#e7e9ea]">{text}</p>
        </div>
      </div>
    </div>
  );
}
