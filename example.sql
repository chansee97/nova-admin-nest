/*
 Navicat Premium Data Transfer

 Source Server         : postgres
 Source Server Type    : PostgreSQL
 Source Server Version : 170006 (170006)
 Source Host           : localhost:5432
 Source Catalog        : nova2
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 130000
 File Encoding         : 65001

 Date: 15/01/2026 23:31:21
*/


-- ----------------------------
-- Type structure for sys_menu_menu_type_enum
-- ----------------------------
DROP TYPE IF EXISTS "sys_menu_menu_type_enum";
CREATE TYPE "sys_menu_menu_type_enum" AS ENUM (
  'directory',
  'page',
  'permission'
);
ALTER TYPE "sys_menu_menu_type_enum" OWNER TO "postgres";

-- ----------------------------
-- Type structure for sys_user_gender_enum
-- ----------------------------
DROP TYPE IF EXISTS "sys_user_gender_enum";
CREATE TYPE "sys_user_gender_enum" AS ENUM (
  'male',
  'female',
  'unknown'
);
ALTER TYPE "sys_user_gender_enum" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for sys_dept_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_dept_id_seq";
CREATE SEQUENCE "sys_dept_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_dict_data_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_dict_data_id_seq";
CREATE SEQUENCE "sys_dict_data_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_dict_type_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_dict_type_id_seq";
CREATE SEQUENCE "sys_dict_type_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_login_log_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_login_log_id_seq";
CREATE SEQUENCE "sys_login_log_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_menu_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_menu_id_seq";
CREATE SEQUENCE "sys_menu_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_role_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_role_id_seq";
CREATE SEQUENCE "sys_role_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_user_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "sys_user_id_seq";
CREATE SEQUENCE "sys_user_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS "sys_dept";
CREATE TABLE "sys_dept" (
  "id" int4 NOT NULL DEFAULT nextval('sys_dept_id_seq'::regclass),
  "parent_id" int4 NOT NULL DEFAULT 0,
  "ancestors" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "dept_name" varchar(30) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "sort" int4 NOT NULL DEFAULT 0,
  "leader" varchar(11) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "phone" varchar(11) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "email" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "status" int2 NOT NULL DEFAULT '0'::smallint,
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_time" timestamp(6) NOT NULL DEFAULT now(),
  "remark" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying
)
;
COMMENT ON COLUMN "sys_dept"."id" IS '部门ID';
COMMENT ON COLUMN "sys_dept"."parent_id" IS '父部门ID';
COMMENT ON COLUMN "sys_dept"."ancestors" IS '祖级列表';
COMMENT ON COLUMN "sys_dept"."dept_name" IS '部门名称';
COMMENT ON COLUMN "sys_dept"."sort" IS '显示顺序';
COMMENT ON COLUMN "sys_dept"."leader" IS '负责人';
COMMENT ON COLUMN "sys_dept"."phone" IS '联系电话';
COMMENT ON COLUMN "sys_dept"."email" IS '邮箱';
COMMENT ON COLUMN "sys_dept"."status" IS '部门状态（0正常 1停用）';
COMMENT ON COLUMN "sys_dept"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_dept"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_dept"."remark" IS '备注';

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
BEGIN;
INSERT INTO "sys_dept" ("id", "parent_id", "ancestors", "dept_name", "sort", "leader", "phone", "email", "status", "create_time", "update_time", "remark") VALUES (1, 0, '', '诺瓦科技', 0, '', '', '', 0, '2025-09-05 07:22:42.438556', '2025-09-05 07:22:42.438556', ''), (2, 1, '1', '技术部', 0, '', '', '', 0, '2025-09-05 07:22:51.399712', '2025-09-05 07:22:51.399712', ''), (3, 1, '1', '行政部', 0, '', '', '', 0, '2025-09-05 07:23:07.965222', '2025-09-05 07:23:07.965222', ''), (4, 1, '1', '人事部', 0, '', '', '', 0, '2025-09-05 07:23:36.722431', '2025-09-05 07:23:36.722431', ''), (5, 1, '1', '采购部', 0, '', '', '', 0, '2025-09-05 07:23:44.414716', '2025-09-05 07:23:44.414716', '');
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS "sys_dict_data";
CREATE TABLE "sys_dict_data" (
  "id" int4 NOT NULL DEFAULT nextval('sys_dict_data_id_seq'::regclass),
  "sort" int4 NOT NULL DEFAULT 0,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "value" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "dict_type" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "status" int2 NOT NULL DEFAULT '0'::smallint,
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_time" timestamp(6) NOT NULL DEFAULT now(),
  "remark" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "dict_type_entity" varchar(100) COLLATE "pg_catalog"."default"
)
;
COMMENT ON COLUMN "sys_dict_data"."id" IS '字典数据id';
COMMENT ON COLUMN "sys_dict_data"."sort" IS '字典排序';
COMMENT ON COLUMN "sys_dict_data"."name" IS '字典标签';
COMMENT ON COLUMN "sys_dict_data"."value" IS '字典键值';
COMMENT ON COLUMN "sys_dict_data"."dict_type" IS '字典类型';
COMMENT ON COLUMN "sys_dict_data"."status" IS '状态（0正常 1停用）';
COMMENT ON COLUMN "sys_dict_data"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_dict_data"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_dict_data"."remark" IS '备注';
COMMENT ON COLUMN "sys_dict_data"."dict_type_entity" IS '字典类型';

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
BEGIN;
INSERT INTO "sys_dict_data" ("id", "sort", "name", "value", "dict_type", "status", "create_time", "update_time", "remark", "dict_type_entity") VALUES (1, 0, '男', '1', 'gender', 0, '2025-09-05 07:41:57.350542', '2025-09-05 07:41:57.350542', '', NULL), (2, 0, '女', '0', 'gender', 0, '2025-09-05 07:42:05.033816', '2025-09-05 07:42:05.033816', '', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS "sys_dict_type";
CREATE TABLE "sys_dict_type" (
  "id" int4 NOT NULL DEFAULT nextval('sys_dict_type_id_seq'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "type" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "status" int2 NOT NULL DEFAULT '0'::smallint,
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_time" timestamp(6) NOT NULL DEFAULT now(),
  "remark" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying
)
;
COMMENT ON COLUMN "sys_dict_type"."id" IS '字典主键';
COMMENT ON COLUMN "sys_dict_type"."name" IS '字典名称';
COMMENT ON COLUMN "sys_dict_type"."type" IS '字典类型';
COMMENT ON COLUMN "sys_dict_type"."status" IS '状态（0正常 1停用）';
COMMENT ON COLUMN "sys_dict_type"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_dict_type"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_dict_type"."remark" IS '备注';

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
BEGIN;
INSERT INTO "sys_dict_type" ("id", "name", "type", "status", "create_time", "update_time", "remark") VALUES (1, '性别', 'gender', 1, '2025-09-05 07:41:45.74599', '2025-09-05 07:41:45.74599', '');
COMMIT;

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS "sys_login_log";
CREATE TABLE "sys_login_log" (
  "id" int8 NOT NULL DEFAULT nextval('sys_login_log_id_seq'::regclass),
  "username" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "ipaddr" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "login_location" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "browser" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "os" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "status" int4 NOT NULL DEFAULT 0,
  "msg" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "login_time" timestamp(6) NOT NULL DEFAULT now()
)
;
COMMENT ON COLUMN "sys_login_log"."username" IS '用户账号';
COMMENT ON COLUMN "sys_login_log"."ipaddr" IS '登录IP地址';
COMMENT ON COLUMN "sys_login_log"."login_location" IS '登录地点';
COMMENT ON COLUMN "sys_login_log"."browser" IS '浏览器类型';
COMMENT ON COLUMN "sys_login_log"."os" IS '操作系统';
COMMENT ON COLUMN "sys_login_log"."status" IS '登录状态（0成功 1失败）';
COMMENT ON COLUMN "sys_login_log"."msg" IS '提示消息';
COMMENT ON COLUMN "sys_login_log"."login_time" IS '访问时间';

-- ----------------------------
-- Records of sys_login_log
-- ----------------------------
BEGIN;
INSERT INTO "sys_login_log" ("id", "username", "ipaddr", "login_location", "browser", "os", "status", "msg", "login_time") VALUES (47, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-16 22:02:17.771698'), (48, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-17 21:17:24.995225'), (49, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-17 22:14:10.632234'), (50, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-18 00:41:03.381888'), (51, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 1, '密码错误', '2025-09-28 23:16:53.472871'), (52, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 1, '密码错误', '2025-09-28 23:18:10.092578'), (53, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 1, '密码错误', '2025-09-28 23:26:26.620483'), (54, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 1, '密码错误', '2025-09-28 23:26:51.450504'), (55, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:29:45.438322'), (56, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:30:17.711998'), (57, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:31:35.065647'), (58, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:33:08.9868'), (59, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:33:32.775863'), (60, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:33:38.969026'), (61, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:36:17.311841'), (62, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:36:42.900249'), (63, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:38:18.776347'), (64, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:40:36.814876'), (65, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:43:04.567429'), (66, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:45:07.012127'), (67, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:46:51.890019'), (68, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:51:50.103113'), (69, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:53:03.518949'), (70, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:53:42.115803'), (71, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:55:21.084666'), (72, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:56:12.274508'), (73, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-09-28 23:58:48.453935'), (74, 'admin', '::1', '未知', 'Chrome 140.0.0.0', 'Windows 10', 0, '登录成功', '2025-10-09 20:52:44.880855'), (75, 'admin', '::1', '未知', 'Chrome 141.0.0.0', 'Windows 10', 0, '登录成功', '2025-10-20 21:34:21.928616'), (1, 'admin', '::1', '未知', 'Chrome 143.0.0.0', 'Windows 10', 0, '登录成功', '2026-01-15 21:03:25.186941');
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS "sys_menu";
CREATE TABLE "sys_menu" (
  "id" int4 NOT NULL DEFAULT nextval('sys_menu_id_seq'::regclass),
  "title" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "parent_id" int4 NOT NULL DEFAULT 0,
  "menu_type" "public"."sys_menu_menu_type_enum" NOT NULL DEFAULT 'directory'::sys_menu_menu_type_enum,
  "sort" int4 NOT NULL DEFAULT 0,
  "path" varchar(200) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "component" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "active_path" varchar(200) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "icon" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "i18n_key" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "menu_visible" bool NOT NULL DEFAULT true,
  "tab_visible" bool NOT NULL DEFAULT true,
  "pin_tab" bool NOT NULL DEFAULT false,
  "is_link" bool NOT NULL DEFAULT false,
  "link_path" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "keep_alive" bool NOT NULL DEFAULT false,
  "perms" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "status" int2 NOT NULL DEFAULT '0'::smallint,
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_time" timestamp(6) NOT NULL DEFAULT now(),
  "remark" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying
)
;
COMMENT ON COLUMN "sys_menu"."id" IS '菜单ID';
COMMENT ON COLUMN "sys_menu"."title" IS '菜单名称';
COMMENT ON COLUMN "sys_menu"."parent_id" IS '父菜单ID';
COMMENT ON COLUMN "sys_menu"."menu_type" IS '菜单类型（directory目录 page菜单 permission权限）';
COMMENT ON COLUMN "sys_menu"."sort" IS '显示顺序';
COMMENT ON COLUMN "sys_menu"."path" IS '路由地址';
COMMENT ON COLUMN "sys_menu"."component" IS '组件路径';
COMMENT ON COLUMN "sys_menu"."active_path" IS '高亮菜单路径';
COMMENT ON COLUMN "sys_menu"."icon" IS '菜单图标';
COMMENT ON COLUMN "sys_menu"."i18n_key" IS '国际化标识Key';
COMMENT ON COLUMN "sys_menu"."menu_visible" IS '菜单显示状态';
COMMENT ON COLUMN "sys_menu"."tab_visible" IS '标签栏显示状态';
COMMENT ON COLUMN "sys_menu"."pin_tab" IS '是否固定标签页';
COMMENT ON COLUMN "sys_menu"."is_link" IS '是否为外链';
COMMENT ON COLUMN "sys_menu"."link_path" IS '外链地址';
COMMENT ON COLUMN "sys_menu"."keep_alive" IS '是否缓存';
COMMENT ON COLUMN "sys_menu"."perms" IS '权限标识';
COMMENT ON COLUMN "sys_menu"."status" IS '菜单状态（0正常 1停用）';
COMMENT ON COLUMN "sys_menu"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_menu"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_menu"."remark" IS '备注';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO "sys_menu" ("id", "title", "parent_id", "menu_type", "sort", "path", "component", "active_path", "icon", "i18n_key", "menu_visible", "tab_visible", "pin_tab", "is_link", "link_path", "keep_alive", "perms", "status", "create_time", "update_time", "remark") VALUES (1, '系统设置', 0, 'directory', 0, '/system', '', '', 'icon-park-outline:setting-two', '', 'f', 'f', 'f', 'f', '', 'f', '', 0, '2025-09-04 22:25:27.55892', '2025-09-04 22:26:53.94008', ''), (7, '角色删除', 3, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:role:remove', 0, '2025-09-04 22:29:42.195457', '2025-09-05 00:15:22.416265', ''), (6, '角色编辑', 3, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:role:edit', 0, '2025-09-04 22:29:06.033666', '2025-09-05 00:15:26.198026', ''), (5, '角色添加', 3, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:role:add', 0, '2025-09-04 22:28:54.311916', '2025-09-05 00:15:29.098766', ''), (4, '角色查询', 3, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:role:query', 0, '2025-09-04 22:28:30.996954', '2025-09-05 00:15:34.193515', ''), (8, '用户新增', 2, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:user:add', 0, '2025-09-05 07:25:16.218236', '2025-09-05 07:25:16.218236', ''), (9, '用户查询', 2, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:user:query', 0, '2025-09-05 07:26:17.80624', '2025-09-05 07:26:17.80624', ''), (10, '用户编辑', 2, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:user:edit', 0, '2025-09-05 07:26:42.51188', '2025-09-05 07:26:42.51188', ''), (11, '用户删除', 2, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:user:remove', 0, '2025-09-05 07:27:12.668509', '2025-09-05 07:27:12.668509', ''), (3, '角色管理', 1, 'page', 1, '/system/role', '/system/role/index.vue', '', 'icon-park-outline:user-positioning', '', 'f', 'f', 'f', 'f', '', 'f', 'system:role:list', 0, '2025-09-04 22:27:40.675801', '2025-09-05 07:27:34.892907', ''), (13, '菜单查询', 12, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:menu:query', 0, '2025-09-05 07:29:19.511006', '2025-09-05 07:29:19.511006', ''), (14, '菜单新增', 12, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:menu:add', 0, '2025-09-05 07:29:37.681383', '2025-09-05 07:29:37.681383', ''), (15, '菜单编辑', 12, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:menu:edit', 0, '2025-09-05 07:29:50.830261', '2025-09-05 07:29:50.830261', ''), (16, '菜单删除', 12, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:menu:remove', 0, '2025-09-05 07:30:05.549868', '2025-09-05 07:30:05.549868', ''), (12, '菜单管理', 1, 'page', 2, '/system/menu', '/system/menu/index.vue', '', 'icon-park-outline:application-menu', '', 'f', 'f', 'f', 'f', '', 'f', 'system:menu:list', 0, '2025-09-05 07:28:41.80642', '2025-09-05 07:31:09.052239', ''), (17, '字典管理', 1, 'page', 3, '/system/dict', '/system/dict/index.vue', '', 'icon-park-outline:book-one', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dict:list', 0, '2025-09-05 07:32:47.801897', '2025-09-05 07:32:47.801897', ''), (18, '字典查询', 17, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dict:query', 0, '2025-09-05 07:33:42.604876', '2025-09-05 07:33:42.604876', ''), (19, '字典新增', 17, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dict:add', 0, '2025-09-05 07:34:07.631181', '2025-09-05 07:34:07.631181', ''), (20, '字典编辑', 17, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dict:edit', 0, '2025-09-05 07:34:25.275021', '2025-09-05 07:34:25.275021', ''), (21, '字典删除', 17, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dict:remove', 0, '2025-09-05 07:34:46.840371', '2025-09-05 07:34:46.840371', ''), (22, '部门管理', 1, 'page', 4, '/system/dept', '/system/dept/index.vue', '', 'icon-park-outline:id-card-h', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dept:list', 0, '2025-09-05 07:38:28.004339', '2025-09-05 07:38:28.004339', ''), (23, '部门查询', 22, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dept:query', 0, '2025-09-05 07:38:45.396156', '2025-09-05 07:39:21.178533', ''), (24, '部门新增', 22, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dept:add', 0, '2025-09-05 07:39:38.022545', '2025-09-05 07:39:38.022545', ''), (25, '部门编辑', 22, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dept:edit', 0, '2025-09-05 07:40:01.005846', '2025-09-05 07:40:01.005846', ''), (26, '部门删除', 22, 'permission', 0, '', '', '', '', '', 'f', 'f', 'f', 'f', '', 'f', 'system:dept:remove', 0, '2025-09-05 07:40:14.741847', '2025-09-05 07:40:14.741847', ''), (2, '用户管理', 1, 'page', 0, '/system/user', '/system/user/index.vue', '', 'icon-park-outline:every-user', '', 'f', 'f', 'f', 'f', '', 'f', 'system:user:list', 0, '2025-09-04 22:26:11.972971', '2025-09-06 20:42:43.327192', ''), (27, '系统监测', 0, 'directory', 1, '/monitor', '', '', 'icon-park-outline:display', '', 'f', 'f', 'f', 'f', '', 'f', '', 0, '2025-09-16 21:40:28.365383', '2025-09-16 21:40:28.365383', ''), (28, '登录日志', 27, 'page', 0, '/monitor/login-log', '/monitor/login-log/index.vue', '', 'carbon:catalog-publish', '', 'f', 'f', 'f', 'f', '', 'f', '', 0, '2025-09-16 21:41:08.35267', '2025-09-16 21:41:08.35267', ''), (30, '服务状态', 27, 'page', 0, '/monitor/server-status', '/monitor/server-status/index.vue', '', 'icon-park-outline:server', '', 'f', 'f', 'f', 'f', '', 'f', '', 0, '2025-09-17 21:18:11.268633', '2025-09-17 21:18:11.268633', '');
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS "sys_role";
CREATE TABLE "sys_role" (
  "id" int4 NOT NULL DEFAULT nextval('sys_role_id_seq'::regclass),
  "role_name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "role_key" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "status" int2 NOT NULL DEFAULT '0'::smallint,
  "data_scope" int2 NOT NULL DEFAULT '1'::smallint,
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_time" timestamp(6) NOT NULL DEFAULT now(),
  "remark" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying
)
;
COMMENT ON COLUMN "sys_role"."id" IS '角色ID';
COMMENT ON COLUMN "sys_role"."role_name" IS '角色名称';
COMMENT ON COLUMN "sys_role"."role_key" IS '角色权限字符串';
COMMENT ON COLUMN "sys_role"."status" IS '角色状态（0正常 1停用）';
COMMENT ON COLUMN "sys_role"."data_scope" IS '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限 5：仅本人数据权限）';
COMMENT ON COLUMN "sys_role"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_role"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_role"."remark" IS '备注';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO "sys_role" ("id", "role_name", "role_key", "status", "data_scope", "create_time", "update_time", "remark") VALUES (1, '超级管理员', 'admin', 0, 1, '2025-09-04 22:52:07.82964', '2025-09-05 00:06:32.018077', ''), (2, '管理员', 'manager', 0, 1, '2025-09-05 00:08:41.368292', '2025-09-05 00:08:41.368292', '');
COMMIT;

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS "sys_role_dept";
CREATE TABLE "sys_role_dept" (
  "id_1" int4 NOT NULL,
  "id_2" int4 NOT NULL
)
;

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS "sys_role_menu";
CREATE TABLE "sys_role_menu" (
  "id_1" int4 NOT NULL,
  "id_2" int4 NOT NULL
)
;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO "sys_role_menu" ("id_1", "id_2") VALUES (1, 2), (1, 1), (1, 4), (1, 5), (1, 6), (1, 7), (1, 3);
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS "sys_user";
CREATE TABLE "sys_user" (
  "id" int4 NOT NULL DEFAULT nextval('sys_user_id_seq'::regclass),
  "dept_id" int4,
  "username" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "nick_name" varchar(30) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "email" varchar(50) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "phone" varchar(11) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "gender" "public"."sys_user_gender_enum" NOT NULL DEFAULT 'unknown'::sys_user_gender_enum,
  "avatar" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "password" varchar(100) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "status" int2 NOT NULL DEFAULT '0'::smallint,
  "create_time" timestamp(6) NOT NULL DEFAULT now(),
  "update_time" timestamp(6) NOT NULL DEFAULT now(),
  "remark" varchar(500) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying
)
;
COMMENT ON COLUMN "sys_user"."id" IS '用户ID';
COMMENT ON COLUMN "sys_user"."dept_id" IS '部门ID';
COMMENT ON COLUMN "sys_user"."username" IS '用户账号';
COMMENT ON COLUMN "sys_user"."nick_name" IS '用户昵称';
COMMENT ON COLUMN "sys_user"."email" IS '用户邮箱';
COMMENT ON COLUMN "sys_user"."phone" IS '手机号码';
COMMENT ON COLUMN "sys_user"."gender" IS '用户性别';
COMMENT ON COLUMN "sys_user"."avatar" IS '头像地址';
COMMENT ON COLUMN "sys_user"."password" IS '密码';
COMMENT ON COLUMN "sys_user"."status" IS '帐号状态（0正常 1停用）';
COMMENT ON COLUMN "sys_user"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_user"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_user"."remark" IS '备注';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO "sys_user" ("id", "dept_id", "username", "nick_name", "email", "phone", "gender", "avatar", "password", "status", "create_time", "update_time", "remark") VALUES (1, 2, 'admin', '', '', '', 'female', '', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 0, '2025-09-04 21:56:48.950837', '2025-09-18 00:31:58.769511', '');
COMMIT;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS "sys_user_role";
CREATE TABLE "sys_user_role" (
  "id_1" int4 NOT NULL,
  "id_2" int4 NOT NULL
)
;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO "sys_user_role" ("id_1", "id_2") VALUES (1, 1);
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_dept_id_seq"
OWNED BY "sys_dept"."id";
SELECT setval('"sys_dept_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_dict_data_id_seq"
OWNED BY "sys_dict_data"."id";
SELECT setval('"sys_dict_data_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_dict_type_id_seq"
OWNED BY "sys_dict_type"."id";
SELECT setval('"sys_dict_type_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_login_log_id_seq"
OWNED BY "sys_login_log"."id";
SELECT setval('"sys_login_log_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_menu_id_seq"
OWNED BY "sys_menu"."id";
SELECT setval('"sys_menu_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_role_id_seq"
OWNED BY "sys_role"."id";
SELECT setval('"sys_role_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "sys_user_id_seq"
OWNED BY "sys_user"."id";
SELECT setval('"sys_user_id_seq"', 1, false);

-- ----------------------------
-- Indexes structure for table sys_dept
-- ----------------------------
CREATE INDEX "idx_sys_dept_parent_id_sort" ON "sys_dept" USING btree (
  "parent_id" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_dept_status" ON "sys_dept" USING btree (
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_dept
-- ----------------------------
ALTER TABLE "sys_dept" ADD CONSTRAINT "pk_sys_dept" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_dict_data
-- ----------------------------
CREATE INDEX "idx_sys_dict_data_dict_type" ON "sys_dict_data" USING btree (
  "dict_type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_dict_data_sort" ON "sys_dict_data" USING btree (
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_dict_data_status" ON "sys_dict_data" USING btree (
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_dict_data
-- ----------------------------
ALTER TABLE "sys_dict_data" ADD CONSTRAINT "pk_sys_dict_data" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_dict_type
-- ----------------------------
CREATE INDEX "idx_sys_dict_type_status" ON "sys_dict_type" USING btree (
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_dict_type_type" ON "sys_dict_type" USING btree (
  "type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table sys_dict_type
-- ----------------------------
ALTER TABLE "sys_dict_type" ADD CONSTRAINT "uk_sys_dict_type_type" UNIQUE ("type");

-- ----------------------------
-- Primary Key structure for table sys_dict_type
-- ----------------------------
ALTER TABLE "sys_dict_type" ADD CONSTRAINT "pk_sys_dict_type" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sys_login_log
-- ----------------------------
ALTER TABLE "sys_login_log" ADD CONSTRAINT "pk_sys_login_log" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_menu
-- ----------------------------
CREATE INDEX "idx_sys_menu_menu_type" ON "sys_menu" USING btree (
  "menu_type" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_menu_parent_id_sort" ON "sys_menu" USING btree (
  "parent_id" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_menu_perms" ON "sys_menu" USING btree (
  "perms" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_menu_status" ON "sys_menu" USING btree (
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_menu
-- ----------------------------
ALTER TABLE "sys_menu" ADD CONSTRAINT "pk_sys_menu" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table sys_role
-- ----------------------------
ALTER TABLE "sys_role" ADD CONSTRAINT "uk_sys_role_role_key" UNIQUE ("role_key");

-- ----------------------------
-- Primary Key structure for table sys_role
-- ----------------------------
ALTER TABLE "sys_role" ADD CONSTRAINT "pk_sys_role" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_role_dept
-- ----------------------------
CREATE INDEX "idx_sys_role_dept_id_1" ON "sys_role_dept" USING btree (
  "id_1" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_role_dept_id_2" ON "sys_role_dept" USING btree (
  "id_2" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_role_dept
-- ----------------------------
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "pk_sys_role_dept" PRIMARY KEY ("id_1", "id_2");

-- ----------------------------
-- Indexes structure for table sys_role_menu
-- ----------------------------
CREATE INDEX "idx_sys_role_menu_id_1" ON "sys_role_menu" USING btree (
  "id_1" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_role_menu_id_2" ON "sys_role_menu" USING btree (
  "id_2" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_role_menu
-- ----------------------------
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "pk_sys_role_menu" PRIMARY KEY ("id_1", "id_2");

-- ----------------------------
-- Indexes structure for table sys_user
-- ----------------------------
CREATE INDEX "idx_sys_user_email" ON "sys_user" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_user_phone" ON "sys_user" USING btree (
  "phone" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_user_status" ON "sys_user" USING btree (
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_user_username" ON "sys_user" USING btree (
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table sys_user
-- ----------------------------
ALTER TABLE "sys_user" ADD CONSTRAINT "uk_sys_user_username" UNIQUE ("username");

-- ----------------------------
-- Primary Key structure for table sys_user
-- ----------------------------
ALTER TABLE "sys_user" ADD CONSTRAINT "pk_sys_user" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_user_role
-- ----------------------------
CREATE INDEX "idx_sys_user_role_id_1" ON "sys_user_role" USING btree (
  "id_1" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_user_role_id_2" ON "sys_user_role" USING btree (
  "id_2" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_user_role
-- ----------------------------
ALTER TABLE "sys_user_role" ADD CONSTRAINT "pk_sys_user_role" PRIMARY KEY ("id_1", "id_2");

-- ----------------------------
-- Foreign Keys structure for table sys_dict_data
-- ----------------------------
ALTER TABLE "sys_dict_data" ADD CONSTRAINT "fk_sys_dict_data_dict_type_entity" FOREIGN KEY ("dict_type_entity") REFERENCES "sys_dict_type" ("type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sys_role_dept
-- ----------------------------
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "fk_sys_role_dept_id_1" FOREIGN KEY ("id_1") REFERENCES "sys_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "fk_sys_role_dept_id_2" FOREIGN KEY ("id_2") REFERENCES "sys_dept" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sys_role_menu
-- ----------------------------
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "fk_sys_role_menu_id_1" FOREIGN KEY ("id_1") REFERENCES "sys_role" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "fk_sys_role_menu_id_2" FOREIGN KEY ("id_2") REFERENCES "sys_menu" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sys_user
-- ----------------------------
ALTER TABLE "sys_user" ADD CONSTRAINT "fk_sys_user_dept_id" FOREIGN KEY ("dept_id") REFERENCES "sys_dept" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sys_user_role
-- ----------------------------
ALTER TABLE "sys_user_role" ADD CONSTRAINT "fk_sys_user_role_id_1" FOREIGN KEY ("id_1") REFERENCES "sys_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sys_user_role" ADD CONSTRAINT "fk_sys_user_role_id_2" FOREIGN KEY ("id_2") REFERENCES "sys_role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
