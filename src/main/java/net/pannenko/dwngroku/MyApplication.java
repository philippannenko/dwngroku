package net.pannenko.dwngroku;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.basic.BasicAuthProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import net.pannenko.dwngroku.auth.ExampleAuthenticator;
import net.pannenko.dwngroku.domain.dao.UserDao;
import net.pannenko.dwngroku.domain.model.User;
import net.pannenko.dwngroku.health.TemplateHealthCheck;
import net.pannenko.dwngroku.resource.ProtectedResource;
import net.pannenko.dwngroku.resource.TodoAppExceptionMapper;
import net.pannenko.dwngroku.resource.UserResource;

public class MyApplication extends Application<MyConfiguration> {
  public static void main(String[] args) throws Exception {
    new MyApplication().run(args);
  }

  @Override
  public String getName() {
    return "hello-world";
  }

  private final HibernateBundle<MyConfiguration> hibernate = new HibernateBundle<MyConfiguration>(User.class) {
    @Override
    public DataSourceFactory getDataSourceFactory(MyConfiguration configuration) {
      return configuration.getDataSourceFactory();
    }
  };

  @Override
  public void initialize(Bootstrap<MyConfiguration> bootstrap) {
    bootstrap.addBundle(new AssetsBundle("/assets", "/", "index.html"));
    bootstrap.addBundle(hibernate);
  }

  @Override
  public void run(MyConfiguration configuration, Environment environment) throws ClassNotFoundException {
    String template = configuration.getTemplate();
    environment.healthChecks().register("template", new TemplateHealthCheck(template));

    SessionFactory sessionFactory = hibernate.getSessionFactory();

    Session session = sessionFactory.openSession();
    
    // init the data
    if(session.get(User.class, 0) == null) {
      for (int i = 0; i < 100; i++) {
        session.save(new User(null, "Name" + i, "Username" + i, "password"));
      }
    }
    
    session.flush();
    session.close();

    final UserDao userDao = new UserDao(sessionFactory);

    environment.jersey().register(new UserResource(userDao));
    environment.jersey().register(new BasicAuthProvider<>(new ExampleAuthenticator(), "SUPER SECRET STUFF"));
    environment.jersey().register(new ProtectedResource());

    environment.jersey().setUrlPattern("/api/*");
    environment.jersey().register(new TodoAppExceptionMapper());
    
  }
}