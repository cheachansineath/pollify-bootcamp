package com.polify.service;

import com.polify.entity.Poll;
import com.polify.entity.PollOption;
import com.polify.entity.User;

import java.util.List;

public interface PollOptionService {

    public List<PollOption> getPollOptionByPollId(Long id);

    public void addPollOption(PollOption pollOption);

    public Poll getPollById(Long id);

    public Long countTotalVoted(Long pollId);
}
