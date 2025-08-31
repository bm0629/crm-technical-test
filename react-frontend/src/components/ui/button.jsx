// src/components/ui/button.jsx
export function Button({ children, variant, ...props }) {
  const base = "px-4 py-2 rounded font-semibold transition-colors duration-200";
  const styles =
    variant === "destructive"
      ? "bg-red-500 text-white hover:bg-red-600"
      : variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-blue-500 text-white hover:bg-blue-600";
  return (
    <button className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
}
