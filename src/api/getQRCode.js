import request from "../utils/request";
export const getQRCode = (data) => {
  return request({
    url: "/getQRCode",
    method: "POST",
    data,
  });
};
