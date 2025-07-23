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
        timer.value++;
    }, 1000);
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
        <v-card>
            <v-card-text>
                <!-- Timer display -->
                <div>Elapsed Time: {{ timer }} seconds</div>
                <!-- Stop button -->
                <v-btn @click="stopTimer">Stop</v-btn>
                <v-btn @click="startTimer">Start</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>