const postListEl = document.querySelector("#post-list");
const postViewEl = document.querySelector("#post-view");
const articleTitleEl = document.querySelector("#article-title");
const articleMetaEl = document.querySelector("#article-meta");
const articleBodyEl = document.querySelector("#article-body");
const homeEl = document.querySelector("#home");
const postsEl = document.querySelector("#posts");
const aboutEl = document.querySelector("#about");
const yearEl = document.querySelector("#year");

let posts = [];

yearEl.textContent = new Date().getFullYear();

if (window.marked) {
  marked.setOptions({
    gfm: true,
    breaks: false,
  });
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function renderPostList() {
  postListEl.innerHTML = posts
    .map(
      (post) => `
        <a class="post-card" href="#post/${post.slug}" data-animate>
          <div>
            <time datetime="${post.date}">${formatDate(post.date)}</time>
            <h3>${post.title}</h3>
            <p>${post.description}</p>
          </div>
          <div class="post-tags">
            ${post.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </a>
      `,
    )
    .join("");

  observeAnimatedItems();
}

function setHomeVisibility(showHome) {
  homeEl.classList.toggle("is-hidden", !showHome);
  postsEl.classList.toggle("is-hidden", !showHome);
  aboutEl.classList.toggle("is-hidden", !showHome);
  postViewEl.classList.toggle("is-hidden", showHome);
}

async function showPost(slug) {
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    window.location.hash = "#posts";
    return;
  }

  setHomeVisibility(false);
  articleTitleEl.textContent = post.title;
  articleMetaEl.textContent = `${formatDate(post.date)} · ${post.readingTime}`;
  articleBodyEl.innerHTML = "<p class=\"is-loading\">文章正在打开...</p>";

  try {
    const response = await fetch(post.file);

    if (!response.ok) {
      throw new Error("Markdown file not found");
    }

    const markdown = await response.text();
    articleBodyEl.innerHTML = window.marked
      ? marked.parse(markdown)
      : `<pre>${markdown}</pre>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    articleBodyEl.innerHTML =
      "<p class=\"error-state\">没有读到这篇 Markdown。请用本地静态服务器预览，或检查 posts/posts.json 里的文件路径。</p>";
  }
}

function showHome() {
  setHomeVisibility(true);
}

function route() {
  const hash = window.location.hash || "#home";

  if (hash.startsWith("#post/")) {
    showPost(hash.replace("#post/", ""));
    return;
  }

  showHome();
}

async function loadPosts() {
  postListEl.innerHTML = "<p class=\"is-loading\">文章正在加载...</p>";

  try {
    const response = await fetch("posts/posts.json");

    if (!response.ok) {
      throw new Error("Post manifest not found");
    }

    posts = await response.json();
    renderPostList();
    route();
  } catch (error) {
    postListEl.innerHTML =
      "<p class=\"error-state\">没有读到文章列表。请用本地静态服务器预览，或检查 posts/posts.json 是否存在。</p>";
  }
}

function observeAnimatedItems() {
  const animatedItems = document.querySelectorAll("[data-animate]");

  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  animatedItems.forEach((item) => observer.observe(item));
}

function startHeroCanvas() {
  const canvas = document.querySelector("#hero-canvas");
  const context = canvas.getContext("2d");
  const particles = Array.from({ length: 62 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 2.5,
    speed: 0.00028 + Math.random() * 0.00058,
    hue: index % 3,
  }));

  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGrid() {
    context.strokeStyle = "rgba(255,255,255,0.055)";
    context.lineWidth = 1;

    for (let x = 0; x < width; x += 72) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y < height; y += 72) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawGrid();

    particles.forEach((particle) => {
      const x = particle.x * width;
      const drift = reduceMotion ? 0 : Math.sin(frame * particle.speed * 12) * 18;
      const y = ((particle.y + frame * particle.speed) % 1) * height;
      const colors = [
        "rgba(84,246,199,0.72)",
        "rgba(255,207,90,0.66)",
        "rgba(117,167,255,0.55)",
      ];

      context.beginPath();
      context.fillStyle = colors[particle.hue];
      context.arc(x + drift, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    frame += 1;

    if (!reduceMotion) {
      rafId = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener("resize", resize);

  return () => cancelAnimationFrame(rafId);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => {
  observeAnimatedItems();
  startHeroCanvas();
  loadPosts();

  if (window.lucide) {
    lucide.createIcons();
  }
});
