"use client";

export function Modal(props: {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-opacity-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
          <h3 className="text-xl font-semibold mb-4">{props.title}</h3>
            {props.children}
          <button
            onClick={props.onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
    </div>
  );
}