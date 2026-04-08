# 简单登录项目

这是一个使用 Node.js 原生 `http` 模块实现的简单登录示例项目。

## 功能

- 提供登录页面（`/`）
- 提供登录接口（`POST /api/login`）
- 使用内置账号进行鉴权：
  - `admin / 123456`
  - `demo / demo123`
- 登录成功后在前端保存模拟 token 到 `localStorage`

## 启动

```bash
npm start
```

然后访问：`http://localhost:3000`
