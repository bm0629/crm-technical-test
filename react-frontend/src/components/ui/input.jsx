// src/components/ui/input.jsx
export function Input(props) {
  return (
    <input
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}
