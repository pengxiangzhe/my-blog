# 拾光笔记：纯静态个人博客

这是一个深色、现代、响应式的个人博客模板。它不需要构建工具，文章用 Markdown 写，部署时直接上传整个文件夹即可。

## 文件结构

```text
.
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ app.js
├─ assets/
│  └─ hero-portrait.png
└─ posts/
   ├─ posts.json
   ├─ start-here.md
   ├─ digital-garden.md
   └─ frontend-taste.md
```

## 本地预览

不要直接双击打开 `index.html`，浏览器会限制 Markdown 文件读取。请在当前文件夹运行一个静态服务器：

```powershell
python -m http.server 4173
```

然后打开：

```text
http://localhost:4173
```

## 修改个人信息

1. 打开 `index.html`。
2. 修改首页标题、个人介绍、邮箱、GitHub 链接。
3. 如果要换头像或主视觉，把新图片放进 `assets` 文件夹，并替换 `assets/hero-portrait.png`。

## 新增文章

1. 在 `posts` 文件夹中新建 Markdown 文件，例如：

```text
posts/my-first-post.md
```

2. 写入文章内容：

```md
# 我的第一篇文章

这里是正文。
```

3. 打开 `posts/posts.json`，添加一条文章信息：

```json
{
  "slug": "my-first-post",
  "title": "我的第一篇文章",
  "description": "这篇文章的简短介绍。",
  "date": "2026-05-24",
  "readingTime": "3 min read",
  "tags": ["随笔"],
  "file": "posts/my-first-post.md"
}
```

4. 保存后刷新页面，文章会出现在列表里。

## 最简单部署方式：GitHub Pages

1. 在 GitHub 新建一个仓库。
2. 把本文件夹里的所有文件上传到仓库根目录。
3. 打开仓库的 `Settings`。
4. 进入 `Pages`。
5. Source 选择 `Deploy from a branch`。
6. Branch 选择 `main`，目录选择 `/ (root)`。
7. 保存后等待部署完成。
8. GitHub 会给出一个网址，通常是：

```text
https://你的用户名.github.io/仓库名/
```

## 可选：用命令上传

如果你想用命令行：

```powershell
git init
git add .
git commit -m "Create personal blog"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

之后再按上面的 GitHub Pages 步骤开启部署。

参考：GitHub 官方文档的 Pages 发布源说明：
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
