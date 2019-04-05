<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-textfield" :attributes="{ label: 'Заголовок', name: fieldName('title'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-inputframe label="Иконки" name="medias.icons" > <a17-slideshow :name="fieldName('icons')" :max="3" crop-context="icons" >SVG иконки</a17-slideshow> </a17-inputframe>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
