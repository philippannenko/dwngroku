package net.pannenko.dwngroku.service;

public final class ServiceResponse {
  private String message;
  private boolean error;
  private Object payload;

  private ServiceResponse(String message, boolean error, Object payload) {
    super();
    this.message = message;
    this.error = error;
    this.payload = payload;
  }

  private ServiceResponse(String message) {
    super();
    this.message = message;
  }
  
  private ServiceResponse(String message, boolean error) {
    super();
    this.message = message;
    this.error = error;
  }
  
  private ServiceResponse(String message, Object payload) {
    super();
    this.message = message;
    this.payload = payload;
  }

  public static ServiceResponse buildOKResponse(String message, Object payload) {
    return new ServiceResponse(message, payload);
  }

  public static ServiceResponse buildOKResponse(String message) {
    return new ServiceResponse(message);
  }
  
  public static ServiceResponse buildErrorResponse(String message, Object payload) {
    return new ServiceResponse(message, true, payload);
  }
  
  public static ServiceResponse buildErrorResponse(String message) {
    return new ServiceResponse(message, true);
  }

  public static ServiceResponse buildResponse(String message, boolean isError, Object payload) {
    return new ServiceResponse(message, isError, payload);
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public boolean isError() {
    return error;
  }

  public void setError(boolean isError) {
    this.error = isError;
  }

  public Object getPayload() {
    return payload;
  }

  public void setPayload(Object payload) {
    this.payload = payload;
  }

}
