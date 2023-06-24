package com.polify.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.polify.entity.LoginHistory;
import com.polify.repository.LoginHistoryRepository;
import com.polify.service.LoginHistoryService;

@Service
public class LoginHistoryServiceImpl implements LoginHistoryService {
	
	@Autowired
	private LoginHistoryRepository loginHistoryRepository;

	@Override
	public LoginHistory save(String email, String attemptStatus) {
		LoginHistory entity = new LoginHistory();
		entity.setEmail(email);
		entity.setAttemptStatus(attemptStatus);
		entity.setAttemptAt(new Date());
		return loginHistoryRepository.saveAndFlush(entity);
	}

	@Override
	public List<LoginHistory> findByEmail(String email) {
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Direction.DESC, "attemptAt"));
		return loginHistoryRepository.findByEmail(email, pageable);
	}

	@Override
	public LoginHistory save(LoginHistory entity) {
		return loginHistoryRepository.saveAndFlush(entity);
	}

}