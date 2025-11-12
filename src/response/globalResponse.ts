export const globalResponse = (
  data: any,
  message: string,
  statusCode: number
) => {
  return {
    data,
    message,
    statusCode,
  };
};
