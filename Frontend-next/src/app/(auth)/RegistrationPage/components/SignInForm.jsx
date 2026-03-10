import React from "react";
import { showNotificationError, showNotificationSuccess } from "../../../../../../FrontEnd/src/utils/message";
import { Link } from "react-router-dom";
import MyButton from "../../../../../../FrontEnd/src/components/ui/MyButton";
import MyInput from "../../../../../../FrontEnd/src/components/ui/MyInput";
import GoogleIco from "../../../../../../FrontEnd/public/icon/GoogleIco";
import FacebookIco from "../../../../../../FrontEnd/public/icon/FaceBookIco";
import mockLogin from "../../../../../../FrontEnd/src/services/auth/auth.service";
import { useState } from "react";
export default function SignInForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        remember: false
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};
        const username = formData.username.trim();

        if (!username) {
            newErrors.username = "Vui lòng nhập email hoặc số điện thoại";
        } else {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
            const isPhone = /^0\d{9,10}$/.test(username);

            if (!isEmail && !isPhone) {
                newErrors.username = "Email hoặc số điện thoại không hợp lệ";
            }
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();// ngan chan hanh vi mac dinh cua trinh duyen dung de luu state 
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            const res = await mockLogin({
                username: formData.username,
                password: formData.password,
            });

            console.log("LOGIN OK:", res);

            if (formData.remember) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
            } else {
                sessionStorage.setItem("token", res.token);
            }

            showNotificationSuccess("Đăng nhập thành công 🎉");
        } catch (err) {
            showNotificationError(err.message || "Sai tài khoản hoặc mật khẩu");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Chào mừng trở lại
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Vui lòng nhập thông tin để đăng nhập
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <MyInput
                    label="Tên đăng nhập"
                    placeholder="Nhập email hoặc số điện thoại"
                    type="text"
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                    error={!!errors.username}
                    hint={errors.username}
                />
                <MyInput
                    label="Mật khẩu"
                    placeholder="Nhập password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={formData.password}
                    error={!!errors.password}
                    hint={errors.password}
                />
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input name="remember" type="checkbox" className="mr-2 rounded border-gray-300 accent-brand-500"
                            checked={formData.remember}
                            onChange={handleChange} />
                        Ghi nhớ đăng nhập
                    </label>
                    <a href="#" className="font-medium hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>
                <MyButton
                    type="submit"
                    variant="primary"
                    className="w-full py-4 text-lg"
                    disabled={isSubmitting}
                >
                    Đăng nhập
                </MyButton>
                <div className="flex items-center">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <p className="px-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Hoặc đăng nhập bằng
                    </p>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>
            </form>
            <div className="flex items-center text-sm gap-3 mt-4">
                <MyButton
                    type="submit"
                    variant="outline"
                    className="w-full"
                    startIcon={<GoogleIco />}
                    size="sm"
                >
                    Google
                </MyButton>
                <MyButton
                    type="submit"
                    startIcon={<FacebookIco className="" />}
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    Facebook
                </MyButton>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Chưa có tài khoản?{" "}
                <Link
                    to="/register"
                    className="font-bold text-[var(--color-primary)] hover:underline"
                >
                    Đăng ký ngay
                </Link>
            </p>
            <div className=" text-amber-50 flex justify-around text-center text-sm mt-6">
                <a href="#" className="text-[var(--color-black)] hover:text-[var(--color-primary)]">
                    CHÍNH SÁCH BẢO MẬT
                </a>
                <a href="#" className="text-[var(--color-black)] hover:text-[var(--color-primary)]">
                    ĐIỀU KHOẢN DỊCH VỤ
                </a>
                <a href="#" className="text-[var(--color-black)] hover:text-[var(--color-primary)]">
                    TRỢ GIÚP
                </a>
            </div>
        </div>
    );
}