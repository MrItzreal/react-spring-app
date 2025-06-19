package com.izzy.stack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // Disable CSRF protection, as it's not needed for stateless REST APIs
        .csrf(csrf -> csrf.disable())

        // Define authorization rules
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**").authenticated() // Secure all API endpoints
            .anyRequest().permitAll() // Allow other requests (like to root '/')
        )

        // Configure session management to be stateless, as we are using tokens
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Configure the app as an OAuth2 Resource Server, enabling JWT validation
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

    return http.build();
  }
}