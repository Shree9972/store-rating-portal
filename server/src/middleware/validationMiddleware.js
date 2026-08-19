const { validationResult } = require("express-validator");


//checks if tehre is any error while validating with respoct to particular validating ruels

const validateRequest = (req, res, next) => {

    const errors = validationResult(req);

    //console.log(errors);

    if (!errors.isEmpty()) 
    {
        return res.status(400).json({

            success: false,
            message: "Validation failed",

            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg,
            })),
        });
    }

    next();
};


module.exports = {
    
  validateRequest,

};