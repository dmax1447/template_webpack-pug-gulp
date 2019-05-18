<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-textfield" :attributes="{ label: 'Клиент (ФИО)', name: fieldName('client_name'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-locale type="a17-textfield" :attributes="{ label: 'Клиент (должность)', name: fieldName('client_position'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-inputframe label="Фото" name="medias.client_photo" > <a17-mediafield :name="fieldName('client_photo')" crop-context="client_photo" ></a17-mediafield> </a17-inputframe><a17-locale type="a17-wysiwyg" :attributes="{ label: 'Отзыв', name: fieldName('client_review'), editSource: true, inStore: 'value' }" ></a17-locale>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
