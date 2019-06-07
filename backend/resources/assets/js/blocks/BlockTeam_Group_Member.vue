<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-textfield" :attributes="{ label: 'Имя', name: fieldName('name'), type: 'text', maxlength: 300, inStore: 'value' }" ></a17-locale><a17-locale type="a17-textfield" :attributes="{ label: 'Работа', name: fieldName('job'), type: 'text', maxlength: 300, inStore: 'value' }" ></a17-locale><a17-inputframe label="Фото" name="medias.avatar" > <a17-mediafield :name="fieldName('avatar')" crop-context="avatar" ></a17-mediafield> </a17-inputframe>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
