import React, { useState } from "react";
import axios from "axios";
import { API } from "../config";

const ShowImage = ({ item, url }) => {
  const [check, setCheck] = useState(false);

  axios.get(`${API}/${url}/photo/${item._id}`).then((res) => {
    if (res.status === 404) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  });
  return (
    <div className="product-img">
      <img
        className="mb-3"
        src={check ? `${API}/${url}/photo/${item._id}` : ""}
        alt={item.name}
        width="200px"
        height="200px"
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </div>
  );
};

export default ShowImage;
