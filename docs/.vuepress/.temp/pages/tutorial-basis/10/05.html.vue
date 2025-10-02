<template><div><h1 id="数据流重导向" tabindex="-1"><a class="header-anchor" href="#数据流重导向"><span>数据流重导向</span></a></h1>
<p>数据流重导向（redirect），将数据传导到其他地方去，将某个指令执行后应该要出现在屏幕上的数据，给传输到其他的地方。</p>
<p>例如文件或则是装置（打印机之类的），数据流重导向在 Linux 的文本模式下很重要，尤其是想要将某些数据存储下来时，就更有用了</p>
<h2 id="什么是数据流重导向" tabindex="-1"><a class="header-anchor" href="#什么是数据流重导向"><span>什么是数据流重导向？</span></a></h2>
<p><img src="@source/tutorial-basis/10/assets/image-20191202220559186.png" alt="image-20191202220559186"></p>
<p>执行一个指令时，这个指令可能会由文件读入资料，经过处理之后，再将数据输出到屏幕上。</p>
<ul>
<li>standard output：标准输出 STDOUT</li>
<li>standard error output：标准错误输出 STDERR</li>
</ul>
<h3 id="standard-output-与-standard-error-output" tabindex="-1"><a class="header-anchor" href="#standard-output-与-standard-error-output"><span>standard output 与 standard error output</span></a></h3>
<p>可以简单理解为：</p>
<ul>
<li>标准输出：指令执行所回传的正确的信息</li>
<li>标准错误输出：指令执行失败后，所回传的错误信息</li>
</ul>
<p>比如，我们的系统默认有 /etc/crontab 但无 /etc/mrcode ，此时若下达 <code v-pre>cat /etc/crontab /etc/mrcode</code> 指令时，cat 会执行：</p>
<ul>
<li>标准输出：读取 /etc/crontab 后，将该文件内容显示到屏幕上</li>
<li>标准错误输出：因为无法找到 /etc/mrcode ，因此在屏幕上显示错误信息</li>
</ul>
<p>可见不管正确或错误信息都输出到屏幕上，那么可以通过数据流重导向将 stdout 与 stderr 分别传送到其他文件或装置去，就达到了分别输出的目的，语法如下：</p>
<ul>
<li>标准输入（stdin 简写）：代码为 0，使用 <code v-pre>&lt;</code> 或 <code v-pre>&lt;&lt;</code></li>
<li>标准输出（stdout）：代码为 1，使用 <code v-pre>&gt;</code> 或 <code v-pre>&gt;&gt;</code></li>
<li>标准错误输出（stderr）：代码为 2，使用 <code v-pre>2&gt;</code> 或 <code v-pre>2&gt;&gt;</code></li>
</ul>
<p>为了理解 stdout 与 stderr，下面进行练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：观察你的系统根目录 / 下各目录的文件名、权限与属性，并记录下来</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll / 			<span class="token comment"># 会把结果输出到屏幕</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll / <span class="token operator">></span> ~/rootfile		<span class="token comment"># 会吧结果输出到指定的 rootfile 文件中</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll ~/rootfile</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">1078</span> Dec  <span class="token number">1</span> <span class="token number">22</span>:53 /home/mrcode/rootfile</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的指令流程：</p>
<ol>
<li>该文件若不存在，系统会自动创建文件</li>
<li>该文件若存在，那么会清空内容，再写入数据</li>
</ol>
<p>标准输出和标准错误输出，单个符号<strong>是覆盖</strong>数据，2 个符号的是<strong>追加</strong>数据；</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：利用一般身份账户查找 /home 下是否有 .bashrc 的文件存在</span></span>
<span class="line"><span class="token comment"># 为了这个练习有效果，我在 abc 目录下用 root 身份创建了 .bashrc 空文件</span></span>
<span class="line"><span class="token comment"># 并且，把 abc 目录的权限都改为只有 root 才能读取</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study home<span class="token punctuation">]</span>$ ll</span>
<span class="line">total <span class="token number">4</span></span>
<span class="line">drwx------.  <span class="token number">2</span> root   root     <span class="token number">32</span> Dec  <span class="token number">1</span> <span class="token number">23</span>:01 abc</span>
<span class="line">drwx------. <span class="token number">18</span> mrcode mrcode <span class="token number">4096</span> Dec  <span class="token number">1</span> <span class="token number">22</span>:53 mrcode</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study home<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc 			</span>
<span class="line">/home/mrcode/.bashrc												<span class="token comment"># 标准输出</span></span>
<span class="line">find: ‘/home/abc’: Permission denied				<span class="token comment"># 标准错误输出</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用数据流重导向指令，发现标准输出不显示在屏幕了</span></span>
<span class="line"><span class="token comment"># 但是标准错误输出还显示在屏幕上</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study home<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator">></span> list</span>
<span class="line">-bash: list: Permission denied			<span class="token comment"># 这里报错了，是因为 home 目录是普通用户是无法写数据的</span></span>
<span class="line"><span class="token comment"># 写在 mrcode 自己的目录下</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study home<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator">></span> ./mrcode/list</span>
<span class="line">find: ‘/home/abc’: Permission denied</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3： 使用标准输出 和 标准错误输出都输出到文件中</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study home<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator">></span> ./mrcode/list <span class="token operator"><span class="token file-descriptor important">2</span>></span> ./mrcode/listerr</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dev-null-垃圾桶黑洞装置的特殊写法" tabindex="-1"><a class="header-anchor" href="#dev-null-垃圾桶黑洞装置的特殊写法"><span>/dev/null 垃圾桶黑洞装置的特殊写法</span></a></h3>
<p>就是可以将任何信息吃掉的黑洞装置</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 4：将错误的数据丢弃，屏幕上显示正确的数据</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator"><span class="token file-descriptor important">2</span>></span> /dev/null</span>
<span class="line">/home/mrcode/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么能否将正确和错误的数据都写到同一个文件呢？需要特殊的写法才行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 5：将指令的数据全部写入 list 文件中</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 错误的写法，可能会交叉写入该文件，数据错乱</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator">></span> list <span class="token operator"><span class="token file-descriptor important">2</span>></span> list</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 正确的写法</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator">></span> list <span class="token operator"><span class="token file-descriptor important">2</span>></span><span class="token file-descriptor important">&amp;1</span></span>
<span class="line"><span class="token comment"># 正确的写法</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">find</span> /home/ <span class="token parameter variable">-name</span> .bashrc <span class="token operator">&amp;></span> list</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="standard-input-与" tabindex="-1"><a class="header-anchor" href="#standard-input-与"><span>standard input ：<code v-pre>&lt;</code> 与<code v-pre>&lt;&lt;</code></span></a></h3>
<p>简单来说：将原本需要由键盘输入的数据，该由文件内容来代替。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 6：利用 cat 指令来建立一个文件的简单流程</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cat</span> <span class="token operator">></span> catfile</span>
<span class="line">testing</span>
<span class="line"><span class="token function">cat</span> <span class="token function">file</span> <span class="token builtin class-name">test</span></span>
<span class="line"><span class="token comment"># 这里使用快捷键 ctrl + d 来离开</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面使用 <code v-pre>cat &gt; catfile</code> ，使用了数据流重导向，catfile 文件会被建立，内容是需要键盘输入，也就是上面的两行内容。这里可以使用标准输入来取代键盘的敲击</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 7：用 stdin 代替键盘输入，建立新文件的简单流程</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cat</span> <span class="token operator">></span> catfile <span class="token operator">&lt;</span> ~/.bashrc</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll catfile ~/.bashrc</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Dec  <span class="token number">1</span> <span class="token number">23</span>:28 catfile</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Aug  <span class="token number">8</span> <span class="token number">20</span>:06 /home/mrcode/.bashrc</span>
<span class="line"><span class="token comment"># 大小一模一样，几乎像是用 cp 来复制一样</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而 <code v-pre>&lt;&lt;</code> 表示接受的输入字符。比如：我要用 cat 直接将输入的信息输出到 catfile 中，且当由键盘输入 eof 时，该次输入就结束</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">[mrcode@study ~]$ cat > catfile &lt;&lt; 'eof'</span>
<span class="line">> This is a test</span>
<span class="line">> Ok new stop</span>
<span class="line">> eof</span>
<span class="line">[mrcode@study ~]$ cat catfile</span>
<span class="line">This is a test</span>
<span class="line">Ok new stop</span>
<span class="line"># 只有两行数据，不会存在关键词一行</span>
<span class="line"># 这里就有点类似判定结束标准输入的功能</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>&lt;&lt;</code>可以代替快捷键 ctrl + d，来终止输入，那为什么要使用命令输出重导向呢？</p>
<ul>
<li>屏幕输出的信息很重要，而且我们需要将它存下来的时候</li>
<li>背景执行的程序，不希望他干扰屏幕正常的输出结果的时候</li>
<li>一些系统的例行命令（例如在 /etc/crontab 中的文件）的执行结果，希望他可以存下来时</li>
<li>一些执行命令可能已知错误信息时，想以<code v-pre>2&gt;/dev/null</code>丢弃时</li>
<li>错误信息与正确信息需要分别输出时</li>
</ul>
<p>当然还有其他的使用场景，最简单的就是网友们经常问到：为何我的 root 都会受到系统 crontab 寄来的错误信息呢？这个是场景的错误，而如果我们已经知道这个错误信息是可以忽略的时，<code v-pre>2&gt; errorfile</code> 这个功能就很重要了吧</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 问：假设要将 echo `error message` 以 standard error output 的格式来输出，怎么做？</span></span>
<span class="line">答：既然有 <span class="token operator"><span class="token file-descriptor important">2</span>></span><span class="token file-descriptor important">&amp;1</span> 来将 <span class="token operator"><span class="token file-descriptor important">2</span>></span> 转到 <span class="token operator"><span class="token file-descriptor important">1</span>></span> 去，</span>
<span class="line">   那么就应该有 <span class="token operator"><span class="token file-descriptor important">1</span>></span><span class="token file-descriptor important">&amp;2</span>，可以这样做</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token string">'error message'</span> <span class="token operator"><span class="token file-descriptor important">1</span>></span><span class="token file-descriptor important">&amp;2</span></span>
<span class="line">error message</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token string">'error message'</span> <span class="token operator"><span class="token file-descriptor important">2</span>></span> /dev/null <span class="token operator"><span class="token file-descriptor important">1</span>></span><span class="token file-descriptor important">&amp;2</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="命令执行的判断依据-、-、" tabindex="-1"><a class="header-anchor" href="#命令执行的判断依据-、-、"><span>命令执行的判断依据：<code v-pre>;</code>、<code v-pre>&amp;&amp;</code>、<code v-pre>||</code></span></a></h2>
<p>很多指令想要一次输入去执行，而不想分此执行，基本上有两种方法：</p>
<ul>
<li>第十二章要介绍的 shell script 脚本执行</li>
<li>通过本章的知识点来完成</li>
</ul>
<h3 id="cmd-cmd-不考虑指令相关性的连续指令下达" tabindex="-1"><a class="header-anchor" href="#cmd-cmd-不考虑指令相关性的连续指令下达"><span><code v-pre>cmd;cmd</code> 不考虑指令相关性的连续指令下达</span></a></h3>
<p>比如子关机的时候希望可以执行两次 sync 同步写入磁盘后，再 shutdown 计算机</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sync</span><span class="token punctuation">;</span> <span class="token function">sync</span><span class="token punctuation">;</span> <span class="token function">shutdown</span> <span class="token parameter variable">-h</span> now</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这个是两个指令之前没有关系的执行，前一个执行完成后，就执行后一个；如果是这样的情况：在某个目录下创建文件，如果目录存在，则创建文件，如果不存在则不做任何操作，该指令就无法完成了</p>
<h3 id="指令回传值-与-和" tabindex="-1"><a class="header-anchor" href="#指令回传值-与-和"><span><code v-pre>$?</code>(指令回传值)与 <code v-pre>&amp;&amp;</code> 和 <code v-pre>||</code></span></a></h3>
<p>前面章节讲到过指令回传值：若前一个指令执行的结果为正确，在 Linux 下会回传一个 <code v-pre>$?=0</code> 的值。可以通过判断这个值来是否执行后面的指令</p>
<p>逻辑操作符这里就不过多解释了</p>
<ul>
<li><code v-pre>&amp;&amp;</code>：前一个执行正确，后面才会执行</li>
<li><code v-pre>||</code>：前一个执行正确，后面的不会执行</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：使用 ls 查阅 目录 /tmp/abc 是否存在，若存在则用 touch 建立 /tmp/abc/hehe</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/abc <span class="token operator">&amp;&amp;</span> <span class="token function">touch</span> /tmp/abc/hehe</span>
<span class="line">ls: cannot access /tmp/abc: No such <span class="token function">file</span> or directory</span>
<span class="line"><span class="token comment"># 只有 ls 报错了，后续的指令没有报错，说明没有被执行</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">mkdir</span> /tmp/abc</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/abc <span class="token operator">&amp;&amp;</span> <span class="token function">touch</span> /tmp/abc/hehe</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll /tmp/abc/</span>
<span class="line">total <span class="token number">0</span></span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">0</span> Dec  <span class="token number">2</span> 00:22 hehe</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：测试 /tmp/abc 是否存在，若不存在则建立该目录，若存在则不做操作</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">rm</span> <span class="token parameter variable">-r</span> /tmp/abc/</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/abc <span class="token operator">||</span> <span class="token function">mkdir</span> /tmp/abc</span>
<span class="line">ls: cannot access /tmp/abc: No such <span class="token function">file</span> or directory</span>
<span class="line"><span class="token comment"># 报错没有找到目录，后面没有报错，但是查看缺创建了，证明执行了</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll <span class="token parameter variable">-d</span> /tmp/abc/</span>
<span class="line">drwxrwxr-x. <span class="token number">2</span> mrcode mrcode <span class="token number">6</span> Dec  <span class="token number">2</span> 00:24 /tmp/abc/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 而下面这个没有报错，后面也没有报错，说明只执行了前面的指令</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/abc <span class="token operator">||</span> <span class="token function">mkdir</span> /tmp/abc</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：我不清楚 /tmp/abc 是否存在，但就是要建立 /tmp/abc/hehe 文件</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/abc <span class="token operator">||</span> <span class="token function">mkdir</span> /tmp/abc/ <span class="token operator">&amp;&amp;</span> <span class="token function">touch</span> /tmp/abc/hehe</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>范例三，对于的表达式对于 java 或则 js 来说，理解不太一样，如下分析：</p>
<ul>
<li>第一种情况：/tmp/abc 不存在
<ol>
<li>ls /tmp/abc 回传 <code v-pre>$?≠0</code>，结果为 false</li>
<li>则执行创建操作，由于会成功，故 <code v-pre>$?=0</code>，结果为 true</li>
<li>则执行创建 hehe 文件</li>
</ol>
</li>
<li>第二种情况：/tmp/abc 存在
<ol>
<li>ls /tmp/abc 回传 <code v-pre>$?=0</code>，结果为 true</li>
<li><code v-pre>||</code> 遇到 true 后面的不会执行，<strong>但是</strong> 结果会往后传递</li>
<li>前一个结果为 true，那么久执行创建</li>
</ol>
</li>
</ul>
<p><img src="@source/tutorial-basis/10/assets/image-20191204230542102.png" alt="image-20191204230542102"></p>
<p>只要注意：linux 指令是从左往右执行的，只有相邻的指令会被特殊符号阻断</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">## 例题：以 ls 测试 /tmp/mrcode 是否存在，存在则显示 exist, 不存在则显示 not exist</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/mrcode <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">'exist'</span> <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">'not exist'</span></span>
<span class="line">ls: cannot access /tmp/mrcode: No such <span class="token function">file</span> or directory</span>
<span class="line">not exist</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">mkdir</span> /tmp/mrcode</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/mrcode <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">'exist'</span> <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">'not exist'</span></span>
<span class="line">exist</span>
<span class="line"><span class="token comment"># 可以看到的确只有相邻的两个指令会被阻断</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如果搞不清楚他们的逻辑的话，就会出现下面这种情况</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/mrcode <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">'exist'</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">'not exist'</span></span>
<span class="line">ls: cannot access /tmp/mrcode: No such <span class="token function">file</span> or directory</span>
<span class="line">exist</span>
<span class="line">not exist</span>
<span class="line"><span class="token comment"># 两种都出现了，不存在，则执行 exist，后面并且关系，再次执行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">mkdir</span> /tmp/mrcode</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">ls</span> /tmp/mrcode <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">'exist'</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">'not exist'</span></span>
<span class="line">not exist</span>
<span class="line"><span class="token comment"># 存在，则不执行 exit，true 往后传递，则执行 not exist</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


