<template>
  <div>
    <h1>参与翻译</h1>
<p>感谢<a href="https://github.com/emircanerkul">Emircan ERKUL</a>提供的第一版英文翻译。</p>
<p>如果你也想参与翻译本文档的话，可以先克隆本仓库。</p>
<p>翻译的文档在<code>/web/src/pages/Doc/</code>目录下，目前支持英文(<code>en</code>)、简体中文(<code>zh</code>)两种语言。</p>
<p>如果是新增一种语言类型，那么可以在<code>/web/src/pages/Doc/</code>目录下创建一个新目录，然后给每个章节创建一个文件夹，你也可以直接复制已存在的语言目录下的所有章节目录进行翻译，注意，你只需要编写<code>index.md</code>文件，章节目录下的<code>index.vue</code>文件是脚本根据<code>index.md</code>自动生成的。</p>
<p>如果是给已存在的语言类型新增翻译章节，可以在目标语言目录下创建新的章节目录，目录下只需要创建<code>index.md</code>文件即可。</p>
<p>当你完成翻译后，可以直接提交<code>Pull requests</code>。</p>
<p>如果你是前端程序员，想运行服务，查看文档页面的效果，如果新增章节，需要修改<code>/web/src/pages/Doc/catalogList.js</code>文件，在<code>StartList</code>或者<code>APIList</code>数组里选择合适的位置插入新章节的<code>path</code>。然后需要在<code>web</code>目录下运行<code>npm run buildDoc</code>编译目录和路由，最后<code>npm run serve</code>启动本地服务，打开以下路径即可查看文档：</p>
<p><code>ip:port/#/doc/zh/introduction</code></p>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>