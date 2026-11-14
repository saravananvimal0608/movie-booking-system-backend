const theatreOwner = (req, res, next) => {

  if (req.user.role !== "TheatreOwner") {

    return res.status(403).json({
      message: "Access denied. Theatre Owner only"
    });

  }
  next();
};

export default theatreOwner;