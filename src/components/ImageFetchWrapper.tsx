import React, { useState } from "react";
import { z } from "zod";
import FoodCard from "./ui/FoodCard";

type Props = {
  name: string;
  id: string;
  imgUrl?: string;
};

const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string().max(1000),
});

const ImageFetchWrapper = (props: Props) => {
  const [imgUrl, setImgUrl] = useState<string>(props.imgUrl || "");

  const fetchImage = async (name: string, id: string) => {
    let res = await fetch("/api/v2/images/database", {
      method: "POST",
      body: JSON.stringify(reqSchema.parse({ name: name || "", id: id || "" })),
    });

    if (res.status == 404) {
      res = await fetch("/api/v2/images/search", {
        method: "POST",
        body: JSON.stringify(
          reqSchema.parse({ name: name || "", id: id || "" })
        ),
      });
      if(res.status==401){
        setImgUrl("/burger-placeholder.webp")
        return
      }
      const resGpt = await res.json();

      // console.log(resGpt)

      res = await fetch("/api/v2/images/update-image-db", {
        method: "POST",
        body: JSON.stringify({
          result: resGpt.result,
          id: id || "",
          name: name || "",
        }),
      });

      const { url } = await res.json();
      setImgUrl(url);
      return;
    }

    const { url } = await res.json();
    setImgUrl(url);
  };

  return (
    <>
      <FoodCard
        name={props.name}
        id={props.id}
        imgUrl={imgUrl}
        fetchImage={fetchImage}
      ></FoodCard>
    </>
  );
};

export default ImageFetchWrapper;
