<template><div><h1 id="打包指令-tar" tabindex="-1"><a class="header-anchor" href="#打包指令-tar"><span>打包指令：tar</span></a></h1>
<p>前面讲解的 gzip、bzip2、xz 也能够针对目录进行压缩，但是是将目录内所有文件 <strong>分别</strong> 压缩的。而在 windows 下可以使用 winRAR 之类的压缩文件，将好多数据包成一个文件的样式。</p>
<p>这种将多个文件或目录包成一个大文件的指令功能，就可以称呼为 <strong>打包指令</strong>，tar 就是这样一个功能的打包指令，同时还可以通过压缩指令将该文件进行压缩。windows 中的 WinRAR 也支持 .tar.gz 的解压缩</p>
<p>tar 的选项与参数非常多，这里只接受几个常用的选项</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">打包与压缩：<span class="token variable"><span class="token variable">`</span><span class="token function">tar</span> <span class="token punctuation">[</span>-z<span class="token operator">|</span>-j<span class="token operator">|</span>-J<span class="token punctuation">]</span><span class="token punctuation">[</span>cv<span class="token punctuation">]</span><span class="token punctuation">[</span>-f 待建立的文件名<span class="token punctuation">]</span> filename<span class="token variable">`</span></span></span>
<span class="line">观察文件：  <span class="token variable"><span class="token variable">`</span><span class="token function">tar</span> <span class="token punctuation">[</span>-z<span class="token operator">|</span>-j<span class="token operator">|</span>-J<span class="token punctuation">]</span><span class="token punctuation">[</span>tv<span class="token punctuation">]</span><span class="token punctuation">[</span>-f file.tar<span class="token punctuation">]</span><span class="token variable">`</span></span></span>
<span class="line">解压缩：	  <span class="token variable"><span class="token variable">`</span><span class="token function">tar</span> <span class="token punctuation">[</span>-z<span class="token operator">|</span>-j<span class="token operator">|</span>-J<span class="token punctuation">]</span><span class="token punctuation">[</span>xf<span class="token punctuation">]</span><span class="token punctuation">[</span>-f file.tar<span class="token punctuation">]</span> <span class="token punctuation">[</span>-C 目录<span class="token punctuation">]</span><span class="token variable">`</span></span></span>
<span class="line"></span>
<span class="line">特别注意：<span class="token variable"><span class="token variable">`</span><span class="token punctuation">[</span>-z<span class="token operator">|</span>-j<span class="token operator">|</span>-J<span class="token punctuation">]</span><span class="token variable">`</span></span> 不可同时出现在一串指令中</span>
<span class="line">特殊注意：c、t、x 也不可同时出现在一串指令中</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数</p>
<ul>
<li>c：建立打包文件，可搭配 <code v-pre>-v</code>来观察过程中被打包的文件名</li>
<li>t：查看打包文件的内容含有哪些文件，重点在查看文件名</li>
<li>x：接打包或解压缩的功能，可搭配 -C 在特定目录解开，特别注意 <strong>c、t、x 不能同时出现在一起</strong></li>
<li>z：通过 gzip 的支持进行压缩、解压缩；此时文件名最好为 <code v-pre>*.tar.gz</code></li>
<li>j：通过 bzip2 的支持进行压缩、解压缩；此时文件名最好为 <code v-pre>*.tar.bz2</code></li>
<li>J：通过 xz  的支持进行压缩、解压缩；此时文件名最好为 <code v-pre>*.tar.xz</code></li>
<li>v：在压缩、解压缩的过程中，将正在处理的文件名显示出来</li>
<li>f：后面要立刻接要被处理的文件名，建议 -f 单独写一个选项（不容易忘记）</li>
<li>C：在指定目录解压缩</li>
<li>p：保留备份数据的原本权限与属性，常用语备份（-c）重要的配置文件</li>
<li>P：保留绝对路径，保留 root 跟路径</li>
<li><code v-pre>--exclude=FILE</code>：在压缩过程中，排除指定的文件，不打包</li>
</ul>
<p>最常用的是以下命令：</p>
<ul>
<li>压    缩：<code v-pre>tar -jcv -f filename.tar.bz2 要被压缩的文件或目录</code></li>
<li>查    询：<code v-pre>tar -jtv -f filename.tar.bz2</code></li>
<li>解压缩：<code v-pre>tar -jxv -f filename.tar.bz2 -C 指定目录解开</code></li>
</ul>
<p>小提示：上面 -jcvf 可以写一起，但是阅读起来就没有上面这样分开好理解</p>
<h2 id="使用-tar-加入-z、-j-或-j-的参数备份-etc-目录" tabindex="-1"><a class="header-anchor" href="#使用-tar-加入-z、-j-或-j-的参数备份-etc-目录"><span>使用 tar 加入 -z、-j 或 -J 的参数备份 /etc/ 目录</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 备份 /etc/ 需要 root 权限，否则会出现一堆错误</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">su</span> -</span>
<span class="line">Password:</span>
<span class="line">Last login: Sun Oct <span class="token number">27</span> <span class="token number">20</span>:38:34 CST <span class="token number">2019</span> on pts/0</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># time tar -zpcv -f /root/etc.tar.gz /etc</span></span>
<span class="line">tar: 从成员名中删除开头的“/”		<span class="token comment"># 注意这里的警告</span></span>
<span class="line">/etc/</span>
<span class="line">/etc/fstab</span>
<span class="line">/etc/crypttab</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">real    0m2.329s		<span class="token comment"># 耗时 2.329 秒</span></span>
<span class="line">user    0m1.322s</span>
<span class="line">sys     0m0.308s</span>
<span class="line"></span>
<span class="line"><span class="token comment"># -p 重点是保留文件的权限与属性</span></span>
<span class="line"><span class="token comment"># 下面去掉了 -v，所以不会显示处理的文件名</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># time tar -jpc -f /root/etc.tar.bz2 /etc</span></span>
<span class="line">tar: 从成员名中删除开头的“/”</span>
<span class="line"></span>
<span class="line">real    0m3.012s</span>
<span class="line">user    0m2.710s</span>
<span class="line">sys     0m0.078s</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># time tar -Jpc -f /root/etc.tar.xz /etc</span></span>
<span class="line">tar: 从成员名中删除开头的“/”</span>
<span class="line"></span>
<span class="line">real    0m14.836s</span>
<span class="line">user    0m13.511s</span>
<span class="line">sys     0m0.224s</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -h /root/etc*</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root  11M <span class="token number">10</span>月 <span class="token number">29</span> 00:05 /root/etc.tar.bz2</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root  12M <span class="token number">10</span>月 <span class="token number">29</span> 00:01 /root/etc.tar.gz</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">8</span>.2M <span class="token number">10</span>月 <span class="token number">29</span> 00:06 /root/etc.tar.xz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># etc 占用 42M</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># du -sh /etc/</span></span>
<span class="line">42M     /etc/</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前面讲解 cp 指令复制的时候也涉及到复制后的文件权限与属性问题，这里的 -p 选项也是这样</p>
<h2 id="查阅-tar-文件的数据内容-可查看文件名-与备份文件名是否有根目录的意义" tabindex="-1"><a class="header-anchor" href="#查阅-tar-文件的数据内容-可查看文件名-与备份文件名是否有根目录的意义"><span>查阅 tar 文件的数据内容（可查看文件名）与备份文件名是否有根目录的意义</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># -v 把权限属性也列出来了</span></span>
<span class="line"><span class="token comment"># 这里查看文件名前面无根路径的</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jtv -f /root/etc.tar.bz2</span></span>
<span class="line">drwxr-xr-x root/root         <span class="token number">0</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:38 etc/</span>
<span class="line">-rw-r--r-- root/root       <span class="token number">808</span> <span class="token number">2019</span>-10-27 <span class="token number">22</span>:43 etc/fstab</span>
<span class="line">-rw------- root/root         <span class="token number">0</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:20 etc/crypttab</span>
<span class="line">lrwxrwxrwx root/root         <span class="token number">0</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:20 etc/mtab -<span class="token operator">></span> /proc/self/mounts</span>
<span class="line">-rw-r--r-- root/root        <span class="token number">51</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:20 etc/resolv.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么需要拿到根目录呢？主要是为了安全，使用 tar 备份的数据可能会需要解压缩回来使用，在 tar 所记录的文件名（上面 -jtv 显示的文件名）就是解压缩后的实际文件名。如果拿到了根目录，则会在当前目录解压。比如现在在 /tmp ，解压后就变成 /tmp/etc/xxx；如果不拿掉根目录，源文件就被覆盖了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jPc -f /root/etc.and.root.tar.bz2 /etc</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jtv -f /root/etc.and.root.tar.bz2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jtv -f /root/etc.and.root.tar.bz2</span></span>
<span class="line">tar: 从成员名中删除开头的“/”</span>
<span class="line">drwxr-xr-x root/root         <span class="token number">0</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:38 /etc/</span>
<span class="line">-rw-r--r-- root/root       <span class="token number">808</span> <span class="token number">2019</span>-10-27 <span class="token number">22</span>:43 /etc/fstab</span>
<span class="line">-rw------- root/root         <span class="token number">0</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:20 /etc/crypttab</span>
<span class="line">lrwxrwxrwx root/root         <span class="token number">0</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:20 /etc/mtab -<span class="token operator">></span> /proc/self/mounts</span>
<span class="line"><span class="token comment"># 对比下，确实是带上了根路径</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="将备份的数据解压缩-并考虑指定目录压缩-c-选项的应用" tabindex="-1"><a class="header-anchor" href="#将备份的数据解压缩-并考虑指定目录压缩-c-选项的应用"><span>将备份的数据解压缩，并考虑指定目录压缩（-C 选项的应用）</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pwd</span></span>
<span class="line">/root</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jx -f etc.tar.bz2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -d etc*</span></span>
<span class="line">drwxr-xr-x. <span class="token number">143</span> root root     <span class="token number">8192</span> <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:38 etc</span>
<span class="line">-rw-r--r--.   <span class="token number">1</span> root root <span class="token number">10520237</span> <span class="token number">10</span>月 <span class="token number">29</span> 00:15 etc.and.root.tar.bz2</span>
<span class="line">-rw-r--r--.   <span class="token number">1</span> root root <span class="token number">10518433</span> <span class="token number">10</span>月 <span class="token number">29</span> 00:05 etc.tar.bz2</span>
<span class="line">-rw-r--r--.   <span class="token number">1</span> root root <span class="token number">12212046</span> <span class="token number">10</span>月 <span class="token number">29</span> 00:01 etc.tar.gz</span>
<span class="line">-rw-r--r--.   <span class="token number">1</span> root root  <span class="token number">8580036</span> <span class="token number">10</span>月 <span class="token number">29</span> 00:06 etc.tar.xz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解压到指定目录</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-zx</span> <span class="token parameter variable">-f</span> etc.tar.gz <span class="token parameter variable">-C</span> /tmp</span>
<span class="line"><span class="token comment"># 记得删除解压后的文件</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /tmp/etc/ /root/etc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="仅解开单一文件" tabindex="-1"><a class="header-anchor" href="#仅解开单一文件"><span>仅解开单一文件</span></a></h2>
<p>前面讲解的都是解开该压缩包中的所有文件。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 利用 -t 查看文件名，接管道查找 shadow</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jtv -f /root/etc.tar.bz2 | grep 'shadow'</span></span>
<span class="line">---------- root/root      <span class="token number">1271</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:31 etc/shadow-</span>
<span class="line">---------- root/root       <span class="token number">797</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:31 etc/gshadow</span>
<span class="line">---------- root/root      <span class="token number">1266</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:31 etc/shadow 		<span class="token comment"># 假设要提取出这个文件</span></span>
<span class="line">---------- root/root       <span class="token number">791</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:31 etc/gshadow-</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 后面接需要提取出来的文件路径</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jxv -f /root/etc.tar.bz2 etc/shadow</span></span>
<span class="line">etc/shadow</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll etc</span></span>
<span class="line">总用量 <span class="token number">4</span></span>
<span class="line">----------. <span class="token number">1</span> root root <span class="token number">1266</span> <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:31 shadow</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="打包某目录-但不包含该目录下的某些文件" tabindex="-1"><a class="header-anchor" href="#打包某目录-但不包含该目录下的某些文件"><span>打包某目录，但不包含该目录下的某些文件</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jc -f /root/system.tar.bz2 --exclude=/root/etc* --exclude=/root/system.tar.bz2 /etc /root</span></span>
<span class="line">tar: 从成员名中删除开头的“/”</span>
<span class="line">tar: 从硬连接目标中删除开头的“/”</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="仅备份比某个时刻还要新的文件" tabindex="-1"><a class="header-anchor" href="#仅备份比某个时刻还要新的文件"><span>仅备份比某个时刻还要新的文件</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 先找出比 /etc/passwd 还要新的文件</span></span>
<span class="line"><span class="token comment"># 前面 touch 中介绍过 --newer 和 --newer-mtime</span></span>
<span class="line"><span class="token comment"># newer 包含 mtime 和 ctime，而 --newer-mtime 只包含 mtime</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># find /etc -newer /etc/passwd</span></span>
<span class="line">/etc</span>
<span class="line">/etc/fstab</span>
<span class="line">/etc/group</span>
<span class="line">/etc/gshadow</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ls --full-time  /etc/passwd</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">2323</span> <span class="token number">2019</span>-10-04 <span class="token number">18</span>:31:08.332738182 +0800 /etc/passwd</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jcv -f /root/etc.newer.the.passwd.tar.bz2 --newer-mtime="2019-10-04" /etc/*</span></span>
<span class="line">tar: 选项 --newer-mtime: 将日期 ‘2019-10-04’ 当作 <span class="token number">2019</span>-10-04 00:00:00</span>
<span class="line">tar: 从成员名中删除开头的“/”</span>
<span class="line">/etc/abrt/</span>
<span class="line">tar: /etc/abrt/abrt-action-save-package-data.conf: 文件未改变；未输出</span>
<span class="line">tar: /etc/abrt/abrt.conf: 文件未改变；未输出</span>
<span class="line">tar: /etc/abrt/gpg_keys.conf: 文件未改变；未输出</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证下是否被打进去了，这里搜索都搜不到，确实没有被打进去</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jtv -f etc.newer.the.passwd.tar.bz2 | grep 'etc/abrt/abrt.conf'</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -jtv -f etc.newer.the.passwd.tar.bz2 | grep 'abrt.conf'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以进行差异文件的记录与备份，例如：在一个月前进行过一次完整的数据备份，那么这个月备份至需要备份更改过的文件即可，直接写到上次备份的时间点即可</p>
<h2 id="基本名称-tarfile、tarball" tabindex="-1"><a class="header-anchor" href="#基本名称-tarfile、tarball"><span>基本名称：tarfile、tarball？</span></a></h2>
<p>tar 可以只打包不压缩 <code v-pre>tar -c -f file.tar</code>，这种文件称为 tarfile，如果有压缩就称为 tarball。</p>
<p>此外 tar 还可以将文件打包到特别的装置中去，例如，<code v-pre>tar -c -f /dev/st0/home /root/etc</code> ,把 etc 打包到磁带机去（磁带机是一次性读取、写入装置，因此不能使用 cp 等指令）</p>
<h2 id="特殊应用-利用管线命令与数据流" tabindex="-1"><a class="header-anchor" href="#特殊应用-利用管线命令与数据流"><span>特殊应用：利用管线命令与数据流</span></a></h2>
<p>关于数据流重导向与管线命令在胡须 bash 章节再详细讲解</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">cd</span> /tmp/</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">tar</span> <span class="token parameter variable">-cv</span> <span class="token parameter variable">-f</span> - /etc/ <span class="token operator">|</span> <span class="token function">tar</span> <span class="token parameter variable">-xv</span> <span class="token parameter variable">-f</span> -</span>
<span class="line"><span class="token comment"># 前面是将 /etc/ 打包到 - ，后面是吧 - 解压</span></span>
<span class="line"><span class="token comment"># 这里的 - 表示标准的输出 和输出，可以吧 - 想成是内存中的一个缓冲区</span></span>
<span class="line"><span class="token comment"># 这里命令像  cp -r /etc /tmp 的效果</span></span>
<span class="line"><span class="token comment"># 这里不想用 -r 命令，所以使用 tar 打包到特殊的装置 - 中，然后管线前面输出的作为后面用来解压，没有产生中间文件，完成了复制的功能</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="例题-系统备份范例" tabindex="-1"><a class="header-anchor" href="#例题-系统备份范例"><span># 例题：系统备份范例</span></a></h1>
<p>系统上有非常多的目录需要进行备份，也不建议将备份数据放到 /root 目录下，假设目前已经知道重要的目录有：</p>
<ul>
<li><code v-pre>/etc/</code>：配置文件</li>
<li><code v-pre>/home/</code> ：用户的家目录</li>
<li><code v-pre>/var/spool/mail/</code>：系统中所有的邮件信箱</li>
<li><code v-pre>/var/spool/cron/</code>：所有账户的工作排成配置文件</li>
<li><code v-pre>/root/</code>：系统管理员的家目录</li>
</ul>
<p>前面做过的练习，/home/loop* 不需要备份，/root 下的压缩文件也不需要备份，假设需要将备份的数据放到 /backups 中，并且该目录仅有 root 权限进入，此外，每次备份的文件名希望不相同。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建备份目录，并修改权限</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /backups</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chmod 700 /backups/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -d /backups/</span></span>
<span class="line">drwx------. <span class="token number">2</span> root root <span class="token number">6</span> <span class="token number">10</span>月 <span class="token number">29</span> 01:33 /backups/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这里的 xxx 需要手动写上想要的日期等字符串每次就不一样了，并不是用脚本变量啥的</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-zcv</span> <span class="token parameter variable">-f</span> /backups/xxx.tar.gz <span class="token parameter variable">--exclude</span><span class="token operator">=</span><span class="token string">"/home/loop*"</span> <span class="token parameter variable">--exclude</span><span class="token operator">=</span><span class="token string">"/root/*.gz"</span> <span class="token parameter variable">--exclude</span><span class="token operator">=</span><span class="token string">"/root/*.bz2"</span> <span class="token parameter variable">--exclude</span><span class="token operator">=</span><span class="token string">"/root/*.xz"</span> /etc/ /home/ /var/spool/mail /var/spool/cron /root </span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -h /backups/</span></span>
<span class="line">总用量 13M</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root 13M <span class="token number">10</span>月 <span class="token number">29</span> 01:37 xxx.tar.gz</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解压缩后的-selinux-课题" tabindex="-1"><a class="header-anchor" href="#解压缩后的-selinux-课题"><span>解压缩后的 SELinux 课题</span></a></h2>
<p>假如你的系统必须要以备份的数据来回填到原本的系统中，那么需要特别注意复原后的系统 SELinux 问题，尤其是在系统文件上面。比如：/etc 下的文件群。SElinux 是比较特别的细部权限设定，具体的会在第 16 章介绍。SELinux 的权限问题，可能让你的系统无法存取某些配置文件内容，导致影响到系统的正常使用权。</p>
<p>有一个例子，通过上面的 tar 备份，然后在另外一部系统上还原回来，但是无法正常的登录系统，在单位维护模式去操作系统，看起来一切都正常，但是这里就是无法登录。大部分原因就是因为 /etc/shadow 密码文件的 SELinux 类型在还原时被更改了，简单的处理方式有如下几个：</p>
<ul>
<li>通过各种可行的救援方式登录系统，修改 /etc/seliux/config 文件，将 SELinux 改成 permissive 模式，重新启动系统就可以了</li>
<li>在第一次复原系统后，不要立即重新启动，先使用 <code v-pre>restorecon  -Rv /etc</code> 自动修复下 SELinux 的类型即可</li>
<li>通过各种可行的方式登录系统，建立 /.autorelabel 文件，重新启动后系统会自动修复 SELinux 的类型，并且又会再次重新启动，之后就正常了</li>
</ul>
</div></template>


