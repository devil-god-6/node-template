const messages = require('../constants/messages.js');

class ServerError extends Error {
  constructor(description = '', rootError = null, message = messages.serverError) {
    super(message);
    this.type = 'ServerError';
    this.statusCode = 500;
    this.description = description;
    this.rootError = rootError
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      rootError: this.rootError
    };
  }
};

class AuthenticationError extends Error {
  constructor(message) {
    super(message || 'Something Went Wrong, While Authenticating..');
    this.type = 'AuthenticationError';
    this.statusCode = 401;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
};

class AuthorizationError extends Error {
  constructor(message = null) {
    super(message || messages.notAuthorized);
    this.type = 'AuthorizationError';
    this.statusCode = 403;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
};



class ResourceNotFoundError extends Error {
  constructor(message = '') {
    super(message || messages.resourceNotFound);
    this.type = 'ResourceNotFoundError';
    this.statusCode = 404;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
};

class InvalidRequestError extends Error {
  constructor(message) {
    super(message);
    this.type = 'InvalidRequestError';
    this.statusCode = 426;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
};

module.exports = {
  ServerError,
  AuthenticationError,
  AuthorizationError,
  ResourceNotFoundError,
  InvalidRequestError,
};
