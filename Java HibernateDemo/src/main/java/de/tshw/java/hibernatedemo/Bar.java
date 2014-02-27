package de.tshw.java.hibernatedemo;

import javax.persistence.*;

@Entity
public class Bar {

    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private Foo foo;

    private String name;

    public Integer getId() {
        return id;
    }

    public Foo getFoo() {
        return foo;
    }

    public void setFoo(Foo foo) {
        this.foo = foo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
