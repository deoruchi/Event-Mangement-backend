//asynchandler function act as a wrapper which does our work and take fn as a paraneter which is the function

const asynchandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asynchandler };

// const asynHandler = (fn) => {
//   async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.status(err.code || 500).json({
//         success: false,
//         message: err.message,
//       });

//     }
//   };
// };
