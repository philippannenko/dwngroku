package net.pannenko.dwngroku;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.db.DatabaseConfiguration;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class MyConfiguration extends Configuration {
  @NotEmpty
  private String template;

  @NotEmpty
  private String defaultName = "Stranger";

  @Valid
  @NotNull
  private DataSourceFactory database = new DataSourceFactory();

  @JsonProperty
  public String getTemplate() {
    return template;
  }

  @JsonProperty
  public void setTemplate(String template) {
    this.template = template;
  }

  @JsonProperty
  public String getDefaultName() {
    return defaultName;
  }

  @JsonProperty
  public void setDefaultName(String defaultName) {
    this.defaultName = defaultName;
  }

  @JsonProperty("database")
  public DataSourceFactory getDataSourceFactory() {
    if (System.getenv("IS_LOCAL") == null) {
      System.out.println("Dropwizard dummy DB URL (will be overridden)=" + database.getUrl());
      DatabaseConfiguration<?> databaseConfiguration = ExampleDatabaseConfiguration.create(System.getenv("DATABASE_URL"));
      database = databaseConfiguration.getDataSourceFactory(null);
    } 
    return database;
  }

  @JsonProperty("database")
  public void setDataSourceFactory(DataSourceFactory dataSourceFactory) {
    this.database = dataSourceFactory;
  }
}