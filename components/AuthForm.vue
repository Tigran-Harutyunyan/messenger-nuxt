<script setup lang="ts">
import AuthSocialButton from "@/components/AuthSocialButton.vue";
import GithubIcon from "@/components/ui/icons/GithubIcon.vue";
import GoogleIcon from "@/components/ui/icons/GoogleIcon.vue";
import { reset } from "@formkit/core";

import { useNotification } from "naive-ui";
const notification = useNotification();

type Variant = "LOGIN" | "REGISTER";
const variant = ref<Variant>("LOGIN");

const isLoading = ref(false);

const showSocial = ref(true);

const { signIn } = useAuth();

const toggleVariant = () => {
  reset("myForm");

  if (variant.value === "LOGIN") {
    variant.value = "REGISTER";
  } else {
    variant.value = "LOGIN";
  }
};

const socialAction = (action: string) => {
  signIn(action, { redirect: false })
    .then((callback) => {
      if (callback?.error) {
        notification.error({
          content: "Invalid credentials!",
          duration: 2500,
          keepAliveOnHover: true,
        });
      }

      if (callback?.ok || callback?.id) {
        router.push("/conversations");
      }
    })
    .finally();
};
const submitted = ref(false);
const router = useRouter();

type form = {
  name?: string;
  email: string;
  password: string;
};
const onSubmit = async (formData: form) => {
  isLoading.value = true;

  if (variant.value === "REGISTER") {
    try {
      const callback = await $fetch("/api/register", {
        method: "post",
        body: formData,
      });

      if (callback && typeof callback === "object" && "error" in callback) {
        notification.error({
          content: callback.error,
          duration: 2500,
          keepAliveOnHover: true,
        });
      }
      if (callback?.id) {
        notification.success({
          content: "Registration success",
          duration: 2500,
          keepAliveOnHover: true,
        });
        isLoading.value = false;
        variant.value = "LOGIN";

        //reset("myForm");
      }
    } catch (error) {
      notification.error({
        content: error?.statusMessage || "Something went wrong",
        duration: 2500,
        keepAliveOnHover: true,
      });
    } finally {
      isLoading.value = false;
    }
  }

  if (variant.value === "LOGIN") {
    signIn("credentials", {
      ...formData,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          notification.error({
            content: callback?.error,
            duration: 2500,
            keepAliveOnHover: true,
          });
        }
        if (callback?.id || (callback?.ok && callback?.error === null)) {
          router.push("/conversations");
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
</script>

<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <FormKit
        type="form"
        id="myForm"
        :form-class="submitted ? 'hide' : 'show'"
        :submit-label="variant === 'REGISTER' ? 'Register' : 'Sign in'"
        @submit="onSubmit"
        :actions="false"
        #default="{ value }"
      >
        <FormKit
          v-if="variant === 'REGISTER'"
          type="text"
          name="name"
          label="Your name"
          placeholder="Jane Doe"
          validation="required"
          :disabled="isLoading"
        />
        <FormKit
          type="text"
          name="email"
          label="Email address"
          placeholder="jane@example.com"
          validation="required|email"
          :disabled="isLoading"
        />

        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required|length:6"
          :validation-messages="{
            matches: 'Please include at least one symbol',
          }"
          placeholder="Your password"
        />
        <div class="submit-block">
          <FormKit
            type="submit"
            :label="
              isLoading
                ? 'Wait...'
                : variant === 'REGISTER'
                ? 'Register'
                : 'Sign in'
            "
          />
        </div>
      </FormKit>
      <div class="mt-6" v-if="showSocial">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500"> Or continue with </span>
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <AuthSocialButton
            :icon="GoogleIcon"
            @click="socialAction('google')"
          />
        </div>
      </div>
      <div class="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
        <div>
          {{
            variant === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account?"
          }}
        </div>
        <div @click="toggleVariant" class="underline cursor-pointer">
          {{ variant === "LOGIN" ? "Create an account" : "Login" }}
        </div>
      </div>
    </div>
  </div>
</template>
