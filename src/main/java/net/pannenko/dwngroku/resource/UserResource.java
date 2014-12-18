package net.pannenko.dwngroku.resource;

import io.dropwizard.hibernate.UnitOfWork;

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

  private final UserDao userDao;

  public UserResource(UserDao userDao) {
    this.userDao = userDao;
  }

  @GET
  @Timed
  @UnitOfWork
  public Response listUsers() {
    return Message.buildMessage(userDao.getAll());
  }

  @POST
  @Timed
  @UnitOfWork
  @Consumes(value = { MediaType.APPLICATION_JSON })
  public Response save(User user) {
    if (user.getId() == null) {
      return Message.buildMessage(userDao.save(user));
    } else {
      return Message.buildMessage(userDao.update(user));
    }
  }

  @DELETE
  @Path("/{id}")
  @Timed
  @UnitOfWork
  public Response deleteUser(@PathParam("id") Integer id) {
    return Message.buildMessage(userDao.delete(id));
  }

  @GET
  @Path("/{id}")
  @Timed
  @UnitOfWork
  public Response getUser(@PathParam("id") Integer id) {
    return Message.buildMessage(userDao.getUser(id));
  }

}
