<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-textfield" :attributes="{ label: 'Заголовок', name: fieldName('title'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-inputframe label="Иконка" name="medias.icon" > <a17-mediafield :name="fieldName('icon')" crop-context="icon" >SVG иконка</a17-mediafield> </a17-inputframe><a17-repeater type="features_offered_item" :name="repeaterName('features_offered_item')" ></a17-repeater>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
