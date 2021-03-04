module.exports = {
  title: "cba-todo",
  description: "A demo of cloudbase-access",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://blog.hal.wang/imgs/cba.png",
      },
    ],
  ],
  markdown: {
    lineNumbers: true,
  },
  base: "/docs/",
  serviceWorker: true,
  themeConfig: {
    logo: "https://blog.hal.wang/imgs/cba.png",
    lastUpdated: "lastUpdate",
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Docs",
        ariaLabel: "Docs",
        items: [
          { text: "About", link: "/about/" },
          { text: "Api", link: "/api/" },
        ],
      },
      { text: "GitHub", link: "https://github.com/hal-wang/cloudbase-access" },
    ],
    sidebar: {
      "/api/": [""],
      "/about/": [""],
    },
  },
};
