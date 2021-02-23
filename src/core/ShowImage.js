import React, { useState } from "react";

const ShowImage = ({ item, url }) => {
  const [check, setCheck] = useState(false);

  // axios.get(`${API}/${url}/photo/${item._id}`).then((res) => {
  //   if (res.status === 404) {
  //     setCheck(false);
  //   } else {
  //     setCheck(true);
  //   }
  // });
  return (
    <div className="product-img">
      <img
        className="mb-3"
        src={
          item.images && item.images.length
            ? item.images[0].url
            : "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
        }
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
