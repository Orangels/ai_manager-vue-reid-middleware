import $api from "../api";
const Mock = require('mockjs');
Mock.setup({timeout: '200-1000'});

import mockJson from "./json/userInfo";

// 
// Mock.mock($api.videoList, 'post', mockJson.user1);
// Mock.mock($api.taskList, 'post', mockJson.userList);
// Mock.mock($api.taskMgt, 'post', mockJson.mgtList);
Mock.mock($api.markMgtData, 'post', mockJson.markMgtData);
Mock.mock($api.markMgtTemp, 'post', mockJson.markMgtTemp);