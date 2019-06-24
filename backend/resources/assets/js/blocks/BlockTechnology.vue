<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-textfield" :attributes="{ label: 'Название', name: fieldName('title'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-inputframe label="Логотип" name="medias.icon" > <a17-mediafield :name="fieldName('icon')" crop-context="icon" ></a17-mediafield> </a17-inputframe>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
