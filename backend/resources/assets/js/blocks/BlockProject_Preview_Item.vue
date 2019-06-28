<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-vselect label="Тип превью" :name="fieldName('type')" :options='[{&quot;value&quot;:&quot;pc&quot;,&quot;label&quot;:&quot;\u0414\u0435\u0441\u043a\u0442\u043e\u043f&quot;},{&quot;value&quot;:&quot;mobile&quot;,&quot;label&quot;:&quot;\u041f\u043b\u0430\u043d\u0448\u0435\u0442&quot;},{&quot;value&quot;:&quot;mobile2&quot;,&quot;label&quot;:&quot;\u041c\u043e\u0431\u0438\u043b\u043a\u0430 \u0432\u0435\u0431-\u0432\u0435\u0440\u0441\u0438\u044f (2 \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0438)&quot;},{&quot;value&quot;:&quot;ios&quot;,&quot;label&quot;:&quot;iPhone App&quot;},{&quot;value&quot;:&quot;android&quot;,&quot;label&quot;:&quot;Android App&quot;}]' :selected="{&quot;value&quot;:&quot;pc&quot;,&quot;label&quot;:&quot;\u0414\u0435\u0441\u043a\u0442\u043e\u043f&quot;}" :has-default-store="true" size="large" in-store="inputValue" > </a17-vselect><a17-inputframe label="Изображение" name="medias.image" > <a17-slideshow :name="fieldName('image')" :max="2" crop-context="image" ></a17-slideshow> </a17-inputframe>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
