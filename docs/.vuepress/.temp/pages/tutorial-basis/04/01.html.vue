<template><div><h1 id="文本模式下指令的下达" tabindex="-1"><a class="header-anchor" href="#文本模式下指令的下达"><span>文本模式下指令的下达</span></a></h1>
<p>文本模式登陆后取得的程序被称为壳（shell），linx 的壳程序就是厉害的 bash 这一支！关于 bash 后续会介绍</p>
<h2 id="开始下达指令" tabindex="-1"><a class="header-anchor" href="#开始下达指令"><span>开始下达指令</span></a></h2>
<p>下面是几个重要概念</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">$ <span class="token builtin class-name">command</span> <span class="token punctuation">[</span>-options<span class="token punctuation">]</span> parameter1 parameter2</span>
<span class="line">  指令      选项        参数1       参数2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>command：指令（command）或 可执行文件（如批次脚本 script）</p>
</li>
<li>
<p>command：是指令名称，例如变换工作目录的指令是 cd 等</p>
</li>
<li>
<p>中括号是可选配置参数</p>
<ul>
<li><code v-pre>-</code> 一个短横线，如 -h，这是选项的简写</li>
<li><code v-pre>--</code> 两个短横线，是选项的完整名称，如 --help</li>
</ul>
</li>
<li>
<p>指令、选项、参数等中间以空格来区分，不论空几格 shell 都视为一格，所以空格是很重要的特殊字符</p>
</li>
<li>
<p>按下 enter 按键后，就代表一行指令的开始启动</p>
</li>
<li>
<p>指令太长的时候，可以使用反斜杠 <code v-pre>\</code> 来跳脱 enter 按键，使指令连续到下一行</p>
</li>
<li>
<p>严格区分英文大小写</p>
</li>
</ul>
<p>其他的介绍，后续 bash 时会详细讲解</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">ls</span> <span class="token parameter variable">-al</span> ~</span>
<span class="line"><span class="token function">ls</span>     <span class="token parameter variable">-al</span>  ~</span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-a</span>   <span class="token parameter variable">-l</span> ~</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上三条命令都是一样的结果，看明白规则了没</p>
<h3 id="语系的支持" tabindex="-1"><a class="header-anchor" href="#语系的支持"><span>语系的支持</span></a></h3>
<p>很多时候，可能会发现，输入指令之后，显示的结果是乱码，是因为 linux 可以支持多国语系，
终端机在默认情况下，无法支持以中文编码输出数据的，可以更改为英文。</p>
<p>可以这样做：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line"># 查看目前支持的语系</span>
<span class="line">[mrcode@study ~]$ locale</span>
<span class="line"># 如果是中文的话，则是 LANG=zh_CN.UTF-8</span>
<span class="line">LANG=en_US.UTF-8</span>
<span class="line">LC_CTYPE="en_US.UTF-8"</span>
<span class="line">LC_NUMERIC="en_US.UTF-8"</span>
<span class="line">LC_TIME="en_US.UTF-8"</span>
<span class="line">LC_COLLATE="en_US.UTF-8"</span>
<span class="line">LC_MONETARY="en_US.UTF-8"</span>
<span class="line">LC_MESSAGES="en_US.UTF-8"</span>
<span class="line">LC_PAPER="en_US.UTF-8"</span>
<span class="line">LC_NAME="en_US.UTF-8"</span>
<span class="line">LC_ADDRESS="en_US.UTF-8"</span>
<span class="line">LC_TELEPHONE="en_US.UTF-8"</span>
<span class="line">LC_MEASUREMENT="en_US.UTF-8"</span>
<span class="line">LC_IDENTIFICATION="en_US.UTF-8"</span>
<span class="line">LC_ALL=</span>
<span class="line"></span>
<span class="line"># LANG 的语系为 en_US.UTF-8，这已经是英文环境下的编码了</span>
<span class="line"># 但是可以通过以下的方式临时来修改语系</span>
<span class="line"></span>
<span class="line"># LANG 只与输出信息有关</span>
<span class="line">[mrcode@study ~]$ LANG=en_US.utf8</span>
<span class="line"># lc_all 则表示所有的都使用该语系</span>
<span class="line">[mrcode@study ~]$ export LC_ALL=en_US.utf8</span>
<span class="line"></span>
<span class="line"># 记得，上面的操作方式是临时的，注销 linux 后，就不生效了，后续会讲解这个</span>
<span class="line"></span>
<span class="line"># 可以修改 `/etc.local.conf` 来达到持久化改变</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基础指令的操作" tabindex="-1"><a class="header-anchor" href="#基础指令的操作"><span>基础指令的操作</span></a></h2>
<ul>
<li>date：显示日期与时间</li>
<li>cal：显示日历</li>
<li>bc：简单好用的计算器</li>
</ul>
<h3 id="date" tabindex="-1"><a class="header-anchor" href="#date"><span>date</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">date</span></span>
<span class="line">Fri Oct  <span class="token number">4</span> <span class="token number">23</span>:41:16 CST <span class="token number">2019</span></span>
<span class="line"><span class="token comment"># 格式化输出</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">date</span> +%Y/%m/%d</span>
<span class="line"><span class="token number">2019</span>/10/04</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">date</span> +%H:%M</span>
<span class="line"><span class="token number">23</span>:41</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前面说到指令后面带选项一般是带 - 号，但是某些特殊情况下是带 + 号，
对于这里的格式化参数占位符，不用死记硬背，后面会告诉你</p>
<h3 id="cal-calendar-显示日历" tabindex="-1"><a class="header-anchor" href="#cal-calendar-显示日历"><span>cal（calendar） 显示日历</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 显示当前月</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cal</span></span>
<span class="line">    October <span class="token number">2019</span>    </span>
<span class="line">Su Mo Tu We Th Fr Sa</span>
<span class="line">       <span class="token number">1</span>  <span class="token number">2</span>  <span class="token number">3</span>  <span class="token number">4</span>  <span class="token number">5</span></span>
<span class="line"> <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span> <span class="token number">10</span> <span class="token number">11</span> <span class="token number">12</span></span>
<span class="line"><span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span> <span class="token number">17</span> <span class="token number">18</span> <span class="token number">19</span></span>
<span class="line"><span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span> <span class="token number">24</span> <span class="token number">25</span> <span class="token number">26</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示整年，这里只贴出部分</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cal</span> <span class="token number">2019</span></span>
<span class="line">                               <span class="token number">2019</span>                               </span>
<span class="line"></span>
<span class="line">       January               February                 March       </span>
<span class="line">Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa</span>
<span class="line">       <span class="token number">1</span>  <span class="token number">2</span>  <span class="token number">3</span>  <span class="token number">4</span>  <span class="token number">5</span>                   <span class="token number">1</span>  <span class="token number">2</span>                   <span class="token number">1</span>  <span class="token number">2</span></span>
<span class="line"> <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span> <span class="token number">10</span> <span class="token number">11</span> <span class="token number">12</span>    <span class="token number">3</span>  <span class="token number">4</span>  <span class="token number">5</span>  <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span>    <span class="token number">3</span>  <span class="token number">4</span>  <span class="token number">5</span>  <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span></span>
<span class="line"><span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span> <span class="token number">17</span> <span class="token number">18</span> <span class="token number">19</span>   <span class="token number">10</span> <span class="token number">11</span> <span class="token number">12</span> <span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span>   <span class="token number">10</span> <span class="token number">11</span> <span class="token number">12</span> <span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span></span>
<span class="line"><span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span> <span class="token number">24</span> <span class="token number">25</span> <span class="token number">26</span>   <span class="token number">17</span> <span class="token number">18</span> <span class="token number">19</span> <span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span>   <span class="token number">17</span> <span class="token number">18</span> <span class="token number">19</span> <span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span></span>
<span class="line"><span class="token number">27</span> <span class="token number">28</span> <span class="token number">29</span> <span class="token number">30</span> <span class="token number">31</span>         <span class="token number">24</span> <span class="token number">25</span> <span class="token number">26</span> <span class="token number">27</span> <span class="token number">28</span>         <span class="token number">24</span> <span class="token number">25</span> <span class="token number">26</span> <span class="token number">27</span> <span class="token number">28</span> <span class="token number">29</span> <span class="token number">30</span></span>
<span class="line">                                              <span class="token number">31</span></span>
<span class="line">        April                   May                   June        </span>
<span class="line">Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa</span>
<span class="line">    <span class="token number">1</span>  <span class="token number">2</span>  <span class="token number">3</span>  <span class="token number">4</span>  <span class="token number">5</span>  <span class="token number">6</span>             <span class="token number">1</span>  <span class="token number">2</span>  <span class="token number">3</span>  <span class="token number">4</span>                      <span class="token number">1</span></span>
<span class="line"> <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span> <span class="token number">10</span> <span class="token number">11</span> <span class="token number">12</span> <span class="token number">13</span>    <span class="token number">5</span>  <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span> <span class="token number">10</span> <span class="token number">11</span>    <span class="token number">2</span>  <span class="token number">3</span>  <span class="token number">4</span>  <span class="token number">5</span>  <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span></span>
<span class="line"><span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span> <span class="token number">17</span> <span class="token number">18</span> <span class="token number">19</span> <span class="token number">20</span>   <span class="token number">12</span> <span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span> <span class="token number">17</span> <span class="token number">18</span>    <span class="token number">9</span> <span class="token number">10</span> <span class="token number">11</span> <span class="token number">12</span> <span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span></span>
<span class="line"><span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span> <span class="token number">24</span> <span class="token number">25</span> <span class="token number">26</span> <span class="token number">27</span>   <span class="token number">19</span> <span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span> <span class="token number">24</span> <span class="token number">25</span>   <span class="token number">16</span> <span class="token number">17</span> <span class="token number">18</span> <span class="token number">19</span> <span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span></span>
<span class="line"><span class="token number">28</span> <span class="token number">29</span> <span class="token number">30</span>               <span class="token number">26</span> <span class="token number">27</span> <span class="token number">28</span> <span class="token number">29</span> <span class="token number">30</span> <span class="token number">31</span>      <span class="token number">23</span> <span class="token number">24</span> <span class="token number">25</span> <span class="token number">26</span> <span class="token number">27</span> <span class="token number">28</span> <span class="token number">29</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>语法为</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">cal</span> <span class="token punctuation">[</span>month<span class="token punctuation">]</span> <span class="token punctuation">[</span>year<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如 2015 年 10 月</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">cal</span> <span class="token number">10</span> <span class="token number">2015</span></span>
<span class="line">    October <span class="token number">2015</span>    </span>
<span class="line">Su Mo Tu We Th Fr Sa</span>
<span class="line">             <span class="token number">1</span>  <span class="token number">2</span>  <span class="token number">3</span></span>
<span class="line"> <span class="token number">4</span>  <span class="token number">5</span>  <span class="token number">6</span>  <span class="token number">7</span>  <span class="token number">8</span>  <span class="token number">9</span> <span class="token number">10</span></span>
<span class="line"><span class="token number">11</span> <span class="token number">12</span> <span class="token number">13</span> <span class="token number">14</span> <span class="token number">15</span> <span class="token number">16</span> <span class="token number">17</span></span>
<span class="line"><span class="token number">18</span> <span class="token number">19</span> <span class="token number">20</span> <span class="token number">21</span> <span class="token number">22</span> <span class="token number">23</span> <span class="token number">24</span></span>
<span class="line"><span class="token number">25</span> <span class="token number">26</span> <span class="token number">27</span> <span class="token number">28</span> <span class="token number">29</span> <span class="token number">30</span> <span class="token number">31</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="bc-计算器" tabindex="-1"><a class="header-anchor" href="#bc-计算器"><span>bc 计算器</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line"># 进入 bc，会显示当前版本等信息</span>
<span class="line">[mrcode@study ~]$ bc</span>
<span class="line">bc 1.06.95</span>
<span class="line">Copyright 1991-1994, 1997, 1998, 2000, 2004, 2006 Free Software Foundation, Inc.</span>
<span class="line">This is free software with ABSOLUTELY NO WARRANTY.</span>
<span class="line">For details type `warranty'.</span>
<span class="line"></span>
<span class="line"># 下面就可以输入你要计算的公式，按回车显示结果</span>
<span class="line"></span>
<span class="line">1+2+3+4</span>
<span class="line">10</span>
<span class="line">7-8+3</span>
<span class="line">2</span>
<span class="line">10*52</span>
<span class="line">520</span>
<span class="line">10^2</span>
<span class="line">100</span>
<span class="line">10/100</span>
<span class="line">0</span>
<span class="line">10*2-1</span>
<span class="line">19</span>
<span class="line"></span>
<span class="line"># 离开</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面计算发现了一个问题， 10 / 100 = 0，应该有小数才对，设置小数的语法如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 在 bc 环境中，使用 scale = 数值</span></span>
<span class="line"><span class="token comment"># 后面数值表示你需要几位小数</span></span>
<span class="line"><span class="token assign-left variable">scale</span><span class="token operator">=</span><span class="token number">3</span></span>
<span class="line"><span class="token number">10</span>/100</span>
<span class="line">.100</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重要的几个热键-tab、ctrl-c、ctrl-d" tabindex="-1"><a class="header-anchor" href="#重要的几个热键-tab、ctrl-c、ctrl-d"><span>重要的几个热键 <code v-pre>tab、ctrl+c、ctrl+d</code></span></a></h2>
<p>在 shell 中有很多的功能组合键，下面是一些重要的几个</p>
<h3 id="tab" tabindex="-1"><a class="header-anchor" href="#tab"><span>tab</span></a></h3>
<p>tab 算术 Linux 的 Bash shell 最棒的功能之一了，具有 <strong>命令补全</strong>、<strong>文件补齐</strong> 的功能，
但是在不同的地方输入有不一样的结果</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">[mrcode@study ~]$ ca   # 连续按两下 tab tab</span>
<span class="line"># 出来了所有以 ca 开头的指令都出来了</span>
<span class="line">cacertdir_rehash     cache_writeback      canberra-boot        case</span>
<span class="line">cache_check          cairo-sphinx         canberra-gtk-play    cat</span>
<span class="line">cache_dump           cal                  cancel               catchsegv</span>
<span class="line">cache_metadata_size  ca-legacy            cancel.cups          catman</span>
<span class="line">cache_repair         calibrate_ppa        capsh                </span>
<span class="line">cache_restore        caller               captoinfo      </span>
<span class="line"></span>
<span class="line"># 文件补齐      </span>
<span class="line">[mrcode@study ~]$ ls -al ~/.bash</span>
<span class="line">.bash_history  .bash_logout   .bash_profile  .bashrc</span>
<span class="line"></span>
<span class="line"># 指令参数补齐       </span>
<span class="line">[mrcode@study ~]$ date --</span>
<span class="line">--date        --help        --reference=  --rfc-3339=   --universal   </span>
<span class="line">--date=       --iso-8601    --rfc-2822    --set=        --version  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>命令补全：</li>
<li>文件补齐：</li>
<li>选项/参数补齐：若安装了 bash-completion 在某些指令后面使用，可参数补全</li>
</ul>
<p>命令和文件笔者没有分清楚到底在什么情况下是什么，书上说了，
由于 CentOS 7 多了 bash-completion，就是有点分不清</p>
<h3 id="ctrl-c" tabindex="-1"><a class="header-anchor" href="#ctrl-c"><span>ctrl + c</span></a></h3>
<p>中断指令的，比如输错了指令，或则这个领了 <code v-pre>find /</code>，会刷屏好一会，这个时候就可以终端它</p>
<h3 id="ctrl-d" tabindex="-1"><a class="header-anchor" href="#ctrl-d"><span>ctrl + d</span></a></h3>
<p>通常代表键盘输入结束（end of file 或 end of Input）。</p>
<p>另外也可以用来取代 exit 的输入，例如在文字界面使用 ctrl + d 就能够直接离开了（相当于 exit）</p>
<h3 id="shift-page-up-page-down" tabindex="-1"><a class="header-anchor" href="#shift-page-up-page-down"><span>shift + Page UP/Page Down</span></a></h3>
<p>翻页功能，在文本界面执行某些指令时，输出的信息很长，导致前面的部分已不再当前屏幕中了，
就可以使用该按键来前后翻页</p>
<h2 id="错误信息查看" tabindex="-1"><a class="header-anchor" href="#错误信息查看"><span>错误信息查看</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ DATE    <span class="token comment"># 故意输错了指令</span></span>
<span class="line">bash: DATE: <span class="token builtin class-name">command</span> not found<span class="token punctuation">..</span>.  <span class="token comment"># 显示错误信息，后续会详细讲解</span></span>
<span class="line">Similar <span class="token builtin class-name">command</span> is: <span class="token string">'date'</span> <span class="token comment"># 给了你一个可能的解决方案</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


