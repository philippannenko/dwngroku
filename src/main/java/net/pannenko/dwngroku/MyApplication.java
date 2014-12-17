package net.pannenko.dwngroku;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.basic.BasicAuthProvider;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import net.pannenko.dwngroku.auth.ExampleAuthenticator;
import net.pannenko.dwngroku.domain.dao.UserDao;
import net.pannenko.dwngroku.health.TemplateHealthCheck;
import net.pannenko.dwngroku.resource.ProtectedResource;
import net.pannenko.dwngroku.resource.TodoAppExceptionMapper;
import net.pannenko.dwngroku.resource.UserResource;

import org.skife.jdbi.v2.DBI;

public class MyApplication extends Application<MyConfiguration> {
  public static void main(String[] args) throws Exception {
    new MyApplication().run(args);
  }

  @Override
  public String getName() {
    return "hello-world";
  }

  @Override
  public void initialize(Bootstrap<MyConfiguration> bootstrap) {
    bootstrap.addBundle(new AssetsBundle("/assets", "/", "index.html"));
  }

  @Override
  public void run(MyConfiguration configuration, Environment environment) throws ClassNotFoundException {
    String template = configuration.getTemplate();

    final DBIFactory factory = new DBIFactory();
    final DBI jdbi = factory.build(environment, configuration.getDataSourceFactory(), "postgresql");

    final UserDao userDao = jdbi.onDemand(UserDao.class);

    environment.jersey().register(new UserResource(userDao));

    environment.healthChecks().register("template", new TemplateHealthCheck(template));
    environment.jersey().setUrlPattern("/api/*");
    environment.jersey().register(new TodoAppExceptionMapper());

    environment.jersey().register(new BasicAuthProvider<>(new ExampleAuthenticator(), "SUPER SECRET STUFF"));
    environment.jersey().register(new ProtectedResource());
  }
}