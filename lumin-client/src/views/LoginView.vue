<!-- TODO: 换成 composition API -->
<template>
    <div class="card bg-base-100 shadow-md mx-auto p-6 mt-8 max-w-md space-y-4">
        <div role="tablist" class="tabs tabs-border w-full flex justify-center">
            <button @click="activeTab = 'login'" role="tab" class="tab" :class="{ 'tab-active': activeTab == 'login' }"
                :disabled="isSubmitting">登录</button>
            <button @click="activeTab = 'register'" role="tab" class="tab"
                :class="{ 'tab-active': activeTab == 'register' }" :disabled="isSubmitting">注册</button>
        </div>

        <div v-if="activeTab === 'login'">
            <h2 class="text-xl font-bold text-center">登录</h2>
            <Form @submit="v => handleLogin(v as ILoginFormValues)" v-slot="{ isSubmitting, errors }">
                <Field name="email" rules="required|email" v-slot="{ field, errors: fieldErrors }">
                    <label class="label">邮箱</label>
                    <input v-bind="field" type="email" autocomplete="email" class="input input-bordered w-full" />
                    <p class="text-error text-sm">{{ fieldErrors[0] }}</p>
                </Field>

                <Field name="password" rules="required" v-slot="{ field, errors: fieldErrors }">
                    <label class="label">密码</label>
                    <input v-bind="field" type="password" autocomplete="current-password"
                        class="input input-bordered w-full" />
                    <p class="text-error text-sm">{{ fieldErrors[0] }}</p>
                </Field>

                <button class="btn btn-primary w-full mt-4" type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? '登录中...' : '登录' }}
                </button>
            </Form>
        </div>

        <div v-if="activeTab === 'register'">
            <h2 class="text-xl font-bold text-center">注册</h2>

            <div v-if="registrationStep === 1">
                <Form @submit="v => handleRegisterStep1(v as IRegisterStep1FormValues)"
                    v-slot="{ isSubmitting, errors }">
                    <Field name="email" rules="required|email" v-slot="{ field, errors: fieldErrors }">
                        <label class="label">邮箱</label>
                        <input v-bind="field" type="email" autocomplete="email" class="input input-bordered w-full" />
                        <p class="text-error text-sm">{{ fieldErrors[0] }}</p>
                    </Field>

                    <button class="btn btn-primary w-full mt-4" type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? '验证中...' : '注册' }}
                    </button>
                </Form>
            </div>

            <div v-if="registrationStep === 2">
                <Form @submit="v => handleRegisterStep2(v as IRegisterStep2FormValues)"
                    v-slot="{ isSubmitting, errors }">
                    <Field name="username" rules="required|max:12" v-slot="{ field, errors: fieldErrors }">
                        <label class="label">用户名</label>
                        <input v-bind="field" type="text" class="input input-bordered w-full" />
                        <p class="text-error text-sm">{{ fieldErrors[0] }}</p>
                    </Field>
                    <input type="email" :value="registrationEmail" autocomplete="username" class="hidden" />
                    <Field name="password" rules="required|min:6" v-slot="{ field, errors: fieldErrors }">
                        <label class="label">密码</label>
                        <input v-bind="field" type="password" autocomplete="new-password"
                            class="input input-bordered w-full" />
                        <p class="text-error text-sm">{{ fieldErrors[0] }}</p>
                    </Field>

                    <Field name="code" rules="required" v-slot="{ field, errors: fieldErrors }">
                        <label class="label">邮箱验证码</label>
                        <input v-bind="field" type="text" class="input input-bordered w-full" />
                        <p class="text-error text-sm">{{ fieldErrors[0] }}</p>
                    </Field>

                    <button class="btn btn-secondary w-full mt-2" type="button" @click="handleResendCode"
                        :disabled="isSendingCode">
                        {{ isSendingCode ? '发送中...' : '重新发送验证码' }}
                    </button>

                    <div class="flex justify-between mt-4">
                        <button class="btn btn-outline" type="button" @click="registrationStep = 1"
                            :disabled="isSubmitting">返回</button>
                        <button class="btn btn-primary" type="submit" :disabled="isSubmitting">
                            {{ isSubmitting ? '注册中...' : '注册' }}
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import axios from '../utils/http';
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
    router.push('/');
};

const loginApi = (values: ILoginFormValues) => {
    return axios.post('/user/login', values);
};

const checkEmailAndSendCodeApi = async (emailValue: string) => {
    return axios.post('/user/register/send-email', { email: emailValue });
};

const registerApi = async (values: IRegisterStep2FormValues & { email: string }) => {
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
    const registrationData = { ...values, email: registrationEmail.value };
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