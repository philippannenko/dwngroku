package net.pannenko.dwngroku.domain.dao;

import net.pannenko.dwngroku.Constants;
import net.pannenko.dwngroku.domain.model.User;

import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.dropwizard.hibernate.AbstractDAO;

public class UserDao extends AbstractDAO<User> {
  private static final Logger LOGGER = LoggerFactory.getLogger(UserDao.class);

  public UserDao(SessionFactory factory) {
    super(factory);
  }

  public User findById(Long id) {
    return get(id);
  }

  public ServiceResponse delete(Integer id) {
    LOGGER.trace("delete()");
    User user = get(id);
    if (user == null) {
      return ServiceResponse.buildErrorResponse(Constants.FAILED_TO_FIND);
    } else {
      currentSession().delete(user);
      return ServiceResponse.buildOKResponse(Constants.DELETE_SUCCESS);
    }
  }

  public ServiceResponse getUser(Integer id) {
    LOGGER.trace("getUser()");
    User user = get(id);
    if (user == null) {
      return ServiceResponse.buildErrorResponse(Constants.FAILED_TO_FIND);
    } else {
      return ServiceResponse.buildOKResponse(Constants.SUCCESS, user);
    }
  }

  public ServiceResponse update(User user) {
    LOGGER.trace("update()");
    if (get(user.getId()) != null) {
      return ServiceResponse.buildErrorResponse(Constants.INVALID_INPUT);
    } else {
      persist(user);
      return ServiceResponse.buildOKResponse(Constants.SUCCESS);
    }
  }

  public ServiceResponse getAll() {
    LOGGER.trace("listUsers()");
    Criteria crit = criteria();
    return ServiceResponse.buildOKResponse(Constants.SUCCESS, list(crit));
  }

  public ServiceResponse save(User user) {
    persist(user);
    return ServiceResponse.buildOKResponse(Constants.SUCCESS);
  }

}
