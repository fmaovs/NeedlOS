package com.farukgenc.boilerplate.springboot.model;


import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {

	USER, ADMIN;

	@JsonCreator
	public static UserRole fromValue(String value) {
		return UserRole.valueOf(value.toUpperCase());
	}

}
