// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");
const { withAccountKitUi } = require("@account-kit/react/tailwind");

module.exports = withAccountKitUi(
  withMT({
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: "#3B82F6", // primary blue
            dark: "#1E40AF", // hover/active
            soft: "#EFF6FF", // background fills
          },
          success: {
            DEFAULT: "#10B981",
            soft: "#ECFDF5",
          },
          pending: {
            DEFAULT: "#F59E0B",
            soft: "#FFFBEB",
          },
          error: {
            DEFAULT: "#EF4444",
            soft: "#FEF2F2",
          },
          gray: {
            950: "#030712",
            900: "#111827",
            500: "#6B7280",
            100: "#F3F4F6",
          },
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"],
        },
      },
    },
    plugins: [],
  }),
);
