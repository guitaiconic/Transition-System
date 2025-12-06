import { globalResponse } from "../response/globalResponse.js";

export const catchAsync = (
  fn: (req: any, res: any, next: any) => Promise<any>
) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      return res.status(500).json(globalResponse(null, error.message, 500));
    });
  };
};
