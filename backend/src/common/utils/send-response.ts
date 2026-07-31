import { Response } from "express";


interface ResponseOptions<T>{
  success:boolean;
  message:string;
  data:T;
  meta?:Record<string,unknown>;
}


export const sendResponse = <T>(
  res:Response,
  statusCode:number,
  options:ResponseOptions<T>
)=>{

  res.status(statusCode).json({
    success:options.success,
    message:options.message,
    data:options.data,
    ...(options.meta && {
      meta:options.meta
    })
  });

};