// src/mocks/mockAuth.js

const MOCK_USERS = [
    {
        id: 1,
        username: "kminchelle",
        password: "0lelplR",
        email: "kminchelle@example.com",
        name: "Kminchelle",
    },
    {
        id: 2,
        username: "admin",
        password: "123456",
        email: "admin@example.com",
        name: "Admin",
    },
];

const fakeJwt = (user) => {
    return btoa(
        JSON.stringify({
            sub: user.id,
            name: user.name,
            exp: Date.now() + 1000 * 60 * 30, // 30 phút
        })
    );
};

export default function mockLogin({ username, password }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(
                (u) =>
                    (u.username === username || u.email === username) &&
                    u.password === password
            );

            if (!user) {
                reject({
                    status: 400,
                    message: "Sai tài khoản hoặc mật khẩu",
                });
                return;
            }

            resolve({
                token: fakeJwt(user),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                expiresIn: 1800,
            });
        }, 800); // giả lập delay API
    });
};