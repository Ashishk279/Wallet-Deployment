import Joi from "joi";
import { BAD_REQUEST } from "../utils/responseCode.js"
import { ApiError } from "../utils/apiErrors.js";
const validateWallet = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        address: Joi.string()
        .length(42) 
        .pattern(/^0x[a-fA-F0-9]{40}$/) 
        .required(),
        
    balance: Joi.string()
        .pattern(/^\d+(\.\d{1,18})?$/)
        .required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : "INVALID_VALUES";
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}
const validateTransfer = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        fromAddress: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),
        
    
    toAddress: Joi.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required(),

    amount: Joi.string()
        .pattern(/^\d+(\.\d{1,18})?$/)
        .required(),

    txHash: Joi.string()
        .pattern(/^0x([A-Fa-f0-9]{64})$/)
        .required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : "INVALID_VALUES";
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

export {
    validateWallet,
    validateTransfer
}

