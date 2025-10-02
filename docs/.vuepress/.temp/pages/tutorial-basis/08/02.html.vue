<template><div><h1 id="linux-系统常用的压缩指令" tabindex="-1"><a class="header-anchor" href="#linux-系统常用的压缩指令"><span>Linux 系统常用的压缩指令</span></a></h1>
<p>在 linux 环境中，压缩文件的扩展名大多是：.tar、.tar.gz、.tgz、.Z、.bz2、.xz ，为什么会有这么多？</p>
<p>虽然在 linux 下扩展名没有啥作用，但是支持的压缩指令非常多，彼此之间无法互通压缩或解压缩，扩展名用于分别是使用哪种软件来解压缩。常用的扩展名如下：</p>
<ul>
<li>.Z：compress 程序压缩的文件</li>
<li>.zip：zip 程序压缩的文件</li>
<li>.gz：gzip 程序压缩的文件</li>
<li>.bz2：bzip2 程序压缩的文件</li>
<li>.xz：xz 程序压缩的文件</li>
<li>.tar：tar 程序打包的数据，并没有压缩过</li>
<li>.tar.gz：tar 程序打包的数据，并经过 gzip 的压缩</li>
<li>.tar.bz2：同上，经过了 bzip2 压缩</li>
<li>.tar.xz：同上，经过了 xz 的压缩</li>
</ul>
<p>linux 上常见的压缩指令是 gzip、bzip2 以及最新的 xz，还有支持 windows 的 zip，至于其他的压缩指令基本上都淘汰了。这些指令通常仅能针对一个文件来压缩与解压缩，如此一来每次压缩与解压缩都要一大堆文件，所以 tar （打包）软件就出现了</p>
<p>tar 可以将很多文件「打包」成为一个文件，将很多文件集结为一个文件，但是没有提供压缩的功能，后来 GNU 计划中，将整个 tar 与压缩的功能结合在一起，提供了更强大的压缩与打包功能。</p>
<h2 id="gzip、zcat-zmore-zless-zgrep" tabindex="-1"><a class="header-anchor" href="#gzip、zcat-zmore-zless-zgrep"><span>gzip、zcat/zmore/zless/zgrep</span></a></h2>
<p>gzip 可以说是应用最广的压缩指令，目前可用解开 compress、zip 与 gzip 等软件所压缩的文件，语法如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">gzip</span> <span class="token punctuation">[</span>-cdtv<span class="token comment">#] 文档名</span></span>
<span class="line">zcat 文档名.gz</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>c：将压缩的数据输出到屏幕上，可通过数据流重导向来处理</li>
<li>d：解压缩的参数</li>
<li>t：可以用来检验一个压缩文件的一致性，看看文件有无错误</li>
<li>v：可以显示出原文件、压缩文件的压缩比等信息</li>
<li><code v-pre>#</code>：为数字的意思，代表压缩等级
<ul>
<li>-1：最快，但是压缩比最差</li>
<li>-9：最慢，但是压缩比最好</li>
<li>-6：默认值</li>
</ul>
</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 找出 /etc 下（不含子目录）容量最大的文件，并将他们复制到 /tmp,然后以 gzip 压缩</span></span>
<span class="line"><span class="token comment"># S 排序时按文件 size，r 翻转，倒序；对于参数，笔者这里使用 man ls 查看的参数说明，记不住的时候就可以这样做</span></span>
<span class="line"><span class="token comment"># ls -ldSr /etc/* 最大的排在最后，莫非使用了 S 就是降序排列的吗？</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> <span class="token parameter variable">-ldS</span> /etc/*</span>
<span class="line">-rw-r--r--.  <span class="token number">1</span> root root   <span class="token number">670293</span> Jun  <span class="token number">7</span>  <span class="token number">2013</span> /etc/services</span>
<span class="line">-rw-r--r--.  <span class="token number">1</span> root root   <span class="token number">104251</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:28 /etc/ld.so.cache</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">cd</span> /tmp/</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">cp</span> /etc/services <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">gzip</span> <span class="token parameter variable">-v</span> services </span>
<span class="line">services:        <span class="token number">79.7</span>% -- replaced with services.gz</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ ll /etc/services /tmp/services*</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root   root   <span class="token number">670293</span> Jun  <span class="token number">7</span>  <span class="token number">2013</span> /etc/services</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">136088</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 /tmp/services.gz</span>
<span class="line"><span class="token comment"># 可以看到压缩比为 79.7，压缩之后变成了 130 多 k</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里需要注意，使用 gzip 进行压缩时，默认状态下原本的文件会被压缩成 .gz 的文件，并且原始文件不存在了（文案已经提示了）；另外 gzip 压缩的文件在 windows 中可以被 WinRAR、7zip 软件解压缩</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 由于 services 是文件内容，将压缩后的文件内容读出来</span></span>
<span class="line">zcat services.gz  </span>
<span class="line"><span class="token comment"># 该文件过大，直接读完，我们看不到最前面的内容了</span></span>
<span class="line"><span class="token comment"># 可以使用 zmore、zless 去读取</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将 services.gz 加压缩</span></span>
<span class="line"><span class="token comment"># 这里使用 -d 来解压缩，还有一个 gunzip 指令也可以解压缩，但是有点难记住它</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">gzip</span> <span class="token parameter variable">-d</span> services.gz </span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ ll <span class="token parameter variable">-l</span> services*</span>
<span class="line"><span class="token comment"># 同样，默认会将 .gz 的删除，剩下原来的文件名</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">670293</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将上面解开的文件，使用最佳压缩比压缩，并保留原文件</span></span>
<span class="line"><span class="token comment"># 这个例子就明白 -c 使用数据流重导来处理是啥意思了，压缩输出到指定文件中</span></span>
<span class="line"><span class="token comment"># 这里的 > 后续再 bash 章节会详细讲解</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">gzip</span> <span class="token parameter variable">-9</span> <span class="token parameter variable">-c</span> services <span class="token operator">></span> services.gz</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ ll <span class="token parameter variable">-l</span> services*</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">670293</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">135489</span> Oct <span class="token number">28</span> <span class="token number">22</span>:50 services.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还可以在 services.gz 找那个找出 http 关键词在哪里（关键词搜索）</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ zgrep <span class="token parameter variable">-n</span> <span class="token string">'http'</span> services.gz </span>
<span class="line"><span class="token comment"># 下面会输出好多包含 http 的信息</span></span>
<span class="line"><span class="token number">14</span>:<span class="token comment">#       http://www.iana.org/assignments/port-numbers</span></span>
<span class="line"><span class="token number">89</span>:http            <span class="token number">80</span>/tcp          www www-http    <span class="token comment"># WorldWideWeb HTTP</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在压缩文档中搜索字符的话可以使用 zgrep、egrep 等指令</p>
<h2 id="bzip2、bzcat-bzmore-bzgrep" tabindex="-1"><a class="header-anchor" href="#bzip2、bzcat-bzmore-bzgrep"><span>bzip2、bzcat/bzmore/bzgrep</span></a></h2>
<p>bzip2 可以说是取代了 gzip 并提供更佳的压缩比。使用方式几乎与 gzip 相同</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">bzip2</span> <span class="token punctuation">[</span>-cdkzv<span class="token comment">#] 文档名</span></span>
<span class="line">bzcat 文档名.bz2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>c：将压缩的过程产生的数据输出到屏幕上</li>
<li>d：解压缩的参数</li>
<li>k：保留源文件</li>
<li>z：压缩的参数（默认值，可以不加）</li>
<li>v：可以显示出源文件/压缩文件的压缩比信息</li>
<li><code v-pre>#</code>：与 gzip 一样，-9 最佳、-1 最快</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">bzip2</span> <span class="token parameter variable">-v</span> services</span>
<span class="line">  services:  <span class="token number">5.409</span>:1,  <span class="token number">1.479</span> bits/byte, <span class="token number">81.51</span>% saved, <span class="token number">670293</span> in, <span class="token number">123932</span> out.</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ ll <span class="token parameter variable">-l</span> services*</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">123932</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services.bz2</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">135489</span> Oct <span class="token number">28</span> <span class="token number">22</span>:50 services.gz</span>
<span class="line"><span class="token comment"># bz2 的压缩率比 gz 的压缩率还要好，看文件大小</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 读取 bz2 文件内容</span></span>
<span class="line">bzcat services.bz2</span>
<span class="line"><span class="token comment"># 解压,默认都是会删除掉原文件，包括压缩也是</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">bzip2</span> <span class="token parameter variable">-d</span> services.bz2 </span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> services*</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">670293</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">135489</span> Oct <span class="token number">28</span> <span class="token number">22</span>:50 services.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这里使用 -k 参数来保留源文件，并使用最优压缩比</span></span>
<span class="line"><span class="token comment"># 还可以使用 -c 来输出 bzip2 -9 -c services > services.gz</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">bzip2</span> <span class="token parameter variable">-9</span> <span class="token parameter variable">-k</span> services</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> services*</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">670293</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">123932</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services.bz2</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用方式 bzip2 与 gzip 几乎一模一样，不过压缩率好的一般都会更耗时</p>
<h2 id="xz、xzcat-xzmore-xzless-xzgrep" tabindex="-1"><a class="header-anchor" href="#xz、xzcat-xzmore-xzless-xzgrep"><span>xz、xzcat/xzmore/xzless/xzgrep</span></a></h2>
<p>xz 比 bzip2 压缩比更高，用法也与 bzip2、gzip 就一模一样</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">xz <span class="token punctuation">[</span>-dtlkc<span class="token comment">#] 文档名</span></span>
<span class="line">xcat 文档名.xz</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>d：解压缩</li>
<li>t：测试压缩文件的完整性，看是否有错误</li>
<li>l：列出压缩文件的相关信息</li>
<li>k：保留原本的文件</li>
<li>c：将数据由屏幕上输出</li>
<li><code v-pre>#</code>：同样，压缩比数值</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 压缩</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ xz <span class="token parameter variable">-v</span> services</span>
<span class="line">services <span class="token punctuation">(</span><span class="token number">1</span>/1<span class="token punctuation">)</span></span>
<span class="line">  <span class="token number">100</span> %        <span class="token number">97.3</span> KiB / <span class="token number">654.6</span> KiB <span class="token operator">=</span> <span class="token number">0.149</span>                                    </span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> services*</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">123932</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services.bz2</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">135489</span> Oct <span class="token number">28</span> <span class="token number">22</span>:50 services.gz</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode  <span class="token number">99608</span> Oct <span class="token number">28</span> <span class="token number">22</span>:39 services.xz</span>
<span class="line"><span class="token comment"># 看看上面的压缩，果真 xz 压缩比是最好的</span></span>
<span class="line"><span class="token comment"># 列出压缩文件信息</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ xz <span class="token parameter variable">-l</span> services.xz </span>
<span class="line">Strms  Blocks   Compressed Uncompressed  Ratio  Check   Filename</span>
<span class="line">    <span class="token number">1</span>       <span class="token number">1</span>     <span class="token number">97.3</span> KiB    <span class="token number">654.6</span> KiB  <span class="token number">0.149</span>  CRC64   services.xz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 读取压缩文件内容</span></span>
<span class="line"> xzless services.xz 、xzcat services.xz 都可以</span>
<span class="line"><span class="token comment"># 解压缩</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ xz <span class="token parameter variable">-d</span> services.xz </span>
<span class="line"><span class="token comment"># 使用 -k 压缩并保留源文件</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ xz <span class="token parameter variable">-k</span> services</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以使用 time 指令统计他们的时间</span></span>
<span class="line"><span class="token comment"># time [gzip|bzip2|xz] -c services > services.[gz|bz2|xz]</span></span>
<span class="line"><span class="token comment"># 上面的语法，下面是实际的指令</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">time</span> <span class="token function">gzip</span> <span class="token parameter variable">-c</span> services <span class="token operator">></span> services.gz<span class="token punctuation">;</span><span class="token punctuation">\</span></span>
<span class="line"><span class="token operator">></span> <span class="token function">time</span> <span class="token function">bzip2</span> <span class="token parameter variable">-c</span> services <span class="token operator">></span> services.bz2<span class="token punctuation">;</span><span class="token punctuation">\</span></span>
<span class="line"><span class="token operator">></span> <span class="token function">time</span> xz <span class="token parameter variable">-c</span> services <span class="token operator">></span> services.xz <span class="token punctuation">;</span></span>
<span class="line">real    0m0.023s	<span class="token comment"># 看这个汇总时间</span></span>
<span class="line">user    0m0.021s</span>
<span class="line">sys     0m0.002s</span>
<span class="line"></span>
<span class="line">real    0m0.043s</span>
<span class="line">user    0m0.036s</span>
<span class="line">sys     0m0.007s</span>
<span class="line"></span>
<span class="line">real    0m0.232s		<span class="token comment"># 看这个汇总时间</span></span>
<span class="line">user    0m0.227s</span>
<span class="line">sys     0m0.005s</span>
<span class="line"></span>
<span class="line">一个 <span class="token number">0</span>.023s 一个 <span class="token number">0</span>.232s，相差 <span class="token number">10</span> 倍</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


