/* eslint-disable global-require */
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-select/dist/index.esm.js',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    animation: {
      'spin-fast': 'spin 0.5s linear infinite',
    },
    extend: {
      // fontSize: {
      //     xs: ["0.625rem", { lineHeight: ".875rem" }],
      //     sm: ["0.75rem", { lineHeight: "1rem" }],
      //     base: ["0.875rem", { lineHeight: "1.25rem" }],
      //     base2: ["0.9375rem", { lineHeight: "1.5rem" }],
      //     lg: ["1rem", { lineHeight: "1.5rem" }],
      //     xl: ["1.125rem", { lineHeight: "1.75rem" }],
      //     "2xl": ["1.375rem", { lineHeight: "1.75rem" }],
      //     "3xl": ["1.625rem", { lineHeight: "2rem" }],
      //     "4xl": ["1.875rem", { lineHeight: "2.25rem" }],
      //     "5xl": ["3rem", { lineHeight: "2.5rem" }],
      //     "6xl": ["3.75rem", { lineHeight: "1" }],
      //     "7xl": ["4.5rem", { lineHeight: "1" }],
      //     "8xl": ["6rem", { lineHeight: "1" }],
      //     "9xl": ["8rem", { lineHeight: "1" }],
      // },
      colors: {
        // Custom Color: Primary Text
        primary: 'var(--theme-primary-text-color)',

        // Custom Color: Data Table
        bwTableHeaderBg: 'var(--bw-table-header-bg-color)',
        bwTableHeaderBgText: 'var(--bw-table-header-text-color)',
        bwTableRowHoverBg: 'var(--bw-table-row-hover-bg-color)',
        bwTableRowText: 'var(--bw-table-row-text-color)',

        // Custom Color: Navbar
        navbarBg: 'var(--navbar-bg-color)',

        navbarBtnBg: 'var(--light-skin-navbar-btn-bg)',
        navbarBtnText: 'var(--light-skin-navbar-btn-text-color)',
        navbarBtnHoverBg: 'var(--light-skin-navbar-btn-hover-bg)',
        navbarBtnHoverText: 'var(--light-skin-navbar-btn-hover-text-color)',

        // Custom Color: Sidebar
        sidebarBg: 'var(--sidebar-bg-color)',

        sidebarBtnBg: 'var(--light-skin-sidebar-btn-bg)',
        sidebarBtnText: 'var(--light-skin-sidebar-btn-text-color)',
        // sidebarBtnActiveBg: 'var(--light-skin-sidebar-btn-active-bg)',
        sidebarBtnActiveText: 'var(--theme-primary-text-color)',
        sidebarBtnHoverBg: 'var(--light-skin-sidebar-btn-hover-bg)',
        sidebarBtnHoverText: 'var(--light-skin-sidebar-btn-hover-text-color)',

        // Custom Color: Links
        link: '#4d148c',

        // Custom Color: Buttons
        btnPrimaryBg: 'var(--theme-primary-text-color)',
        btnPrimaryText: 'var(--theme-primary-btn-primary-text-color)',
        textBtnPrimaryText: 'var(--theme-primary-text-btn-primary-text-color)',

        // btnDangerBg: 'var(--theme-primary-btn-danger-bg)',
        // btnDangerText: 'var(--theme-primary-btn-danger-text-color)',
        // textBtnDangerText: 'var(--theme-primary-text-btn-danger-text-color)',

        btnInfoBg: 'var(--theme-primary-btn-info-bg)',
        btnInfoText: 'var(--theme-primary-btn-info-text-color)',
        textBtnInfoText: 'var(--theme-primary-text-btn-info-text-color)',

        // Custom Color: Pagination
        paginationActivePageBg: 'var(--theme-primary-text-color)',
        paginationActivePageText: 'var(--pagination-active-page-text)',
        paginationHoverText: 'var(--pagination-hover-text-color)',
        paginationHoverBg: 'var(--pagination-hover-bg)',

        // Custom Color: Box
        formCardHeader: 'var(--box-header-title-color)',
        formCardHeaderBg: 'var(--box-header-bg)',
        formCardBodyBg: 'var(--box-body-bg)',

        // Custom Color: Top Menu
        topMenuCustomBtnText: 'var(--light-skin-top-menu-custom-btn-text-color)',
        topMenuCustomBtnHoverText: 'var(--theme-primary-text-color)',

        // Custom Color: CSV Button
        csvBtnBg: 'var(--theme-primary-text-color)',
        csvBtnText: 'var(--csv-btn-text-color)',

        // Custom Color: Add Button
        applyButtonBg: 'var(--theme-primary-text-color)',
        applyButtonText: 'var(--add-button-text-color)',
        applyTextButtonText: 'var(--add-text-button-text-color)',

        // Custom Color: Cancel Button
        cancelButtonBg: 'var(--cancel-button-bg)',
        cancelButtonText: 'var(--theme-primary-text-color)',
        cancelTextButtonText: 'var(--cancel-text-button-text-color)',

        // Custom Color: Mobile Menu
        mobileMenuBg: 'var(--mobile-menu-bg-color)',

        mobileMenuBtnBg: 'var(--light-skin-mobile-menu-btn-bg)',
        mobileMenuBtnText: 'var(--light-skin-mobile-menu-btn-text-color)',
        mobileMenuBtnActiveBg: 'var(--light-skin-mobile-menu-btn-active-bg)',
        mobileMenuBtnActiveText: 'var(--theme-primary-text-color)',
        mobileMenuBtnHoverBg: 'var(--light-skin-mobile-menu-btn-hover-bg)',
        mobileMenuBtnHoverText: 'var(--light-skin-mobile-menu-btn-hover-text-color)',

        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          primary: '#E9E9E9',
          bg: '#FAFAFA',
        },
      },
      boxShadow: {
        'all-side': '0px 0px 8px 0px rgb(0 0 0 / 0.1), 0px -0px 8px 0px rgb(0 0 0 / 0.1); ',
      },
      screens: {
        lg: '1180px',
      },
    },
    skeletonScreen: {
      DEFAULT: {
        baseColor: '#EEEEEE',
        movingColor: 'linear-gradient(to right, transparent 0%, #FDFDFD 50%, transparent 100%)',
        duration: '1s',
        timing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
    // eslint-disable-next-line import/no-extraneous-dependencies
    require('@gradin/tailwindcss-skeleton-screen'),
    // eslint-disable-next-line import/no-extraneous-dependencies
    require('tailwindcss-debug-screens'),
  ],
}
