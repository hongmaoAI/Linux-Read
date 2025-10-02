<template><div><h1 id="检验软件的正确性" tabindex="-1"><a class="header-anchor" href="#检验软件的正确性"><span>检验软件的正确性</span></a></h1>
<p>在网络上下载软件时，由于黑客无处不在，那么你这么保证你下载的文件是原版官方放出来的文件？这就需要通过 <strong>每个文件独特的指纹验证数据了</strong></p>
<p>每个文件的内容与文件大小都不同，如果一个文件被修改之后，必然会有部分信息不一样，利用这个特性，可以使用 MD5/sha1 或更严密的 sha256 等指纹验证机制来判断该文件是否被更改过</p>
<h2 id="md5sum、sha1sum、sha256sum" tabindex="-1"><a class="header-anchor" href="#md5sum、sha1sum、sha256sum"><span>md5sum、sha1sum、sha256sum</span></a></h2>
<p>目前有多重机制可以计算文件的指纹码，我们选择使用较为广泛的 MD5、SHA1、SHA256 加密机制来处理。</p>
<p>这里使用前一小节下载的 NPT 软件，来测试。在 NTP 下载页面上，提供了一个 md5 文件的下载，把这个对应版本的 md5 文件下载下来，里面就写着他的指纹码</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">mrcode:Downloads mrcode$ <span class="token function">cat</span> ntp-4.2.8p14.tar.gz.md5</span>
<span class="line">MD5 <span class="token punctuation">(</span>ntp-4.2.8p14.tar.gz<span class="token punctuation">)</span> <span class="token operator">=</span> 783edaf1d68ddf651bde64eda54a579d</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果如下的方式获取我们下载的 ntp 软件的指纹码，语法为</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">md5sum/sha1sum/sha256sum <span class="token punctuation">[</span>-bct<span class="token punctuation">]</span> filename</span>
<span class="line">md5sum/sha1sum/sha256sum <span class="token punctuation">[</span>--status<span class="token operator">|</span>--warn<span class="token punctuation">]</span> <span class="token parameter variable">--check</span> filename</span>
<span class="line"></span>
<span class="line">-b：使用 binary 的读取方式，默认为 Windows/DOS 文件形态的读取方式</span>
<span class="line">-c：检验文件指纹</span>
<span class="line">-t：以文字形态来读取文件指纹</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：获取刚刚 NTP 软件的指纹码</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># md5sum ntp-4.2.8p14.tar.gz </span></span>
<span class="line">783edaf1d68ddf651bde64eda54a579d  ntp-4.2.8p14.tar.gz</span>
<span class="line"><span class="token comment"># 使用此指纹码对比刚刚官网下载下来的指纹码是否相同</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你可以利用此特性将一些重要文件进行指纹数据库的建立，这样就能知道文件是否被修改过了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将多个文件生成指纹码，并写入文件中</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># md5sum /etc/group /etc/passwd >> data.md5</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat data.md5 </span></span>
<span class="line">b75dbd8dc79305ad77c798ba1c9289e2  /etc/group</span>
<span class="line">a60de527e76f0d5b31b0114098c8072a  /etc/passwd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 校验指纹码是否匹配</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># md5sum -c data.md5                       </span></span>
<span class="line">/etc/group: OK</span>
<span class="line">/etc/passwd: OK</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


