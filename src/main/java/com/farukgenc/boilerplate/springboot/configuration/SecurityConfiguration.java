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
						//SASTRE
						.requestMatchers("/ingresos/nuevo").hasAuthority("USER")
						.requestMatchers("/inventario/all", "/inventario/Usando", "/inventario/stock-bajo").hasAuthority("USER")
						.requestMatchers("/orders/all").hasAuthority("USER")
						.requestMatchers("/orders/{id}/**").hasAuthority("USER")
						.requestMatchers("/orders/estado/**").hasAuthority("USER")
						.requestMatchers("/orders/concepto").hasAuthority("USER")
						.requestMatchers("/orders/customer").hasAuthority("USER")
						.requestMatchers("/orders/sastre").hasAuthority("USER")

						//ADMIN Y SASTRE
						.requestMatchers("/abonos/**").hasAnyAuthority("ADMIN", "USER")
						.requestMatchers("/customers/**").hasAnyAuthority("ADMIN", "USER")
						.requestMatchers("/prendas/**").hasAnyAuthority("ADMIN", "USER")

						//ADMIN
						.requestMatchers("/orders/**").hasAuthority("ADMIN")
						.requestMatchers("/arqueo/**").hasAuthority("ADMIN")
						.requestMatchers("/gastos/**").hasAuthority("ADMIN")
						.requestMatchers("/nomina/**").hasAuthority("ADMIN")
						.requestMatchers("/users/**").hasAuthority("ADMIN")
						.requestMatchers("/ingresos/**").hasAuthority("ADMIN")
						.requestMatchers("/inventario/**").hasAuthority("ADMIN")
						.requestMatchers("/register/**").hasAuthority("ADMIN")
						.requestMatchers("/users/**").hasAuthority("ADMIN")
						.anyRequest()
						.authenticated())
				.sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(handler -> handler.authenticationEntryPoint(unauthorizedHandler))
				.build();

		//@formatter:on
	}

}
