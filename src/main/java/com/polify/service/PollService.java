package com.polify.service;

import com.polify.entity.Community;
import com.polify.entity.Poll;
import com.polify.entity.User;

import java.util.List;
import java.util.Map;

public interface PollService {

    public Poll getPoll(Long id);

    public List<Poll> getCommunityPoll(Long id);

    public Poll addPoll(Poll poll);

    public Community getCommunityById(Long id);

    public User getUserById(Long id);

    public Map<String, Object> getPollResponse(Poll poll, User user);
}