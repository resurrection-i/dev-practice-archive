/*
 Navicat Premium Data Transfer

 Source Server         : mysql8
 Source Server Type    : MySQL
 Source Server Version : 80036
 Source Host           : localhost:3306
 Source Schema         : campus_notice

 Target Server Type    : MySQL
 Target Server Version : 80036
 File Encoding         : 65001

 Date: 16/12/2025 20:26:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分类描述',
  `sort_order` int NULL DEFAULT 0 COMMENT '排序顺序',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '学术通知', '学术讲座、会议等通知', 1, '2025-12-16 11:30:35', '2025-12-16 11:30:35');
INSERT INTO `category` VALUES (2, '教务公告', '选课、考试等教务信息', 2, '2025-12-16 11:30:35', '2025-12-16 11:30:35');
INSERT INTO `category` VALUES (3, '校园活动', '社团活动、文体活动等', 3, '2025-12-16 11:30:35', '2025-12-16 11:30:35');
INSERT INTO `category` VALUES (4, '就业信息', '招聘会、实习信息等', 4, '2025-12-16 11:30:35', '2025-12-16 11:30:35');
INSERT INTO `category` VALUES (5, '行政通知', '学校行政管理相关通知', 5, '2025-12-16 11:30:35', '2025-12-16 11:30:35');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `notice_id` bigint NOT NULL COMMENT '公告ID',
  `user_id` bigint NOT NULL COMMENT '评论用户ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_notice_id`(`notice_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `fk_comment_notice` FOREIGN KEY (`notice_id`) REFERENCES `notice` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (1, 1, 2, '这个讲座很有意思，我一定会参加！', '2025-12-15 10:30:00');
INSERT INTO `comment` VALUES (2, 1, 3, '请问需要提前报名吗？', '2025-12-15 11:00:00');
INSERT INTO `comment` VALUES (3, 2, 2, '选课系统什么时候开放？', '2025-12-14 09:00:00');
INSERT INTO `comment` VALUES (4, 2, 3, '感谢提醒，差点忘记选课了', '2025-12-14 10:30:00');
INSERT INTO `comment` VALUES (5, 3, 2, '篮球比赛我要报名！', '2025-12-13 14:00:00');
INSERT INTO `comment` VALUES (6, 4, 3, '这家公司待遇怎么样？', '2025-12-12 16:00:00');
INSERT INTO `comment` VALUES (7, 5, 2, '已经提交申请了，谢谢通知', '2025-12-11 11:00:00');
INSERT INTO `comment` VALUES (8, 1, 4, '什么时候放假', '2025-12-16 18:05:21');
INSERT INTO `comment` VALUES (9, 1, 5, '我想回家过年', '2025-12-16 18:39:53');
INSERT INTO `comment` VALUES (11, 1, 6, '我想回家', '2025-12-16 18:47:19');

-- ----------------------------
-- Table structure for favorite
-- ----------------------------
DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `notice_id` bigint NOT NULL COMMENT '公告ID',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_notice`(`user_id` ASC, `notice_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_notice_id`(`notice_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of favorite
-- ----------------------------
INSERT INTO `favorite` VALUES (1, 4, 2, '2025-12-16 11:42:07');
INSERT INTO `favorite` VALUES (2, 4, 7, '2025-12-16 16:47:35');
INSERT INTO `favorite` VALUES (3, 4, 1, '2025-12-16 18:05:31');
INSERT INTO `favorite` VALUES (4, 5, 1, '2025-12-16 18:39:56');

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '公告内容',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `author_id` bigint NOT NULL COMMENT '发布者ID',
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览次数',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：0-草稿，1-已发布',
  `is_top` tinyint NULL DEFAULT 0 COMMENT '是否置顶：0-否，1-是',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category_id`(`category_id` ASC) USING BTREE,
  INDEX `idx_author_id`(`author_id` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (1, '关于2025-2026学年第一学期期末考试安排的通知', '各位同学：\n\n根据学校教学安排，本学期期末考试将于2026年1月6日至1月15日进行。请各位同学做好复习准备，按时参加考试。\n\n具体考试时间和地点请登录教务系统查询。\n\n教务处\n2025年12月16日', 2, 1, NULL, 19, 1, 1, '2025-12-16 11:30:35', '2025-12-16 18:48:12');
INSERT INTO `notice` VALUES (2, '计算机科学前沿技术讲座通知', '讲座主题：人工智能与大数据技术应用\n主讲人：李教授\n时间：2025年12月20日 14:00\n地点：学术报告厅\n\n欢迎广大师生参加！', 1, 1, NULL, 1, 1, 0, '2025-12-16 11:30:35', '2025-12-16 11:42:05');
INSERT INTO `notice` VALUES (3, '校园篮球赛报名通知', '为丰富校园文化生活，学校将举办篮球赛。\n\n报名时间：即日起至12月25日\n比赛时间：2026年1月\n报名方式：请联系体育部\n\n期待各位同学踊跃报名！', 3, 1, NULL, 0, 1, 0, '2025-12-16 11:30:35', '2025-12-16 11:30:35');
INSERT INTO `notice` VALUES (4, '关于举办\"互联网+\"创新创业大赛的通知', '各学院、各位同学：\n\n为培养学生创新创业能力，学校将举办第八届\"互联网+\"大学生创新创业大赛。\n\n大赛时间：2026年3月-5月\n参赛对象：全体在校学生\n奖项设置：\n- 一等奖3名，奖金5000元\n- 二等奖5名，奖金3000元\n- 三等奖10名，奖金1000元\n\n报名方式：请登录创新创业平台报名\n截止日期：2026年2月28日\n\n创新创业学院\n2025年12月15日', 1, 1, NULL, 3, 1, 0, '2025-12-16 12:08:50', '2025-12-16 18:48:03');
INSERT INTO `notice` VALUES (5, '关于2026年春季学期选课的通知', '各位同学：\n\n2026年春季学期选课工作即将开始，现将有关事项通知如下：\n\n选课时间：\n第一轮：2025年12月20日-12月25日\n第二轮：2026年1月5日-1月10日\n\n选课方式：登录教务系统进行网上选课\n\n注意事项：\n1. 请认真阅读课程介绍和教学大纲\n2. 注意课程时间冲突\n3. 优先选择专业必修课\n4. 选课结果以系统最终确认为准\n\n教务处\n2025年12月14日', 2, 1, NULL, 1, 1, 0, '2025-12-16 12:08:50', '2025-12-16 16:51:47');
INSERT INTO `notice` VALUES (6, '关于开展2025-2026学年第一学期学生评教工作的通知', '各位同学：\n\n为了解教学情况，提高教学质量，学校将开展本学期学生评教工作。\n\n评教时间：2025年12月18日-12月30日\n评教方式：登录教务系统进行网上评教\n\n请同学们认真、客观、公正地对任课教师进行评价。评教结果将作为教师教学质量评估的重要依据。\n\n完成评教后方可查询本学期成绩。\n\n教务处\n2025年12月13日', 2, 1, NULL, 0, 1, 0, '2025-12-16 12:08:50', '2025-12-16 12:08:50');
INSERT INTO `notice` VALUES (7, '关于举办校园歌手大赛的通知', '各位同学：\n\n为丰富校园文化生活，展示学生才艺，校团委将举办\"青春之声\"校园歌手大赛。\n\n比赛时间：\n初赛：2025年12月28日\n决赛：2026年1月8日\n\n比赛地点：大学生活动中心\n\n参赛要求：\n1. 演唱歌曲健康向上\n2. 可独唱或组合形式\n3. 自备伴奏音乐\n\n报名方式：扫描二维码填写报名表\n报名截止：2025年12月22日\n\n校团委\n2025年12月10日', 3, 1, NULL, 1, 1, 0, '2025-12-16 12:08:50', '2025-12-16 16:47:33');
INSERT INTO `notice` VALUES (8, '关于开展\"书香校园\"读书月活动的通知', '各位同学：\n\n为营造良好的读书氛围，图书馆将举办\"书香校园\"读书月活动。\n\n活动时间：2025年12月-2026年1月\n\n活动内容：\n1. 好书推荐与分享\n2. 读书心得征文比赛\n3. 名家讲座\n4. 图书漂流活动\n\n参与方式：\n- 关注图书馆公众号了解详情\n- 到图书馆一楼服务台领取活动手册\n\n优秀作品将获得精美礼品！\n\n图书馆\n2025年12月8日', 3, 1, NULL, 0, 1, 0, '2025-12-16 12:08:50', '2025-12-16 12:08:50');
INSERT INTO `notice` VALUES (9, '2026届毕业生春季校园招聘会通知', '各位毕业生：\n\n学校将举办2026届毕业生春季校园招聘会，现将有关事项通知如下：\n\n招聘会时间：2026年3月15日 9:00-17:00\n招聘会地点：体育馆\n\n参会企业：预计300余家知名企业\n招聘岗位：涵盖IT、金融、教育、制造等多个行业\n\n注意事项：\n1. 请携带个人简历（多份）\n2. 着装得体，注意仪表\n3. 提前了解企业信息\n4. 保持手机畅通\n\n就业指导中心\n2025年12月5日', 4, 1, NULL, 0, 1, 0, '2025-12-16 12:08:50', '2025-12-16 12:08:50');
INSERT INTO `notice` VALUES (10, '关于开展2026届毕业生就业意向调查的通知', '各位2026届毕业生：\n\n为更好地了解毕业生就业意向，做好就业指导服务工作，现开展就业意向调查。\n\n调查时间：2025年12月16日-12月25日\n调查方式：扫描二维码填写问卷\n\n调查内容包括：\n1. 就业期望（行业、地区、薪资等）\n2. 求职准备情况\n3. 需要的就业指导服务\n\n请同学们认真填写，您的意见对我们的工作非常重要！\n\n就业指导中心\n2025年12月3日', 4, 1, NULL, 0, 1, 0, '2025-12-16 12:08:50', '2025-12-16 12:08:50');
INSERT INTO `notice` VALUES (11, '关于2026年元旦放假安排的通知', '各单位、全体师生：\n\n根据国务院办公厅通知精神，现将2026年元旦放假安排通知如下：\n\n放假时间：2026年1月1日（星期四）至1月3日（星期六），共3天\n调休安排：1月4日（星期日）正常上班上课\n\n假期注意事项：\n1. 注意人身和财产安全\n2. 离校学生需在辅导员处登记\n3. 留校学生遵守宿舍管理规定\n4. 做好防火防盗工作\n\n祝全体师生元旦快乐！\n\n校办公室\n2025年12月1日', 5, 1, NULL, 1, 1, 0, '2025-12-16 12:08:50', '2025-12-16 18:46:07');
INSERT INTO `notice` VALUES (12, '关于加强校园安全管理的通知', '各单位、全体师生：\n\n为维护校园安全稳定，创建平安校园，现就加强校园安全管理有关事项通知如下：\n\n一、门禁管理\n1. 进出校门需刷校园卡\n2. 外来人员需登记\n3. 车辆进出需检查\n\n二、宿舍管理\n1. 严禁使用大功率电器\n2. 按时归寝，不得晚归\n3. 禁止留宿外来人员\n\n三、消防安全\n1. 定期检查消防设施\n2. 掌握消防器材使用方法\n3. 发现隐患及时报告\n\n请各单位高度重视，认真落实！\n\n保卫处\n2025年11月28日', 5, 1, NULL, 0, 1, 0, '2025-12-16 12:08:50', '2025-12-16 12:08:50');
INSERT INTO `notice` VALUES (13, '关于开展校园环境卫生整治的通知', '各单位、全体师生：\n\n为营造整洁优美的校园环境，学校决定开展校园环境卫生整治活动。\n\n整治时间：2025年12月20日-12月25日\n\n整治重点：\n1. 教学楼、宿舍楼卫生\n2. 校园道路清洁\n3. 绿化带维护\n4. 垃圾分类管理\n\n要求：\n1. 各单位做好责任区域卫生\n2. 学生宿舍保持整洁\n3. 不乱扔垃圾，不随地吐痰\n4. 爱护公共设施\n\n让我们共同努力，建设美丽校园！\n\n后勤处\n2025年11月25日', 5, 1, NULL, 0, 1, 0, '2025-12-16 12:08:50', '2025-12-16 12:08:50');
INSERT INTO `notice` VALUES (14, '好好吃饭', '请好好吃饭', 3, 6, '', 0, 1, 0, '2025-12-16 18:50:50', '2025-12-16 18:50:50');

-- ----------------------------
-- Table structure for notice_tag
-- ----------------------------
DROP TABLE IF EXISTS `notice_tag`;
CREATE TABLE `notice_tag`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `notice_id` bigint NOT NULL COMMENT '公告ID',
  `tag_id` bigint NOT NULL COMMENT '标签ID',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_notice_tag`(`notice_id` ASC, `tag_id` ASC) USING BTREE,
  INDEX `idx_notice_id`(`notice_id` ASC) USING BTREE,
  INDEX `idx_tag_id`(`tag_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '公告标签关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice_tag
-- ----------------------------
INSERT INTO `notice_tag` VALUES (1, 1, 1, '2025-12-16 11:30:35');
INSERT INTO `notice_tag` VALUES (2, 1, 3, '2025-12-16 11:30:35');
INSERT INTO `notice_tag` VALUES (3, 2, 3, '2025-12-16 11:30:35');
INSERT INTO `notice_tag` VALUES (4, 2, 5, '2025-12-16 11:30:35');
INSERT INTO `notice_tag` VALUES (5, 3, 3, '2025-12-16 11:30:35');
INSERT INTO `notice_tag` VALUES (6, 3, 4, '2025-12-16 11:30:35');
INSERT INTO `notice_tag` VALUES (7, 4, 1, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (8, 4, 4, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (9, 5, 1, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (10, 5, 3, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (11, 6, 3, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (12, 7, 4, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (13, 8, 4, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (14, 9, 1, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (15, 9, 2, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (16, 10, 3, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (17, 11, 1, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (18, 11, 3, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (19, 12, 1, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (20, 12, 2, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (21, 13, 3, '2025-12-16 12:08:50');
INSERT INTO `notice_tag` VALUES (22, 14, 3, '2025-12-16 18:50:50');

-- ----------------------------
-- Table structure for operation_log
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint NULL DEFAULT NULL COMMENT '操作用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作用户名',
  `operation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '操作类型',
  `method` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请求方法',
  `params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '请求参数',
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '操作日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operation_log
-- ----------------------------
INSERT INTO `operation_log` VALUES (1, 1, 'admin', '登录系统', 'POST /admin/login', '{\"username\":\"admin\"}', '127.0.0.1', '2025-12-16 09:00:00');
INSERT INTO `operation_log` VALUES (2, 1, 'admin', '发布公告', 'POST /admin/notice/add', '{\"title\":\"关于2025-2026学年第一学期期末考试安排的通知\"}', '127.0.0.1', '2025-12-16 09:15:00');
INSERT INTO `operation_log` VALUES (3, 1, 'admin', '编辑公告', 'PUT /admin/notice/4', '{\"title\":\"关于举办\"互联网+\"创新创业大赛的通知\"}', '127.0.0.1', '2025-12-16 09:30:00');
INSERT INTO `operation_log` VALUES (4, 1, 'admin', '删除评论', 'DELETE /admin/comment/3', '{\"id\":3}', '127.0.0.1', '2025-12-16 10:00:00');
INSERT INTO `operation_log` VALUES (5, 1, 'admin', '添加分类', 'POST /admin/category/add', '{\"name\":\"重要通知\"}', '127.0.0.1', '2025-12-16 10:15:00');
INSERT INTO `operation_log` VALUES (6, 1, 'admin', '编辑标签', 'PUT /admin/tag/2', '{\"name\":\"重要\",\"color\":\"#E6A23C\"}', '127.0.0.1', '2025-12-16 10:30:00');
INSERT INTO `operation_log` VALUES (7, 1, 'admin', '查看日志', 'GET /admin/logs', NULL, '127.0.0.1', '2025-12-16 11:00:00');
INSERT INTO `operation_log` VALUES (8, 1, 'admin', '登录系统', 'POST /admin/login', '{\"username\":\"admin\"}', '127.0.0.1', '2025-12-16 14:00:00');
INSERT INTO `operation_log` VALUES (9, 1, 'admin', '发布公告', 'POST /admin/notice/add', '{\"title\":\"关于加强校园安全管理的通知\"}', '127.0.0.1', '2025-12-16 14:30:00');
INSERT INTO `operation_log` VALUES (10, 1, 'admin', '置顶公告', 'PUT /admin/notice/4/top', '{\"isTop\":true}', '127.0.0.1', '2025-12-16 15:00:00');
INSERT INTO `operation_log` VALUES (11, 1, 'admin', '取消置顶', 'PUT /admin/notice/5/top', '{\"isTop\":false}', '127.0.0.1', '2025-12-16 15:15:00');
INSERT INTO `operation_log` VALUES (12, 1, 'admin', '删除公告', 'DELETE /admin/notice/10', '{\"id\":10}', '127.0.0.1', '2025-12-16 15:30:00');
INSERT INTO `operation_log` VALUES (13, 1, 'admin', '编辑分类', 'PUT /admin/category/3', '{\"name\":\"行政通知\"}', '127.0.0.1', '2025-12-16 16:00:00');
INSERT INTO `operation_log` VALUES (14, 1, 'admin', '添加标签', 'POST /admin/tag/add', '{\"name\":\"紧急\",\"color\":\"#F56C6C\"}', '127.0.0.1', '2025-12-16 16:30:00');
INSERT INTO `operation_log` VALUES (15, 1, 'admin', '查看统计', 'GET /admin/index', NULL, '127.0.0.1', '2025-12-16 17:00:00');
INSERT INTO `operation_log` VALUES (16, 2, 'user1', '用户登录', 'POST /user/login', '{\"username\":\"user1\"}', '127.0.0.1', '2025-12-16 08:30:00');
INSERT INTO `operation_log` VALUES (17, 2, 'user1', '查看公告', 'GET /notice/4', '{\"id\":4}', '127.0.0.1', '2025-12-16 08:35:00');
INSERT INTO `operation_log` VALUES (18, 2, 'user1', '收藏公告', 'POST /user/favorite/4', '{\"noticeId\":4}', '127.0.0.1', '2025-12-16 08:40:00');
INSERT INTO `operation_log` VALUES (19, 2, 'user1', '发表评论', 'POST /comment/add', '{\"noticeId\":4,\"content\":\"这个讲座很有意思！\"}', '127.0.0.1', '2025-12-16 08:45:00');
INSERT INTO `operation_log` VALUES (20, 3, 'user2', '用户登录', 'POST /user/login', '{\"username\":\"user2\"}', '127.0.0.1', '2025-12-16 09:00:00');
INSERT INTO `operation_log` VALUES (21, 3, 'user2', '查看公告', 'GET /notice/5', '{\"id\":5}', '127.0.0.1', '2025-12-16 09:10:00');
INSERT INTO `operation_log` VALUES (22, 3, 'user2', '发表评论', 'POST /comment/add', '{\"noticeId\":5,\"content\":\"请问需要提前报名吗？\"}', '127.0.0.1', '2025-12-16 09:15:00');
INSERT INTO `operation_log` VALUES (23, 2, 'user1', '取消收藏', 'DELETE /user/favorite/5', '{\"noticeId\":5}', '127.0.0.1', '2025-12-16 10:00:00');
INSERT INTO `operation_log` VALUES (24, 2, 'user1', '修改资料', 'PUT /user/profile', '{\"nickname\":\"张三\"}', '127.0.0.1', '2025-12-16 11:00:00');
INSERT INTO `operation_log` VALUES (25, 3, 'user2', '上传头像', 'POST /user/uploadAvatar', '{\"file\":\"avatar.jpg\"}', '127.0.0.1', '2025-12-16 12:00:00');
INSERT INTO `operation_log` VALUES (26, 6, '鸡腿饭', '修改公告', 'NoticeController.saveNotice', 'title=好好吃饭', '0:0:0:0:0:0:0:1', '2025-12-16 18:50:50');

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名称',
  `color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '#409EFF' COMMENT '标签颜色',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '标签表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES (1, '重要', '#F56C6C', '2025-12-16 11:30:35');
INSERT INTO `tag` VALUES (2, '紧急', '#E6A23C', '2025-12-16 11:30:35');
INSERT INTO `tag` VALUES (3, '通知', '#409EFF', '2025-12-16 11:30:35');
INSERT INTO `tag` VALUES (4, '活动', '#67C23A', '2025-12-16 11:30:35');
INSERT INTO `tag` VALUES (5, '讲座', '#909399', '2025-12-16 11:30:35');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '/images/default-avatar.png' COMMENT '头像路径',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'USER' COMMENT '角色：USER-普通用户，ADMIN-管理员',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', 'admin123', '系统管理员', '/uploads/avatars/20251216_dedf3b659ddf486c9d0d62609a376aa4.jpg', '', '', 'ADMIN', 1, '2025-12-16 11:30:35', '2025-12-16 18:16:00');
INSERT INTO `user` VALUES (2, 'user1', '123456', '张三', '/images/default-avatar.svg', NULL, NULL, 'USER', 1, '2025-12-16 11:30:35', '2025-12-16 12:23:39');
INSERT INTO `user` VALUES (3, 'user2', '123456', '李四', '/images/default-avatar.svg', NULL, NULL, 'USER', 1, '2025-12-16 11:30:35', '2025-12-16 12:23:39');
INSERT INTO `user` VALUES (4, '蛋炒饭', '123456', '蛋炒饭', '/uploads/avatars/20251216_0544d060900b4b8c8a27c763b9cd95e3.jpg', '123456@qq.com', '', 'USER', 1, '2025-12-16 11:36:21', '2025-12-16 16:47:02');
INSERT INTO `user` VALUES (5, '猪脚饭', '123456', '猪脚饭', '/uploads/avatars/20251216_5955c86127644eaa926650738924e0d5.jpg', '1234567@qq.com', NULL, 'ADMIN', 1, '2025-12-16 18:35:53', '2025-12-16 18:44:07');
INSERT INTO `user` VALUES (6, '鸡腿饭', '123456', '鸡腿饭', '/uploads/avatars/20251216_2e32ded3e73b4073bb37c0414abd0780.jpg', '', '', 'ADMIN', 1, '2025-12-16 18:46:40', '2025-12-16 18:49:05');

SET FOREIGN_KEY_CHECKS = 1;
