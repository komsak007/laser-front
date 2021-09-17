import { API } from "../config";
import axios from "axios";

export const createCategory = (userId, token, category) => {
  // console.log(name, email, password);
  return fetch(`${API}/category/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createProduct = async (userId, token, product, images) =>
  axios.post(
    `${API}/product/create/${userId}`,
    { product, images },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// export const createProduct = (userId, token, product) => {
//   console.log(product);
//   return fetch(`${API}/product/create/${userId}`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: product,
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getCategory = (categoryId) => {
  return fetch(`${API}/category/${categoryId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const UpdateCategoryId = async (categoryId, userId, token, category) =>
  await axios.put(`${API}/category/${categoryId}/${userId}`, category, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const listOrders = (userId, token) => {
  return fetch(`${API}/order/list/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getStatusValues = (userId, token) => {
  return fetch(`${API}/order/status-values/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateOrderStatus = (userId, token, orderId, status) => {
  return fetch(`${API}/order/${orderId}/status/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, orderId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

/**
 * to perform crud on product
 * get all products
 * get a single product
 * update a single product
 * delete single product
 */

export const getProducts = () => {
  return fetch(`${API}/products?limit=100`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteProduct = (productId, userId, token) => {
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getProduct = (productId) => {
  return fetch(`${API}/product/${productId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// export const updateProduct = (productId, userId, token, product) => {
//   return fetch(`${API}/product/${productId}/${userId}`, {
//     method: "PUT",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: product,
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => console.log(err));
// };

export const updateProduct = async (
  productId,
  userId,
  token,
  product,
  images
) =>
  await axios.put(
    `${API}/product/${productId}/${userId}`,
    { product, images },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const updateImages = async (productId, userId, token, images) =>
  await axios.put(
    `${API}/product/${productId}/image/${userId}`,
    { images },
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteCategories = (categoryId, userId, token) => {
  return fetch(`${API}/category/${categoryId}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const createLaser = async (product) => {
  // console.log(product);
  await axios.post(`${API}/product/laser`, product);
};

export const addLaser = async (product) => {
  // console.log(product);
  await axios.post(`${API}/product/addlaser`, product);
};

export const listUser = () => {
  return fetch(`${API}/user/list`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteUser = (userId) => {
  return fetch(`${API}/user/${userId}`, {
    method: "DELETE",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getUser = (userId) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateUser = (userId, user) => {
  axios.put(`${API}/user/${userId}`, user);
};

export const getMeasure = () => {
  return axios.get(`${API}/laser`);
};

export const addMeasure = (measurement) => {
  return axios.post(`${API}/laser`, {
    measurement,
  });
};

export const delMeasure = (measureId) => {
  return axios.delete(`${API}/laser/${measureId}`);
};
