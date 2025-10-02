<template><div><h1 id="文件内容查阅" tabindex="-1"><a class="header-anchor" href="#文件内容查阅"><span>文件内容查阅</span></a></h1>
<p>查阅一个文件内容是，这里有相当多有趣的指令来了解下，
最常使用的可以说是 cat 、more、less，那么当查阅一个很大型的文件的时候，
想要在几百兆的文件内容中找到我们想要的数据怎么办？下面的指令能发挥出一些作用</p>
<ul>
<li>cat：由第一行开始显示文件内容</li>
<li>tac：从最后一行开始显示，可以看出 tac 是 cat 的倒着写</li>
<li>nl：显示的时候顺道输出行号</li>
<li>more：一页一页的显示文件内容</li>
<li>less：与 more 类似，但是比 more 更好的是，他可以往前翻页</li>
<li>head 只看头几行</li>
</ul>
<h2 id="直接检视文件内容" tabindex="-1"><a class="header-anchor" href="#直接检视文件内容"><span>直接检视文件内容</span></a></h2>
<p>直接查阅一个文件的内容可以使用 cat、tac、nl 这几个指令</p>
<h3 id="cat-concatenate" tabindex="-1"><a class="header-anchor" href="#cat-concatenate"><span>cat（concatenate）</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token punctuation">[</span>-AbEnTv<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>A：相当于 -vET 的整合选项，可列出一些特殊字符而不是空白</li>
<li>b：列出行号，仅针对非空白行做行号显示，空白行不标行号</li>
<li>E：将结尾的断行字符 $ 显示出来</li>
<li>n：打印出行号（包含空白行）</li>
<li>T：将 tab 按键以 ^I 显示出来</li>
<li>v：列出一些看不出来的特殊字符</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># cat /etc/issue</span></span>
<span class="line"><span class="token punctuation">\</span>S</span>
<span class="line">Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 带行号显示，最后还有一行空白行呢。对于大文件要找某个特定的行时，有点用处</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># cat -n /etc/issue</span></span>
<span class="line">     <span class="token number">1</span>  <span class="token punctuation">\</span>S</span>
<span class="line">     <span class="token number">2</span>  Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line">     <span class="token number">3</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面练习显示特殊的内容</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># cat -A /etc/man_db.conf</span></span>
<span class="line"><span class="token comment">#^I^I*MANPATH*     ->^I*CATPATH*$</span></span>
<span class="line"><span class="token comment">#$</span></span>
<span class="line">MANDB_MAP^I/usr/man^I^I/var/cache/man/fsstnd$</span>
<span class="line">MANDB_MAP^I/usr/share/man^I^I/var/cache/man$</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 上面只是部分内容，说下差异</span></span>
<span class="line"><span class="token comment"># 断行以 $ 显示，可以发现每行后面都有 $ ，这个其实就 window 中的换行把？</span></span>
<span class="line"><span class="token comment"># tab 以 ^I 显示</span></span>
<span class="line"><span class="token comment"># windows 的断行字符是 ^M$</span></span>
<span class="line"><span class="token comment"># 这部分在 vim 软件介绍时会再次说明</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tac-反向列示" tabindex="-1"><a class="header-anchor" href="#tac-反向列示"><span>tac 反向列示</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line"># 从最后一行开始显示</span>
<span class="line">[root@study tmp]# tac /etc/issue</span>
<span class="line"></span>
<span class="line">Kernel \r on an \m</span>
<span class="line">\S</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nl-添加行号打印" tabindex="-1"><a class="header-anchor" href="#nl-添加行号打印"><span>nl 添加行号打印</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">nl</span> <span class="token punctuation">[</span>-bnw<span class="token punctuation">]</span> 文件</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>
<p>b：指定行号指定的方式，主要有两种</p>
<ul>
<li><code v-pre>-b a</code>：表示不论是否为空行，也同样列出行号（类似 cat -n）</li>
<li><code v-pre>-b t</code>：如果有空行，空行不要列出行号（默认值）</li>
</ul>
</li>
<li>
<p>n：列出行号表示的方法，主要有三种</p>
<ul>
<li><code v-pre>-b ln</code>：行号在屏幕的最左方显示</li>
<li><code v-pre>-b rn</code>：行号在自己字段的最右方显示，且不加 0</li>
<li><code v-pre>-b rz</code>：行号在自己字段的最有方显示，且加 0</li>
</ul>
</li>
<li>
<p>w：行号字段的占用字符数</p>
</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 用 nl 列出 /etc/issue 的内容</span></span>
<span class="line"><span class="token comment"># 默认不显示空行的行号</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># nl /etc/issue</span></span>
<span class="line">     <span class="token number">1</span>  <span class="token punctuation">\</span>S</span>
<span class="line">     <span class="token number">2</span>  Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示空行行号</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># nl -b a /etc/issue</span></span>
<span class="line">     <span class="token number">1</span>  <span class="token punctuation">\</span>S</span>
<span class="line">     <span class="token number">2</span>  Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line">     <span class="token number">3</span>  </span>
<span class="line"><span class="token comment"># 行号自动补 0，前面说的左右，看下面的对比，这个右是指，行号区域的左右</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># nl -b a -n rz /etc/issue</span></span>
<span class="line">000001  <span class="token punctuation">\</span>S</span>
<span class="line">000002  Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line">000003  </span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># nl -b a -n rn /etc/issue</span></span>
<span class="line">     <span class="token number">1</span>  <span class="token punctuation">\</span>S</span>
<span class="line">     <span class="token number">2</span>  Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line">     <span class="token number">3</span>  </span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># nl -b a -n ln /etc/issue</span></span>
<span class="line"><span class="token number">1</span>       <span class="token punctuation">\</span>S</span>
<span class="line"><span class="token number">2</span>       Kernel <span class="token punctuation">\</span>r on an <span class="token punctuation">\</span>m</span>
<span class="line"><span class="token number">3</span>       </span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="可翻页检视" tabindex="-1"><a class="header-anchor" href="#可翻页检视"><span>可翻页检视</span></a></h2>
<h3 id="more-一页一页翻动" tabindex="-1"><a class="header-anchor" href="#more-一页一页翻动"><span>more 一页一页翻动</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># more /etc/man_db.conf</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment"># This file is used by the man-db package to configure the man and cat paths.</span></span>
<span class="line"><span class="token comment"># It is also used to provide a manpath for those without one by examining</span></span>
<span class="line"><span class="token comment"># their PATH environment variable. For details see the manpath(5) man page.</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line">--More--<span class="token punctuation">(</span><span class="token number">14</span>%<span class="token punctuation">)</span>   <span class="token comment"># 重点在这一行，你的光标也会在这里等待你的指令</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 more 程序中，有几个按键可以按：</p>
<ul>
<li>空格键（space）：向下翻一页</li>
<li>Enter：向下翻一行</li>
<li><code v-pre>/字符串</code>：在显示的内容中，向下搜索「字符串」这个关键词</li>
<li>q：立即离开 more</li>
<li>b 或 ctrl+b：向前翻页，只针对文件有用，对管线（管道 |）无用</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">more</span> /etc/man_db.conf</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">--More--<span class="token punctuation">(</span><span class="token number">14</span>%<span class="token punctuation">)</span>   <span class="token comment"># 光标在这里，一定要在英文输入状态下直接按 / 才会进入到搜索模式，让你输入文字</span></span>
<span class="line">/MANPATH   <span class="token comment"># 这里搜索 MANPATH 这个字符串，查找下一个直接按 n 就可以了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="less-一页一页翻动" tabindex="-1"><a class="header-anchor" href="#less-一页一页翻动"><span>less 一页一页翻动</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用指令后，就会进入到 less 环境</span></span>
<span class="line"><span class="token function">less</span> /etc/man_db.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># This file is used by the man-db package to configure the man and cat paths.</span></span>
<span class="line"><span class="token comment"># It is also used to provide a manpath for those without one by examining</span></span>
<span class="line"></span>
<span class="line">注意，刚进入的时候，没有光标，可以直接输入 <span class="token builtin class-name">:</span> 或则方向下键，就会在最下面出现 「:光标」这里就可以输入指令了</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以使用的按键和指令有</p>
<ul>
<li>空格键：向下翻一页</li>
<li>pagedown：向下翻一页</li>
<li>pageup：向上翻一页</li>
<li><code v-pre>/字符串</code>：向下搜索字符串；注意这个斜杠也是需要输入的，不是在 「:」输入，：也和这个是一个功能</li>
<li><code v-pre>?字符串</code>：向上搜索字符串</li>
<li>n：重复前一个搜索（与 / 或 ？有关）</li>
<li>N：反向的重复前一个搜索</li>
<li>g：前进到这个资料的第一行</li>
<li>G：前进到这个资料的最后一行去（注意是大写）</li>
<li>q：离开 less 这个程序</li>
</ul>
<p>此外，man page 就是调用 less 来显示说明文件内容的，所以看上去很相似</p>
<p>笔者工作中查看日志中有用得数据的时候，就是这个 less 了，但是只知道 shift+g 可以前进到最后一行去，原来 shift+g 其实就是输入了大写的 G 指令</p>
<h2 id="资料摘取" tabindex="-1"><a class="header-anchor" href="#资料摘取"><span>资料摘取</span></a></h2>
<p>可以将输出的资料做一个最简单的摘取，如去除文件前面几行（head）或则后面几行（tail），
需要注意的是， head 和 tail 都是以行为单位来进行摘取的</p>
<h3 id="head-去除前面几行" tabindex="-1"><a class="header-anchor" href="#head-去除前面几行"><span>head 去除前面几行</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">head</span> <span class="token punctuation">[</span>-n number<span class="token punctuation">]</span> 文件</span>
<span class="line"></span>
<span class="line">-n：后面接数字，表示摘取几行</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 默认显示前 10 行，可以指定显示 20 行</span></span>
<span class="line"><span class="token function">head</span> <span class="token parameter variable">-n</span> <span class="token number">20</span> /etc/man_db.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 注意后面的数值为负数</span></span>
<span class="line"><span class="token comment"># 该文件共有 131 行，这里是的意思就是，从尾部 -128 行，剩下的内容显示</span></span>
<span class="line"><span class="token comment"># 也就是说，忽略显示后 128 行的数据</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># head -n -128 /etc/man_db.conf</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment"># This file is used by the man-db package to configure the man and cat paths.</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tail-取出后面几行" tabindex="-1"><a class="header-anchor" href="#tail-取出后面几行"><span>tail 取出后面几行</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">tail</span> <span class="token punctuation">[</span>-nf number<span class="token punctuation">]</span> 文件</span>
<span class="line"></span>
<span class="line"><span class="token parameter variable">-n</span> ：后面接数字，表示显示几行</span>
<span class="line"><span class="token parameter variable">-f</span> ：表示持续侦测后面所接的档名，要等到按下 ctrl+c 才会结束 <span class="token function">tail</span> 的侦测</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 默认显示最后 10 行</span></span>
<span class="line"><span class="token function">tail</span> /etc/man_db.conf</span>
<span class="line"><span class="token comment"># 显示最后 20 行</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">20</span> /etc/man_db.conf</span>
<span class="line"><span class="token comment"># 忽略显示前 100 行的数据，也就是说显示 100 行后的数据</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-n</span> +100 /etc/man_db.conf</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这个就是笔者最常用查看某个项目当前滚动日志的方式了</span></span>
<span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /var/log/messages</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组合使用示例</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 获取 第 11 到 20 行的数据</span></span>
<span class="line"><span class="token comment"># 思路是：先取前 20 行数据出来，再从这 20 行里面取后 10 行数据</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># head -n 20 /etc/man_db.conf | tail -n 10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这个 | 就是管线的意思</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>|</code>：管线/管道符，前面的指令所输出的信息，请透过管线交由后续的指令继续使用。后续会详细讲解</p>
<p>上面的例子，其实我也不知道到底取出来的行数对不对，那么就可以使用管线来组合其他的指令使用</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 先使用 cat -n 显示行号，再交给后续的指令</span></span>
<span class="line"><span class="token comment"># 我这里是显示 第 18 行到 20 行的内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study tmp<span class="token punctuation">]</span><span class="token comment"># cat -n /etc/man_db.conf | head -n 20 | tail -n 3</span></span>
<span class="line">    <span class="token number">18</span>  <span class="token comment">#MANDATORY_MANPATH                      /usr/src/pvm3/man</span></span>
<span class="line">    <span class="token number">19</span>  <span class="token comment">#</span></span>
<span class="line">    <span class="token number">20</span>  MANDATORY_MANPATH                       /usr/man</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="非纯文本-od" tabindex="-1"><a class="header-anchor" href="#非纯文本-od"><span>非纯文本 od</span></a></h2>
<p>上面讲解了读取出文本的内容，那么想阅读非文本文件呢？比如查看 /usr/bin/passwd 文档，
使用上面提出来的指令读取就会乱码。</p>
<p>可以使用 od 指令来读取</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">od <span class="token punctuation">[</span>-t TYPE<span class="token punctuation">]</span> 文件</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>type 选项为：</p>
<ul>
<li>a：利用默认的字符来输出</li>
<li>c：使用 ASCII 字符来输出</li>
<li><code v-pre>d[size]</code>：十进制（decimal）输出数据，每个整数占用 size bytes</li>
<li><code v-pre>f[size]</code>：浮点数（floating）输出数据</li>
<li><code v-pre>o[size]</code>：八进制（octal)</li>
<li><code v-pre>x[size]</code>：十六进制（hexadecimal）</li>
</ul>
<p>实践练习</p>
<p>使用 ASCII 展示</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># od -t c /usr/bin/passwd</span></span>
<span class="line">0000000 <span class="token number">177</span>   E   L   F 002 001 001  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span></span>
<span class="line">0000020 003  <span class="token punctuation">\</span><span class="token number">0</span>   <span class="token operator">></span>  <span class="token punctuation">\</span><span class="token number">0</span> 001  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>   H   <span class="token number">2</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span></span>
<span class="line">0000040   @  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span> <span class="token number">220</span>   e  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span></span>
<span class="line">0000060  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>   @  <span class="token punctuation">\</span><span class="token number">0</span>   <span class="token number">8</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span>t  <span class="token punctuation">\</span><span class="token number">0</span>   @  <span class="token punctuation">\</span><span class="token number">0</span> 035  <span class="token punctuation">\</span><span class="token number">0</span> 034  <span class="token punctuation">\</span><span class="token number">0</span></span>
<span class="line">0000100 006  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span> 005  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>   @  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span>  <span class="token punctuation">\</span><span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 最左边第一栏以 8 进制来表示 bytes 数。</span></span>
<span class="line"><span class="token comment"># 比如 00000020 表示是第16 个 bytes (2x8)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 8 进制位列出存储值与 ASCII 的对照表</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># od -t oCc /etc/issue</span></span>
<span class="line">0000000 <span class="token number">134</span> <span class="token number">123</span> 012 <span class="token number">113</span> <span class="token number">145</span> <span class="token number">162</span> <span class="token number">156</span> <span class="token number">145</span> <span class="token number">154</span> 040 <span class="token number">134</span> <span class="token number">162</span> 040 <span class="token number">157</span> <span class="token number">156</span> 040</span>
<span class="line">          <span class="token punctuation">\</span>   S  <span class="token punctuation">\</span>n   K   e   r   n   e   l       <span class="token punctuation">\</span>   r       o   n    </span>
<span class="line">0000020 <span class="token number">141</span> <span class="token number">156</span> 040 <span class="token number">134</span> <span class="token number">155</span> 012 012</span>
<span class="line">          a   n       <span class="token punctuation">\</span>   m  <span class="token punctuation">\</span>n  <span class="token punctuation">\</span></span>
<span class="line">0000027</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 上面是八进制表示，下面是对应的 ascii 字符</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对照指令对于工程师来说可能更有用处，上面是文件是一个纯文本文件，显示了字符的 ACCIS 对照表，
百度了下， ACCIS 可以与上面的各种进制来对照</p>
<p>比如 password 字符串，需要他的 10 进制对照表</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 可以使用管道符来给 od 处理</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo password | od -t dCc</span></span>
<span class="line">0000000  <span class="token number">112</span>   <span class="token number">97</span>  <span class="token number">115</span>  <span class="token number">115</span>  <span class="token number">119</span>  <span class="token number">111</span>  <span class="token number">114</span>  <span class="token number">100</span>   <span class="token number">10</span></span>
<span class="line">           p    a    s    s    w    o    r    d   <span class="token punctuation">\</span>n</span>
<span class="line">0000011</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="修改文件时间或新建文件-touch" tabindex="-1"><a class="header-anchor" href="#修改文件时间或新建文件-touch"><span>修改文件时间或新建文件 touch</span></a></h2>
<p>使用 ls 指令的时候，提到过每个文件 linux 底下都会记录许多的时间参数，其实是有三个主要的变动时间：</p>
<ul>
<li>
<p>modification time（mtime）</p>
<p>当文档 <strong>内容数据</strong> 变更时。该时间会被更新。</p>
</li>
<li>
<p>status time（ctime）</p>
<p>当文件 <strong>状态</strong> 改变时。比如权限与数学被更改了</p>
</li>
<li>
<p>access time（atime）</p>
<p>当文件 <strong>内容被取用</strong> 时。比如我们使用 cat 去读取 /etc/man_db.conf ，该时间就会改变</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># date;ls -l /etc/man_db.conf ;ls -l --time=atime /etc/man_db.conf ;ls -l --time=ctime /etc/man_db.conf</span></span>
<span class="line"><span class="token number">2019</span>年 <span class="token number">10</span>月 <span class="token number">13</span>日 星期日 <span class="token number">21</span>:33:52 CST</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">5171</span> <span class="token number">10</span>月 <span class="token number">31</span> <span class="token number">2018</span> /etc/man_db.conf <span class="token comment"># 2018/10/31 建立的 mtime</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">5171</span> <span class="token number">10</span>月 <span class="token number">13</span> <span class="token number">15</span>:36 /etc/man_db.conf <span class="token comment"># 10月13号 读取过 atime</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">5171</span> <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:22 /etc/man_db.conf <span class="token comment"># 10月4号 更新过状态 ctime</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 笔者就现在使用了 cat /etc/man_db.conf，也没有发现时间变更，不知道是啥原因</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当你看到一个未来时间的文件，这个是有可能的，因为支持多时区，安装系统行为不当，就有可能导致这种情况发生</p>
<p>可以使用 touch 来修订时间</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">touch</span> <span class="token punctuation">[</span>-acdmt<span class="token punctuation">]</span> 文件</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>a：仅修订 access time</li>
<li>c：仅修改文件的时间，若该文件不存在则不建立新文件</li>
<li>d：后面可以接欲修订的日期而不用目前的日期，也可以使用 --date=&quot;日期或时间&quot;</li>
<li>m：仅修改 mtime</li>
<li>t：后面可以接欲修订的时间而不用目前的时间，格式为 YYYYMMDDhhmm</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">cd</span> /tmp/</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">touch</span> testtouch</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> testtouch</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode <span class="token number">0</span> Oct <span class="token number">13</span> <span class="token number">21</span>:45 testtouch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 注意到这个文件的大小是 0，在预设的状态下，如果 touch 没有接文件</span></span>
<span class="line"><span class="token comment"># 则该文件的三个时间（atime、ctime、mtime 都会更新为目前的时间。</span></span>
<span class="line"><span class="token comment"># 若该文件不存在，则会主动建立一个新的空文件</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 复制一个文件，假设复制全部的属性，并检查日期</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">cp</span> <span class="token parameter variable">-a</span> ~/.bashrc bashrc</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">date</span><span class="token punctuation">;</span> ll bashrc <span class="token punctuation">;</span> ll <span class="token parameter variable">--time</span><span class="token operator">=</span>atime bashrc <span class="token punctuation">;</span> ll <span class="token parameter variable">--time</span><span class="token operator">=</span>ctime bashrc</span>
<span class="line">Sun Oct <span class="token number">13</span> <span class="token number">21</span>:48:24 CST <span class="token number">2019</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Aug  <span class="token number">8</span> <span class="token number">20</span>:06 bashrc <span class="token comment"># mtime</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Oct <span class="token number">13</span> <span class="token number">14</span>:38 bashrc <span class="token comment"># atime</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Oct <span class="token number">13</span> <span class="token number">21</span>:47 bashrc <span class="token comment"># ctime</span></span>
<span class="line"><span class="token comment"># 属性完全被复制，mtime 与源文件相同，该文件是刚刚建立的， ctime 就是当前时间</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以将日期调整为两天前</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">touch</span> <span class="token parameter variable">-d</span> <span class="token string">"2 days ago"</span> bashrc</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">date</span><span class="token punctuation">;</span> ll bashrc <span class="token punctuation">;</span> ll <span class="token parameter variable">--time</span><span class="token operator">=</span>atime bashrc <span class="token punctuation">;</span> ll <span class="token parameter variable">--time</span><span class="token operator">=</span>ctime bashrc</span>
<span class="line">Sun Oct <span class="token number">13</span> <span class="token number">21</span>:51:31 CST <span class="token number">2019</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Oct <span class="token number">11</span> <span class="token number">21</span>:51 bashrc <span class="token comment"># mtime</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Oct <span class="token number">11</span> <span class="token number">21</span>:51 bashrc <span class="token comment"># atime</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Oct <span class="token number">13</span> <span class="token number">21</span>:51 bashrc <span class="token comment"># ctime</span></span>
<span class="line"><span class="token comment"># 可以看到前两个实际变化了，ctime 又变成当前时间了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将日期调整为诶指定的时间 2014/06/15 00:00</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">touch</span> <span class="token parameter variable">-t</span> <span class="token number">201406150000</span> bashrc</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">date</span><span class="token punctuation">;</span> ll bashrc <span class="token punctuation">;</span> ll <span class="token parameter variable">--time</span><span class="token operator">=</span>atime bashrc <span class="token punctuation">;</span> ll <span class="token parameter variable">--time</span><span class="token operator">=</span>ctime bashrc</span>
<span class="line">Sun Oct <span class="token number">13</span> <span class="token number">21</span>:54:31 CST <span class="token number">2019</span></span>
<span class="line"><span class="token comment"># 由于时间太久远，默认的格式显示不全的，没有显示时分格式</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Jun <span class="token number">15</span>  <span class="token number">2014</span> bashrc</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Jun <span class="token number">15</span>  <span class="token number">2014</span> bashrc</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode mrcode <span class="token number">231</span> Oct <span class="token number">13</span> <span class="token number">21</span>:54 bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么 touc 中最常用的功能是：</p>
<ul>
<li>建立一个空的文件</li>
<li>将某个文件日期秀固定为目前（mtime 与 atime）</li>
<li>比较重要的是 mtime，关心这个文件内容是什么时候被更新的</li>
</ul>
</div></template>


