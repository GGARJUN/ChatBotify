"use client";

import styles from "./index.module.css";

import React, { useRef, useState } from "react";

import clsx from "clsx";


import Link from "next/link";
import { redirect } from "next/navigation";
export default function Signup() {

    const [formValues, setFormValues] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    const [loader, setLoader] = useState(false);
    const [errFields, setErrFields] = useState({});
    const [showDialog, setShowDialog] = useState({
        close: Function,
        heading: "",
        show: false,
        title: "",
        variant: "success",
    });
    const msgs = useRef(null);
    const register = () => {
        let errorCount = errorValidation(formValues);
        if (errorCount === 0) {
            setLoader(true);
            authServices
                .register({
                    emailId: formValues.email,
                    username: `${formValues.firstname}${formValues.lastname}`,
                    password: formValues.password,
                } )
                .then(() => {
                    setShowDialog((prev) => ({
                        ...prev,
                        show: true,
                        title:"Signed up successfully, Please check your email and verify"
                    }))
                })
                .catch(() => {
                    // msgs.current.show({
                    //     sticky: false,
                    //     severity: "error",
                    //     summary: "Info",
                    //     detail: "Unable to signup, please try again after sometime",
                    //     closable: true,
                    //     life: 5000,
                    // });
                    setShowDialog((prev) => ({
                        ...prev,
                        show: true,
                        varient:"error",
                        title:"Unable to signup, Please try again after sometime",
                    }))
                })
                .finally(() => {
                    setLoader(false);
                });
        }
    };
    const changeHandler = (e) => {
        let { name, value } = e.currentTarget;
        let _copyFormValues = { ...formValues };
        _copyFormValues[name ] = value;
        setFormValues(_copyFormValues);
        errorValidation(_copyFormValues);
    };
    const errorValidation = (form) => {
        let emailReg = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        let passwordReg = new RegExp(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        );
        let _copyErrObj = { ...errFields };
        Object.keys(form).forEach((ele) => {
            let elemValue = form[ele ];
            if (ele === "email") {
                emailReg.test(elemValue)
                    ? (_copyErrObj.email = "")
                    : (_copyErrObj.email = "Please enter a valid email id");
            }
            if (ele === "password") {
                passwordReg.test(elemValue)
                    ? (_copyErrObj.password = "")
                    : (_copyErrObj.password =
                        "Password must be 8-16 characters long and include at least one uppercase letter, one special character, and one number");
            }
            if (ele === "firstname") {
                elemValue.trim().length > 0
                    ? (_copyErrObj.firstname = "")
                    : (_copyErrObj.firstname = "Required Field");
            }
        });
        setErrFields(_copyErrObj);
        return Object.values(_copyErrObj).filter((ele) => Boolean(ele)).length;
    };
    const closeHanlder = () => {
        let _copyPrev = { ...showDialog };
        _copyPrev.show = false;
        setShowDialog(_copyPrev);
        if (_copyPrev.variant === 'success') redirect('/login')
    }
    return (


            <section>
                <div className={styles.mainsection}>
                    <div className={styles.innersection}>
                        <img src="/bg.jpeg" alt="logo img" />
                        <div className={styles.title}>
                            <h2 className="sw-heading-1">Discover your next big idea</h2>
                            <p className="sw-description-1">Sign up for a free account.</p>
                        </div>
                        <div className={`${styles.content} sw-form`}>
                            <div className={styles.seperator}>
                                <p>or</p>
                            </div>
                            <div className={styles.name}>
                                <div className={styles.email}>
                                    <h2 className="sw-description-2">First Name</h2>
                                    <input
                                        placeholder="First Name"
                                        value={formValues.firstname}
                                        name="firstname"
                                        onChange={changeHandler}
                                        className={clsx({
                                            ["border-red-500 border-2"]: errFields.firstname,
                                        })}
                                    />
                                    {errFields.firstname && (
                                        <small className="text-red-600 font-bold">
                                            {errFields.firstname}
                                        </small>
                                    )}
                                </div>
                                <div className={styles.email}>
                                    <h2 className="sw-description-2">Last Name</h2>
                                    <input
                                        placeholder="Last Name"
                                        value={formValues.lastname}
                                        name="lastname"
                                        onChange={changeHandler}
                                    ></input>
                                    {errFields.lastname && <small>{errFields.lastname}</small>}
                                </div>
                            </div>
                            <div className={styles.email}>
                                <h2 className="sw-description-2">Email</h2>
                                <input
                                    placeholder="eleanor@mixpixel.com"
                                    value={formValues.email}
                                    name="email"
                                    onChange={changeHandler}
                                    className={clsx(errFields.email && "border-red-500 border-2")}
                                ></input>
                                {errFields.email && (
                                    <small className="text-red-600 font-bold">
                                        {errFields.email}
                                    </small>
                                )}
                            </div>
                            <div className={styles.email}>
                                <h2 className="sw-description-2">Password</h2>
                                <Password
                                    value={formValues.password}
                                    name="password"
                                    onChange={changeHandler}
                                    toggleMask
                                    placeholder="Example@123"
                                    className={clsx("input-full-width", {
                                        ["invalid-form-element"]: errFields.password,
                                    })}
                                    strongRegex="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                                />
                                {errFields.password && (
                                    <small className="text-red-600 font-bold">
                                        {errFields.password}
                                    </small>
                                )}
                            </div>
                            <div className={styles.checkbox}>
                                <input type="checkbox"></input>
                                <label className="sw-description-2">
                                    Agreed to <a href="#">terms of use</a> &{" "}
                                    <a href="#">privacy statements</a>
                                </label>
                            </div>
                            <Button onClick={register} label="Sign up" />
                            {/* <button onClick={register}>Sign Up</button> */}
                            <p className="sw-description-2">
                                Already have an account? <Link href={"/auth/pageslogin"}>Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
    );
}
