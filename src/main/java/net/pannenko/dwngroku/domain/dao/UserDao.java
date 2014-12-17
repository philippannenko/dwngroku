package net.pannenko.dwngroku.domain.dao;

import net.pannenko.dwngroku.domain.model.User;
import net.pannenko.dwngroku.domain.model.mapper.UserMapper;

import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.BindBean;
import org.skife.jdbi.v2.sqlobject.GetGeneratedKeys;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;
import org.skife.jdbi.v2.sqlobject.mixins.Transactional;

import java.util.List;

@RegisterMapper(UserMapper.class)
public interface UserDao extends Transactional<UserDao> {

  @SqlUpdate("INSERT INTO app_user (name, username, password) VALUES (:u.name, :u.username, :password)")
  @GetGeneratedKeys
  int insert(@BindBean("u") User user, @Bind("password") String password);

  @SqlUpdate("UPDATE app_user SET name = :p.name, username = :p.username WHERE id = :p.id")
  int update(@BindBean("p") User user);

  @SqlQuery("SELECT * FROM app_user")
  List<User> getAll();

  @SqlUpdate("DELETE FROM app_user WHERE id = :it")
  int deleteById(@Bind int id);

  @SqlQuery("SELECT * FROM app_user WHERE id = :id")
  User findById(@Bind("id") int id);

}
