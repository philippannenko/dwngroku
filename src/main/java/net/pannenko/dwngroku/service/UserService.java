package net.pannenko.dwngroku.service;

import net.pannenko.dwngroku.Constants;
import net.pannenko.dwngroku.domain.dao.UserDao;
import net.pannenko.dwngroku.domain.model.User;
import net.pannenko.dwngroku.resource.UserResource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {

  private static final Logger LOGGER = LoggerFactory.getLogger(UserResource.class);

  private final UserDao userDao;

  public UserService(UserDao userDao) {
    this.userDao = userDao;
  }

  public ServiceResponse delete(Integer id) {
    LOGGER.trace("delete()");
    if (userDao.findById(id) == null) {
      return ServiceResponse.buildErrorResponse(Constants.FAILED_TO_FIND);
    } else {
      if (userDao.deleteById(id) > 0) {
        return ServiceResponse.buildOKResponse(Constants.DELETE_SUCCESS);
      } else {
        return ServiceResponse.buildErrorResponse(Constants.FAILED_TO_DELETE);
      }
    }
  }

  public ServiceResponse getUser(Integer id) {
    LOGGER.trace("getUser()");
    User user = userDao.findById(id);
    if (user == null) {
      return ServiceResponse.buildErrorResponse(Constants.FAILED_TO_FIND);
    } else {
      return ServiceResponse.buildOKResponse(Constants.SUCCESS, user);
    }
  }

  public ServiceResponse update(User user) {
    LOGGER.trace("update()");
    if (userDao.findById(user.getId()) == null) {
      return ServiceResponse.buildErrorResponse(Constants.INVALID_INPUT);
    } else {
      if (userDao.update(user) > 0) {
        return ServiceResponse.buildOKResponse(Constants.SUCCESS);
      } else {
        return ServiceResponse.buildErrorResponse(Constants.INVALID_INPUT);
      }
    }
  }

  public ServiceResponse getAll() {
    LOGGER.trace("listUsers()");
    return ServiceResponse.buildOKResponse(Constants.SUCCESS, userDao.getAll());
  }

  private ServiceResponse save(boolean isExternalTransactionStarted, User user) {
    boolean isDone = false;
    try {
      if (!isExternalTransactionStarted) {
        userDao.begin();
      }
      userDao.insert(user, "asdf");

      userDao.commit();
      isDone = true;
      return ServiceResponse.buildOKResponse(Constants.SUCCESS);
    } finally {
      if (!isDone && !isExternalTransactionStarted) {
        userDao.rollback();
      }
    }
  }

  public ServiceResponse save(User user) {
    LOGGER.trace("save()");
    return save(false, user);
  }

}
