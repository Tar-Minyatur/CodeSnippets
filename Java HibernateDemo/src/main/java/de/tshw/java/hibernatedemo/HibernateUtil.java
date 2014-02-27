package de.tshw.java.hibernatedemo;

import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;
    private static final ServiceRegistry serviceRegistry;

    static {
        // retrieves by default hibernate.cfg.xml
        Configuration conf = new Configuration();
        conf.configure();

        StandardServiceRegistryBuilder registryBuilder = new StandardServiceRegistryBuilder();
        registryBuilder.applySettings(conf.getProperties());
        serviceRegistry = registryBuilder.build();
        sessionFactory = conf.buildSessionFactory(serviceRegistry);
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static ServiceRegistry getServiceRegistry() {
        return serviceRegistry;
    }
}
