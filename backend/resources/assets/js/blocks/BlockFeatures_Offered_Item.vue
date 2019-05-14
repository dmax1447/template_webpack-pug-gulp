<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-textfield" :attributes="{ label: 'Текст', name: fieldName('title'), type: 'text', maxlength: 300, inStore: 'value' }" ></a17-locale><a17-textfield label="Иконка FA" :name="fieldName('icon')" type="text" note="FontAwesome icon" in-store="value" ></a17-textfield>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
