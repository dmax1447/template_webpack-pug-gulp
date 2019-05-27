<template>
    <!-- eslint-disable -->
    <div class="block__body">
        <a17-textfield label="Key" :name="fieldName('key')" type="text" :maxlength="100" in-store="value" ></a17-textfield><a17-locale type="a17-textfield" :attributes="{ label: 'Категория', name: fieldName('category'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-locale type="a17-textfield" :attributes="{ label: 'Имя', name: fieldName('name'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-locale type="a17-textfield" :attributes="{ label: 'Должность', name: fieldName('job'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-locale type="a17-textfield" :attributes="{ label: 'Специализация', name: fieldName('spec'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-locale type="a17-wysiwyg" :attributes="{ label: 'Описание', name: fieldName('text'), options: {&quot;modules&quot;:{&quot;toolbar&quot;:[{&quot;header&quot;:[2,3,4,5,false]},&quot;clean&quot;],&quot;syntax&quot;:false}}, editSource: true, inStore: 'value' }" ></a17-locale><a17-locale type="a17-textfield" :attributes="{ label: 'Также текст', name: fieldName('alsoHeader'), type: 'text', maxlength: 200, inStore: 'value' }" ></a17-locale><a17-inputframe label="Фото" name="medias.icon" > <a17-mediafield :name="fieldName('icon')" crop-context="icon" ></a17-mediafield> </a17-inputframe><a17-repeater type="team_group_member" :name="repeaterName('team_group_member')" ></a17-repeater>
    </div>
</template>

<script>
  import BlockMixin from '@/mixins/block'

  export default {
    mixins: [BlockMixin]
  }
</script>
