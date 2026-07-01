export const sendSuccess = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const sendMessage = (res, message, status = 200) => {
  res.status(status).json({ success: true, message });
};
