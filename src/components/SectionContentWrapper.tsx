interface SectionContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionContentWrapper({
  children,
  className = "",
  id,
}: SectionContentWrapperProps) {
  return (
    <div
      id={id}
      data-nav-theme="light"
      className={`relative z-20 w-full bg-[var(--bg-cream)] ${className}`}
    >
      {/* Section Content Area */}
      {children}
    </div>
  );
}
