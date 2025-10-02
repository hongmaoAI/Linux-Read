<template><div><h1 id="本章习题" tabindex="-1"><a class="header-anchor" href="#本章习题"><span>本章习题</span></a></h1>
<p>请按照以下的方式来建立你的系统重要文件指纹膜，并每日对比此重要工作</p>
<ol>
<li>
<p>将 <code v-pre>/etc/{passwd,shadow,group}</code> 以及系统上所有的 SUID/SGID 文件建立文件列表，命名为 important.file</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ls /etc/{passwd,shadow,group} > important.file</span></span>
<span class="line"><span class="token comment"># 将 SUID/SGID 文件追加写入到文件中</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># find /usr/sbin/ /usr/bin -perm /6000 >> important.file </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>通过这个文档名列表，建立 md5.checkfile.sh 脚本，并将该指纹码文件 finger1.file 设置为不可修改属性</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim md5.checkfile.sh</span></span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">filename</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /root/important.file<span class="token variable">)</span></span></span>
<span class="line"><span class="token keyword">do</span></span>
<span class="line">	md5sum <span class="token variable">$filename</span> <span class="token operator">>></span> finger1.file</span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sh md5.checkfile.sh</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chattr +i finger1.file</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>通过相同的机制去建立后续的分析数据为 <code v-pre>finger_new.file</code> ，并将两者进行对比，若有问题则提供 email 给 root 查询</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim md5.checkfile.sh</span></span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">"<span class="token variable">$1</span>"</span> <span class="token operator">==</span><span class="token operator">=</span> <span class="token string">"new"</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token keyword">for</span> <span class="token for-or-select variable">filename</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /root/important.file<span class="token variable">)</span></span></span>
<span class="line">  <span class="token keyword">do</span></span>
<span class="line">    md5sum <span class="token variable">$filename</span> <span class="token operator">>></span> finger1.file</span>
<span class="line">  <span class="token keyword">done</span></span>
<span class="line">  <span class="token builtin class-name">echo</span> <span class="token string">"New file finger1.file is created."</span></span>
<span class="line">  <span class="token builtin class-name">exit</span> <span class="token number">0</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> finger1.file <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">	<span class="token builtin class-name">echo</span> <span class="token string">"file: finger1.file NOT exist."</span></span>
<span class="line">	<span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span> <span class="token parameter variable">-f</span> finger_new.file <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> finger_new.file</span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">filename</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /root/important.file<span class="token variable">)</span></span></span>
<span class="line">  <span class="token keyword">do</span></span>
<span class="line">    md5sum <span class="token variable">$filename</span> <span class="token operator">>></span> finger_new.file</span>
<span class="line">  <span class="token keyword">done</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">testing</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">diff</span> finger1.file finger_new.file<span class="token variable">)</span></span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">"<span class="token variable">$testing</span>"</span> <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">	<span class="token function">diff</span> finger1.file finger_new.file <span class="token operator">|</span> mail <span class="token parameter variable">-s</span> <span class="token string">'finger trouble..'</span> root</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/crontab</span></span>
<span class="line"><span class="token number">30</span> <span class="token number">2</span> * * * root <span class="token builtin class-name">cd</span> /root<span class="token punctuation">;</span> <span class="token function">sh</span> md5.checkfile.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上脚本则可以自动分析这些文件是否有改动</p>
</li>
</ol>
</div></template>


