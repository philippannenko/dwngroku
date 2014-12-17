package net.pannenko.dwngroku.domain.model.mapper.utils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public final class DataMapperUtils {
  
  private DataMapperUtils() {
    
  }

  public static MappedRS mapRS2Map(ResultSet resultSet) throws SQLException {
    MappedRS result = new MappedRS();
    ResultSetMetaData metaData = resultSet.getMetaData();
    int columnCount = metaData.getColumnCount();

    for (int i = 1; i <= columnCount; i++) {
      result.put(metaData.getColumnLabel(i), resultSet.getObject(i));
    }

    return result;
  }

}
