<template><div><h1 id="tarball-的管理与建议" tabindex="-1"><a class="header-anchor" href="#tarball-的管理与建议"><span>Tarball 的管理与建议</span></a></h1>
<p>那么接下来我们要知道如何使用具有源码的 Tarball 来建立一个属于自己的软件</p>
<p>Tarball 的安装是可以跨平台的，只是需要的编译程序可能并不相同，例如 Linux 上用 gcc，而 windows 上也有相关的 c 编译程序。</p>
<p>如果万一没有编译成功，可以通过修改小部分的程序代码（通常是因为很小部分的不同）就可以跨平台的移植了</p>
<h2 id="使用源码管理软件所需要的基础软件" tabindex="-1"><a class="header-anchor" href="#使用源码管理软件所需要的基础软件"><span>使用源码管理软件所需要的基础软件</span></a></h2>
<p>从源码制作一个 binary program 需要很多软件的支持，包括以下基础的软件：</p>
<ul>
<li>
<p>gcc 或 cc 等 c 语言编译程序（compiler）</p>
<p>编译程序也有很多，其中以 GNU 的 gcc 是首选的自由软件编译程序，在 Linux 平台上面发展的软件的源码，原本就是以 gcc 为底来设计的</p>
</li>
<li>
<p>需要 Kernel 提供的 Library 以及相关的 Include 文件</p>
<p>从前面的源码编译过程，我们知道函数库 library 的重要性，和 include 文件的存在。</p>
<p>很多软件在发展的时候都是直接取用系统核心提供的函数库与 include 文件，尤其是在驱动程序方面的模块，例如网卡、声卡、USB 等驱动程序在安装的时候，常常需要核心提供相关的信息。</p>
<p>在 Red Hat 系统中（包含 Fedora、CentOS 等系列），这个核心相关的功能通常都是被包含在 kernel-source 或 kernel-header 这些软件名称中，所以记得安装这些软件</p>
</li>
</ul>
<p>一般来说 Tarball 的安装比较简单，只要顺着开发商提供的 README 与 INSTALL 文件的说明步骤来安装，基本上是很容易的，但是在论坛上还会发现很多人问提示 「没有 gcc 程序」、「无法使用 make」等问题，这些基本上都是以上基础软件没有安装的原因</p>
<p>目前的 Linux distribution 大多已经偏向与桌面计算机的使用（非服务器），所以默认不会安装这些偏向开发的软件，如果你希望未来可以安装一些以 Tarball 方式的软件时，请自行挑选想要安装的软件名称。例如在 CentOS 或死 Red Hat 中，需要选中 Development Tools 以及 Kernel Source Development 等相关字眼的软件群</p>
<p>如果你在安装 Linux 时，没有选择这些软件随机安装，也就是没有 make、gcc 等这些东西，那么可以使用 RPM （下章节讲解）的方式来安装软件，所以只要拿出当初安装 Linux 时的原本光盘，然后以 RPM 来一个一个安装到你的 Linux 主机里面，尤其是现在有 yum ，在线安装更方便了</p>
<p>在 CentOS 中，如果你已经联网的话，那么可以使用下一章会介绍到的 yum，通过 yum 的软件群组安装工功能，可以如下做：</p>
<ul>
<li>安装 gcc 等软件开放工具：<code v-pre>yum groupinstall &quot;Development Tools&quot;</code></li>
<li>若待安装的软件需要图形接口支持，一般还需要：<code v-pre>yum groupinstall &quot;X Software Development&quot;</code></li>
<li>若安装的软件较旧，可能需要：<code v-pre>yum groupinstall &quot;Legacy Software Development&quot;</code></li>
</ul>
<p>详细信息请参考后续章节</p>
<h2 id="tarball-安装的基本步骤" tabindex="-1"><a class="header-anchor" href="#tarball-安装的基本步骤"><span>Tarball 安装的基本步骤</span></a></h2>
<p>步骤如下：</p>
<ol>
<li>取得源码文件：将 tarball 文件在 <code v-pre>/usr/local/src</code> 目录下解压</li>
<li>取得步骤流程：进入新建立的目录下，查阅 INSTALL 或 README 等相关文件内容（很重要）</li>
<li>相依属性软件安装：根据 INSTALL/README 的内容查看并安装好一些相依的软件（非必要）</li>
<li>建立 makefile：用自动检测程序（configure 或 config）检测作业环境，并建立 Makefile 文件</li>
<li>编译：以 make 程序并使用该目录下的 Makefile 作为参考配置文件，进行 make 编译或其他的动作</li>
<li>安装：以 make 程序，并以 Makefile 作为参数配置文件，根据 install 这个目标（target）的指定来安装到正确的路径</li>
</ol>
<p>下面简约介绍下大部分的 tarball 软件安装的指令下达方式：</p>
<ol>
<li>
<p><code v-pre>./configure</code></p>
<p>程序开发者提供的一个 scripts 检查程序，并生成 Makefile 文件</p>
</li>
<li>
<p>make clean</p>
<p>会读取 Makefile 中关于 clean 的工作，该步骤不一定会有，但是希望之星下，因为他可以删除目标文件。至少能保证后续编译出来的 *.o 文件使我们自己机器编译出来的</p>
</li>
<li>
<p>make</p>
<p>会根据 Makefile 中预设的工作进行编译行为，主要工作是进行 gcc 来将源码编译为可以被执行的 object files。但是这些 object files 通常还需要一些函数库之类的 link 后，才能产生一个完整的执行文件。使用 make 就是将源码便以为可被执行的文件，该执行文件会放到目前所在的目录下，尚未被安装到预定安装的目录中</p>
</li>
<li>
<p>make install</p>
<p>通常这就是最后的安装步骤了，make 会根据 Makefile 文件里关于 install 的项目，将上一个步骤所编译完成的数据安装到预定的目录中，就安装完成了</p>
</li>
</ol>
<p>以上步骤，只要前一个步骤没有成功，那么后续步骤就无法执行成功的。</p>
<p>如果安装成功，并且是安装在独立的一个目录中，例如 <code v-pre>/usr/local/packages</code> 目录中，那么你必须手动的将整个软件的 man page 给它写入到 <code v-pre>/etc/man_db.conf</code></p>
<h2 id="一般-tarball-软件安装的建议事项-如何移除-升级" tabindex="-1"><a class="header-anchor" href="#一般-tarball-软件安装的建议事项-如何移除-升级"><span>一般 Tarball 软件安装的建议事项（如何移除？升级？）</span></a></h2>
<p>为什么前一个章节，Tarball 要在 <code v-pre>/usr/local/src</code> 下解压呢？基本上，在预设的情况下，原本的 Linux distribution 释出安装的软件大多是在 <code v-pre>/usr</code> 中，而用户自行安装的软件则建议放置 <code v-pre>/usr/local</code> 中。这是考虑到管理用户所安装软件的便利性</p>
<p>几乎所有的软件都提供联机帮助服务，就是 info 与 man 功能。在默认情况下，man 会搜索 <code v-pre>/usr/local/man</code> 中的说明文件，因此如果将软件安装在 <code v-pre>/usr/local</code> 下，那么安装完成后，该软件的说明文件就可以被找到了（笔者疑问：可没有说说明文件说明时候被安装到指定目录的？）</p>
<p>所以，通常建议将自己安装的软件放在 <code v-pre>/usr/local/</code> 下，至于源码（Tarball）则建议放到 <code v-pre>/usr/local/src</code> 下</p>
<p>再来看看 Linux distribution 默认的安装软件的路径会用到哪些？这里以 apache 软件来说明：</p>
<ul>
<li><code v-pre>/etc/httpd</code>：配置文件</li>
<li><code v-pre>/usr/lib</code>：函数库</li>
<li><code v-pre>/usr/bin</code>：执行文件</li>
<li><code v-pre>/usr/share/man</code>：联机帮助文件</li>
</ul>
<p>会发现软件的内容大致上是放在 etc、lib、bin、man 目录中的。那么通过 tarbal 来安装时，如果是放在预设的 <code v-pre>/usr/local</code> 中，由于 <code v-pre>/usr/local</code> 原本默认这几个目录，所以你的数据就会被放在：</p>
<ul>
<li><code v-pre>/usr/local/etc</code></li>
<li><code v-pre>/usr/local/bin</code></li>
<li><code v-pre>/usr/local/lib</code></li>
<li><code v-pre>/usr/local/man</code></li>
</ul>
<p>如果你每个软件都选择在这个默认的路径下安装的话，那么所有的软件文件都将放在这 4 个目录中，那么未来再想要升级或移除的时候，就会比较难以追查文件的来源，而如果在安装的时候选择的是单独目录，例如我将 apache 安装在 <code v-pre>/usr/local/apache</code> 中，那么你的文件目录就会变成</p>
<ul>
<li><code v-pre>/usr/local/apache/etc</code></li>
<li><code v-pre>/usr/local/apache/bin</code></li>
<li><code v-pre>/usr/local/apache/lib</code></li>
<li><code v-pre>/usr/local/apache/man</code></li>
</ul>
<p>这样一来，移除软件就简单多了，只要将该目录移除就可以了。</p>
<p>当然，实际安装的时候，还需要看该软件的 Makefile 里 install 信息才能知道它的安装情况。因为例如 sendmail 的安装就很麻烦</p>
<p>此种方式虽然有利于软件的移除，但是在执行指令的时候，该指令是否在 PATH 环境变量所记录的路径有关。以上面的 Apache 软件安装为例，<code v-pre>/usr/local/apache/bin</code> 肯定不在 PATH 里面的，所以执行 apache 的指令，要么使用绝对路径，要么加入到 PATH 中，另外还需要将 <code v-pre>/usr/local/apache/man</code> 也加入到 man page 搜索的路径中</p>
<p>另外，Tarball 在升级的时候也挺困扰，以 apache 来说明，WWW 服务器为了考虑互动性，所以通常会将 <code v-pre>PHP+MySql+Apache</code> 一起安装，那么每个软件在安装的时候都有一定的顺序与程序，因为他们之间具有相关性，所以安装时必须要三者同时考虑到他们的函数库与相关的编译参数</p>
<p>假设今天只要升级 PHP呢？有时候因为只涉及动态函数库的升级，那么只要升级 PHP 即可，其他的部分或许影响不大。但是今天如果 PHP 需要重新编译的模块比较多，那么可能会连带的，连 Apahce 这个程序也需要重新编译过才行。所以使用 tarball 确实有它的优点，但是在这方面也确实麻烦</p>
<p>由于 Tarball 在升级与安装上面具有这些特色，即 Tarball 在反安装上面具有比较高的难度（如果你没有好好规划的话），所以为了方便 Tarball 的管理，通常作者会这样建议使用者：</p>
<ol>
<li>
<p>最好将 tarball 的源码数据解压到 <code v-pre>/usr/local/src</code> 中</p>
</li>
<li>
<p>安装时，最好安装到 <code v-pre>/usr/local</code> 这个默认路径下</p>
</li>
<li>
<p>考虑未来的反安装步骤，最好可以将每个软件单独的安装在 <code v-pre>/usr/local</code> 下</p>
</li>
<li>
<p>为安装到单独目录的软件的 man page 加入 man path 搜索</p>
<p>如果你安装的软件在 <code v-pre>/usr/local/software/</code> 那么 man page 搜索设置中，可能需要在 <code v-pre>/etc/man_db.conf</code> 内的 40~50 行左右处，写入如下的一行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">MANPATH_MAP /usr/local/software/bin /usr/local/software/man</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这样才可以使用 man 来查询该软件的在下文件</p>
</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>时至今日，不太需要有 tarball 的安装了。 CentOS/Fedora 有个 RPM 补遗计划，就是俗称的 EPEL 计划，相关说明请参考 <a href="https://fedoraproject.org/wiki/EPEL" target="_blank" rel="noopener noreferrer">EPEL</a> ，一般学界用到的软件都在里面，除非你要用的软件是专属收费软件，或则是比较冷门的软件，否则都有好心的网友帮我妈打包好了</p>
</div>
<h2 id="一个简单的范例-利用-ntp-来示范" tabindex="-1"><a class="header-anchor" href="#一个简单的范例-利用-ntp-来示范"><span>一个简单的范例，利用 ntp 来示范</span></a></h2>
<p>这里用时间服务器 ntp（network time protocol）软件来测试安装。下载网址请在此 <a href="http://www.ntp.org/downloads.html" target="_blank" rel="noopener noreferrer">网页中找到下载包链接</a> ，本次使用 <code v-pre>http://www.eecis.udel.edu/~ntp/ntp_spool/ntp4/ntp-4.2/ntp-4.2.8p14.tar.gz</code> 这个版本。</p>
<p>假设我对这个软件的要求如下：</p>
<ul>
<li>假设 <code v-pre>ntp4.*.*.tar.gz</code> 文件放到 <code v-pre>/root</code> 目录下</li>
<li>源码解压在 <code v-pre>/usr/local/src</code> 下</li>
<li>安装到 <code v-pre>/usr/local/ntp</code> 目录中</li>
</ul>
<p>​</p>
<p>解压文件，并阅读 README/INSTALL 文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cd /usr/local/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study local<span class="token punctuation">]</span><span class="token comment"># tar -zxv -f /root/ntp-4.2.8p14.tar.gz</span></span>
<span class="line"><span class="token punctuation">[</span>root@study local<span class="token punctuation">]</span><span class="token comment"># cd ntp-4.2.8p14/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ntp-4.2.8p14<span class="token punctuation">]</span><span class="token comment"># vi INSTALL</span></span>
<span class="line"><span class="token comment"># 查看安装说明，使用 set nu 显示行号</span></span>
<span class="line"><span class="token comment"># 然后阅读 28 ~ 54 行的安装步骤，大约就是如下的内容</span></span>
<span class="line">   <span class="token number">28</span> The simplest way to compile this package is:</span>
<span class="line">   <span class="token number">29</span> </span>
<span class="line">   <span class="token number">30</span>   <span class="token number">1</span>. <span class="token variable"><span class="token variable">`</span><span class="token builtin class-name">cd</span><span class="token string">' to the directory containing the package'</span>s <span class="token builtin class-name">source</span> code and <span class="token builtin class-name">type</span></span>
<span class="line">   <span class="token number">31</span>      <span class="token variable">`</span></span>./configure<span class="token string">' to configure the package for your system.  If you'</span>re</span>
<span class="line">   <span class="token number">32</span>      using <span class="token variable"><span class="token variable">`</span>csh' on an old version of System V, you might need to <span class="token builtin class-name">type</span></span>
<span class="line">   <span class="token number">33</span>      <span class="token variable">`</span></span><span class="token function">sh</span> ./configure<span class="token string">' instead to prevent `csh'</span> from trying to execute</span>
<span class="line">   <span class="token number">34</span>      <span class="token variable"><span class="token variable">`</span>configure' itself.</span>
<span class="line">   <span class="token number">35</span> </span>
<span class="line">   <span class="token number">36</span>      Running <span class="token variable">`</span></span>configure<span class="token string">' takes a while.  While running, it prints some</span>
<span class="line">   37      messages telling which features it is checking for.</span>
<span class="line">   38 </span>
<span class="line">   39   2. Type `make'</span> to compile the package.</span>
<span class="line">   <span class="token number">40</span> </span>
<span class="line">   <span class="token number">41</span>   <span class="token number">3</span>. Optionally, <span class="token builtin class-name">type</span> <span class="token variable"><span class="token variable">`</span><span class="token function">make</span> check' to run any self-tests that come with</span>
<span class="line">   <span class="token number">42</span>      the package.</span>
<span class="line">   <span class="token number">43</span> </span>
<span class="line">   <span class="token number">44</span>   <span class="token number">4</span>. Type <span class="token variable">`</span></span><span class="token function">make</span> <span class="token function">install</span><span class="token string">' to install the programs and any data files and</span>
<span class="line">   45      documentation.</span>
<span class="line">   46 </span>
<span class="line">   47   5. You can remove the program binaries and object files from the</span>
<span class="line">   48      source code directory by typing `make clean'</span><span class="token builtin class-name">.</span>  To also remove the</span>
<span class="line">   <span class="token number">49</span>      files that <span class="token variable"><span class="token variable">`</span>configure' created <span class="token punctuation">(</span>so you can compile the package <span class="token keyword">for</span></span>
<span class="line">   <span class="token number">50</span>      a different kind of computer<span class="token punctuation">)</span>, <span class="token builtin class-name">type</span> <span class="token variable">`</span></span><span class="token function">make</span> distclean<span class="token string">'.  There is</span>
<span class="line">   51      also a `make maintainer-clean'</span> target, but that is intended mainly</span>
<span class="line">   <span class="token number">52</span>      <span class="token keyword">for</span> the package's developers.  If you use it, you may have to get</span>
<span class="line">   <span class="token number">53</span>      all sorts of other programs <span class="token keyword">in</span> order to regenerate files that came</span>
<span class="line">   <span class="token number">54</span>      with the distribution.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>检查 configure 支持的参数，并实际建立 makefile 规则文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ntp-4.2.8p14<span class="token punctuation">]</span><span class="token comment"># ./configure --help | more</span></span>
<span class="line">`configure' configures ntp <span class="token number">4.2</span>.8p14 to adapt to many kinds of systems.</span>
<span class="line"></span>
<span class="line">Usage: ./configure <span class="token punctuation">[</span>OPTION<span class="token punctuation">]</span><span class="token punctuation">..</span>. <span class="token punctuation">[</span>VAR<span class="token operator">=</span>VALUE<span class="token punctuation">]</span><span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line">To assign environment variables <span class="token punctuation">(</span>e.g., CC, CFLAGS<span class="token punctuation">..</span>.<span class="token punctuation">)</span>, specify them as</span>
<span class="line"><span class="token assign-left variable">VAR</span><span class="token operator">=</span>VALUE.  See below <span class="token keyword">for</span> descriptions of some of the useful variables.</span>
<span class="line">有很多参数，下面列出来比较重要的选项</span>
<span class="line"><span class="token parameter variable">--prefix</span><span class="token operator">=</span>PREFIX         <span class="token function">install</span> architecture-independent files <span class="token keyword">in</span> PREFIX</span>
<span class="line">                          <span class="token punctuation">[</span>/usr/local<span class="token punctuation">]</span></span>
<span class="line">--enable-all-clocks     + include all suitable non-PARSE clocks:</span>
<span class="line">--enable-parse-clocks   - include all suitable PARSE clocks:</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ntp-4.2.8p14<span class="token punctuation">]</span><span class="token comment"># ./configure --prefix=/usr/local/ntp --enable-all-clocks --enable-parse-clocks</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">checking <span class="token keyword">for</span> gcc<span class="token punctuation">..</span>gcc				<span class="token comment"># 找到了 gcc 编译程序</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">configure: creating ./config.status</span>
<span class="line">config.status: creating libevent.pc</span>
<span class="line">config.status: creating libevent_openssl.pc</span>
<span class="line">config.status: creating libevent_pthreads.pc</span>
<span class="line">config.status: creating Makefile		<span class="token comment"># 创建了一个 Makefile</span></span>
<span class="line">config.status: creating config.h</span>
<span class="line">config.status: creating evconfig-private.h</span>
<span class="line">config.status: evconfig-private.h is unchanged</span>
<span class="line">config.status: executing depfiles commands</span>
<span class="line">config.status: executing libtool commands</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般来说 configure 设置参数比较重要的就是 <code v-pre>--prefix=PREFIX</code>了，后面指定了该软件未来要安装到的目录</p>
<p>最后开始编译与安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ntp-4.2.8p14<span class="token punctuation">]</span><span class="token comment"># make clean; make</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ntp-4.2.8p14<span class="token punctuation">]</span><span class="token comment"># make check</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span></span>
<span class="line">Testsuite summary <span class="token keyword">for</span> ntp <span class="token number">4.2</span>.8p14</span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span></span>
<span class="line"><span class="token comment"># TOTAL: 1</span></span>
<span class="line"><span class="token comment"># PASS:  1</span></span>
<span class="line"><span class="token comment"># SKIP:  0</span></span>
<span class="line"><span class="token comment"># XFAIL: 0</span></span>
<span class="line"><span class="token comment"># FAIL:  0</span></span>
<span class="line"><span class="token comment"># XPASS: 0</span></span>
<span class="line"><span class="token comment"># ERROR: 0</span></span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span></span>
<span class="line"><span class="token comment"># 通过 check 后，会列出一个清单结果，这里是表示都成功了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ntp-4.2.8p14<span class="token punctuation">]</span><span class="token comment"># make install</span></span>
<span class="line"><span class="token comment"># 安装成功后，就可以看到 ntp 目录下安装好的文件了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ntp<span class="token punctuation">]</span><span class="token comment"># cd /usr/local/ntp</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ntp<span class="token punctuation">]</span><span class="token comment"># ll</span></span>
<span class="line">total <span class="token number">0</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root <span class="token number">189</span> Apr  <span class="token number">6</span> 03:49 bin</span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root   <span class="token number">6</span> Apr  <span class="token number">6</span> 03:49 libexec</span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root   <span class="token number">6</span> Apr  <span class="token number">6</span> 03:49 sbin</span>
<span class="line">drwxr-xr-x. <span class="token number">5</span> root root  <span class="token number">39</span> Apr  <span class="token number">6</span> 03:49 share</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="利用-patch-更新源码" tabindex="-1"><a class="header-anchor" href="#利用-patch-更新源码"><span>利用 patch 更新源码</span></a></h2>
<p>所谓更新源码，通常是某一段代码有问题，因此通常只是更新部分文件的小部分内容。</p>
<p>好处则是：没有变动的文件的目标文件（object file）不需要重新编译，变动过的文件可以利用 make 来自动 update，如此一来，原先的设置（makefile 文件里面的规则）将不需要重新改写或检测，可以节省很多的宝贵时间</p>
<p>可以用 diff 指令将两个文件的差异性列出来，再以相关的指令来将旧版的文件更新，这是可以的，通常很多软件开发商在更新了源码之后，几乎都会放出所谓的 patch file，也就是直接将源码 update 的一个方式，使用 patch 指令来完成。</p>
<p>关于 diff 与 patch 的基本用法在第 11 章已经讲过了。下面通过一个简单的例子来讲解；之前章节的计算函数的例子，相关文件如下</p>
<h3 id="main-0-1-版本" tabindex="-1"><a class="header-anchor" href="#main-0-1-版本"><span>main-0.1 版本</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># ll</span></span>
<span class="line">total <span class="token number">20</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">184</span> Apr  <span class="token number">6</span> 04:01 cos_value.c</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">101</span> Apr  <span class="token number">6</span> 04:01 haha.c</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">291</span> Apr  <span class="token number">6</span> 04:01 main.c</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">142</span> Apr  <span class="token number">6</span> 04:02 Makefile</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">186</span> Apr  <span class="token number">6</span> 04:02 sin_value.c</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：以下文件，可能是由于复制过程中的编码问题，会导致部分与 patch 中的文件内容不一致，从而导致 patch 过程失败，请直接下载以下链接中的包，并解压到 <code v-pre>/root/</code> 下</p>
<ul>
<li>
<p>wget http://linux.vbird.org/linux_basic/0520source/main-0.1.tgz</p>
</li>
<li>
<p>wget http://linux.vbird.org/linux_basic/0520source/main_0.1_to_0.2.patch</p>
<p>下载后，修改文件名为 <code v-pre>main-0.1-to-0.2.patch</code></p>
</li>
</ul>
<p><code v-pre>main.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line"><span class="token comment">#define pi 3.14159</span></span>
<span class="line">char name<span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">float angle<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">int main<span class="token punctuation">(</span>void<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>version 0.1"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span><span class="token entity" title="\n">\n</span>Please input your name: "</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	scanf  <span class="token punctuation">(</span><span class="token string">"%s"</span>, <span class="token operator">&amp;</span>name <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>Please enter the degree angle (ex> 90): "</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	scanf  <span class="token punctuation">(</span><span class="token string">"%f"</span>, <span class="token operator">&amp;</span>angle <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	haha<span class="token punctuation">(</span> name <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	sin_value<span class="token punctuation">(</span> angle <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	cos_value<span class="token punctuation">(</span> angle <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>haha.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line">int haha<span class="token punctuation">(</span>char name<span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span><span class="token entity" title="\n">\n</span>Hi, Dear %s, nice to meet you."</span>, name<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>sin_value.c</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment">#include &lt;stdio.h></span></span>
<span class="line"><span class="token comment">#include &lt;math.h></span></span>
<span class="line"><span class="token comment">#define pi 3.14159</span></span>
<span class="line">float angle<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">void sin_value<span class="token punctuation">(</span>void<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">        float value<span class="token punctuation">;</span></span>
<span class="line">        value <span class="token operator">=</span> sin <span class="token punctuation">(</span> angle / <span class="token number">180</span>. * pi <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>The sin(%f) is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,angle, value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>cos_value.c</code></p>
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
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>Makefile</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># This make file is a test rule file</span></span>
<span class="line"><span class="token comment"># # Version 0.1 2009/06/06</span></span>
<span class="line">LIBS <span class="token operator">=</span> <span class="token parameter variable">-lm</span></span>
<span class="line">OBJS <span class="token operator">=</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line">main: <span class="token variable">${OBJS}</span></span>
<span class="line">        gcc <span class="token parameter variable">-o</span> main <span class="token variable">${OBJS}</span> <span class="token variable">${LIBS}</span></span>
<span class="line">clean:</span>
<span class="line">        <span class="token function">rm</span> <span class="token parameter variable">-f</span> main <span class="token variable">${OBJS}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>记得调整上面使用 tab 的语法部分</p>
<h3 id="由-0-1-升级到-0-2-的-patch-file" tabindex="-1"><a class="header-anchor" href="#由-0-1-升级到-0-2-的-patch-file"><span>由 0.1 升级到 0.2 的 patch file</span></a></h3>
<p><code v-pre>main-0.1-to-0.2.patch</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">diff</span> <span class="token parameter variable">-Naur</span> main-0.1/cos_value.c main-0.2/cos_value.c</span>
<span class="line">--- main-0.1/cos_value.c	<span class="token number">2015</span>-09-04 <span class="token number">14</span>:46:59.200444001 +0800</span>
<span class="line">+++ main-0.2/cos_value.c	<span class="token number">2015</span>-09-04 <span class="token number">14</span>:47:10.215444000 +0800</span>
<span class="line">@@ -7,5 +7,5 @@</span>
<span class="line"> <span class="token punctuation">{</span></span>
<span class="line"> 	float value<span class="token punctuation">;</span></span>
<span class="line"> 	value <span class="token operator">=</span> cos <span class="token punctuation">(</span> angle / <span class="token number">180</span>. * pi <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">-	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"The Cos is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">+	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"The cos(%f) is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,angle, value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line"><span class="token function">diff</span> <span class="token parameter variable">-Naur</span> main-0.1/main.c main-0.2/main.c</span>
<span class="line">--- main-0.1/main.c	<span class="token number">2009</span>-06-12 00:39:38.000000000 +0800</span>
<span class="line">+++ main-0.2/main.c	<span class="token number">2009</span>-06-12 00:45:38.000000000 +0800</span>
<span class="line">@@ -5,7 +5,7 @@</span>
<span class="line"> </span>
<span class="line"> int main<span class="token punctuation">(</span>void<span class="token punctuation">)</span></span>
<span class="line"> <span class="token punctuation">{</span></span>
<span class="line">-	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>version 0.1"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">+	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>version 0.2"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> 	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span><span class="token entity" title="\n">\n</span>Please input your name: "</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> 	scanf  <span class="token punctuation">(</span><span class="token string">"%s"</span>, <span class="token operator">&amp;</span>name <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> 	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>Please enter the degree angle (ex> 90): "</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">diff</span> <span class="token parameter variable">-Naur</span> main-0.1/Makefile main-0.2/Makefile</span>
<span class="line">--- main-0.1/Makefile	<span class="token number">2009</span>-06-12 00:34:53.000000000 +0800</span>
<span class="line">+++ main-0.2/Makefile	<span class="token number">2009</span>-06-12 00:42:39.000000000 +0800</span>
<span class="line">@@ -1,8 +1,12 @@</span>
<span class="line"> <span class="token comment"># This make file is a test rule file</span></span>
<span class="line">-<span class="token comment"># Version 0.1 2009/06/06</span></span>
<span class="line">+<span class="token comment"># Version 0.2 2009/06/11</span></span>
<span class="line"> LIBS <span class="token operator">=</span> <span class="token parameter variable">-lm</span></span>
<span class="line"> OBJS <span class="token operator">=</span> main.o haha.o sin_value.o cos_value.o</span>
<span class="line"> main: <span class="token variable">${OBJS}</span></span>
<span class="line"> 	gcc <span class="token parameter variable">-o</span> main <span class="token variable">${OBJS}</span> <span class="token variable">${LIBS}</span></span>
<span class="line"> clean:</span>
<span class="line"> 	<span class="token function">rm</span> <span class="token parameter variable">-f</span> main <span class="token variable">${OBJS}</span></span>
<span class="line">+install:</span>
<span class="line">+	<span class="token function">cp</span> <span class="token parameter variable">-a</span> main /usr/local/bin</span>
<span class="line">+uninstall:</span>
<span class="line">+	<span class="token function">rm</span> <span class="token parameter variable">-f</span> /usr/local/bin/main</span>
<span class="line"><span class="token function">diff</span> <span class="token parameter variable">-Naur</span> main-0.1/sin_value.c main-0.2/sin_value.c</span>
<span class="line">--- main-0.1/sin_value.c	<span class="token number">2015</span>-09-04 <span class="token number">14</span>:46:52.286444001 +0800</span>
<span class="line">+++ main-0.2/sin_value.c	<span class="token number">2015</span>-09-04 <span class="token number">14</span>:47:17.665444020 +0800</span>
<span class="line">@@ -7,5 +7,5 @@</span>
<span class="line"> <span class="token punctuation">{</span></span>
<span class="line"> 	float value<span class="token punctuation">;</span></span>
<span class="line"> 	value <span class="token operator">=</span> sin <span class="token punctuation">(</span> angle / <span class="token number">180</span>. * pi <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">-	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>The Sin is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">+	<span class="token builtin class-name">printf</span> <span class="token punctuation">(</span><span class="token string">"<span class="token entity" title="\n">\n</span>The sin(%f) is: %5.2f<span class="token entity" title="\n">\n</span>"</span>,angle, value<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>把这目录和文件放到 root 目录下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">drwxr-xr-x. <span class="token number">2</span> root   root         <span class="token number">88</span> Apr  <span class="token number">6</span> 04:11 main-0.1</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root   root       <span class="token number">1538</span> Apr  <span class="token number">6</span> 04:11 main-0.1-to-0.2.patch</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>在 0.1 版本中，有 main 与 clean 两个目标功能。而 0.2 版本则增加了 install 与 uninstall 的规则与设置。下面来进行升级</p>
<h3 id="测试旧版程序的功能" tabindex="-1"><a class="header-anchor" href="#测试旧版程序的功能"><span>测试旧版程序的功能</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># make clean main   </span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> main main.o haha.o sin_value.o cos_value.o</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> main.o main.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> haha.o haha.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> sin_value.o sin_value.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> cos_value.o cos_value.c</span>
<span class="line">gcc <span class="token parameter variable">-o</span> main main.o haha.o sin_value.o cos_value.o <span class="token parameter variable">-lm</span></span>
<span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># ./main </span></span>
<span class="line"></span>
<span class="line">version <span class="token number">0.1</span></span>
<span class="line"></span>
<span class="line">Please input your name: mrcode</span>
<span class="line"></span>
<span class="line">Please enter the degree angle <span class="token punctuation">(</span>ex<span class="token operator">></span> <span class="token number">90</span><span class="token punctuation">)</span>: <span class="token number">45</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Hi, Dear mrcode, <span class="token function">nice</span> to meet you.</span>
<span class="line">The Sin is:  <span class="token number">0.71</span></span>
<span class="line">The Cos is:  <span class="token number">0.71</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与之前的结果类似，但是如果你下达 make install 时，系统会告知没有 install 的 target，如何更新到 0.2 版本呢？</p>
<h3 id="查阅-patch-file-内容" tabindex="-1"><a class="header-anchor" href="#查阅-patch-file-内容"><span>查阅 patch file 内容</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim main-0.1-to-0.2.patch </span></span>
<span class="line"><span class="token function">diff</span> <span class="token parameter variable">-Naur</span> main-0.1/cos_value.c main-0.2/cos_value.c</span>
<span class="line">--- main-0.1/cos_value.c	<span class="token number">2015</span>-09-04 <span class="token number">14</span>:46:59.200444001 +0800</span>
<span class="line">+++ main-0.2/cos_value.c	<span class="token number">2015</span>-09-04 <span class="token number">14</span>:47:10.215444000 +0800</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>diff -Naur main-0.1/cos_value.c main-0.2/cos_value.c</code></p>
<p>表示使用 diff 去比较时，比较的两个文件路径，该路径非常重要，因为 patch 的基本语法如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">patch <span class="token parameter variable">-p</span> 数字 <span class="token operator">&lt;</span> patch_file</span>
<span class="line"></span>
<span class="line">-p： 与 patch_file 里列出的文件名有关的信息。假如 patch_file 里面累出的文件名有关的信息，假如第一行是写的 <span class="token variable"><span class="token variable">`</span>*** /home/guest/example/expatch.old<span class="token variable">`</span></span></span>
<span class="line"></span>
<span class="line">那么当下达 patch <span class="token parameter variable">-p0</span> <span class="token operator">&lt;</span> patch_file 时，更新的文件是 /home/guest/example/expatch.old,</span>
<span class="line">如果下达  patch <span class="token parameter variable">-p1</span> <span class="token operator">&lt;</span> patch_file 时，更的文件是 home/guest/example/expatch.old</span>
<span class="line">如果下达  patch <span class="token parameter variable">-p4</span> <span class="token operator">&lt;</span> patch_file 时，更新的是 expatch.old</span>
<span class="line">也就是说 <span class="token parameter variable">-pxx</span> xx 表示是拿掉几个斜线的意思</span>
<span class="line"></span>
<span class="line">那么上面比较的文件是在 main-0.1/xxx 与 main-0.2/xxx 所以，如果你是在 main-0.1 下，并且想要处理更新时，就需要拿掉一个目录，因为并没有 main-0.2 的存在，我们是在当前的目录进行更新的，因此需要使用 <span class="token parameter variable">-p1</span> 才对</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="更新源码-并重新编译程序" tabindex="-1"><a class="header-anchor" href="#更新源码-并重新编译程序"><span>更新源码，并重新编译程序</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># patch -p1 &lt; ../main-0.1-to-0.2.patch </span></span>
<span class="line">patching <span class="token function">file</span> cos_value.c</span>
<span class="line">patching <span class="token function">file</span> main.c</span>
<span class="line">patching <span class="token function">file</span> Makefile</span>
<span class="line">patching <span class="token function">file</span> sin_value.c</span>
<span class="line"><span class="token comment"># 请注意，目前所在的目录在 main-0.1 ，注意与 patch 文件的相对路径</span></span>
<span class="line"><span class="token comment"># 虽然有 5 个文件，但是只有 4 个文件有修改过，上面显示有修改过的文件</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># make clean main</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> main main.o haha.o sin_value.o cos_value.o</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> main.o main.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> haha.o haha.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> sin_value.o sin_value.c</span>
<span class="line">cc    <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> cos_value.o cos_value.c</span>
<span class="line">gcc <span class="token parameter variable">-o</span> main main.o haha.o sin_value.o cos_value.o <span class="token parameter variable">-lm</span></span>
<span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># ./main </span></span>
<span class="line"></span>
<span class="line">version <span class="token number">0.2</span></span>
<span class="line"></span>
<span class="line">Please input your name: mrcode</span>
<span class="line"></span>
<span class="line">Please enter the degree angle <span class="token punctuation">(</span>ex<span class="token operator">></span> <span class="token number">90</span><span class="token punctuation">)</span>: <span class="token number">45</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Hi, Dear mrcode, <span class="token function">nice</span> to meet you.</span>
<span class="line">The sin<span class="token punctuation">(</span><span class="token number">45.000000</span><span class="token punctuation">)</span> is:  <span class="token number">0.71</span></span>
<span class="line">The cos<span class="token punctuation">(</span><span class="token number">45.000000</span><span class="token punctuation">)</span> is:  <span class="token number">0.71</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># make install</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> main /usr/local/bin</span>
<span class="line"><span class="token comment"># 可以看到，把执行程序复制到了 bin 下，所以就可以不加绝对路径运行了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># main</span></span>
<span class="line"><span class="token punctuation">[</span>root@study main-0.1<span class="token punctuation">]</span><span class="token comment"># make uninstall</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> /usr/local/bin/main</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个就是利用了 diff 和 patch 指令来完成的源码更新，然后重新编译安装的效果和流程。</p>
<p>如果你 patch 错误呢？可以通过 <code v-pre>patch -R &lt; ../main-0.1-to-0.2.patch</code> 将已经更新过的还原。（笔者在复制笔记上的文件到虚拟机文件的时候，不知道哪里有问题，导致前 4 个文件可以 patch 成功，但是第 4 个文件显示失败，这种情况下，就可以通过这样的指令还原回去）</p>
<p>一个问题：如果有一个很旧版本的软件，该软件已经更新到最新版本，例如核心，我可以使用 patch file 来更新吗？</p>
<p>答：首先要确认有释放出 patch file 才行，以 kernel 2.2.xx 与 2.4.xx 来说，基本上的架构已经不同了，所以两者无法以 patch file 来更新的。不过 2.4.xx 与 2.4.yy 就可以。不过，因为 kernel 每次推出的 patch 文件都是针对前一个版本而已，假设你的内核是 kernel 2.4.20 要升级大 2.5.26，那么中间有 5 个文件，需要按顺序更新才可以。但是如果有朋友帮你对比过 2.4.20 与 2.4.26，那么你直接使用该 patch file 来直接一次更新也可以</p>
</div></template>


