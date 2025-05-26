import { Skeleton } from "@/components/ui/skeleton";

const ImageSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-1 p-1">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton 
          key={index}
          className="aspect-square w-full rounded" 
        />
      ))}
    </div>
  );
};

export default ImageSkeleton;