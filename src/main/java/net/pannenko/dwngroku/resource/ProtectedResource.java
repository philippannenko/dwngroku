package net.pannenko.dwngroku.resource;

import io.dropwizard.auth.Auth;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import net.pannenko.dwngroku.domain.model.User;

@Path("/protected")
@Produces(MediaType.TEXT_PLAIN)
public class ProtectedResource {
  @GET
  public String showSecret(@Auth User user) {
    return String.format("Hey there, %s. You know the secret!", user.getName());
  }
}