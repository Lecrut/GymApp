<script setup lang="ts">
import { requiredRule, emailRule, lengthRule, lengthRuleShort, timestampPastRule } from '~/composables/rules'
import { UserModel } from '~/models/user'
import { formatDateForInput } from '~/composables/time'

const isShow = defineModel<boolean>('isShow', {
  default: false,
})

const { form, valid, isValid } = formValidation()
const authStore = useAuthStore()
const { userData, error } = storeToRefs(authStore)

const email = ref('')
const nick = ref('')
const name = ref('')
const surname = ref('')
const dateOfBirth = ref('')



function prepareUserModel() {
    if (!userData.value) return null
    return new UserModel({
      ...userData.value,
      nick: nick.value,
      name: name.value,
      surname: surname.value,
      dateOfBirth: new Date(dateOfBirth.value),
    }, userData.value?.reference)
}

async function editUser() {
    const newUser = prepareUserModel()
    console.log('Editing user:', newUser)
  if (await isValid() && newUser) {
    await authStore.updateUserData(newUser)
    if (!error.value) {
      isShow.value = false
    }
  }
}

function closeDialog() {
    email.value = ''
    nick.value = ''
    name.value = ''
    surname.value = ''
    dateOfBirth.value = ''

    isShow.value = false
}

watch(isShow, (newValue) => {
  if (newValue) {
    email.value = userData.value?.email || ''
    nick.value = userData.value?.nick || ''
    name.value = userData.value?.name || ''
    surname.value = userData.value?.surname || ''
    dateOfBirth.value = formatDateForInput(userData.value?.dateOfBirth || new Date())
  }
})

</script>

<template>
  <v-dialog
    v-model="isShow"
    max-width="600"
    @update:model-value="closeDialog"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('auth.editProfile') }}
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                :label="$t('auth.name')"
                :rules="[requiredRule(), lengthRule()]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="surname"
                :label="$t('auth.surname')"
                :rules="[requiredRule(), surnameLengthRule()]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="nick"
                :label="$t('auth.nick')"
                :rules="[requiredRule(), lengthRuleShort(), lengthRule()]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :label="$t('auth.email')"
                :rules="[requiredRule(), emailRule()]"
                disabled
                variant="outlined"
                density="comfortable"
                type="email"
              />
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="dateOfBirth"
                :label="$t('auth.register.dateBirth')"
                :rules="[timestampPastRule()]"
                variant="outlined"
                density="comfortable"
                type="date"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeDialog"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!valid"
          @click="editUser"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>