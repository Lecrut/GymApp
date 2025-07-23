<script setup lang="ts">
import { ref } from 'vue';
import TrainingDialog from '@/components/dialogs/TrainingDialog.vue'

const isShowDialog = ref(false)

function openTrainingDialog() {
    isShowDialog.value = true
}
</script>

<template>
    <div>
        <v-card class="py-5 bg-blue-lighten-1">
            <v-card-title align="center">
                <div class="text-h2">{{ $t('user.gymTraining') }}</div>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col class="d-flex align-center justify-center" cols="12" md="6">
                        <div class="d-flex flex-column ga-3">
                            <div class="text-h3 font-weight-bold">
                                {{ $t("training.startYourTraining") }}
                            </div>
                            <div class="text-h3 font-weight-bold text-primary">
                                {{ $t("training.rightNow") }}
                            </div>
                            <p class="text-subtitle-1">
                                {{ $t("training.description") }}
                            </p>
                            <v-btn @click="openTrainingDialog">
                                {{ $t("training.letsGo") }}
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col class="d-flex justify-center" cols="12" md="6">
                        <v-img class="flex-grow-0" height="400" width="400" src="public/images/fitness-stats.svg">
                            <template #placeholder>
                                <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular color="grey-lighten-4" indeterminate />
                                </div>
                            </template>
                        </v-img>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <TrainingDialog v-if="isShowDialog" v-model="isShowDialog" />
    </div>
</template>