package org.ead2.user.data;

import jakarta.persistence.*;

import java.math.BigInteger;

@Entity
@Table(name = "users")
public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private BigInteger id;
}
