<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-locale type="a17-wysiwyg" :attributes="{ label: 'Текст', name: fieldName('content'), options: {&quot;modules&quot;:{&quot;toolbar&quot;:[{&quot;header&quot;:[2,3,4,5,false]},&quot;clean&quot;],&quot;syntax&quot;:false}}, editSource: true, inStore: 'value' }" ></a17-locale>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
