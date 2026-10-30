export default function Logo() {
  return (
    <span className="logo">
      <svg width="30" height="30" viewBox="0 0 512 512" aria-hidden>
        <rect width="512" height="512" rx="112" fill="#2c58d6" />
        <path d="M112 266 L256 140 L400 266" fill="none" stroke="#fff" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M158 262 L256 176 L354 262 V388 a28 28 0 0 1 -28 28 H186 a28 28 0 0 1 -28 -28 Z" fill="#fff" />
        <path d="M222 416 V350 a34 34 0 0 1 68 0 V416 Z" fill="#1e1e1e" />
      </svg>
      <span>Reeltaz <em>Admin</em></span>
    </span>
  );
}
