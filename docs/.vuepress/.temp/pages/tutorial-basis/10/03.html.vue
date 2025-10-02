<template><div><h1 id="命令别名与历史命令" tabindex="-1"><a class="header-anchor" href="#命令别名与历史命令"><span>命令别名与历史命令</span></a></h1>
<h2 id="命令别名设置-alias、unalias" tabindex="-1"><a class="header-anchor" href="#命令别名设置-alias、unalias"><span>命令别名设置：alias、unalias</span></a></h2>
<p>命令别名就是你可以把一长串指令指定一个简短的名称，在键入指令的时候使用简短的名称来达到调用一长串指令的目的。例如：<code v-pre>ls -al|more</code> 查看隐藏文档并且翻页查看，觉得这串指令太长了，可以通过下面的指令来设置别名</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">alias</span> <span class="token assign-left variable">lm</span><span class="token operator">=</span><span class="token string">'ls -al | more'</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ lm</span>
<span class="line">total <span class="token number">68</span></span>
<span class="line">drwx------. <span class="token number">18</span> mrcode mrcode  <span class="token number">4096</span> Nov <span class="token number">11</span> <span class="token number">10</span>:20 <span class="token builtin class-name">.</span></span>
<span class="line">drwxr-xr-x.  <span class="token number">4</span> root   root      <span class="token number">42</span> Oct  <span class="token number">8</span> <span class="token number">23</span>:01 <span class="token punctuation">..</span></span>
<span class="line">-rw-------.  <span class="token number">1</span> mrcode mrcode <span class="token number">10279</span> Nov <span class="token number">11</span> <span class="token number">14</span>:12 .bash_history</span>
<span class="line">-rw-r--r--.  <span class="token number">1</span> mrcode mrcode    <span class="token number">18</span> Aug  <span class="token number">8</span> <span class="token number">20</span>:06 .bash_logout</span>
<span class="line">-rw-r--r--.  <span class="token number">1</span> mrcode mrcode   <span class="token number">193</span> Aug  <span class="token number">8</span> <span class="token number">20</span>:06 .bash_profile</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>别名的定义规则与<RouteLink to="/tutorial-basis/10/02.html#%E5%8F%98%E9%87%8F%E7%9A%84%E8%AE%BE%E7%BD%AE%E8%A7%84%E5%88%99">变量定义规则</RouteLink>几乎相同，另外可以取代已经存在的变量名</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">rm</span><span class="token operator">=</span><span class="token string">'rm -i'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>root 可以移除（rm）任何数据，所以当使用 rm 的时候需要小心，可以使用上面的别名指令覆盖掉原始的 rm 指令，执行的时候就是执行 rm -i 指令了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">alias</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">egrep</span><span class="token operator">=</span><span class="token string">'egrep --color=auto'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">fgrep</span><span class="token operator">=</span><span class="token string">'fgrep --color=auto'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">grep</span><span class="token operator">=</span><span class="token string">'grep --color=auto'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> l.<span class="token operator">=</span><span class="token string">'ls -d .* --color=auto'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">ll</span><span class="token operator">=</span><span class="token string">'ls -l --color=auto'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">lm</span><span class="token operator">=</span><span class="token string">'ls -al | more'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">ls</span><span class="token operator">=</span><span class="token string">'ls --color=auto'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">rm</span><span class="token operator">=</span><span class="token string">'rm -i'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">vi</span><span class="token operator">=</span><span class="token string">'vim'</span></span>
<span class="line"><span class="token builtin class-name">alias</span> <span class="token assign-left variable">which</span><span class="token operator">=</span><span class="token string">'alias | /usr/bin/which --tty-only --read-alias --show-dot --show-tilde'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 root 用户下是没有 <code v-pre>vi='vim'</code> 的，一般用户会默认添加该别名</p>
<p>想取消别名可以使用 unalias 指令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">unalias</span> lm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>例题：DOS 年代，列出目录与文件用 dir，清除屏幕用 cls，在 linux 如何达到这个效果？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">alias</span> <span class="token assign-left variable">cls</span><span class="token operator">=</span><span class="token string">'clear'</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">alias</span> <span class="token assign-left variable">dir</span><span class="token operator">=</span><span class="token string">'ls -l'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="历史命令-history" tabindex="-1"><a class="header-anchor" href="#历史命令-history"><span>历史命令：history</span></a></h2>
<p>前面提过 bash 有提供指令历史的服务，可以使用 history 来查询曾经下达过的指令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">history</span> <span class="token punctuation">[</span>n<span class="token punctuation">]</span></span>
<span class="line"><span class="token function">history</span> <span class="token punctuation">[</span>-c<span class="token punctuation">]</span></span>
<span class="line"><span class="token function">history</span> <span class="token punctuation">[</span>-raw<span class="token punctuation">]</span> histfiles</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>n：数字，列出最近 n 条命令</li>
<li>c：将目前的 shell 中的所有 history 内容全部消除</li>
<li>a：将目前新增的 history 指令新增如 histfiles 中，若没有加 histfiles 则预设写入 <code v-pre>~/.bash_history</code></li>
<li>r：将 histfiles 的内容读到目前这个 shell 的 history 记忆中</li>
<li>w：将目前的 history 记忆内容写入 histfiles 中</li>
</ul>
<p>实践与练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出目前内存内的所有 history 记忆</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">history</span></span>
<span class="line">    <span class="token number">1</span>  <span class="token builtin class-name">cd</span> /root/</span>
<span class="line">    <span class="token number">2</span>  <span class="token function">sudo</span></span>
<span class="line">    <span class="token number">3</span>  <span class="token function">sudo</span> <span class="token builtin class-name">cd</span> /root/</span>
<span class="line">    <span class="token punctuation">..</span><span class="token punctuation">..</span> 中间省略</span>
<span class="line">  <span class="token number">666</span>  <span class="token builtin class-name">alias</span> </span>
<span class="line">  <span class="token number">667</span>  <span class="token builtin class-name">alias</span> <span class="token assign-left variable">cls</span><span class="token operator">=</span><span class="token string">'clear'</span></span>
<span class="line">  <span class="token number">668</span>  <span class="token builtin class-name">alias</span> <span class="token assign-left variable">dir</span><span class="token operator">=</span><span class="token string">'ls -l'</span></span>
<span class="line">  <span class="token number">669</span>  <span class="token function">dir</span></span>
<span class="line">  <span class="token number">670</span>  <span class="token function">history</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：列出们目前最近的 3 条指令</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">history</span> <span class="token number">3</span></span>
<span class="line">  <span class="token number">669</span>  <span class="token function">dir</span></span>
<span class="line">  <span class="token number">670</span>  <span class="token function">history</span></span>
<span class="line">  <span class="token number">671</span>  <span class="token function">history</span> <span class="token number">3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：like将目前的资料写入 histfile 中</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">history</span> <span class="token parameter variable">-w</span></span>
<span class="line"><span class="token comment"># 默认情况会将记录记录写入 ~/.bash_history 中</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token variable">${<span class="token environment constant">HISTSIZE</span>}</span></span>
<span class="line"><span class="token number">1000</span>		<span class="token comment"># 这里不是现实文件中有多少条，而是最大可存储多少条</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正常情况下历史命令的读取记录是这样的：</p>
<ul>
<li>当以 bash 登录 Linux 主机后，系统会主动的由家目录的 <code v-pre>~/.bash_history</code> 读取</li>
<li>假设这次登录后，共下达过 100 次命令，等你注销时，系统就会将 101~1100 总共 1000 条记录<strong>更新</strong>到 <code v-pre>~/.bash_history</code> 中，因为和能存储最大条数 HISTSIZE 有关系，前面的序号会增加，但是总存储条数只有 HISTSIZE 条</li>
<li>也可以使用 history -w 强制写入</li>
</ul>
<p>history 指令不只是提供了查询历史记录而已，还可以利用相关命令来执行指令，如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 执行第几条命令，这里 number 是数值序号</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token operator">!</span>number</span>
<span class="line"><span class="token comment"># 由最近的指令向前搜索指令开头为 command 的哪个指令，并执行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token operator">!</span>command</span>
<span class="line"><span class="token comment"># 执行上一个指令（相当于按 ↑ 后，再按 Enter）</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token operator">!</span><span class="token operator">!</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用范例</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">history</span> <span class="token number">4</span></span>
<span class="line">  <span class="token number">681</span>  <span class="token function">man</span> <span class="token function">rm</span></span>
<span class="line">  <span class="token number">682</span>  <span class="token builtin class-name">alias</span></span>
<span class="line">  <span class="token number">683</span>  <span class="token function">man</span> <span class="token function">history</span></span>
<span class="line">  <span class="token number">684</span>  <span class="token function">history</span> <span class="token number">4</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$  <span class="token operator">!</span><span class="token number">681</span>		  <span class="token comment"># 执行第 681 条指令</span></span>
<span class="line"> <span class="token function">man</span> <span class="token function">rm</span>			<span class="token comment"># 这里会显示具体执行的指令是什么</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token operator">!</span><span class="token operator">!</span>				<span class="token comment"># 执行上一个指令</span></span>
<span class="line"> <span class="token function">man</span> <span class="token function">rm</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token operator">!</span>al				<span class="token comment"># 从最新的历史指令开始搜索 al 开头的指令并执行他</span></span>
<span class="line"><span class="token builtin class-name">alias</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然好用，但是需要小心安全问题，尤其是 root 的历史记录，这是黑客的最爱。另外使用 history 配合 <code v-pre>!</code> 曾经使用过的指令下达是很有效率的一个指令下达方式</p>
<h3 id="同一账户同时多次登录的-history-写入问题" tabindex="-1"><a class="header-anchor" href="#同一账户同时多次登录的-history-写入问题"><span>同一账户同时多次登录的 history 写入问题</span></a></h3>
<p>常常会同时开几个 bash 窗口，这些 bash 的身份都是 root。这样会有 <code v-pre>~/.bash_history</code>的写入问题吗？</p>
<p>自动写入的条件是注销 bash 时，自动写入，那么最后一个被注销的 bash 窗口中的历史记录会存下来，如果记录大于了 1000 的话，后注销的会覆盖前面先注销的（会有同时注销的情况导致错乱的吗？书上没有说）</p>
<p>由于多重登录有这样的问题，很多朋友都习惯单一 bash 登录，再用后续要讲解的 「工作控制 job control 来切换不同的工作」，这样才能将所有曾经下达过的指令记录下来，也方便未来系统管理员进行指令的 debug</p>
<h3 id="无法记录时间" tabindex="-1"><a class="header-anchor" href="#无法记录时间"><span>无法记录时间</span></a></h3>
<p>history 有一个问题就是无法记录指令下达时间。按序号记录的，但是没有记录时间。如果有兴趣，其实可以通过 <code v-pre>~/.bash_logout</code> 来进行 history 的记录，并加上 date 来增加时间参数（后续的情景模拟题中会讲到怎么做）</p>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>有一种情况就是，想不要别人翻阅你的历史记录的话，可以使用 history -c;history -w 强迫清除并立即写入文件来清空历史记录</p>
</div>
</div></template>


