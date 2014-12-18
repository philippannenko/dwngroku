package net.pannenko.dwngroku.resource;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import net.pannenko.dwngroku.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TodoAppExceptionMapper implements ExceptionMapper<RuntimeException> {
  private static final Logger LOG = LoggerFactory.getLogger(TodoAppExceptionMapper.class);

  @Override
  public Response toResponse(RuntimeException exception) {
    return handleWebApplicationException(exception);
  }

  private Response handleWebApplicationException(Exception exception) {

    if (exception instanceof WebApplicationException) {
      WebApplicationException webAppException = (WebApplicationException) exception;

      if (webAppException.getResponse().getStatus() == Status.UNAUTHORIZED.getStatusCode()) {
        return Response.status(Status.FORBIDDEN).entity(Constants.FORBIDDEN_PAGE_REQUEST_ERROR).build();
      }
      if (webAppException.getResponse().getStatus() == Status.NOT_FOUND.getStatusCode()) {
        return Response.status(Status.NOT_FOUND).entity(Constants.NOT_FOUND_ERROR).build();
      }
    }

    LOG.error(Constants.ERROR_MSG, exception);
    return Message.build5XXErrorMessage(Constants.SERVER_ERROR);
  }
}
