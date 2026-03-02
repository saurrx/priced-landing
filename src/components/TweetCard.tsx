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
    <div className="rounded-t-2xl border border-[#2f3336] bg-[#16181c] p-4">
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
            <span className="text-[15px] text-[#71767b]">&middot; {timestamp}</span>
          </div>
          <p className="mt-1 text-[15px] leading-5 text-[#e7e9ea]">{text}</p>

          {/* Tweet action bar */}
          <div className="mt-3 flex max-w-[360px] justify-between text-[#71767b]">
            {/* Reply */}
            <button className="group flex items-center gap-1.5 transition-colors hover:text-[#1d9bf0]" tabIndex={-1}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1.751 10c.118-2.648.998-5.076 2.464-7.023a.5.5 0 0 1 .81.065 10.52 10.52 0 0 0 4.752 4.336 11.1 11.1 0 0 0 4.474.96h.848V4.5a.5.5 0 0 1 .838-.369l7.312 6.539a.5.5 0 0 1 0 .738l-7.312 6.539a.5.5 0 0 1-.838-.369v-3.838h-.848c-3.945 0-7.545 1.644-10.089 4.287a.5.5 0 0 1-.862-.401C3.903 14.533 4.88 11.87 6.671 10H1.751z" />
              </svg>
              <span className="text-xs">24</span>
            </button>
            {/* Retweet */}
            <button className="group flex items-center gap-1.5 transition-colors hover:text-[#00ba7c]" tabIndex={-1}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13v2.5H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z" />
              </svg>
              <span className="text-xs">1.2K</span>
            </button>
            {/* Like */}
            <button className="group flex items-center gap-1.5 transition-colors hover:text-[#f91880]" tabIndex={-1}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.807-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.56-1.13-1.666-1.84-2.908-1.91z" />
              </svg>
              <span className="text-xs">8.4K</span>
            </button>
            {/* Views */}
            <button className="group flex items-center gap-1.5 transition-colors hover:text-[#1d9bf0]" tabIndex={-1}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8.75 21V3h2v18h-2zM18.75 21V8.5h2V21h-2zM13.75 21v-9h2v9h-2zM3.75 21v-4h2v4h-2z" />
              </svg>
              <span className="text-xs">2.1M</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
