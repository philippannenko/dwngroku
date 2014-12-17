package net.pannenko.dwngroku.domain.model.mapper.utils;

import java.util.Date;
import java.util.HashMap;

public class MappedRS extends HashMap<String, Object> {

  private static final long serialVersionUID = 7628082691865395298L;

  @Override
  public Object put(String key, Object value) {
    return super.put(key.toLowerCase(), value);
  }

  public Integer getInt(String key) {
    Object o = this.get(key.toLowerCase());
    if (o == null) {
      return null;
    } else {
      return (Integer) o;
    }
  }

  public String getString(String key) {
    Object o = this.get(key.toLowerCase());
    if (o == null) {
      return null;
    } else {
      return (String) o;
    }
  }

  public Date getDate(String key) {
    return (Date) this.get(key.toLowerCase());
  }

  public Boolean getBoolean(String key) {
    Object o = this.get(key.toLowerCase());
    if (o == null) {
      return null;
    } else {
      return (Boolean) o;
    }
  }

}
