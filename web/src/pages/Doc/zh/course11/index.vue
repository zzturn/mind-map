<template>
  <div>
    <h1>结构</h1>
<p><code>simple-mind-map</code>目前支持四种结构：logicalStructure（逻辑结构图）、mindMap（思维导图）、organizationStructure（组织结构图）、catalogOrganization（目录组织图）。</p>
<p>可以在实例化<code>simple-mind-map</code>时通过选项指定使用的结构：</p>
<pre class="hljs"><code><span class="hljs-keyword">new</span> MindMap({
    <span class="hljs-comment">// ...</span>
    <span class="hljs-attr">layout</span>: <span class="hljs-string">&#x27;logicalStructure&#x27;</span>
})
</code></pre>
<p>也可以动态切换结构：</p>
<pre class="hljs"><code>mindMap.setLayout(<span class="hljs-string">&#x27;organizationStructure&#x27;</span>)
</code></pre>
<p>获取当前使用的结构可以使用<code>getLayout</code>方法：</p>
<pre class="hljs"><code><span class="hljs-keyword">const</span> layout = mindMap.getLayout()
</code></pre>
<h2>完整示例</h2>
<iframe style="width: 100%; height: 455px; border: none;" src="https://wanglin2.github.io/playground/#eNrFVVtrFDEU/iuHiMxWtrNb8Gndlnp7EFqR+tgUSWfS3WgmGSaZXiwLUgrWS0Hpg6Ag6os++ChCW8Q/0+72Z3iymZkd2z745sIsk3P5vpOc72S2yc00DddzTjqka6JMpBYMt3k6R5VIUp1Z2IaMrzVBq0WdK8vjJpg+k1JvLPE1GMBaphMIECGoMhaFihdZ6l2UGDRLPp2gdTphKSVUAVAluQVnc5GzoHIpvb3VgtNfB6cv9oe/nw1/HI/e75693BntHJ7uvTv7/I2qSCtjgUVWrPP7OuYGsycVNZZXpqjyKHvPh/tfRscHw4+7ZVrUZ6rHF7aYzi3mNaZgdg62HXFRSoi7X2Bb6G4EOusxJZ4yK7R6aLM8snnGA4QfOIbqQBoXUdyG+EZ5EI2xC4DLDsQ6yhOubNjj9q7k7vXW1r24ERSZt7WyTCieBVNNnxUzyzoe3f0ocQZKaiZvtnzTOjMlw0+H/sj8UbvfoABzgVFfyDjjygUvTzDOwV3Kcp7p5Oj16OjrebK/CS8hXZn46nH/qYLytbCVeUIJu6S1dRp7oI1wKsDMQPI1GzQhiLB12KaVIlyORdOBQOqeiJicCMb5B1M3vLoBUJmjD29P33z3RXuVnxy9Ojn+WdehVo1AIfUjr3RkbLhlE9z/gjB2IjqoT0O4zmTOnQCLOE+PosWn2/IzjtONC8txMJnluALoxmIdIsmMmaWkKOIOTzQlY3cRIOKJt5IqhnRb6K0HlkhWa7nKXIh3Uttdza3VCuYjKaInGFKfSYyrj2235YNL5IqlfOu2apvApbFb0u9nvriMKAlb/gYqpjHkJgkjYyipWhLW9lse6YaIbb8DM+321XEcQFqJIOPIiAc+doz1454r58+lhJokslWjZW59ImoGpdSBdrGyOp0sLtL3uej1Mfx6u51ulsyX814rmROW9QTylqgpi2OheqWhKj0s2vSPFc+UFRRFV2sERImNe0CaxHfA3fnhY6MVfmLG8LRwYAeq4aYEvyB+osMWvoYZXq0i4a5Z06uZ3jA8QxBKimm75Kvicy+22mUVtQ3I4A+xm1Zg" />
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>