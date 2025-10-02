<template><div><h1 id="用-make-进行宏编译" tabindex="-1"><a class="header-anchor" href="#用-make-进行宏编译"><span>用 make 进行宏编译</span></a></h1>
<h2 id="为什么要用-make" tabindex="-1"><a class="header-anchor" href="#为什么要用-make"><span>为什么要用 make</span></a></h2>
<p>来看一个案例：执行文档里面包含了 4 个源码文件，分别是 <code v-pre>main.c</code>、 <code v-pre>haha.c</code>、 <code v-pre>sin_value.c</code>、 <code v-pre>cos_value.c</code>、</p>
<ul>
<li><code v-pre>main.c</code>：主要目的是让用户输入角度数据与调用其他三个子程序</li>
<li><code v-pre>haha.c</code>：输出一堆有的没有的信息</li>
<li><code v-pre>sin_value.c</code>：计算使用者输入的角度（360）sin 数值</li>
<li><code v-pre>cos_value.c</code>：计算使用者输入的角度（360）cos 数值</li>
</ul>
<p><code v-pre>main.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line"><span class="token comment">#define pi 3.14159</span></span>
<span class="line">char name<span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">float angle<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">int main<span class="token punctuation">(</span>void<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span><span class="token entity" title="\n">\n</span>Please input your name: "</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	scanf  <span class="token punctuation">(</span><span class="token string">"%s"</span>, <span class="token operator">&amp;</span>name <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>Please enter the degree angle (ex> 90): "</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	scanf  <span class="token punctuation">(</span><span class="token string">"%f"</span>, <span class="token operator">&amp;</span>angle <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	haha<span class="token punctuation">(</span> name <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	sin_value<span class="token punctuation">(</span> angle <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	cos_value<span class="token punctuation">(</span> angle <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>haha.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line">int haha<span class="token punctuation">(</span>char name<span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span><span class="token entity" title="\n">\n</span>Hi, Dear %s, nice to meet you."</span>, name<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>sin_value.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line"><span class="token comment">#include &lt;math.h></span></span>
<span class="line"><span class="token comment">#define pi 3.14159</span></span>
<span class="line">float angle<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">void sin_value<span class="token punctuation">(</span>void<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	float value<span class="token punctuation">;</span></span>
<span class="line">	value <span class="token operator">=</span> sin <span class="token punctuation">(</span> angle / <span class="token number">180</span>. * pi <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>The Sin is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>cos_value.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line"><span class="token comment">#include &lt;math.h></span></span>
<span class="line"><span class="token comment">#define pi 3.14159</span></span>
<span class="line">float angle<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">void cos_value<span class="token punctuation">(</span>void<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	float value<span class="token punctuation">;</span></span>
<span class="line">	value <span class="token operator">=</span> cos <span class="token punctuation">(</span> angle / <span class="token number">180</span>. * pi <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"The Cos is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先进行目标文件的编译，最终会有 4 个 *.o 的文件出现</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gcc -c main.c </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gcc -c haha.c </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gcc -c sin_value.c </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gcc -c cos_value.c </span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 再执行连结称为执行文件，并加入 libm 的函数，产生 man 的执行文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gcc -o man main.o haha.o sin_value.o cos_value.o  -lm</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 执行程序，比如输入姓名，360 度角的角度值来计算</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ./man </span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Please input your name: mrcode		<span class="token comment"># 输入姓名</span></span>
<span class="line">	</span>
<span class="line">Please enter the degree angle <span class="token punctuation">(</span>ex<span class="token operator">></span> <span class="token number">90</span><span class="token punctuation">)</span>: <span class="token number">30</span>		<span class="token comment"># 输入角度</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Hi, Dear mrcode, <span class="token function">nice</span> to meet you.</span>
<span class="line">The Sin is:  <span class="token number">0.50</span></span>
<span class="line">The Cos is:  <span class="token number">0.87</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到编译指令就变得复杂起来了，如果要重新编译，上述流程还需要重新来一次，很麻烦</p>
<p>可以使用 make 工具简化我们的工作。先建立 makefile 的文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先编辑 makefile 规则文件，内容只要做出 man 这个执行文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim makefile</span></span>
<span class="line">main: main.o haha.o sin_value.o cos_value.o</span>
<span class="line">        gcc <span class="token parameter variable">-o</span> main main.o haha.o sin_value.o cos_value.o <span class="token parameter variable">-lm</span></span>
<span class="line"><span class="token comment"># 注意第 2 行数据，是按 tab 产生的空格</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2.尝试使用 makefile 指定的规则进行编译行为</span></span>
<span class="line"><span class="token comment"># 先把之前产生的 .o 文件删除</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rm -f main *.o</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># make          </span></span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> main.o main.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> haha.o haha.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> sin_value.o sin_value.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> cos_value.o cos_value.c</span>
<span class="line">gcc <span class="token parameter variable">-o</span> main main.o haha.o sin_value.o cos_value.o <span class="token parameter variable">-lm</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 此时 make 会读取 makefile 的内容，并根据内容直接编译相关的文件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 在不删除任何文件的情况下，重新执行一次编译的动作</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># make</span></span>
<span class="line">make: `main' is up to date.</span>
<span class="line"><span class="token comment"># 只会执行更新 update 的动作</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的执行，从命令行输出来看，获取你会觉得 shell script 也可以做到，的确是这样，但是 make 提供了增量编译的机制，不需要你自己去写那么复杂的流程判断了。好处如下：</p>
<ul>
<li>简化编译时所需要下达的指令</li>
<li>若在编译完成之后，修改了某个源码文件，则 make 仅会针对被修改了的文件进行编译，其他的 object file 不会变动</li>
<li>最后可以依照相依性来更新（update）执行文件</li>
</ul>
<p>下面针对 makefile 的语法来介绍</p>
<h2 id="makefile-的基本语法与变量" tabindex="-1"><a class="header-anchor" href="#makefile-的基本语法与变量"><span>makefile 的基本语法与变量</span></a></h2>
<p>makefile 的语法多而复杂，可以参考 <a href="http://www.gnu.org/software/make/manual/make.html" target="_blank" rel="noopener noreferrer">GUN 官网文档</a>，这里仅做一些基本的规则，重点在于你接触源码的时候，不至于恐慌，基本规则如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">目标（target）：目标文件1 目标文件2</span>
<span class="line"><span class="token operator">&lt;</span>tab<span class="token operator">></span>	 gcc <span class="token parameter variable">-o</span> 欲建立的执行文件 目标文件1 目标文件2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>在 makefile 中的规则基本上是：</p>
<ul>
<li><code v-pre>#</code> 代表批注</li>
<li><code v-pre>&lt;tab&gt;</code> 需要在命令行的第一个字符</li>
<li>目标 target 与相依文件（目标文件）之间以 <code v-pre>:</code> 分割</li>
</ul>
<p>对上上面那个示例，如果有两个以上的执行动作时，如何做？比如增加一个指令，直接清除所有的目标文件与执行文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 编辑 makefile 来建议新的规则，此规则的目标为 clean</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim makefile </span></span>
<span class="line">main: main.o haha.o sin_value.o cos_value.o</span>
<span class="line">        gcc <span class="token parameter variable">-o</span> main main.o haha.o sin_value.o cos_value.o <span class="token parameter variable">-lm</span></span>
<span class="line">clean:</span>
<span class="line">        <span class="token function">rm</span> <span class="token parameter variable">-rf</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line">        </span>
<span class="line"><span class="token comment"># 2. 以新的目标 clean 测试执行</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># make clean</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如此一来，makefile 里就具有至少两个目标，可以单独执行，也可以如下一起组合执行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># make clean main</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> main.o main.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> haha.o haha.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> sin_value.o sin_value.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> cos_value.o cos_value.c</span>
<span class="line">gcc <span class="token parameter variable">-o</span> main main.o haha.o sin_value.o cos_value.o <span class="token parameter variable">-lm</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个时候，你会发现 makefile 中的重复数据很多，可以通过变量来重构</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim makefile </span></span>
<span class="line">LIBS <span class="token operator">=</span> <span class="token parameter variable">-lm</span></span>
<span class="line">OBJS <span class="token operator">=</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line">main: <span class="token variable">${OBJS}</span></span>
<span class="line">        gcc <span class="token parameter variable">-o</span> main <span class="token variable">${OBJS}</span> <span class="token variable">${LIBS}</span></span>
<span class="line">clean:</span>
<span class="line">        <span class="token function">rm</span> <span class="token parameter variable">-rf</span> main <span class="token variable">${OBJS}</span></span>
<span class="line"><span class="token comment"># 一定要注意这个 tab 键的语法，不能使用空格替代的！</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与 bash shell script 的语法有点不太相同，变量的基本语法为：</p>
<ol>
<li>变量与变量内容以 <code v-pre>=</code> 隔开，同时两边可以有空格</li>
<li>变量左边不可以有 <code v-pre>&lt;tab&gt;</code></li>
<li>变量与变量内容在 <code v-pre>=</code> 两边不能有 <code v-pre>:</code></li>
<li>在习惯上，变量最好以大写字母为主</li>
<li>使用变量时，以 <code v-pre>${变量}、$(变量)</code>使用</li>
<li>在该 shell 的环境变量是可以被套用的，例如提到的 CFLAGS 这个变量</li>
<li>在指令列模式也可以给予变量</li>
</ol>
<p>由于 gcc 在编译的行为时，会主动读取 CFLAGS 这个环境变量，所以可以直接在 shell 定义出这个环境变量</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">CFLAGS</span><span class="token operator">=</span><span class="token string">"-Wall"</span> <span class="token function">make</span> clean main</span>
<span class="line"><span class="token comment"># 在 make 进行编译时，会读取 CFLAGS 的变量内容</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还可以在 makefile 中定义这个变量</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果在指令列和 makefile 中都设置了 CFLAGS 变量，而且内容不同，那么哪一个会生效？</p>
<ol>
<li>make 指令列后加上的环境变量为优先</li>
<li>makefile 里面指定的环境变量第 2</li>
<li>shell 原本具有的环境变量第 3</li>
</ol>
<p>此外：<code v-pre>$@</code> 这个特殊的变量，表示目前的目标（target），因此可以修改 makefile 为</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim makefile </span></span>
<span class="line">LIBS <span class="token operator">=</span> <span class="token parameter variable">-lm</span></span>
<span class="line">OBJS <span class="token operator">=</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line">main: <span class="token variable">${OBJS}</span></span>
<span class="line">        gcc <span class="token parameter variable">-o</span> <span class="token variable">$@</span> <span class="token variable">${OBJS}</span> <span class="token variable">${LIBS}</span>		</span>
<span class="line">        <span class="token comment"># 这里的 $@ 就表示是 main 这个字符</span></span>
<span class="line">clean:</span>
<span class="line">        <span class="token function">rm</span> <span class="token parameter variable">-rf</span> main <span class="token variable">${OBJS}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


