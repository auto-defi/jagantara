// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent-soft": "var(--gradient-accent-soft)",
        "gradient-sheen": "var(--gradient-sheen)",
      },
    },
  },
};
