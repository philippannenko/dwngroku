package net.pannenko.dwngroku.resource;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.pannenko.dwngroku.domain.dao.UserDao;
import net.pannenko.dwngroku.domain.model.User;
import net.pannenko.dwngroku.service.UserService;

import com.codahale.metrics.annotation.Timed;

/**
 * 
 * @author Philip.Pannenko
 * 
 */
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

  private final UserService userService;

  public UserResource(UserDao userDao) {
    this.userService = new UserService(userDao);
  }

  @GET
  @Timed
  public Response listUsers() {
    return Message.buildMessage(userService.getAll());
  }

  @POST
  @Timed
  @Consumes(value = { MediaType.APPLICATION_JSON })
  public Response save(User user) {
    if (user.getId() == null) {
      return Message.buildMessage(userService.save(user));
    } else {
      return Message.buildMessage(userService.update(user));
    }
  }

  @DELETE
  @Path("/{id}")
  @Timed
  public Response deleteUser(@PathParam("id") Integer id) {
    return Message.buildMessage(userService.delete(id));
  }

  @GET
  @Path("/{id}")
  @Timed
  public Response getUser(@PathParam("id") Integer id) {
    return Message.buildMessage(userService.getUser(id));
  }

}
