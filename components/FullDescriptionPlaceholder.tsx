import { Loader } from "lucide-react";

export default function FullDescriptionPlaceholder() {
  return (
    <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto flex justify-center items-center">
      <div className="bg-white m-auto p-0 rounded-xl size-5/6 overflow-auto">
        <div className="flex flex-col items-center gap-5">
          <Loader />
        </div>
      </div>
    </dialog>
  );
}
