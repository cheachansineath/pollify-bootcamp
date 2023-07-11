package com.polify.controller;

import com.polify.entity.Community;
import com.polify.entity.CommunityMembers;
import com.polify.entity.User;
import com.polify.service.CommunityMembersService;
import com.polify.service.UserAccountService;
import com.polify.utils.ProjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(ProjectUtils.COMMUNITY_MEMBERS_URL)
public class CommunityMembersController {

    @Autowired
    private CommunityMembersService communityMembersService;

    @Autowired
    private UserAccountService userAccountService;

    @GetMapping(path = "/user")
    public Map<String, Object> getUserCommunity(Authentication authentication){
        String username = authentication.getName();
        User user = userAccountService.getUserByUsername(username);

        return communityMembersService.getUserCommunityResponse(user.getId());
    }

    @GetMapping(path = "/community/{id}")
    public Map<String, Object> getCommunityMembers(@PathVariable Long id){
        return communityMembersService.getCommunityMembersResponse(id);
    }

    @GetMapping(path = "/join/community/{id}")
    public Map<String, Object> joinMember(@PathVariable Long id, Authentication authentication){

        String username = authentication.getName();
        User user = userAccountService.getUserByUsername(username);

        Community community = communityMembersService.getCommunityById(id);

        Boolean isMember = communityMembersService.isExist(community, user);
        Map<String, Object> joinCommunity = new HashMap<>();
        joinCommunity.put("isMember", isMember);
        return joinCommunity;
    }

    @PostMapping(path = "/community/{id}")
    public ResponseEntity<Object> addCommunityMembers(@PathVariable Long id, Authentication authentication){

        String username = authentication.getName();
        User user = userAccountService.getUserByUsername(username);

        Community community = communityMembersService.getCommunityById(id);

        if (communityMembersService.isExist(community, user)){
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("User is already in Community!!!");
        }
        CommunityMembers communityMembers = new CommunityMembers();

        communityMembers.setUsers(user);
        communityMembers.setCommunity(community);

        CommunityMembers savedCommunityMembers = communityMembersService.addCommunityMembers(communityMembers);

        return ResponseEntity.ok(savedCommunityMembers);
    }
}