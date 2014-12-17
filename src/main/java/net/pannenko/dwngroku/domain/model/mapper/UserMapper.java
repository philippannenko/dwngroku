package net.pannenko.dwngroku.domain.model.mapper;

import net.pannenko.dwngroku.domain.model.User;
import net.pannenko.dwngroku.domain.model.mapper.utils.DataMapperUtils;
import net.pannenko.dwngroku.domain.model.mapper.utils.MappedRS;

import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements ResultSetMapper<User> {
  @Override
  public User map(int i, ResultSet rs, StatementContext statementContext) throws SQLException {
    MappedRS mrs = DataMapperUtils.mapRS2Map(rs);
    return new User(mrs.getInt("ID"), mrs.getString("NAME"), mrs.getString("USERNAME"), mrs.getString("PASSWORD"));
  }
}
