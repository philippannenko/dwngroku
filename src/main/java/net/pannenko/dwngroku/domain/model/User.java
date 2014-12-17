package net.pannenko.dwngroku.domain.model;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User implements Serializable {

  private static final long serialVersionUID = 849609613534944733L;

  @NotNull
  private Integer id;

  @NotEmpty
  private String name;

  @NotEmpty
  private String username;

  @NotNull
  private String password;

  public User(String username) {
    this.username = username;
  }

  public User(Integer id, String name, String username, String password) {
    super();
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  public User(Integer id) {
    this.id = id;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

}