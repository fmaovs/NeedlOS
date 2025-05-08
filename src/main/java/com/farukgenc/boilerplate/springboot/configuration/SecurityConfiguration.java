package com.farukgenc.boilerplate.springboot.configuration;

import com.farukgenc.boilerplate.springboot.security.jwt.JwtAuthenticationEntryPoint;
import com.farukgenc.boilerplate.springboot.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	private final JwtAuthenticationEntryPoint unauthorizedHandler;

	@Bean
	public AuthenticationManager authenticationManager(final AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		//@formatter:off

		return http
				.csrf(CsrfConfigurer::disable)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.authorizeHttpRequests(request -> request.requestMatchers("/register",
																	      "/login",
																	      "/v3/api-docs/**",
																          "/swagger-ui/**",
																	      "/swagger-ui.html",
																	      "/actuator/**")
													   .permitAll()
						//ADMIN
						.requestMatchers("/orders/reasignar-sastre/{id}").hasAuthority("ADMIN")
						.requestMatchers("/arqueo/**").hasAuthority("ADMIN")
						.requestMatchers("/gastos/**").hasAuthority("ADMIN")
						.requestMatchers("/nomina/**").hasAuthority("ADMIN")
						.requestMatchers("/inventario/all").hasAnyAuthority("USER", "ADMIN")
						.requestMatchers("/inventario/ingresando").hasAuthority("ADMIN")
						.requestMatchers("/inventario/nuevo").hasAuthority("ADMIN")
						.requestMatchers("/inventario/stock-bajo").hasAuthority("ADMIN")
						.requestMatchers("/register/**").hasAuthority("ADMIN")
						.requestMatchers("/ingresos/**").hasAuthority("ADMIN")

						.anyRequest()
						.authenticated())
				.sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(handler -> handler.authenticationEntryPoint(unauthorizedHandler))
				.build();

		//@formatter:on
	}

}
