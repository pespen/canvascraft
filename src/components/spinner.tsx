"use client";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner = ({ size = 40, color = "#3498db" }: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="opacity-25"
          style={{ color: color }}
        />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{ color: color }}
        />
      </svg>
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  );
};

export default Spinner;
