// components/Button.tsx
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
  }
  
  export default function Button({ children, onClick, className = '', type = 'button' }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`w-full cursor-pointer bg-[#1D1D1D] text-white text-sm rounded-xl py-3 hover:bg-gray-800 transition duration-200 ${className}`}
      >
        {children}
      </button>
    );
  }
  
  