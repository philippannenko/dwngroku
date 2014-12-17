package net.pannenko.dwngroku.resource;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import net.pannenko.dwngroku.Constants;
import net.pannenko.dwngroku.service.ServiceResponse;

public class Message {
  private String message;
  private String type;
  private Object payload;

  public Message(String message, String type) {
    this.message = message;
    this.type = type;
  }

  public Message(String message, String type, Object payload) {
    this.message = message;
    this.type = type;
    this.payload = payload;
  }

  public Message(ServiceResponse response) {
    this.message = response.getMessage();
    this.type = response.isError() ? Constants.MESSAGE_TYPE_DANGER : Constants.MESSAGE_TYPE_SUCCESS;
    this.payload = response.getPayload();
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Object getPayload() {
    return payload;
  }

  public void setPayload(Object payload) {
    this.payload = payload;
  }

  public static Response buildErrorMessage(String message, int status) {
    return Response.status(status).entity(new Message(message, Constants.MESSAGE_TYPE_DANGER)).build();
  }

  public static Response build4XXErrorMessage(String message) {
    return Response.status(Status.BAD_REQUEST.getStatusCode()).entity(new Message(message, Constants.MESSAGE_TYPE_DANGER)).build();
  }

  public static Response build5XXErrorMessage(String message) {
    return Response.status(Status.INTERNAL_SERVER_ERROR.getStatusCode()).entity(new Message(message, Constants.MESSAGE_TYPE_DANGER)).build();
  }

  public static Response buildOkMessage(String message) {
    return Response.status(Status.OK).entity(new Message(message, Constants.MESSAGE_TYPE_SUCCESS)).build();
  }

  public static Response buildOkMessage(String message, Object payload) {
    return Response.status(Status.OK).entity(new Message(message, Constants.MESSAGE_TYPE_SUCCESS, payload)).build();
  }

  public static Response buildOkMessage(Object payload) {
    return Response.status(Status.OK).entity(new Message(null, null, payload)).build();
  }

  public static Response buildMessage(ServiceResponse response) {
    if (response.isError()) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(new Message(response)).build();
    } else {
      return Response.ok(new Message(response)).build();
    }
  }

}
