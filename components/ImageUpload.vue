<script setup lang="ts">
import HiPhoto from "~/components/ui/icons/HiPhoto.vue";

interface ImageUploadProps {
  label?: string;
}

const { label } = defineProps<ImageUploadProps>();

const emit = defineEmits(["change"]);

const uploadTest = ref("uw-test");

interface SuccessResponse {
  value: {
    event: "success";
    info: {
      secure_url: string;
    };
  };
}

interface ErrorResponse {
  value: {
    event: "error";
    error: {
      message: string;
    };
  };
}

type Response = SuccessResponse | ErrorResponse;

const handleUpload = (res: Response) => {
  if (res.value.event === "success") {
    emit("change", res.value?.info?.secure_url);
  }
};
</script>

<template>
  <CldUploadWidget
    v-slot="{ open }"
    :uploadPreset="uploadTest"
    :options="{ maxFiles: 1 }"
    @upload="handleUpload"
  >
    <p
      v-if="label"
      @click="open"
      class="font-semibold cursor-pointer text-gray-900 text-sm"
    >
      {{ label }}
    </p>
    <HiPhoto v-else @click="open" class="cursor-pointer" />
  </CldUploadWidget>
</template>
