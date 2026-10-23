import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Load saved theme or fallback
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

        applyTheme(initialTheme);
    }, []);

    const applyTheme = (newTheme) => {
        setTheme(newTheme);

        // Remove both classes before adding new one
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);

        const themeColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--background")
            .trim();
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", themeColor);
        }

        // Save preference
        localStorage.setItem("theme", newTheme);
    };

    const setLight = () => applyTheme("light");
    const setDark = () => applyTheme("dark");
    const toggleTheme = () => applyTheme(theme === "light" ? "dark" : "light");

    return (
        <ThemeContext.Provider value={{ theme, setLight, setDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);