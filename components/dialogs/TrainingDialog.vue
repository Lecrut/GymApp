<script setup lang="ts">
import { ref, watch } from 'vue';

const isShow = defineModel<boolean>('isShow', {
    default: false,
});

const timer = ref(0);
const intervalId = ref<NodeJS.Timeout | null>(null);

function startTimer() {
    timer.value = 0;
    intervalId.value = setInterval(() => {
        timer.value += 0.1;
    }, 100);
}

function stopTimer() {
    if (intervalId.value !== null) {
        clearInterval(intervalId.value);
        intervalId.value = null;
    }
}

watch(isShow, (newVal) => {
    if (newVal) {
        startTimer();
    } else {
        stopTimer();
    }
});
</script>

<template>
    <v-dialog v-model="isShow" persistent>
        <v-card class="pa-4">
            <v-card-text>
                <div class="d-flex flex-column align-center">
                    <v-progress-circular color="primary" size="100" :width="12" indeterminate />
                    <div class="text-h6 mt-4">
                        {{ $t("training.form.breakTime") }}: {{ Math.round(timer * 10) / 10 }} s
                    </div>

                    <v-btn @click="stopTimer">{{ $t("training.form.startSet") }}</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>