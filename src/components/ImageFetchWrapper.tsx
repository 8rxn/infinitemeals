import React, { useState } from "react";
import { z } from "zod";
import FoodCard from "./ui/FoodCard";

type Props = {
  name: string;
  id: string;
  tags: string[];
  imgUrl?: string;
};

const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string().max(1000),
});

const ImageFetchWrapper = (props: Props) => {
  const [imgUrl, setImgUrl] = useState<string>("");

  const fetchImage = async (name: string, id: string) => {
    const res = await fetch("/api/v1/get-image", {
      method: "POST",
      body: JSON.stringify(reqSchema.parse({ name: name || "", id: id || "" })),
    });

    const { url } = await res.json();
    setImgUrl(url);
  };

  return (
    <>
      <FoodCard
        name={props.name}
        id={props.id}
        tags={props.tags}
        imgUrl={props.imgUrl}
        fetchImage={fetchImage}
      ></FoodCard>
    </>
  );
};

export default ImageFetchWrapper;
