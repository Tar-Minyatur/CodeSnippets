import de.tshw.java.hibernatedemo.Bar;
import de.tshw.java.hibernatedemo.Foo;
import de.tshw.java.hibernatedemo.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

public class Main {

    public static void main(String[] args) {
        SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
        Session session = sessionFactory.openSession();

        session.beginTransaction();
        Foo foo = new Foo("Lorem ipsum");
        Bar bar = new Bar();
        bar.setFoo(foo);
        bar.setName("The quick brown fox jumps over the lazy dog.");
        session.persist(bar);
        session.getTransaction().commit();

        List<Bar> bars = session.createQuery("from Bar").list();
        for (Bar b: bars) {
            System.out.println("Found Bar entity #" + b.getId() + " named '" + b.getName() + "':");
            System.out.println("=> Foo: " + b.getFoo().getId() + " - " + b.getFoo().getBla());
        }

        session.close();

        // Forcing the application to shut down for ease of use
        System.exit(0);
    }

}
