import { Loader2 } from "lucide-react";

export default function Loading() {
  return <LoadingSkeleton />;
}

const LoadingSkeleton = () => {
  return (
    <div>
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
};
