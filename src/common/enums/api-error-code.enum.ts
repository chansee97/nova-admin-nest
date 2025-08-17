export enum ApiErrorCode {
  /* 通用 */
  SERVER_SUCCESS = 200, // 成功
  SERVER_ERROR = 500, // 成功

  /* 业务相关 */
  USER_ID_INVALID = 1001, // 用户id无效
  USER_NOTEXIST = 1002, // 用户id无效
  USER_EXIST = 1003, // 用户已存在
  USER_PASSWORD_INVALID = 1004, // 密码无效

  /* token相关 */
  TOKEN_INVALID = 11001, // token无效
  TOKEN_MISS = 11002, // token缺失

  /* 部门相关 */
  DEPT_NOT_EXIST = 2001, // 部门不存在
  DEPT_NAME_EXISTS = 2002, // 部门名称已存在
  PARENT_DEPT_NOT_EXIST = 2003, // 父部门不存在
  DEPT_HAS_CHILDREN = 2004, // 存在子部门
  DEPT_HAS_USERS = 2005, // 部门下存在用户

  /* 字典相关 */
  DICT_TYPE_NOT_EXIST = 3001, // 字典类型不存在
  DICT_TYPE_EXISTS = 3002, // 字典类型已存在
  DICT_TYPE_HAS_DATA = 3003, // 字典类型下存在数据
  DICT_DATA_NOT_EXIST = 3004, // 字典数据不存在
  DICT_DATA_EXISTS = 3005, // 字典数据已存在

  /* 验证码相关 */
  CAPTCHA_EMPTY = 4001, // 验证码不能为空
  CAPTCHA_EXPIRED = 4002, // 验证码已过期
  CAPTCHA_INVALID = 4003, // 验证码错误
}
