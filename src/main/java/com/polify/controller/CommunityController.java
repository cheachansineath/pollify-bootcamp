package com.polify.controller;

import com.polify.entity.Community;
import com.polify.entity.CommunityMembers;
import com.polify.entity.User;
import com.polify.model.CommunityDTO;
import com.polify.service.CommunityMembersService;
import com.polify.service.CommunityService;
import com.polify.service.UserAccountService;
import com.polify.utils.ProjectUtils;
import com.polify.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ProjectUtils.COMMUNITY_URL)
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @Autowired
    private CommunityMembersService communityMembersService;

    @Autowired
    private UserAccountService userAccountService;

    @GetMapping(path = "/all")
    public List<Community> getAllCommunity(){
        return communityService.getAllCommunity();
    }

    @GetMapping(path = "{user_id}")
    public List<Community> getCommunity(@PathVariable Long user_id){
        return communityService.getCommunity(user_id);
    }

    @PostMapping(value = "", consumes = "multipart/form-data")
    public Map<String, Object> addCommunity(CommunityDTO communityDTO, @RequestPart(name = "file", required = false) MultipartFile file) throws IOException {
        String uploadUrl = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User creator = userAccountService.getUserByUsername(username);
        String file_name = null;
        String file_url = null;
        if (file != null) {
            uploadUrl = ProjectUtils.FILE_URL;
            byte[] fileBytes = file.getBytes();
            String fileName = file.getOriginalFilename();
            file_name = Utils.uploadFile(fileBytes, fileName);
            file_url = uploadUrl + "/files/" + file_name;
        }

        Community community = new Community();
        community.setCommunityName(communityDTO.getCommunityName());
        community.setCommunityDescription(communityDTO.getCommunityDescription());
        community.setUsers(creator);
        community.setImage(file_name);
        Community savedCommunity = communityService.addCommunity(community);

        List<Long> userIdList = communityDTO.getUserId();
        userIdList.add(0, creator.getId());
        for (Long userId : userIdList) {
            CommunityMembers communityMembers = new CommunityMembers();
            communityMembers.setCommunity(savedCommunity);
            User user = communityService.getUserById(userId);
            communityMembers.setUsers(user);
            communityMembersService.addCommunityMembers(communityMembers);
        }

        Object resCommunity = communityMembersService.getCommunityMembersResponse(savedCommunity.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("community", resCommunity);
        response.put("file_url", file_url);

        return response;
    }
}