export const setAuthCookies = (res, accessToken, expiresIn, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn
    });

    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }
};

export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
};