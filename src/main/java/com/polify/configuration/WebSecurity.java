package com.polify.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.polify.filter.JWTAuthenticationFilter;
import com.polify.filter.JWTAuthorizationFilter;
import com.polify.service.LoginHistoryService;
import com.polify.service.UserAccountService;
import com.polify.utils.ProjectUtils;

@Configuration
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserAccountService userDetailService;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private LoginHistoryService loginHistoryService;

    @Autowired
    private UserAccountService userAccountService;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().authorizeRequests()
				.antMatchers(
                    HttpMethod.POST,
                    ProjectUtils.REGISTER_USER_FULL_URL,
                    ProjectUtils.VERIFY_USER_FULL_URL,
                    ProjectUtils.FORGOT_PASSWORD_USER_FULL_URL,
                    ProjectUtils.VERIFY_FORGOT_PASSWORD_FULL_URL,
                    ProjectUtils.RESET_FORGOT_PASSWORD_FULL_URL
                )
                .permitAll().anyRequest()
				.authenticated().and().addFilter(this.getJWTAuthenticationFilter())
				.addFilter(new JWTAuthorizationFilter(authenticationManager())).sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    }

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailService).passwordEncoder(bCryptPasswordEncoder);
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
		return source;
	}

	public JWTAuthenticationFilter getJWTAuthenticationFilter() throws Exception {
		final JWTAuthenticationFilter filter = new JWTAuthenticationFilter(authenticationManager(),
				loginHistoryService, userAccountService);
		filter.setFilterProcessesUrl(ProjectUtils.LOGIN_URL); // override the default spring login URL
		return filter;
	}
}
