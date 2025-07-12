package com.bit.jk_fashion_system.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class webConfiguration{

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity)throws Exception{
        httpSecurity.authorizeHttpRequests(auth -> {
            auth     
                    .requestMatchers("/resource/**").permitAll()
                    .requestMatchers("/createadmin").permitAll()
                    .requestMatchers("/login").permitAll()
                    .requestMatchers("/error").permitAll()
                    .requestMatchers("/dashboard").permitAll()
                    .requestMatchers("/index").permitAll()
                    .requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager","Production_Manager","Sales_Agent","StoreKeeper")
                    .requestMatchers("/user/**").hasAnyAuthority("Admin","Manager")
                    .requestMatchers("/privilege/**").hasAnyAuthority("Admin", "Manager", "Production_Manager")
                    .requestMatchers("/material/**").hasAnyAuthority("Admin","Manager","StoreKeeper")
                    .requestMatchers("/supplier/**").hasAnyAuthority("Admin","Manager","StoreKeeper")
                    .requestMatchers("/product/**").hasAnyAuthority("Admin","Production_Manager","Manager","StoreKeeper")
                    .requestMatchers("/shop/**").hasAnyAuthority("Admin","Manager") 
                    .requestMatchers("/report/**").hasAnyAuthority("Admin","Manager","Production_Manager","Sales_Agent","StoreKeeper")
                    .requestMatchers("/purchaseorder/**").hasAnyAuthority("Admin","Manager","Production_Manager","Sales_Agent","StoreKeeper")
                    .requestMatchers("/grn/**").hasAnyAuthority("Admin","Manager","StoreKeeper")
                     

                    .anyRequest().authenticated();

        })
                //login form detailed
                .formLogin(login -> {
                    login.loginPage("/login")
                            .defaultSuccessUrl("/index",true)
                            .failureUrl("/login?error=usernamepassworderror")
                            .usernameParameter("username")
                            .passwordParameter("password");
                })

                //logout
                .logout (logout ->{
                    logout
                            .logoutUrl("/logout")
                            .logoutSuccessUrl("/login");
                })

                //exception
               .exceptionHandling(exception ->{
                   exception.accessDeniedPage("/error");
                //    exception.accessDeniedPage("/login?error=usernamepassworderror");
               })
                
               //request url without in chrome like js
                .csrf(csrf ->{
                    csrf.disable();
                });

        return  httpSecurity.build();
    }

    @Bean
     public BCryptPasswordEncoder bCryptPasswordEncoder(){
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }


}


