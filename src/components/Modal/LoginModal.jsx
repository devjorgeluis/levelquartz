import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../Loading/LoadApi";
import ImgLogo from "/src/assets/images/Logo.png";

const LoginModal = ({ isOpen, onClose, onConfirm, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape" && !isLoading) onClose();
        };

        document.addEventListener("keydown", handleEscape);
        usernameRef.current?.focus();
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, isLoading, onClose]);

    const validate = () => {
        const nextErrors = {};
        if (!username.trim()) nextErrors.username = "Por favor, rellene Nombre de usuario";
        if (!password) nextErrors.password = "Por favor, rellene Contraseña";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setErrorMsg("");

        if (!validate() || isLoading) return;

        setIsLoading(true);
        callApi(
            contextData,
            "POST",
            "/login/",
            callbackSubmitLogin,
            JSON.stringify({
                username: username.trim(),
                password,
                site_label: "main",
            })
        );
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);

        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);
            onLoginSuccess?.(result.user.balance);
            onClose();
            return;
        }

        setErrorMsg(
            result.status === "country"
                ? result.message
                : "Nombre de usuario o contraseña no válidos"
        );
    };

    const updateUsername = (event) => {
        setUsername(event.target.value);
        if (errors.username) setErrors((current) => ({ ...current, username: "" }));
        if (errorMsg) setErrorMsg("");
    };

    const updatePassword = (event) => {
        setPassword(event.target.value);
        if (errors.password) setErrors((current) => ({ ...current, password: "" }));
        if (errorMsg) setErrorMsg("");
    };

    const handleForgotPassword = () => {
        onConfirm?.("forgot-password");
    };

    if (!isOpen) return null;

    return (
        <div id="modal-root">
            <div className="tb--modal-lvl1">
                <div className="tb--modal-lvl2">
                    <div className="tb--modal-lvl3 tb--rel">
                        <div className="tb--modal-popup tb--login-form tb--log_reg_form tb--flex tb--flex-col tb--modal-scroll_fix">
                            <div className="tb--modal-header tb--flex tb--align-center tb--justify-end tb--pr-12">
                                <span className="tb--modal-header-txt tb--text_upercase tb--f-14 tb--flex-grow tb--ellipsis">
                                    Acceso
                                </span>
                                <button
                                    type="button"
                                    className="tb--modal-close"
                                    onClick={onClose}
                                    aria-label="Cerrar"
                                    disabled={isLoading}
                                >
                                    <i className="digi_icon-close" />
                                </button>
                            </div>

                            <div className="tb--modal-logo tb--tac" style={{ paddingBottom: 32 }}>
                                <img className="loaded ready" alt="Logo" src={ImgLogo} />
                            </div>

                            <form className="tb--body-panel tb--flex-popup-stretch" name="loginForm" onSubmit={handleSubmit} noValidate>
                                <div className="tb--modal-body tb--flex-grow">
                                    {errorMsg && (
                                        <div className="tb--error-mes tb--login-server-error" role="alert">
                                            <p>{errorMsg}</p>
                                        </div>
                                    )}

                                    <div className="tb--flex tb--flex-col tb--mb-16 tb--w_100 tb--input-group tb--pc-input">
                                        <label className="tb--lbl tb--f-12 tb--login-lbl" htmlFor="UserName">
                                            Nombre de usuario <span> *</span>
                                        </label>
                                        <div className="tb--rel tb--error-cont">
                                            <div>
                                                <input
                                                    ref={usernameRef}
                                                    id="UserName"
                                                    name="userName"
                                                    className={`${errors.username ? "tb--error-border" : ""} tb--input tb--input-white tb--ellipsis`}
                                                    type="text"
                                                    placeholder="Ingrese su nombre de usuario"
                                                    autoComplete="username"
                                                    value={username}
                                                    onChange={updateUsername}
                                                    aria-invalid={Boolean(errors.username)}
                                                    aria-describedby={errors.username ? "username-error" : undefined}
                                                />
                                                <div className="tg--verify-ico-box"><div className="tg--verify-ico" /></div>
                                            </div>
                                            {errors.username && (
                                                <div className="tb--error-mes" id="username-error" role="alert">
                                                    <p>{errors.username}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="tb--flex tb--flex-col tb--mb-16 tb--w_100 tb--input-group tb--pc-input">
                                        <label className="tb--lbl tb--f-12 tb--login-lbl" htmlFor="Password">
                                            Contraseña <span> *</span>
                                        </label>
                                        <div className="tb--rel tb--error-cont">
                                            <div>
                                                <input
                                                    id="Password"
                                                    name="password"
                                                    className={`${errors.password ? "tb--error-border" : ""} tb--input tb--input-white tb--ellipsis tb--has-eye-icon`}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Ingresa tu contraseña"
                                                    autoComplete="current-password"
                                                    value={password}
                                                    onChange={updatePassword}
                                                    aria-invalid={Boolean(errors.password)}
                                                    aria-describedby={errors.password ? "password-error" : undefined}
                                                />
                                                <i
                                                    className={`tb--inline_login_eye tb--login_eye tb--flex tb--align-center tb--justify-center ${showPassword ? "digi_icon-eye" : "digi_icon-eye-slash"}`}
                                                    onClick={() => setShowPassword((visible) => !visible)}
                                                ></i>
                                                {/* <button
                                                    type="button"
                                                    className={`tb--inline_login_eye tb--login_eye tb--flex tb--align-center tb--justify-center ${showPassword ? "digi_icon-eye" : "digi_icon-eye-slash"}`}
                                                    onClick={() => setShowPassword((visible) => !visible)}
                                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                /> */}
                                            </div>
                                            {errors.password && (
                                                <div className="tb--error-mes" id="password-error" role="alert">
                                                    <p>{errors.password}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="tb--modal-login_footer tb--center tb--f-14 tb--mt-8">
                                    <div className="tb--flex tb--flex-wrap tb--justify-center tb--w_100 tb--rel">
                                        <input
                                            autoComplete="off"
                                            className="tb--mb-16 btn btn-wb-size-l btn-mb-size-l btn-primary__popup tb--w_100 submit-button"
                                            type="submit"
                                            value={isLoading ? "" : "Acceso"}
                                            disabled={isLoading}
                                        />
                                        {isLoading && <LoadApi />}
                                        <button
                                            type="button"
                                            className="btn tb--btn-forgot-password tb-max-w_100"
                                            onClick={handleForgotPassword}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                    <div className="tb--w_100 tb--tac" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
