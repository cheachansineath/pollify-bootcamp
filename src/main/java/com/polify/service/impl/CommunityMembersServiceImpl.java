package com.polify.service.impl;

import com.polify.entity.Community;
import com.polify.entity.CommunityMembers;
import com.polify.entity.User;
import com.polify.repository.CommunityMembersRepository;
import com.polify.repository.CommunityRepository;
import com.polify.repository.UserRepository;
import com.polify.service.CommunityMembersService;
import com.polify.utils.ProjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class CommunityMembersServiceImpl implements CommunityMembersService {

    @Autowired
    private CommunityMembersRepository communityMembersRepository;

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<CommunityMembers> getCommunityMembers(UUID id) {
        return communityMembersRepository.findByCommunityId(id);
    }

    @Override
    public List<CommunityMembers> getUserCommunity(Long id) {
        return communityMembersRepository.findByUsersId(id);
    }

    @Override
    public CommunityMembers addCommunityMembers(Community community, User user, String role) {
        CommunityMembers communityMembers = new CommunityMembers();
        communityMembers.setCommunity(community);
        communityMembers.setUsers(user);
        communityMembers.setRole(role);
        return communityMembersRepository.save(communityMembers);
    }



    @Override
    public User getUserById(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!!!"));
    }

    @Override
    public Community getCommunityById(UUID communityId){
        return communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found!!!"));
    }

    @Override
    public CommunityMembers isExist(Community community, User user) {
        return communityMembersRepository.findByCommunityAndUsers(community, user);
    }

    @Override
    public Map<String, Object> getCommunityMembersResponse(UUID id) {
        Map<String, Object> response = new HashMap<>();

        List<CommunityMembers> communityMembers = getCommunityMembers(id);
        Community community = communityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Community not found!!!"));

        String name = community.getCommunityName();
        LocalDate dateCreated = community.getDateCreated();

        response.put("id", id);
        response.put("name", name);
        response.put("dateCreated", dateCreated);

        List<Map<String, Object>> userList = new ArrayList<>();
        for (CommunityMembers communityMember: communityMembers) {
            Map<String, Object> userMap = new HashMap<>();
            User user = communityMember.getUsers();

            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("role", communityMember.getRole());

            userList.add(userMap);
        }

        response.put("user", userList);


        return response;
    }

    @Override
    public Map<String, Object> getUserCommunityResponse(Long id) {
        Map<String, Object> response = new HashMap<>();
        String file_url = ProjectUtils.FILE_URL;

        List<CommunityMembers> communityMembers = getUserCommunity(id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found!!!"));

        response.put("id", id);
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        List<Map<String, Object>> communityList = new ArrayList<>();
        for (CommunityMembers communityMember: communityMembers) {
            Map<String, Object> communityMap = new HashMap<>();
            Community community = communityMember.getCommunity();
            communityMap.put("id", community.getId());
            communityMap.put("name", community.getCommunityName());
            if (community.getImage() != null){
                communityMap.put("image", file_url + "/files/" + community.getImage());
            }
            else {
                communityMap.put("image", null);
            }

            communityList.add(communityMap);
        }
        response.put("community", communityList);

        return response;
    }

    @Override
    public CommunityMembers saveCommunityMember(CommunityMembers communityMembers) {
        return communityMembersRepository.save(communityMembers);
    }

    @Override
    public void leaveCommunity(Long id) {
        communityMembersRepository.deleteById(id);
    }
}