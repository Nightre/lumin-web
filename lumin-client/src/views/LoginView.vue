<template>
    <div>
        <div>
            <button @click="activeTab = 'login'" :disabled="isSubmitting">登录</button>
            <button @click="activeTab = 'register'" :disabled="isSubmitting">注册</button>
        </div>
        <hr />

        <div v-if="activeTab === 'login'">
            <h2>登录</h2>
            <Form @submit="v => handleLogin(v as ILoginFormValues)" v-slot="{ isSubmitting, errors }">
                <div>
                    <label for="loginEmail">邮箱</label>
                    <Field id="loginEmail" name="email" type="email" rules="required|email" autocomplete="email" />
                    <p style="color: red;">{{ errors.email }}</p>
                </div>
                <div>
                    <label for="loginPassword">密码</label>
                    <Field id="loginPassword" name="password" type="password" rules="required"
                        autocomplete="current-password" />
                    <p style="color: red;">{{ errors.password }}</p>
                </div>
                <button type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? '登录中...' : '登录' }}
                </button>
            </Form>
        </div>

        <div v-if="activeTab === 'register'">
            <h2>注册</h2>

            <div v-if="registrationStep === 1">
                <Form @submit="v => handleRegisterStep1(v as ILoginFormValues)" v-slot="{ isSubmitting, errors }">
                    <div>
                        <label for="regEmail">邮箱</label>
                        <Field id="regEmail" name="email" type="email" rules="required|email" autocomplete="email" />
                        <p style="color: red;">{{ errors.email }}</p>
                    </div>
                    <button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? '验证中...' : '发送验证码' }}
                    </button>
                </Form>
            </div>

            <div v-if="registrationStep === 2">
                <Form @submit="v => handleRegisterStep2(v as IRegisterStep2FormValues)" v-slot="{ isSubmitting, errors }">
                    <div>
                        <label for="regUsername">用户名</label>
                        <Field id="regUsername" name="username" type="text" rules="required|min:3"
                            autocomplete="username" />
                        <p style="color: red;">{{ errors.username }}</p>
                    </div>
                    <div>
                        <label for="regPassword">密码</label>
                        <Field id="regPassword" name="password" type="password" rules="required|min:8"
                            autocomplete="new-password" />
                        <p style="color: red;">{{ errors.password }}</p>
                    </div>
                    <div>
                        <label for="regCode">邮箱验证码</label>
                        <Field id="regCode" name="code" type="text" rules="required" />
                        <p style="color: red;">{{ errors.code }}</p>
                    </div>

                    <div>
                        <button type="button" @click="handleResendCode" :disabled="isSendingCode">
                            {{ isSendingCode ? '发送中...' : '重新发送验证码' }}
                        </button>
                    </div>

                    <br>

                    <button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? '注册中...' : '注册' }}
                    </button>
                    <button type="button" @click="registrationStep = 1" :disabled="isSubmitting">
                        返回
                    </button>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field, defineRule } from 'vee-validate';
import axios from '../axios';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import type { IUser } from '../stores/user';

interface ILoginFormValues {
    email: string;
    password: string;
}

interface IRegisterStep1FormValues {
    email: string;
}

interface IRegisterStep2FormValues {
    username: string;
    password: string;
    code: string;
}

interface IAuthResponse {
    token: string;
    user: IUser;
}

const activeTab = ref('login');
const registrationStep = ref(1);
const registrationEmail = ref('');
const isSubmitting = ref(false);
const isSendingCode = ref(false);
const router = useRouter();
const user = useUserStore();

const fnisi = (data: IAuthResponse) => {
    user.setToken(data.token);
    user.login(data.user);
    router.push("/");
};

const loginApi = (values: ILoginFormValues) => {
    return axios.post('/user/login', values);
};

const checkEmailAndSendCodeApi = async (emailValue: string) => {
    return axios.post('/user/register/send-email', { email: emailValue });
};

const registerApi = async (values: IRegisterStep1FormValues) => {
    return axios.post('/user/register/verify', values);
};

const handleLogin = async (values: ILoginFormValues) => {
    isSubmitting.value = true;
    try {
        const response = await loginApi(values);
        fnisi(response.data);
    } finally {
        isSubmitting.value = false;
    }
};

const handleRegisterStep1 = async (values: IRegisterStep1FormValues) => {
    isSubmitting.value = true;

    try {
        await checkEmailAndSendCodeApi(values.email);
        registrationEmail.value = values.email;
        registrationStep.value = 2;
    } finally {
        isSubmitting.value = false;
    }
};

const handleRegisterStep2 = async (values: IRegisterStep2FormValues) => {
    isSubmitting.value = true;
    const registrationData = {
        ...values,
        email: registrationEmail.value,
    };

    try {
        const response = await registerApi(registrationData);
        fnisi(response.data);
    } finally {
        isSubmitting.value = false;
    }
};

const handleResendCode = async () => {
    isSendingCode.value = true;
    try {
        await checkEmailAndSendCodeApi(registrationEmail.value);
    } finally {
        isSendingCode.value = false;
    }
};
</script>