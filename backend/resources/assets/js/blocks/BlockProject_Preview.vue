<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-repeater type="project_preview_item" :name="repeaterName('project_preview_item')" ></a17-repeater>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
