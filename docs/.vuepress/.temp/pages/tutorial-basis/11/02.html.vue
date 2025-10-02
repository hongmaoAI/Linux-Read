<template><div><h1 id="基础正则表达式" tabindex="-1"><a class="header-anchor" href="#基础正则表达式"><span>基础正则表达式</span></a></h1>
<p>既然正则表达式是处理字符串的一种表示方式，那么对字符排序有影响的语系数据就会对正则表达式的结果有影响。此外也需要有支持工具程序来辅助才行。</p>
<p>因此这里先介绍一个最简单的字符串摘取工具程序 grep。前面讲解了 grep 的相关参数与参数，本章着重讲解进阶的 grep 选项说明，介绍完 grep 的功能后，就进入正则表达式的特殊字符处理能力</p>
<h2 id="语系对正则表达式的影响" tabindex="-1"><a class="header-anchor" href="#语系对正则表达式的影响"><span>语系对正则表达式的影响</span></a></h2>
<p>为什么语系数据会影响正则表达式的输出结果？在第 0 章计算器概论的文字编码系统里面谈到，文件其实记录的仅有 0 与 1，我们看到的字符与数值都是通过编码表转换来的。</p>
<p>由于不同语系的编码数据不同，就会造成数据处理结果的差异了，举例说明，假设两种语系输出结果为：</p>
<ul>
<li>LANG=C：0 1 2 3 ... A B C D ..Z a b c d .. z</li>
<li>LANG=zh_TW ：0 1 2 3 ... a A b c C D .. z Z</li>
</ul>
<p>两种语系明显不一样，如果想获取大写字符使用 <code v-pre>[A-Z]</code>时，会发现 C 可以获取到正确的大写字符（因为是连续的），zh_TW 连同小写也会 b-z 也会获取到，因为就编码的顺序来看，big5 语系可以获取到 <code v-pre>A b B c C .. z Z</code> 这一堆字符。</p>
<p>所以使用正则表达式时，需要留意当前的语系，否则可能发现与别人不同的截取结果</p>
<p>由于一般我们再联系正则表达式时，使用的是兼容于 POSIX 的标准，因此就使用 C 这个语系，因此下面的练习都是使用 <code v-pre>LANG=C</code>来练习的。为了避免这样编码所造成的英文与数字截取问题，因此特殊符号需要了解下</p>
<ul>
<li><code v-pre>[:alnum:]</code>：代表英文大小写字符及数字，即 0-9、A-Z、a-z</li>
<li><code v-pre>[:alpha:]</code>：代表任何英文大小写字符，A-Z、a-z</li>
<li><code v-pre>[:blank:]</code>：代表空格与 tab</li>
<li><code v-pre>[:cntrl:]</code>：代表键盘上面的控制按键，包括 CR、LF、TAB、Del 等</li>
<li><code v-pre>[:digit:]</code>：代表数字，0-9</li>
<li><code v-pre>[:graph:]</code>：除了空格符（空格键与 tab 键）外其他的所有按键</li>
<li><code v-pre>[:lower:]</code>：代表些小字符，a-z</li>
<li><code v-pre>[:print:]</code>：代表任何可以被打印出来的字符</li>
<li><code v-pre>[:punct:]</code>：代表标点符号（punctuation symbol）</li>
<li><code v-pre>[:upper:]</code>：代表大写字符，A-Z</li>
<li><code v-pre>[:space:]</code>：任何会产生空白的字符，包括空格、tab、CR 等</li>
<li><code v-pre>[:xdigit:]</code>：代表 16 进制的数值类型，包括 0-9、A-F、a-f 的数字与字符</li>
</ul>
<p>尤其是 <code v-pre>[:alnum:]</code>、<code v-pre>[:alpha:]</code>、<code v-pre>[:upper:]</code>、<code v-pre>[:lower:]</code>、<code v-pre>[:digit:]</code>一定要知道代表什么意思，因为他们要比 a-z 或 A-Z 的用途要确定。</p>
<h2 id="grep-的一些进阶选项" tabindex="-1"><a class="header-anchor" href="#grep-的一些进阶选项"><span>grep 的一些进阶选项</span></a></h2>
<p>在第十章 BASH 中的 grep 谈论过一些基础用法，下面列出较进阶的 grep 选项与参数</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">grep</span> <span class="token punctuation">[</span>-A<span class="token punctuation">]</span> <span class="token punctuation">[</span>-B<span class="token punctuation">]</span> <span class="token punctuation">[</span>--color<span class="token operator">=</span><span class="token string">'auto'</span><span class="token punctuation">]</span> <span class="token string">'关键词'</span> filename</span>
<span class="line"></span>
<span class="line">-A：后面可以加数字，为 after 的意思，除了列出该行外，后续的 n 行也列出来</span>
<span class="line">-B：后面可以加数字，为 befer 的意思，处理列出该行外，前面的 n 行也列出来</span>
<span class="line"><span class="token parameter variable">--colort</span><span class="token operator">=</span>auto：可将正确的哪个截取数据列出颜色</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践与练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：用 dmesg 列出核心信息，再以 grep 找出含有 qx1 那一行</span></span>
<span class="line"><span class="token function">dmesg</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'qx1'</span></span>
<span class="line"><span class="token comment"># 笔者不知道自己使用的显卡是什么，而且使用的是虚拟机，而作者使用的显卡是 qx1，所以查看显卡信息</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：用 --color=auto 显示查找到的关键词高亮,并显示行号</span></span>
<span class="line"><span class="token function">dmesg</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token parameter variable">--color</span><span class="token operator">=</span>auto ‘qx1’</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：在关键词所在行的前两行与后三行也一起显示出来</span></span>
<span class="line">dmest <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token parameter variable">-A2</span> <span class="token parameter variable">-B3</span> <span class="token parameter variable">--color</span><span class="token operator">=</span>auto <span class="token string">'qx1'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>grep 是一个很常见也很常用的指令，最重要的功能就是进行字符串的比对，然后将符合用户需求的字符串打印出来。需要注意的是：grep 是已整行为单位来进行数据截取的</p>
<h2 id="基础正则表达式练习" tabindex="-1"><a class="header-anchor" href="#基础正则表达式练习"><span>基础正则表达式练习</span></a></h2>
<p>要了解正则表达式最简单的方法就是由实际练习去感受，所以在汇总特殊符号前，先以下面这个文件的内容来进行正则表达式的练习，练习前提为：</p>
<ul>
<li>语系已经使用 <code v-pre>export LANG=C；export LC_ALL=C</code></li>
<li>grep 已经使用 alias 设置为 <code v-pre>grep --color=auto</code></li>
</ul>
<p>本机默认为 <code v-pre>LANG=en_US.UTF-8;LC_ALL=</code></p>
<p>文件为 regular——express.txt ，该文件内容是在 windows 系统下编辑的，所以包含 dos 的换行符；</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">"Open Source" is a good mechanism to develop programs.</span>
<span class="line">apple is my favorite food.</span>
<span class="line">Football game is not use feet only.</span>
<span class="line">this dress doesn't fit me.</span>
<span class="line">However, this dress is about $ 3183 dollars.</span>
<span class="line">GNU is free air not free beer.</span>
<span class="line">Her hair is very beauty.</span>
<span class="line">I can't finish the test.</span>
<span class="line">Oh! The soup taste good.</span>
<span class="line">motorcycle is cheap than car.</span>
<span class="line">This window is clear.</span>
<span class="line">the symbol '*' is represented as start.</span>
<span class="line">Oh!	My god!</span>
<span class="line">The gd software is a library for drafting programs.</span>
<span class="line">You are the best is mean you are the no. 1.</span>
<span class="line">The world &lt;Happy> is the same with "glad".</span>
<span class="line">I like dog.</span>
<span class="line">google is the best tools for search keyword.</span>
<span class="line">goooooogle yes!</span>
<span class="line">go! go! Let's go.</span>
<span class="line"># I am VBird</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>文件最后一行为空白行。</p>
<h3 id="范例-1-搜索特定字符" tabindex="-1"><a class="header-anchor" href="#范例-1-搜索特定字符"><span>范例 1：搜索特定字符</span></a></h3>
<p>从文件中取得 the 这个特定字符串，最简单的方式如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'the'</span> regular_express.txt</span>
<span class="line"><span class="token number">8</span>:I can<span class="token string">'t finish the test.</span>
<span class="line">12:the symbol '</span>*' is represented as start.</span>
<span class="line"><span class="token number">15</span>:You are the best is mean you are the no. <span class="token number">1</span>.</span>
<span class="line"><span class="token number">16</span>:The world <span class="token operator">&lt;</span>Happy<span class="token operator">></span> is the same with <span class="token string">"glad"</span><span class="token builtin class-name">.</span></span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>反向选择，可以看到输出结果少了上面的 8、12、15、16、18 行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-vn</span> <span class="token string">'the'</span> regular_express.txt</span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">4</span>:this dress doesn<span class="token string">'t fit me.</span>
<span class="line">5:However, this dress is about $ 3183 dollars.</span>
<span class="line">6:GNU is free air not free beer.</span>
<span class="line">7:Her hair is very beauty.</span>
<span class="line">9:Oh! The soup taste good.</span>
<span class="line">10:motorcycle is cheap than car.</span>
<span class="line">11:This window is clear.</span>
<span class="line">13:Oh!  My god!</span>
<span class="line">14:The gd software is a library for drafting programs.</span>
<span class="line">17:I like dog.</span>
<span class="line">19:goooooogle yes!</span>
<span class="line">20:go! go! Let'</span>s go.</span>
<span class="line"><span class="token number">21</span>:<span class="token comment"># I am VBird</span></span>
<span class="line"><span class="token number">22</span>:</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>忽略大小写 ，多出来几行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-in</span> <span class="token string">'the'</span> regular_express.txt</span>
<span class="line"><span class="token number">8</span>:I can<span class="token string">'t finish the test.</span>
<span class="line">9:Oh! The soup taste good.</span>
<span class="line">12:the symbol '</span>*' is represented as start.</span>
<span class="line"><span class="token number">14</span>:The gd software is a library <span class="token keyword">for</span> drafting programs.</span>
<span class="line"><span class="token number">15</span>:You are the best is mean you are the no. <span class="token number">1</span>.</span>
<span class="line"><span class="token number">16</span>:The world <span class="token operator">&lt;</span>Happy<span class="token operator">></span> is the same with <span class="token string">"glad"</span><span class="token builtin class-name">.</span></span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="范例-2-利用中括号-来搜索集合字符" tabindex="-1"><a class="header-anchor" href="#范例-2-利用中括号-来搜索集合字符"><span>范例 2：利用中括号<code v-pre>[]</code>来搜索集合字符</span></a></h3>
<p>如果要搜索 test 或 taste 这两个单词时，可以发现他们其实有共同的 <code v-pre>t?st</code> 存在</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">[mrcode@study tmp]$ grep -n 't[ae]st' regular_express.txt</span>
<span class="line">8:I can't finish the test.</span>
<span class="line">9:Oh! The soup taste good.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>中括号中，无论几个字符都表示任意一个字符。如果想要搜索到所有 oo 字符时</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'oo'</span> regular_express.txt</span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good.</span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果不想要 oo 前面的 g 呢？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'[^g]oo'</span> regular_express.txt</span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会发现可能会有一部分是正确的，一部分是错误的，比如 1、9 行少了，但是 google 和 goooooogle 还是出来了，是怎么回事？第 18 行，出现了 tools 所以也符合 <code v-pre>[^g]oo</code>，而 19 行，中间有那么多的 oo，也符合</p>
<p>继续，不想要 oo 前面是小写字符的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 由于小写字符的 ASCII 编码顺序是连续的，所以可以简化为，否则就需要把 a-z 都写出来</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'[^a-z]oo'</span> regular_express.txt</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 取得有数字那一行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'[0-9]'</span> regular_express.txt</span>
<span class="line"><span class="token number">5</span>:However, this dress is about $ <span class="token number">3183</span> dollars.</span>
<span class="line"><span class="token number">15</span>:You are the best is mean you are the no. <span class="token number">1</span>.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于考虑到语系对于编码顺序的影响，因此除了连续编码使用减号 <code v-pre>-</code>，还可以使用如下的方法来取得前面两个测试的结果</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'[^[:lower:]]oo'</span> regular_express.txt</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'[[:digit:]]'</span> regular_express.txt</span>
<span class="line"><span class="token number">5</span>:However, this dress is about $ <span class="token number">3183</span> dollars.</span>
<span class="line"><span class="token number">15</span>:You are the best is mean you are the no. <span class="token number">1</span>.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="范例-3-行首与行位字符-、" tabindex="-1"><a class="header-anchor" href="#范例-3-行首与行位字符-、"><span>范例 3：行首与行位字符 <code v-pre>^、$</code></span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 只要行首是 the 的</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'^the'</span> regular_express.txt </span>
<span class="line"><span class="token number">12</span>:the symbol <span class="token string">'*'</span> is represented as start.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 想要行首是小写字符开头的</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'^[a-z]'</span> regular_express.txt </span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">4</span>:this dress doesn<span class="token string">'t fit me.</span>
<span class="line">10:motorcycle is cheap than car.</span>
<span class="line">12:the symbol '</span>*<span class="token string">' is represented as start.</span>
<span class="line">18:google is the best tools for search keyword.</span>
<span class="line">19:goooooogle yes!</span>
<span class="line">20:go! go! Let'</span>s go.</span>
<span class="line"><span class="token comment"># 下面的等效</span></span>
<span class="line"><span class="token comment"># [mrcode@study tmp]$ grep -n '^[[:lower:]]' regular_express.txt </span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 不要英文字母开头的</span></span>
<span class="line"><span class="token comment"># ^ 在中括号内表示反选，在外表示定位首航</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'^[^a-zA-Z]'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">21</span>:<span class="token comment"># I am VBird</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>行尾练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 找出行尾为 . 符号的数据</span></span>
<span class="line"><span class="token comment"># 使用 \ 对 小数点转义</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'\.$'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">4</span>:this dress doesn<span class="token string">'t fit me.</span>
<span class="line">5:However, this dress is about $ 3183 dollars.</span>
<span class="line">6:GNU is free air not free beer.</span>
<span class="line">7:Her hair is very beauty.</span>
<span class="line">8:I can'</span>t finish the test.</span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good.</span>
<span class="line"><span class="token number">10</span>:motorcycle is cheap than car.</span>
<span class="line"><span class="token number">11</span>:This window is clear.</span>
<span class="line"><span class="token number">12</span>:the symbol <span class="token string">'*'</span> is represented as start.</span>
<span class="line"><span class="token number">14</span>:The gd software is a library <span class="token keyword">for</span> drafting programs.</span>
<span class="line"><span class="token number">15</span>:You are the best is mean you are the no. <span class="token number">1</span>.</span>
<span class="line"><span class="token number">16</span>:The world <span class="token operator">&lt;</span>Happy<span class="token operator">></span> is the same with <span class="token string">"glad"</span><span class="token builtin class-name">.</span></span>
<span class="line"><span class="token number">17</span>:I like dog.</span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">20</span>:go<span class="token operator">!</span> go<span class="token operator">!</span> Let's go.</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里需要说一句，原本的文件 5-9 行默认是 <code v-pre>.^M$</code> 结尾的，也就是 <code v-pre>\r\n</code>，由于没有网络，无法下载文件，所以复制粘贴丢失了这些换行符，和书上结果不一样。</p>
<p>也就是说上面的示例 5-9 不应该出来的，使用命令查看特殊字符应该如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">cat</span> <span class="token parameter variable">-An</span> regular_express.txt <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-n</span> <span class="token number">10</span> <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">6</span></span>
<span class="line">     <span class="token number">5</span>  However, this dress is about $ <span class="token number">3183</span> dollars.^M$</span>
<span class="line">     <span class="token number">6</span>  GNU is <span class="token function">free</span> air not <span class="token function">free</span> beer.^M$</span>
<span class="line">     <span class="token number">7</span>  Her hair is very beauty.^M$</span>
<span class="line">     <span class="token number">8</span>  I can't finish the test.^M$</span>
<span class="line">     <span class="token number">9</span>  Oh<span class="token operator">!</span> The soup taste good.^M$</span>
<span class="line">    <span class="token number">10</span>  motorcycle is cheap than car.$		<span class="token comment"># 但实际上 ^M 被丢失了</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>找出空白行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'^$'</span> regular_express.txt </span>
<span class="line"><span class="token number">22</span>:</span>
<span class="line"><span class="token comment"># 只有行首和行尾的表示法，中间没有任何字符，所以是 ^$</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设你已经知道 shell script 或则是配置文件中，空白行与开头为 # 的那一行是批注，想要将这些数据忽略掉，该怎么做？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">cat</span> <span class="token parameter variable">-n</span> /etc/rsyslog.conf </span>
<span class="line"><span class="token comment"># 在 centOS 7 中可以看到有 91 行，有大量的空行与批注信息</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 第一种写法：-v '^$' 是反选，也就是排除空行的，-v ‘^#’ 排除开头是 # 号的</span></span>
<span class="line"><span class="token comment"># 但是这里的行号与源文件对不上了，后面的行号是针对前面排除空行后的行号</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">'^$'</span> /etc/rsyslog.conf <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-vn</span> <span class="token string">'^#'</span></span>
<span class="line"><span class="token number">6</span>:<span class="token variable">$ModLoad</span> imuxsock <span class="token comment"># provides support for local system logging (e.g. via logger command)</span></span>
<span class="line"><span class="token number">7</span>:<span class="token variable">$ModLoad</span> imjournal <span class="token comment"># provides access to the systemd journal</span></span>
<span class="line"><span class="token number">18</span>:<span class="token variable">$WorkDirectory</span> /var/lib/rsyslog</span>
<span class="line"><span class="token number">20</span>:<span class="token variable">$ActionFileDefaultTemplate</span> RSYSLOG_TraditionalFileFormat</span>
<span class="line"><span class="token number">25</span>:<span class="token variable">$IncludeConfig</span> /etc/rsyslog.d/*.conf</span>
<span class="line"><span class="token number">28</span>:<span class="token variable">$OmitLocalLogging</span> on</span>
<span class="line"><span class="token number">30</span>:<span class="token variable">$IMJournalStateFile</span> imjournal.state</span>
<span class="line"><span class="token number">37</span>:*.info<span class="token punctuation">;</span>mail.none<span class="token punctuation">;</span>authpriv.none<span class="token punctuation">;</span>cron.none                /var/log/messages</span>
<span class="line"><span class="token number">39</span>:authpriv.*                                              /var/log/secure</span>
<span class="line"><span class="token number">41</span>:mail.*                                                  -/var/log/maillog</span>
<span class="line"><span class="token number">43</span>:cron.*                                                  /var/log/cron</span>
<span class="line"><span class="token number">45</span>:*.emerg                                                 :omusrmsg:*</span>
<span class="line"><span class="token number">47</span>:uucp,news.crit                                          /var/log/spooler</span>
<span class="line"><span class="token number">49</span>:local7.*                                                /var/log/boot.log</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 第二种实现：直接匹配行首非 # 开头的</span></span>
<span class="line"><span class="token comment"># 因为使用了中括号表示需要有一个字符存在，所以空行的不会被匹配</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'^[^#]'</span> /etc/rsyslog.conf </span>
<span class="line"><span class="token number">9</span>:<span class="token variable">$ModLoad</span> imuxsock <span class="token comment"># provides support for local system logging (e.g. via logger command)</span></span>
<span class="line"><span class="token number">10</span>:<span class="token variable">$ModLoad</span> imjournal <span class="token comment"># provides access to the systemd journal</span></span>
<span class="line"><span class="token number">26</span>:<span class="token variable">$WorkDirectory</span> /var/lib/rsyslog</span>
<span class="line"><span class="token number">29</span>:<span class="token variable">$ActionFileDefaultTemplate</span> RSYSLOG_TraditionalFileFormat</span>
<span class="line"><span class="token number">36</span>:<span class="token variable">$IncludeConfig</span> /etc/rsyslog.d/*.conf</span>
<span class="line"><span class="token number">40</span>:<span class="token variable">$OmitLocalLogging</span> on</span>
<span class="line"><span class="token number">43</span>:<span class="token variable">$IMJournalStateFile</span> imjournal.state</span>
<span class="line"><span class="token number">54</span>:*.info<span class="token punctuation">;</span>mail.none<span class="token punctuation">;</span>authpriv.none<span class="token punctuation">;</span>cron.none                /var/log/messages</span>
<span class="line"><span class="token number">57</span>:authpriv.*                                              /var/log/secure</span>
<span class="line"><span class="token number">60</span>:mail.*                                                  -/var/log/maillog</span>
<span class="line"><span class="token number">64</span>:cron.*                                                  /var/log/cron</span>
<span class="line"><span class="token number">67</span>:*.emerg                                                 :omusrmsg:*</span>
<span class="line"><span class="token number">70</span>:uucp,news.crit                                          /var/log/spooler</span>
<span class="line"><span class="token number">73</span>:local7.*                                                /var/log/boot.log</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里要注意的是批注可以出现在任意处，所以匹配行首的是最安全的做法</p>
<h3 id="范例-4-任意一个字符-与重复字符" tabindex="-1"><a class="header-anchor" href="#范例-4-任意一个字符-与重复字符"><span>范例 4：任意一个字符 <code v-pre>.</code> 与重复字符 <code v-pre>*</code></span></a></h3>
<p>在第十章 bash 中，通配符 <code v-pre>*</code>表示任意（0 或 多个）字符，但是正则表达式中并不是这样，他们含义如下：</p>
<ul>
<li><code v-pre>.</code>：一定有一个任意字符</li>
<li><code v-pre>*</code>：重复前一个字符，0  到任意次，为组合形态</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 找出 g??d 的字符串，也就是 g 开头 d 结尾的 4 字符的字符串</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'g..d'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good.</span>
<span class="line"><span class="token number">16</span>:The world <span class="token operator">&lt;</span>Happy<span class="token operator">></span> is the same with <span class="token string">"glad"</span><span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 找出 oo、ooo、ooo 等数据，至少含有 2 个 o</span></span>
<span class="line"><span class="token comment"># 注意，这里不能写 oo* 因为，*是作用于第二个 o 的，表示 0 到任意个</span></span>
<span class="line"><span class="token comment"># 也就是说如果是 oo* 有可能匹配到一个 o </span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'ooo*'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good.</span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 找出 开头与结尾都是 g ，并且中间至少含有一个 o 的数据</span></span>
<span class="line"><span class="token comment"># 也就是 gog、goog 之类的数据</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'goo*g'</span> regular_express.txt </span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 找出 开头与结尾都是 g，中间有无字符均可</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'g*g'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good.</span>
<span class="line"><span class="token number">13</span>:Oh<span class="token operator">!</span>  My god<span class="token operator">!</span></span>
<span class="line"><span class="token number">14</span>:The gd software is a library <span class="token keyword">for</span> drafting programs.</span>
<span class="line"><span class="token number">16</span>:The world <span class="token operator">&lt;</span>Happy<span class="token operator">></span> is the same with <span class="token string">"glad"</span><span class="token builtin class-name">.</span></span>
<span class="line"><span class="token number">17</span>:I like dog.</span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"><span class="token number">20</span>:go<span class="token operator">!</span> go<span class="token operator">!</span> Let<span class="token string">'s go.</span>
<span class="line"># 使用 g*g 发现第一行的数据就不匹配，这个还是需要再终端看，因为可以开启高亮，方便查看哈</span>
<span class="line"># 原因是 * 作用于 g，g* 代表空字符或一个以上的 g，因此应该匹配 g、gg、ggg 等</span>
<span class="line"></span>
<span class="line"># 正确的应该这样实现</span>
<span class="line">[mrcode@study tmp]$ grep -n '</span>g.*g<span class="token string">' regular_express.txt </span>
<span class="line">1:"Open Source" is a good mechanism to develop programs.</span>
<span class="line">14:The gd software is a library for drafting programs.</span>
<span class="line">18:google is the best tools for search keyword.</span>
<span class="line">19:goooooogle yes!</span>
<span class="line">20:go! go! Let'</span>s go.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 找出包含任意数字的数据</span></span>
<span class="line"><span class="token comment"># 同上，[0-9]* 只作用于一个中括号</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'[0-9][0-9]*'</span> regular_express.txt </span>
<span class="line"><span class="token number">5</span>:However, this dress is about $ <span class="token number">3183</span> dollars.</span>
<span class="line"><span class="token number">15</span>:You are the best is mean you are the no. <span class="token number">1</span>.</span>
<span class="line"><span class="token comment"># 直接使用 grep -n '[0-9]' regular_express.txt 也可以得到相同结果哈</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="范例-5-限定连续-正则字符范围" tabindex="-1"><a class="header-anchor" href="#范例-5-限定连续-正则字符范围"><span>范例 5：限定连续 正则字符范围 <code v-pre>{}</code></span></a></h3>
<p>找出 2 个到 5 个 o 的连续字符串</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 华括弧在 shell 中是特殊符号，需要转义</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'o\{2\}'</span> regular_express.txt </span>
<span class="line"><span class="token number">1</span>:<span class="token string">"Open Source"</span> is a good mechanism to develop programs.</span>
<span class="line"><span class="token number">2</span>:apple is my favorite food.</span>
<span class="line"><span class="token number">3</span>:Football game is not use feet only.</span>
<span class="line"><span class="token number">9</span>:Oh<span class="token operator">!</span> The soup taste good.</span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"><span class="token comment"># 上述结果是至少是 2 个 oo 的出来了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 单词开头结尾都是 g，中间 o，至少 2 个，最多 5 个</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'go\{2,5\}g'</span> regular_express.txt </span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 承上，只是中间的 o 至少 2 个</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">grep</span> <span class="token parameter variable">-n</span> <span class="token string">'go\{2,\}g'</span> regular_express.txt </span>
<span class="line"><span class="token number">18</span>:google is the best tools <span class="token keyword">for</span> search keyword.</span>
<span class="line"><span class="token number">19</span>:goooooogle yes<span class="token operator">!</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基础正则表示法字符汇总" tabindex="-1"><a class="header-anchor" href="#基础正则表示法字符汇总"><span>基础正则表示法字符汇总</span></a></h2>
<ul>
<li>
<p><code v-pre>^word</code>：搜索的关键词 word 在行首</p>
<p>范例：搜索行首为 # 的，并列出行号 <code v-pre>grep -n '^#' file</code></p>
</li>
<li>
<p><code v-pre>word$</code>：搜索的关键词 word 在行尾</p>
<p>范例：搜索以 ！结尾的，<code v-pre>grep -n '!$' file</code></p>
</li>
<li>
<p><code v-pre>.</code>：一定有一个任意字符</p>
<p>范例：搜索字符串可以是 eve、eae、eee、e e；<code v-pre>grep -n 'e.e' file</code></p>
</li>
<li>
<p><code v-pre>\</code>：转义字符</p>
<p>范例：搜索含有单引号数据。<code v-pre>grep -n '\’' file</code></p>
</li>
<li>
<p><code v-pre>*</code>：重复另个到无穷多个前一个字符</p>
<p>范例：找出含有 es、ess、esss 等字符串；<code v-pre>grep -n 'es*' file</code></p>
</li>
<li>
<p><code v-pre>[list]</code>：里面列出想要截取的字符合集</p>
<p>范例：找出含有 g1 或 gd 的数据；<code v-pre>grep -n 'g[1d]' file</code></p>
</li>
<li>
<p><code v-pre>[n1-n2]</code>：字符合集范围</p>
<p>范例：找出含有任意大写字母的数据；<code v-pre>grep -n '[A-Z]' file</code></p>
</li>
<li>
<p><code v-pre>[^list]</code>：不要包含该集合中的字符或该范围的字符</p>
<p>范例：找出 ooa、oog 但是不包含 oot 的数据; <code v-pre>grep -n 'oo[^t]'</code></p>
</li>
<li>
<p><code v-pre>\{n,m\}</code>：连续 n 到 m 个前一个字符</p>
</li>
<li>
<p><code v-pre>\{n\}</code>：连续 n 个前一个字符</p>
</li>
<li>
<p><code v-pre>\{n,\}</code>：至少 n 个以上的前一个字符；咋效果上感觉和 <code v-pre>\{n\}</code> 是一样的</p>
</li>
</ul>
<p>最后再强调，通配符和正则表达式不一样，比如在 ls 命令中找出以 a 开头的文件</p>
<ul>
<li>通配符：<code v-pre>ls -l a*</code></li>
<li>正则表达式：<code v-pre>ls | grep -n '^a'</code> 或则 <code v-pre>ls | grep -n '^a.*'</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例：以 ls -l 配合 grep 找出 /etc/ 下文件类型为链接文件属性的文件名</span></span>
<span class="line"><span class="token comment"># 符号链接文件的特点是权限前面一位是 l，根据 ls 的输出，只要找到行首为 l 的即可</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> /etc <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'^l'</span></span>
<span class="line">lrwxrwxrwx.  <span class="token number">1</span> root root       <span class="token number">56</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:22 favicon.png -<span class="token operator">></span> /usr/share/icons/hicolor/16x16/apps/fedora-logo-icon.png</span>
<span class="line">lrwxrwxrwx.  <span class="token number">1</span> root root       <span class="token number">22</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:23 grub2.cfg -<span class="token operator">></span> <span class="token punctuation">..</span>/boot/grub2/grub.cfg</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="sed-工具" tabindex="-1"><a class="header-anchor" href="#sed-工具"><span>sed 工具</span></a></h2>
<p>了解了一些正则基础使用后，可以来玩一玩 sed 和 awk ；作者就利用他们两个实现了一个小工具：logfile.sh 分析登录文件（第十八章会讲解）。里面绝大部分关键词的提取、统计等都是通过他们来完成的</p>
<p>sed：本身是一个管线命令，可以分析 standard input 的数据，还可以将数据进行替换、新增、截取特定行等功能</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sed</span> <span class="token punctuation">[</span>-nefr<span class="token punctuation">]</span> <span class="token punctuation">[</span>动作<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>
<p>n：使用安静（silent）模式</p>
<p>在一般 sed 的用法中，所有来自 STDIN 的数据一般都会列出到屏幕上，加上 -n 之后，只有经过 sed 特殊处理的那一行（或则动作）才会被打印出来</p>
</li>
<li>
<p>e：直接在指令模式上进行 sed 的动作编辑</p>
</li>
<li>
<p>f：直接将 sed 的动作写在一个文件内，- f filename 则可以执行 filename 内的 sed 动作</p>
</li>
<li>
<p>r：sed 的动作支持是延伸类型正则表达式的语法（预设是基础正则表达式语法）</p>
</li>
<li>
<p>i：直接修改读取的文件内容，而不是由屏幕输出</p>
</li>
</ul>
<p>动作说明：<code v-pre>[n1[,n2]]function</code></p>
<p><code v-pre>n1,n2</code>：不见得会存在，一般代表「选择进行动作的行数」，比如：如果我的动作是需要再 10 到 20 行之间进行的，则「10,20[动作行为]」</p>
<p>function 有如下：</p>
<ul>
<li>a：新增，a 后面可以接字符串，这些字符串会在新的一行出现（当前的下一行）</li>
<li>c：替换，c 后面可以接字符串，这些字符串替换 n1,n2 之间的行</li>
<li>d：删除，后面不接任何字符串</li>
<li>i：插入，i 的后面可以接字符串，而这些字符串会在新的一行出现（当前的上一行）</li>
<li>p：打印，将某个选择的数据打印。通常 p 会参与 sed -n 一起运作</li>
<li>s：替换，可以直接进行替换工作。通常这个 s 的动作可以搭配正则表达式，例如：<code v-pre>1,20s/old/new/g</code></li>
</ul>
<h3 id="以行为单位的新增-删除功能" tabindex="-1"><a class="header-anchor" href="#以行为单位的新增-删除功能"><span>以行为单位的新增/删除功能</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例1：将 /etc/passwd 的内容列出并且打印行号，同时将第 2~5 行删除</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'2,5d'</span>   	<span class="token comment"># 注意写法和结果</span></span>
<span class="line">     <span class="token number">1</span>  root:x:0:0:root:/root:/bin/bash</span>
<span class="line">     <span class="token number">6</span>  sync:x:5:0:sync:/sbin:/bin/sync</span>
<span class="line">     <span class="token number">7</span>  shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown</span>
<span class="line"><span class="token comment"># 另外这里，应该带上 sed -e '2,5d' 才标准，不过不带也可以，但是需要使用单引号括起来</span></span>
<span class="line"><span class="token comment"># 实测不用单引号也可以实现</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例2：只删除第二行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'2d'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例3：删除第三行到最后一行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'3,$d'</span></span>
<span class="line">     <span class="token number">1</span>  root:x:0:0:root:/root:/bin/bash</span>
<span class="line">     <span class="token number">2</span>  bin:x:1:1:bin:/bin:/sbin/nologin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例4：在第二行后（也就是加载第三行）加上「drink tea？」字样</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'2a drink tea?'</span></span>
<span class="line">     <span class="token number">1</span>  root:x:0:0:root:/root:/bin/bash</span>
<span class="line">     <span class="token number">2</span>  bin:x:1:1:bin:/bin:/sbin/nologin</span>
<span class="line">drink tea?</span>
<span class="line">     <span class="token number">3</span>  daemon:x:2:2:daemon:/sbin:/sbin/nologin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例5：在第二行后面加入两行字</span></span>
<span class="line"><span class="token comment"># 注意：不要一开始就写好所有的单引号，因为需要使用 \ + 回车触发换行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'2a drink tea \</span>
<span class="line">> drink beer?'</span></span>
<span class="line">     <span class="token number">1</span>  root:x:0:0:root:/root:/bin/bash</span>
<span class="line">     <span class="token number">2</span>  bin:x:1:1:bin:/bin:/sbin/nologin</span>
<span class="line">drink tea </span>
<span class="line">drink beer?</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="以行为单位的取代显示功能" tabindex="-1"><a class="header-anchor" href="#以行为单位的取代显示功能"><span>以行为单位的取代显示功能</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例1：将第 2-5 行的内容替换为 no 2-5 nuber</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'2,5c no 2-5 number'</span></span>
<span class="line">     <span class="token number">1</span>  root:x:0:0:root:/root:/bin/bash</span>
<span class="line">no <span class="token number">2</span>-5 number</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例2：取出第 11-20 行</span></span>
<span class="line"><span class="token comment"># 通过之前的知识来达成需要这样写</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-n</span> <span class="token number">20</span> <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">10</span></span>
<span class="line">    <span class="token number">11</span>  games:x:12:100:games:/usr/games:/sbin/nologin</span>
<span class="line">    <span class="token number">12</span>  ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin</span>
<span class="line">    <span class="token number">13</span>  nobody:x:99:99:Nobody:/:/sbin/nologin</span>
<span class="line">    <span class="token number">14</span>  systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin</span>
<span class="line">    <span class="token number">15</span>  dbus:x:81:81:System message bus:/:/sbin/nologin</span>
<span class="line">    <span class="token number">16</span>  polkitd:x:999:998:User <span class="token keyword">for</span> polkitd:/:/sbin/nologin</span>
<span class="line">    <span class="token number">17</span>  colord:x:998:997:User <span class="token keyword">for</span> colord:/var/lib/colord:/sbin/nologin</span>
<span class="line">    <span class="token number">18</span>  libstoragemgmt:x:997:995:daemon account <span class="token keyword">for</span> libstoragemgmt:/var/run/lsm:/sbin/nologin</span>
<span class="line">    <span class="token number">19</span>  rpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin</span>
<span class="line">    <span class="token number">20</span>  saslauth:x:996:76:Saslauthd user:/run/saslauthd:/sbin/nologin</span>
<span class="line"><span class="token comment"># 注意需要使用 -n 只输出 sed 处理过的数据</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">nl</span> /etc/passwd <span class="token operator">|</span> <span class="token function">sed</span> <span class="token parameter variable">-n</span> <span class="token string">'11,20p'</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部分数据的搜索并替换功能" tabindex="-1"><a class="header-anchor" href="#部分数据的搜索并替换功能"><span>部分数据的搜索并替换功能</span></a></h3>
<p>除了整行的处理模式外，还可以用行为单位进行部分数据的搜索并替换的功能，基本上 sed 的搜索与替换与 vi 类似</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sed</span> <span class="token string">'s/要被替换的字符串/新的字符串/g'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例1：先观察原始信息，利用 /sbin/ifconfig 查询 IP</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ /sbin/ifconfig </span>
<span class="line">enp0s3: <span class="token assign-left variable">flags</span><span class="token operator">=</span><span class="token number">416</span><span class="token operator"><span class="token file-descriptor important">3</span>&lt;</span>UP,BROADCAST,RUNNING,MULTICAST<span class="token operator">></span>  mtu <span class="token number">1500</span></span>
<span class="line">        inet <span class="token number">192.168</span>.0.128  netmask <span class="token number">255.255</span>.255.0  broadcast <span class="token number">192.168</span>.0.255</span>
<span class="line">        inet6 fe80::deb9:3a1b:fd0f:f6c2  prefixlen <span class="token number">64</span>  scopeid 0x2<span class="token operator"><span class="token file-descriptor important">0</span>&lt;</span>link<span class="token operator">></span></span>
<span class="line">        ether 08:00:27:a0:49:8f  txqueuelen <span class="token number">1000</span>  <span class="token punctuation">(</span>Ethernet<span class="token punctuation">)</span></span>
<span class="line">        RX packets <span class="token number">2436261</span>  bytes <span class="token number">219827411</span> <span class="token punctuation">(</span><span class="token number">209.6</span> MiB<span class="token punctuation">)</span></span>
<span class="line">        RX errors <span class="token number">0</span>  dropped <span class="token number">0</span>  overruns <span class="token number">0</span>  frame <span class="token number">0</span></span>
<span class="line">        TX packets <span class="token number">2011081</span>  bytes <span class="token number">319310584</span> <span class="token punctuation">(</span><span class="token number">304.5</span> MiB<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 还未讲解到 IP,这里先关注第二行的 IP</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 利用关键词配合 grep 截取出关键的一行数据</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ /sbin/ifconfig enp0s3 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'inet '</span></span>
<span class="line">        inet <span class="token number">192.168</span>.0.128  netmask <span class="token number">255.255</span>.255.0  broadcast <span class="token number">192.168</span>.0.255</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将 ip 前面的信息删除，也就是 inet </span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ /sbin/ifconfig enp0s3 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'inet '</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/inet //g'</span></span>
<span class="line">        <span class="token number">192.168</span>.0.128  netmask <span class="token number">255.255</span>.255.0  broadcast <span class="token number">192.168</span>.0.255</span>
<span class="line"><span class="token comment"># 需要使用通配符，不然会留下前面的空白符号：任意字符开头另个或多个</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ /sbin/ifconfig enp0s3 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'inet '</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/^.*inet //g'</span></span>
<span class="line"><span class="token number">192.168</span>.0.128  netmask <span class="token number">255.255</span>.255.0  broadcast <span class="token number">192.168</span>.0.255</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再删除后续部分，只剩下 192.168.0.128</span></span>
<span class="line"><span class="token comment"># 注意这里需要使用：空格任意个，来匹配前面多个空格</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ /sbin/ifconfig enp0s3 <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'inet '</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/^.*inet //g'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/ *netmask.*$//g'</span></span>
<span class="line"><span class="token number">192.168</span>.0.128</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子建议一步一步的来做，下面继续研究 sed 与正则表示法配合练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例2：只要 MAN 存在的那几行数据，但是含有 # 在内的批注和空白行不要</span></span>
<span class="line"><span class="token comment"># 步骤1：先使用 grep 将关键词 MAN 所在行取出来</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cat</span> /etc/man_db.conf <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'MAN'</span></span>
<span class="line"><span class="token comment"># MANDATORY_MANPATH                     manpath_element</span></span>
<span class="line"><span class="token comment"># MANPATH_MAP           path_element    manpath_element</span></span>
<span class="line"><span class="token comment"># MANDB_MAP             global_manpath  [relative_catpath]</span></span>
<span class="line"><span class="token comment"># every automatically generated MANPATH includes these fields</span></span>
<span class="line"><span class="token comment">#MANDATORY_MANPATH                      /usr/src/pvm3/man</span></span>
<span class="line">MANDATORY_MANPATH                       /usr/man</span>
<span class="line">MANDATORY_MANPATH                       /usr/share/man</span>
<span class="line"><span class="token punctuation">..</span>.省略<span class="token punctuation">..</span>.</span>
<span class="line"><span class="token comment"># 步骤2：删除掉批注数据行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cat</span> /etc/man_db.conf <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'MAN'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/^#.*$//g'</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">MANDATORY_MANPATH                       /usr/man</span>
<span class="line">MANDATORY_MANPATH                       /usr/share/man</span>
<span class="line">MANDATORY_MANPATH                       /usr/local/share/man</span>
<span class="line"><span class="token comment"># 步骤3：删除空白行</span></span>
<span class="line"><span class="token comment"># 注意这里使用了动作里面的 d 命令，前面是正则匹配？</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cat</span> /etc/man_db.conf <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'MAN'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/^#.*$//g'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'/^$/d'</span></span>
<span class="line">MANDATORY_MANPATH                       /usr/man</span>
<span class="line">MANDATORY_MANPATH                       /usr/share/man</span>
<span class="line">MANDATORY_MANPATH                       /usr/local/share/man</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="直接修改文件内容-危险动作" tabindex="-1"><a class="header-anchor" href="#直接修改文件内容-危险动作"><span>直接修改文件内容（危险动作）</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例1：利用 sed 将 /tmp/regular_express.txt 内每一行结尾若为 . 则换成 ！</span></span>
<span class="line"><span class="token comment"># 下面还是使用了动作 s 替换，后面的是转义 . 和 !</span></span>
<span class="line"><span class="token comment"># 这样可以直接修改文件内容</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'s/\./\!/g'</span> regular_express.txt </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例2：利用 sed 直接在 /tmp/regular_express.txt 最后一行加入 # This is a test</span></span>
<span class="line"><span class="token comment"># $ 表示最后一行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'$a # This is a test '</span> regular_express.txt </span>
<span class="line"><span class="token comment"># 想要删除最后一行就简单了</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study tmp<span class="token punctuation">]</span>$ <span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">'$d'</span> regular_express.txt </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


