<template><div><h1 id="简单的-shell-script-练习" tabindex="-1"><a class="header-anchor" href="#简单的-shell-script-练习"><span>简单的 Shell Script 练习</span></a></h1>
<p>本章 范例中，实现的方式很多，建议先自行编写，再参考例子，才能加深概念</p>
<h2 id="简单范例" tabindex="-1"><a class="header-anchor" href="#简单范例"><span>简单范例</span></a></h2>
<p>本小节范例在很多脚本程序中都会用到，而且简单</p>
<h3 id="对谈式脚本-变量类容由用户决定" tabindex="-1"><a class="header-anchor" href="#对谈式脚本-变量类容由用户决定"><span>对谈式脚本：变量类容由用户决定</span></a></h3>
<p>在很多场景中，需要用户输入一些内容，让程序可以顺利运行。比如，安装软件时，让用户选择安装目录；</p>
<p><a href="../10/02.mdl#read">BASH 中的变量读取指令 read</a> ，那么以 read 指令的用途实现：</p>
<ol>
<li>用户输入 first name</li>
<li>用户输入 last name</li>
<li>最后在屏幕上显示：You full name is：xxx</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token function">vim</span> read.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'first name: '</span> firstName</span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'last name: '</span> lastName</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"You full name: <span class="token variable">${firstName}</span><span class="token variable">${lastName}</span>"</span></span>
<span class="line"><span class="token builtin class-name">exit</span> <span class="token number">0</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 增加执行权限</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token function">chmod</span> a+x read.sh</span>
<span class="line"><span class="token comment"># 执行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ./read.sh </span>
<span class="line">first name: zhu</span>
<span class="line">last name: mrcode</span>
<span class="line">You full name: zhumrcode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是书上的程序</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vim</span> showname.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># Program：</span></span>
<span class="line"><span class="token comment">#	用户输入姓名，程序显示出输入的姓名</span></span>
<span class="line"><span class="token comment"># History：</span></span>
<span class="line"><span class="token comment">#	2020/01/19	mrcode	first release</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token environment constant">PATH</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">"Please input you first name: "</span> firstname		<span class="token comment"># 提示使用者输入</span></span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">"Please input you last name: "</span> lastname			<span class="token comment"># 提示使用者输入</span></span>
<span class="line"><span class="token comment"># -e 开启反斜杠转移的特殊字符显示，比如下面的 \n 换行显示</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> “<span class="token punctuation">\</span>n Your full name is: <span class="token variable">${firstname}</span><span class="token variable">${lastname}</span>”	<span class="token comment"># 结果由屏幕输出	</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 执行结果</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ./showname.sh </span>
<span class="line">Please input you first name: zhu</span>
<span class="line">Please input you last name: mrcode</span>
<span class="line"></span>
<span class="line"> Your full name is: zhumrcode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>笔者小结：可以看到上面这个脚本，增加了一个良好的习惯，就是脚本说明等信息</p>
<h3 id="随日期变化-利用-date-进行文件的建立" tabindex="-1"><a class="header-anchor" href="#随日期变化-利用-date-进行文件的建立"><span>随日期变化：利用 date 进行文件的建立</span></a></h3>
<p>考虑一个场景，每天备份 MySql 的数据文件，备份文件名以当天日期命名，如 <code v-pre>backup.2020-01-19.data</code>.</p>
<p>重点是 <code v-pre>2020-01-19</code> 是怎么来的？范例需求如下：</p>
<ol>
<li>用户输入一个文件名前缀</li>
<li>创建出以日期为名的三个空文件（通过 touch 指令），生成 前天、昨天、今天 日期，及格式为：filename_2020-01-19</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vim</span> create_3_filename.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># Program: </span></span>
<span class="line"><span class="token comment">#       用户输入文件名前缀，生成前天、昨天、今天的三个空文件</span></span>
<span class="line"><span class="token comment"># History：</span></span>
<span class="line"><span class="token comment">#       2020/01/19      mrcode          first release</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token environment constant">PATH</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">"将使用 ‘touch’ 命令创建 3 个文件"</span></span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">"请输入文件名："</span> fileuser</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 容错，使用变量功能判定与赋值默认值</span></span>
<span class="line"><span class="token assign-left variable">filename</span><span class="token operator">=</span><span class="token variable">${fileuser<span class="token operator">:-</span>"filename"}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># date 命令的使用</span></span>
<span class="line"><span class="token assign-left variable">date1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token parameter variable">--date</span><span class="token operator">=</span><span class="token string">'2 days ago'</span> +%Y-%m-%d<span class="token variable">)</span></span>		<span class="token comment"># 两天前的日期，并格式化显示</span></span>
<span class="line"><span class="token assign-left variable">date2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token parameter variable">--date</span><span class="token operator">=</span><span class="token string">'1 days ago'</span> +%Y-%m-%d<span class="token variable">)</span></span>	</span>
<span class="line"><span class="token assign-left variable">date3</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y-%m-%d<span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">file1</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${filename}</span>_<span class="token variable">${date1}</span>"</span></span>
<span class="line"><span class="token assign-left variable">file2</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${filename}</span>_<span class="token variable">${date2}</span>"</span></span>
<span class="line"><span class="token assign-left variable">file3</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${filename}</span>_<span class="token variable">${date3}</span>"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在这里其实可以直接拼接文件名</span></span>
<span class="line"><span class="token function">touch</span> <span class="token string">"<span class="token variable">${file1}</span>"</span></span>
<span class="line"><span class="token function">touch</span> <span class="token string">"<span class="token variable">${file2}</span>"</span></span>
<span class="line"><span class="token function">touch</span> <span class="token string">"<span class="token variable">${file3}</span>"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里使用了变量的赋值相关功能，详参考：<RouteLink to="/tutorial-basis/10/02.html#%E5%8F%98%E9%87%8F%E7%9A%84%E6%B5%8B%E8%AF%95%E4%B8%8E%E5%86%85%E5%AE%B9%E6%9B%BF%E6%8D%A2">变量功能</RouteLink></p>
<p>运行测试</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ./create_3_filename.sh </span>
<span class="line">将使用 ‘touch’ 命令创建 <span class="token number">3</span> 个文件</span>
<span class="line">请输入文件名：mrcode</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ll</span>
<span class="line">总用量 <span class="token number">16</span></span>
<span class="line">-rwxrwxr-x. <span class="token number">1</span> mrcode mrcode <span class="token number">677</span> <span class="token number">1</span>月  <span class="token number">19</span> <span class="token number">14</span>:15 create_3_filename.sh</span>
<span class="line">-rwxrwxr-x. <span class="token number">1</span> mrcode mrcode <span class="token number">239</span> <span class="token number">1</span>月  <span class="token number">19</span> <span class="token number">11</span>:25 hello.sh</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode   <span class="token number">0</span> <span class="token number">1</span>月  <span class="token number">19</span> <span class="token number">14</span>:15 mrcode_2020-01-17</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode   <span class="token number">0</span> <span class="token number">1</span>月  <span class="token number">19</span> <span class="token number">14</span>:15 mrcode_2020-01-18</span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> mrcode mrcode   <span class="token number">0</span> <span class="token number">1</span>月  <span class="token number">19</span> <span class="token number">14</span>:15 mrcode_2020-01-19</span>
<span class="line"><span class="token comment"># 一次正常输入文件名，一次直接按 enter 按键完成输入，查看是否达到默认赋值等功能</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数值运算-简单的加减乘除" tabindex="-1"><a class="header-anchor" href="#数值运算-简单的加减乘除"><span>数值运算：简单的加减乘除</span></a></h3>
<p>在变量功能课程中讲解到，需要使用 <RouteLink to="/tutorial-basis/10/02.html#declare-%E3%80%81-typeset">declare</RouteLink> 来定义变量为正数才能进行计算，此外，也可以利用 <code v-pre>$((计算表达式))</code> 来进行数值运算，可惜的是，bashe shell 预设仅支持整数数据。</p>
<p>范例需求：</p>
<ol>
<li>要求用户输入两个变量</li>
<li>将两个变量相乘后输出到屏幕</li>
</ol>
<p>下面是笔者自己写的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># Program:</span></span>
<span class="line"><span class="token comment">#       用户输入 2 个整数；输出相乘后的结果</span></span>
<span class="line"><span class="token comment"># History：</span></span>
<span class="line"><span class="token comment">#       2020/01/19      mrcode          first release</span></span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'请输入第一个整数：'</span> intUser1</span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'请输入第二个整数：'</span> intUser2</span>
<span class="line"><span class="token builtin class-name">declare</span> <span class="token parameter variable">-i</span> <span class="token assign-left variable">int1</span><span class="token operator">=</span><span class="token variable">${intUser1}</span></span>
<span class="line"><span class="token builtin class-name">declare</span> <span class="token parameter variable">-i</span> <span class="token assign-left variable">int2</span><span class="token operator">=</span><span class="token variable">${intUser2}</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span>  <span class="token string">"<span class="token entity" title="\n">\n</span> <span class="token variable">${int1}</span> x <span class="token variable">${int2}</span> = <span class="token variable"><span class="token variable">$((</span>int1<span class="token operator">*</span>int2<span class="token variable">))</span></span>"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试输出</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ./multiplying.sh </span>
<span class="line">请输入第一个整数：2</span>
<span class="line">请输入第二个整数：3</span>
<span class="line"></span>
<span class="line"> <span class="token number">2</span> x <span class="token number">3</span> <span class="token operator">=</span> <span class="token number">6</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实用下面这样的方式来定义和输出</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'请输入第一个整数：'</span> intUser1</span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'请输入第二个整数：'</span> intUser2</span>
<span class="line"><span class="token assign-left variable">total</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$((</span>${intUser1}<span class="token operator">*</span>${intUser2}<span class="token variable">))</span></span>		<span class="token comment"># 使用 $((运算内容)) 方式计算</span></span>
<span class="line"><span class="token comment"># declare -i total=${intUser1}*${intUser2}		# 还可以使用此种方式</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span>  <span class="token string">"<span class="token entity" title="\n">\n</span> <span class="token variable">${intUser1}</span> x <span class="token variable">${intUser2}</span> = <span class="token variable">${total}</span>"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>建议用 <code v-pre>var = $((计算内容))</code> 方式来计算，此种方式简单。比如</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 取余数</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">$((</span><span class="token number">3</span> <span class="token operator">%</span> <span class="token number">2</span><span class="token variable">))</span></span></span>
<span class="line"><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 对于小数，可以使用 bc 指令来协助</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">$((</span><span class="token number">3</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token variable">))</span></span><span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token string">"3/2"</span> <span class="token operator">|</span> <span class="token function">bc</span> <span class="token parameter variable">-l</span></span>
<span class="line"><span class="token number">1</span></span>
<span class="line"><span class="token number">1.50000000000000000000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数值运算-通过-bc-计算-pi" tabindex="-1"><a class="header-anchor" href="#数值运算-通过-bc-计算-pi"><span>数值运算：通过 bc 计算 pi</span></a></h3>
<p>bc 提供了一个计算 pi 的公式： <code v-pre>pi=$(echo &quot;scale=10; 4*a(1)&quot; | bc -l)</code>，此计算公式可以通过 <code v-pre>man bc | grep 'pi'</code> 定位到相关文档。这里的 scale 是计算 pi 的精度，越高则利用到的 cpu 资源越多，计算时间越长。</p>
<p>好了，了解到怎么启用 pi 计算，这里要求用户输入 scale 进行计算 pi 值，并输出显示</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vim</span> cal_pi.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># Program：</span></span>
<span class="line"><span class="token comment">#	用户输入 scale 的值，程序计算出 scale 精度的 pi 值，并显示</span></span>
<span class="line"><span class="token comment"># History：</span></span>
<span class="line"><span class="token comment">#	2020/01/19		mrcode		first release</span></span>
<span class="line"><span class="token comment"># PATH 常规赋值</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token environment constant">PATH</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">read</span> <span class="token parameter variable">-p</span> <span class="token string">'请输入 scale 的值（10~10000）？'</span> checking</span>
<span class="line"><span class="token assign-left variable">num</span><span class="token operator">=</span><span class="token variable">${checking<span class="token operator">:-</span>"10"}</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">'\n开始计算 pi 的值'</span></span>
<span class="line"><span class="token function">time</span> <span class="token builtin class-name">echo</span> <span class="token string">"scale=<span class="token variable">${num}</span>; 4*a(1)"</span> <span class="token operator">|</span> <span class="token function">bc</span> <span class="token parameter variable">-l</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试输出</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ./cal_pi.sh </span>
<span class="line">请输入 scale 的值（10~10000）？20</span>
<span class="line"></span>
<span class="line">开始计算 pi 的值</span>
<span class="line"><span class="token number">3.14159265358979323844</span></span>
<span class="line"></span>
<span class="line">real	0m0.002s</span>
<span class="line">user	0m0.000s</span>
<span class="line">sys	0m0.001s</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="script-的执行方式差异-source、sh-script、-script" tabindex="-1"><a class="header-anchor" href="#script-的执行方式差异-source、sh-script、-script"><span>script 的执行方式差异（source、sh script、./script）</span></a></h2>
<p>不同的方式执行执行会造成不一样的结果，尤其影响 bash 的环境很大。</p>
<h3 id="利用直接执行的方式来执行-script-在子程序中执行" tabindex="-1"><a class="header-anchor" href="#利用直接执行的方式来执行-script-在子程序中执行"><span>利用直接执行的方式来执行 script：在子程序中执行</span></a></h3>
<p><RouteLink to="/tutorial-basis/12/01.html#%E7%AC%AC%E4%B8%80%E6%94%AF-script-%E7%9A%84%E7%BC%96%E5%86%99%E4%B8%8E%E6%89%A7%E8%A1%8C">直接指令下达</RouteLink> 或者是利用 bash（sh）来运行脚本时，都会使用一个新的 bash 环境来执行脚本的指令。也就是说这种方式执行是在子程序的 bash 内执行的。在第十章 BASH 内谈到 <RouteLink to="/tutorial-basis/10/02.html"><code v-pre>export</code> 自定义变量转成环境变量</RouteLink> 的功能时，重点在于：当子程序完成后，子程序内的各项变量或动作将会结束儿不会传回到父程序中。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 运行上面范例的姓名打印</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ ./showname.sh </span>
<span class="line">Please input you first name: m</span>
<span class="line">Please input you last name: q</span>
<span class="line"></span>
<span class="line"> Your full name is: mq		<span class="token comment">#  echo -e "\n Your full name is: ${firstname}${lastname}" 打印出来了信息</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token variable">${fristname}</span><span class="token variable">${lastname}</span>		<span class="token comment"># 但是在父程序中却没有信息</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="利用-source-来执行脚本-在父程序中执行" tabindex="-1"><a class="header-anchor" href="#利用-source-来执行脚本-在父程序中执行"><span>利用 source 来执行脚本：在父程序中执行</span></a></h3>
<p>同样的测试代码，使用 source 就不一样了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token builtin class-name">source</span> showname.sh </span>
<span class="line">Please input you first name: m</span>
<span class="line">Please input you last name: q</span>
<span class="line"></span>
<span class="line"> Your full name is: mq</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study bin<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token variable">${firstname}</span><span class="token variable">${lastname}</span></span>
<span class="line">mq			<span class="token comment"># 在父程序中还能获取到</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


