<template>
    <div class="flex flex-col gap-3">
        <p>作品名称</p>
        <input v-model="name" v-bind="nameAttrs" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>

        <p>子域名</p>
        <input v-model="domain" v-bind="domainAttrs" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        <p v-if="errors.domain" class="text-red-500 text-sm mt-1">{{ errors.domain }}</p>

        <p>作品简介</p>
        <textarea v-model="description" v-bind="descriptionAttrs" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
        <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>

        <p>网站内容（zip文件）</p>
        <input type="file" ref="fileInput" @change="handleFileChange" v-bind="fileAttrs" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        <p v-if="errors.file" class="text-red-500 text-sm mt-1">{{ errors.file }}</p>
        <button @click="submitForm" class="mt-3 px-4 py-2 bg-blue-500 text-white rounded">提交</button>        
    </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import http from '../utils/http';
import type { IProject } from '@/interface';

const validationSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(1).max(12),
        domain: zod.string().min(1).max(12),
        file: zod
            .instanceof(File, { message: '请上传一个文件' })
            .refine((file) => file.size <= 100 * 1024 * 1024, '文件大小不能超过100MB')
            .optional(),
        description: zod.string().max(4089)
    })
);

const { defineField, handleSubmit, errors, setValues } = useForm({
    validationSchema,
});

const [domain, domainAttrs] = defineField('domain');
const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');

const [file, fileAttrs] = defineField('file');

const route = useRoute();
const project = ref<IProject>();
const fileInput = ref<HTMLInputElement | null>(null);

watch(
    () => route.params.id,
    async (newId) => {
        if (!newId) return;
        const res = await http.get(`/projects/detail/${newId}`);
        project.value = res.data.project;
        setValues(res.data.project)
    },
    { immediate: true }
);

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        file.value = input.files[0]
    }
};

const submitForm = handleSubmit(async (values) => {
    await http.post('/projects/update/' + project.value?.id, values)

    if (values.file) {
        const formData = new FormData();
        formData.append('domain', values.domain);
        formData.append('description', values.description);
        formData.append('file', values.file);

        await http.post('/projects/upload-zip/' + project.value?.id, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
});
</script>