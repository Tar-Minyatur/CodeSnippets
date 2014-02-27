package de.tshw.java.hibernatedemo;

import javax.persistence.*;

@Entity
public class Foo {

    @Id
    @GeneratedValue
    private Integer id;

    private String bla;

    public Foo() {
    }

    public Foo(String bla) {
        this.bla = bla;
    }

    public Integer getId() {
        return id;
    }

    public String getBla() {
        return bla;
    }

    public void setBla(String bla) {
        this.bla = bla;
    }
}
