class CustomError extends Error {
	constructor(message, statuscode){
		super(message)
		this.statuscode = statuscode
	}
	
}

const createError = (message, statuscode) =>{
	return new CustomError(message, statuscode)
}

module.exports = {CustomError, createError}