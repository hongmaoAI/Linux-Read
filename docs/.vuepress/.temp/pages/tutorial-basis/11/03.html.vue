<template><div><h1 id="延伸正则表示法" tabindex="-1"><a class="header-anchor" href="#延伸正则表示法"><span>延伸正则表示法</span></a></h1>
<p>一般来说，只要了解了基础正则表示法大概就已经相当足够了，所谓技多不压身；还可以了解使用范围更广的延伸正则表示法。举个例子：前面讲解到要去除空白行与行首为 <code v-pre>#</code> 的行，使用的是</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">'^$'</span> regular_express.txt <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">'^#'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>需要使用到管线命令来搜寻两次，使用延伸的正则表示法则如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">egrep</span> <span class="token parameter variable">-v</span> <span class="token string">'^$|^#'</span> regular_express.txt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>此外，grep 预设仅支持基础的正则表示法，可以使用 <code v-pre>-E</code> 参数开启，不过建议用别名 egrep</p>
<p>下面是延伸正则表示法的符号（RE 字符）说明：</p>
<ul>
<li>
<p><code v-pre>+</code>：重复「一个或一个以上」的前一个 RE 字符</p>
<p>范例：搜索 (god)(good)(goood)...等字符串。 可以使用</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">egrep</span> <span class="token parameter variable">-n</span> <span class="token string">'go+d'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs<span class="token operator">!</span></span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good<span class="token operator">!</span></span>
<span class="line"><span class="token number">13</span>:Oh<span class="token operator">!</span>  My god<span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>?</code>：「0 个或 1 个」的前一个 RE 字符</p>
<p>范例：搜索 gd、god</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">egrep</span> <span class="token parameter variable">-n</span> <span class="token string">'go?d'</span> regular_express.txt </span>
<span class="line"><span class="token number">13</span>:Oh<span class="token operator">!</span>  My god<span class="token operator">!</span></span>
<span class="line"><span class="token number">14</span>:The gd software is a library <span class="token keyword">for</span> drafting programs<span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>|</code>：用或（or）的方式找出数个字符串</p>
<p>范例：搜索 gd 或 good</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">egrep</span> <span class="token parameter variable">-n</span> <span class="token string">'gd|good'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs<span class="token operator">!</span></span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good<span class="token operator">!</span></span>
<span class="line"><span class="token number">14</span>:The gd software is a library <span class="token keyword">for</span> drafting programs<span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>()</code>：找出「群组」字符串</p>
<p>范例：搜索 glad 或 good</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 当然，这里使用上面完整的或来匹配两个固定单词也是可以的</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">egrep</span> <span class="token parameter variable">-n</span> <span class="token string">'g(la)|(oo)d'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs<span class="token operator">!</span></span>
<span class="line"><span class="token number">2</span>:apple is my favorite food<span class="token operator">!</span></span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good<span class="token operator">!</span></span>
<span class="line"><span class="token number">16</span>:The world <span class="token operator">&lt;</span>Happy<span class="token operator">></span> is the same with <span class="token string">"glad"</span><span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>()+</code>：多个重复群组的判别</p>
<p>范例：将「AxyzxyzxyzxyzC」用 echo 叫出，然后再使用如下的方法搜索</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token string">'AxyzxyzxyzxyzC'</span> <span class="token operator">|</span> <span class="token function">egrep</span> <span class="token string">'A(xyz)'</span></span>
<span class="line">Axyz xyzxyzxyzC <span class="token comment"># 在命令行中是有红色高亮的，这个只能高亮到 Axyz</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token string">'AxyzxyzxyzxyzC'</span> <span class="token operator">|</span> <span class="token function">egrep</span> <span class="token string">'A(xyz)+'</span></span>
<span class="line">Axyzxyzxyzxyz C <span class="token comment"># C 不会高亮</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token string">'AxyzxyzxyzxyzC'</span> <span class="token operator">|</span> <span class="token function">egrep</span> <span class="token string">'A(xyz)+C'</span></span>
<span class="line">AxyzxyzxyzxyzC <span class="token comment"># 完全匹配</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>要特别注意：<code v-pre>grep -n '[!&gt;]' xx.txt</code> 的含义并不是除了 &gt; 字符之外的字符，因为 <code v-pre>!</code>  不是一个特殊符号</p>
<p>想要表示非，需要这样写 <code v-pre>grep -n '[^a-z]' xx.txt</code></p>
</div>
</div></template>


