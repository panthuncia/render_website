import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Render Stack Docs',
  tagline: 'BasicRHI, OpenRenderGraph, and SealLOD Engine',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: {
      // Use Webpack to avoid Rspack module-graph panics during development.
      rspackBundler: false,
      rspackPersistentCache: false,
    },
  },

  // Set the production url of your site here
  url: process.env.SITE_URL ?? 'https://panthuncia.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.SITE_BASE_URL ?? '/blog/',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'panthuncia', // GitHub repository owner.
  projectName: 'blog', // GitHub Pages deployment repository; source stays in render_website.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/panthuncia/render_website/edit/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'basicrhi',
        path: 'docs-basicrhi',
        routeBasePath: 'basicrhi',
        sidebarPath: './sidebars.basicrhi.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'opengraph',
        path: 'docs-opengraph',
        routeBasePath: 'opengraph',
        sidebarPath: './sidebars.opengraph.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'SealLOD',
        path: 'docs-SealLOD',
        routeBasePath: 'SealLOD',
        sidebarPath: './sidebars.SealLOD.ts',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Render Stack',
      logo: {
        alt: 'Render Stack Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          label: 'About',
          to: '/basicrhi/about',
          className: 'project-subnav project-subnav-basicrhi',
          position: 'left',
        },
        {
          label: 'Docs',
          to: '/basicrhi/docs',
          className: 'project-subnav project-subnav-basicrhi',
          position: 'left',
        },
        {
          label: 'Tutorial',
          to: '/basicrhi/tutorial',
          className: 'project-subnav project-subnav-basicrhi',
          position: 'left',
        },
        {
          label: 'About',
          to: '/opengraph/about',
          className: 'project-subnav project-subnav-opengraph',
          position: 'left',
        },
        {
          label: 'Docs',
          to: '/opengraph/docs',
          className: 'project-subnav project-subnav-opengraph',
          position: 'left',
        },
        {
          label: 'Tutorial',
          to: '/opengraph/tutorial',
          className: 'project-subnav project-subnav-opengraph',
          position: 'left',
        },
        {
          label: 'About',
          to: '/SealLOD/about',
          className: 'project-subnav project-subnav-SealLOD',
          position: 'left',
        },
        {
          label: 'Docs',
          to: '/SealLOD/docs',
          className: 'project-subnav project-subnav-SealLOD',
          position: 'left',
        },
        {
          label: 'Tutorial',
          to: '/SealLOD/tutorial',
          className: 'project-subnav project-subnav-SealLOD',
          position: 'left',
        },
        {
          to: '/basicrhi/about',
          label: 'BasicRHI',
          activeBasePath: '/basicrhi',
          className: 'global-nav-item global-nav-first',
          position: 'left',
        },
        {
          to: '/opengraph/about',
          label: 'OpenRenderGraph',
          activeBasePath: '/opengraph',
          className: 'global-nav-item',
          position: 'left',
        },
        {
          to: '/SealLOD/about',
          label: 'SealLOD Engine',
          activeBasePath: '/SealLOD',
          className: 'global-nav-item',
          position: 'left',
        },
        {
          to: '/',
          label: 'Blog',
          className: 'global-nav-item',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Projects',
          items: [
            {
              label: 'BasicRHI',
              to: '/basicrhi/about',
            },
            {
              label: 'OpenRenderGraph',
              to: '/opengraph/about',
            },
            {
              label: 'SealLOD Engine',
              to: '/SealLOD/about',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              to: '/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/panthuncia/render_website',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Render Stack. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
