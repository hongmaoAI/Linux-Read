<template><div><h1 id="rpm-软件管理程序-rpm" tabindex="-1"><a class="header-anchor" href="#rpm-软件管理程序-rpm"><span>RPM 软件管理程序：rpm</span></a></h1>
<h2 id="rpm-默认安装的路径" tabindex="-1"><a class="header-anchor" href="#rpm-默认安装的路径"><span>RPM 默认安装的路径</span></a></h2>
<p>一般来说，RPM 类型的文件在安装的时候，会先读取文件内记载的设置参数内容，然后将该数据用来对比 Linux 系统的环境，找出未安装的依赖软件。</p>
<p>若环境检查合格了，则开始安装。安装完成后，该软件相关的信息会被写入到 <code v-pre>/var/lib/rpm/</code> 目录下的数据库文件中。</p>
<p>这个数据库的数据很重要，因为未来如果我们有任何软件的升级需求，版本之间的比较就是来自这个数据库，想查询已安装的软件信息也是来自于该数据库，同时，目前的 RPM 也提供数字签名信息，也是记录在此</p>
<p>那么软件内的文件放置到哪里的？这个与文件系统有关，在第 5 章的目录配置谈过每个目录的含义，这里再次强调：</p>
<ul>
<li><code v-pre>/etc/</code>：一些配置文件</li>
<li><code v-pre>/usr/bin/</code>：一些可执行文件</li>
<li><code v-pre>/usr/lib/</code>：一些程序使用的动态函数库</li>
<li><code v-pre>/usr/share/doc/</code>：一些基本的软件使用手册与说明文件</li>
<li><code v-pre>/usr/share/man/</code>：一些 man page 文件</li>
</ul>
<h2 id="rpm-安装-install" tabindex="-1"><a class="header-anchor" href="#rpm-安装-install"><span>RPM 安装（install）</span></a></h2>
<p>因为软件安装时需要 root 的权限工作，因此需要有 root 身份才可以使用 rpm 指令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> package_name</span>
<span class="line"></span>
<span class="line">-i：install</span>
<span class="line">-v：查看更详细的安装信息画面</span>
<span class="line">-h：以安装信息列显示安装进度</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：安装原版光盘上的 rp-pppoe 软件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -ivh /mnt/Packages/rp-pppoe-3.11-7.el7.x86_64.rpm </span></span>
<span class="line">Preparing<span class="token punctuation">..</span>.                          <span class="token comment">################################# [100%]</span></span>
<span class="line">Updating / installing<span class="token punctuation">..</span>.</span>
<span class="line">   <span class="token number">1</span>:rp-pppoe-3.11-7.el7              <span class="token comment">################################# [100%]</span></span>
<span class="line">   </span>
<span class="line"><span class="token comment"># 范例 2：一次性安装两个以上的软件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> a.i386.rpm b.i386.rpm *.rpm</span>
<span class="line"><span class="token comment"># 后面可以接上许多的软件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：直接用网络上面的某个文件安装</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> http://website.name/path/pkgname.rpm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另外，如果在安装过程中发现问题，或已经知道会发生问题，还是要强制安装，可以参考以下说明，下面列出 rpm 安装时常用的选项与参数说明：</p>
<ul>
<li>
<p><code v-pre>--nodeps</code></p>
<ul>
<li>使用时机：当发生软件属性依赖问题而无法安装时，但你想强制安装时</li>
<li>危险性：如果不考虑依赖问题，可能导致软件无法正常使用</li>
</ul>
</li>
<li>
<p><code v-pre>--replacefiles</code></p>
<ul>
<li>使用时机：如果在安装过程中出现了「某个文件已经被安装在你的系统上」的信息，又或许出现版本不合的信息（confilcting files）时，可以使用该参数来直接覆盖文件</li>
<li>危险性：覆盖的动作无法还原，所以你必须很清楚的知道你自己在做什么</li>
</ul>
</li>
<li>
<p><code v-pre>--replacepkgs</code></p>
<p>使用时机：重新安装某个已经安装过的软件，如果你要安装一堆 RPM 软件时，可以使用 <code v-pre>rpm -ivh *.rpm</code>，但若某些软件已经安装过了，此时系统会出现某软件已经安装过的信息，导致无法继续安装。此时可以使用该选项</p>
</li>
<li>
<p><code v-pre>--force</code></p>
<p>使用时机：该参数其实是 <code v-pre>--replacefiles</code> 与 <code v-pre>--replacepkgs</code> 的合体</p>
</li>
<li>
<p><code v-pre>--test</code></p>
<p>使用时机：想要测试下该软件是否可以被安装到使用者的 Linux 环境中，可以找出是否有属性依赖问题</p>
</li>
<li>
<p><code v-pre>--justdb</code></p>
<p>使用时机：由于 RPM 数据库破损或某些缘故产生错误时，可以使用该选项来更新软件在数据库内的相关信息</p>
</li>
<li>
<p><code v-pre>--nosignature</code></p>
<p>使用时机：想要忽略数字签名时的检查时</p>
</li>
<li>
<p><code v-pre>--prefix 新路径</code></p>
<p>使用时机：要将软件安装到其他非正规目录时</p>
</li>
<li>
<p><code v-pre>--noscripts</code></p>
<ul>
<li>使用时机：不想让该软件在安装过程中自行执行某些系统指令</li>
<li>说明：RPM 的优点除了可以将文件放置到指定位置外，还可以自动执行一些前置作业指令，例如数据库初始化。如果不想让 RPM 帮你自动执行这一类的指令，可以加上该参数</li>
</ul>
</li>
</ul>
<p>一般来说，rpm 的安装选项与参数大约就是以上的项目。作者建议一般使用 <code v-pre>-ivh</code> 就好了。如果安装过程中发现问题，一个一个将问题找出来，尽量不要使用暴力安装法（不要使用 <code v-pre>-force</code> 方式）</p>
<p>范例：当没有网络时，通过原版光盘安装一个名为 pam-devel 软件时，可以如下做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">找出光驱位置：blkid </span>
<span class="line">挂载光盘：mount /dev/sr0 /mnt</span>
<span class="line">找出文件的实际路径：find /mnt <span class="token parameter variable">-name</span> <span class="token string">'pam-devel*'</span></span>
<span class="line">测试此软件是否具有相依性：rpm <span class="token parameter variable">-ivh</span> pam-devel<span class="token punctuation">..</span>. <span class="token parameter variable">--test</span></span>
<span class="line">直接安装：rpm <span class="token parameter variable">-ivh</span> pam-devel<span class="token punctuation">..</span>.</span>
<span class="line">卸载光盘：umount/mnt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rpm-升级与更新-upgrade-freshen" tabindex="-1"><a class="header-anchor" href="#rpm-升级与更新-upgrade-freshen"><span>RPM 升级与更新（upgrade/freshen）</span></a></h2>
<p>使用 RPM 来升级也很简单，可以使用如下参数</p>
<ul>
<li>
<p><code v-pre>-Uvh</code></p>
<p>后面接的软件即使没有安装过，则系统直接安装；若安装过旧版的软件，则系统自动更新至新版</p>
</li>
<li>
<p><code v-pre>-Fvh</code></p>
<p>后面接的软件并未安装到系统，则该软件不会安装；</p>
</li>
</ul>
<p>从说明来看，<code v-pre>-Fvh</code> 一般用在大量升级系统旧版本软件时。</p>
<p>早期没有 yum 的环境下，同时网络带宽也很糟糕的情况下，通常有的朋友在进行整个操作系统的旧版本软件修补时，喜欢这么做：</p>
<ol>
<li>先到个发展商 errdata 网站或者是国内的 FTP 镜像下载最新的 RPM 文件</li>
<li>使用 <code v-pre>-Fvh</code> 将你系统内曾安装过的软件进行升级</li>
</ol>
<h2 id="rpm-查询-query" tabindex="-1"><a class="header-anchor" href="#rpm-查询-query"><span>RPM 查询（query）</span></a></h2>
<p>RPM 在查询的时候，其实也是使用的是 <code v-pre>/var/lib/rpm</code> 目录下的数据库文件</p>
<p>另外，还可以查询未安装的 RPM 文件内的信息。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span>																	  <span class="token comment"># 已安装软件</span></span>
<span class="line"><span class="token function">rpm</span> -q<span class="token punctuation">[</span>licdR<span class="token punctuation">]</span> 已安装的软件名称							<span class="token comment"># 已安装软件</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qf</span> 存在于系统上面的某个文件名						<span class="token comment"># 已安装软件</span></span>
<span class="line"><span class="token function">rpm</span> -qp<span class="token punctuation">[</span>licdR<span class="token punctuation">]</span> 未安装的某个文件名					<span class="token comment"># 查询 RPM 文件</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">查询已安装软件的信息：</span>
<span class="line">	-q：仅查询，后面接的软件名称是否有安装</span>
<span class="line">	-qa：列出所有的，已经安装在本机所有软件名称</span>
<span class="line">	-qi：列出该软件的详细信息（information），包含开发商、版本与说明等</span>
<span class="line">	-ql：列出该软件所有的文件与目录所在完整文件名（list）</span>
<span class="line">	-qc：列出该软件的所有配置文件（找出在 <span class="token variable"><span class="token variable">`</span>/etc/<span class="token variable">`</span></span> 下的文件名）</span>
<span class="line">	-qd：列出该软件的所有说明文件（找出与 <span class="token function">man</span> 有关的文件）</span>
<span class="line">	-qR：列出与该软件有关的相依赖软件所含的文件（Required）</span>
<span class="line">	-qf：由后面接的文件名，找出该文件属于哪一个已安装的软件</span>
<span class="line">	<span class="token parameter variable">-q</span> --scripts：列出是否含有安装后需要执行的脚本文件，可以用来 debug</span>
<span class="line">查询某个 RPM 文件内含有的信息：</span>
<span class="line">	-qp<span class="token punctuation">[</span>icdlR<span class="token punctuation">]</span>：这里的参数与上面的一致，只是这里查询的是没有安装的软件</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在查询部分，所有参数都需要加上 <code v-pre>-q</code> 表示查询。查询主要分为两部分：</p>
<ul>
<li>查询已安装到系统上的软件信息，数据信息由 <code v-pre>/var/lib/rpm/</code> 提供</li>
<li>查询 rpm 文件内容，等于是由 RPM 文件内找出一些要写入数据库内的信息，需要使用 <code v-pre>-qp(p 是 package 的含义)</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：找出是否有安装 logrotate 这个软件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -q logrotate</span></span>
<span class="line">logrotate-3.8.6-17.el7.x86_64</span>
<span class="line"><span class="token comment"># 查询未安装的，则提示没有安装</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -q logrotating</span></span>
<span class="line">package logrotating is not installed</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：列出上题中，属于该软件所提供的所有目录与文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -ql logrotate</span></span>
<span class="line">/etc/cron.daily/logrotate</span>
<span class="line">/etc/logrotate.conf</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"><span class="token comment"># 可以看到有很多的文件和目录，可以用来追踪软件的数据</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：列出 logrotate 软件的相关说明</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qi logrotate</span></span>
<span class="line">Name        <span class="token builtin class-name">:</span> <span class="token function">logrotate</span>										<span class="token comment"># 软件名称</span></span>
<span class="line">Version     <span class="token builtin class-name">:</span> <span class="token number">3.8</span>.6												<span class="token comment"># 软件版本</span></span>
<span class="line">Release     <span class="token builtin class-name">:</span> <span class="token number">17</span>.el7											<span class="token comment"># 释出的版本</span></span>
<span class="line">Architecture: x86_64											<span class="token comment"># 编译时所针对的硬件等级</span></span>
<span class="line">Install Date: Fri Oct  <span class="token number">4</span> <span class="token number">18</span>:22:43 <span class="token number">2019</span>		<span class="token comment"># 该软件安装到本系统的时间</span></span>
<span class="line">Group       <span class="token builtin class-name">:</span> System Environment/Base			<span class="token comment"># 软件是放在哪一个软件群组中</span></span>
<span class="line">Size        <span class="token builtin class-name">:</span> <span class="token number">107156</span>											<span class="token comment"># 软件的大小</span></span>
<span class="line">License     <span class="token builtin class-name">:</span> GPL+												<span class="token comment"># 释出的授权方式</span></span>
<span class="line">Signature   <span class="token builtin class-name">:</span> RSA/SHA256, Mon Nov <span class="token number">12</span> <span class="token number">22</span>:39:25 <span class="token number">2018</span>, Key ID 24c6a8a7f4a80eb5</span>
<span class="line">Source RPM  <span class="token builtin class-name">:</span> logrotate-3.8.6-17.el7.src.rpm	<span class="token comment"># SRPM 的文件名</span></span>
<span class="line">Build Date  <span class="token builtin class-name">:</span> Wed Oct <span class="token number">31</span> 03:13:00 <span class="token number">2018</span>				<span class="token comment"># 软件编译打包的时间</span></span>
<span class="line">Build Host  <span class="token builtin class-name">:</span> x86-01.bsys.centos.org					<span class="token comment"># 在哪一部主机上编译的</span></span>
<span class="line">Relocations <span class="token builtin class-name">:</span> <span class="token punctuation">(</span>not relocatable<span class="token punctuation">)</span></span>
<span class="line">Packager    <span class="token builtin class-name">:</span> CentOS BuildSystem <span class="token operator">&lt;</span>http://bugs.centos.org<span class="token operator">></span></span>
<span class="line">Vendor      <span class="token builtin class-name">:</span> CentOS</span>
<span class="line">URL         <span class="token builtin class-name">:</span> https://github.com/logrotate/logrotate</span>
<span class="line">Summary     <span class="token builtin class-name">:</span> Rotates, compresses, removes and mails system log files</span>
<span class="line">Description <span class="token builtin class-name">:</span>		<span class="token comment"># 详细描述</span></span>
<span class="line">The <span class="token function">logrotate</span> utility is designed to simplify the administration of</span>
<span class="line">log files on a system <span class="token function">which</span> generates a lot of log files.  Logrotate</span>
<span class="line">allows <span class="token keyword">for</span> the automatic rotation compression, removal and mailing of</span>
<span class="line">log files.  Logrotate can be <span class="token builtin class-name">set</span> to handle a log <span class="token function">file</span> daily, weekly,</span>
<span class="line">monthly or when the log <span class="token function">file</span> gets to a certain size.  Normally,</span>
<span class="line"><span class="token function">logrotate</span> runs as a daily <span class="token function">cron</span> job.</span>
<span class="line"></span>
<span class="line">Install the <span class="token function">logrotate</span> package <span class="token keyword">if</span> you need a utility to deal with the</span>
<span class="line">log files on your system.</span>
<span class="line"><span class="token comment"># 列出了很多的信息</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 4：分别仅找出 logrotate 的配置文件与说明文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qc logrotate</span></span>
<span class="line">/etc/cron.daily/logrotate</span>
<span class="line">/etc/logrotate.conf</span>
<span class="line">/etc/rwtab.d/logrotate</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qd logrotate</span></span>
<span class="line">/usr/share/doc/logrotate-3.8.6/CHANGES</span>
<span class="line">/usr/share/doc/logrotate-3.8.6/COPYING</span>
<span class="line">/usr/share/man/man5/logrotate.conf.5.gz</span>
<span class="line">/usr/share/man/man8/logrotate.8.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 5：若要成功安装 logrotate，还需要什么文件的帮忙</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qR logrotate</span></span>
<span class="line">/bin/sh</span>
<span class="line">/bin/sh</span>
<span class="line">config<span class="token punctuation">(</span>logrotate<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">3.8</span>.6-17.el7</span>
<span class="line">coreutils <span class="token operator">>=</span> <span class="token number">5.92</span></span>
<span class="line">libacl.so.1<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libacl.so.1<span class="token punctuation">(</span>ACL_1.0<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.14<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.2.5<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.3<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.3.4<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.4<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.7<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libc.so.6<span class="token punctuation">(</span>GLIBC_2.8<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libpopt.so.0<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libpopt.so.0<span class="token punctuation">(</span>LIBPOPT_0<span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">libselinux.so.1<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span></span>
<span class="line">popt</span>
<span class="line">rpmlib<span class="token punctuation">(</span>CompressedFileNames<span class="token punctuation">)</span> <span class="token operator">&lt;=</span> <span class="token number">3.0</span>.4-1</span>
<span class="line">rpmlib<span class="token punctuation">(</span>FileDigests<span class="token punctuation">)</span> <span class="token operator">&lt;=</span> <span class="token number">4.6</span>.0-1</span>
<span class="line">rpmlib<span class="token punctuation">(</span>PayloadFilesHavePrefix<span class="token punctuation">)</span> <span class="token operator">&lt;=</span> <span class="token number">4.0</span>-1</span>
<span class="line">rtld<span class="token punctuation">(</span>GNU_HASH<span class="token punctuation">)</span></span>
<span class="line">rpmlib<span class="token punctuation">(</span>PayloadIsXz<span class="token punctuation">)</span> <span class="token operator">&lt;=</span> <span class="token number">5.2</span>-1</span>
<span class="line"><span class="token comment"># 列出了该软件的依赖文件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 6：在范例 5 基础上，找出 /bin/sh 是哪个软件提供的？</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qf /bin/sh</span></span>
<span class="line">bash-4.2.46-33.el7.x86_64</span>
<span class="line"><span class="token comment"># 参数后，接的是文件，而不是软件名称</span></span>
<span class="line"><span class="token comment"># 该功能查询系统的某个文件属于哪一个软件的</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 7：假设我下载一个 RPM 文件，想要知道该文件的需求文件</span></span>
<span class="line"> <span class="token function">rpm</span> <span class="token parameter variable">-qpR</span> filename.i386.rpm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="练习题" tabindex="-1"><a class="header-anchor" href="#练习题"><span>练习题</span></a></h3>
<ol>
<li>
<p>想要知道系统中，以 C 开头的软件有几个</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qa | grep ^c | wc -l</span></span>
<span class="line"><span class="token number">65</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>www 服务器为 Apache，我知道它使用的 RPM 软件文件名为 httpd，要知道这个软件的所有配置文件放置何处</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qc httpd</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>承上题，如果查出来的配置文件已经被修改过，但是忘记修改了哪些地方，所以想要直接重新安装一次软件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">假设该软件在网络上的地址为：http://xxx.com/path/httpd-x.x.xx.i386.rpm</span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> http://xxx.com/path/httpd-x.x.xx.i386.rpm <span class="token parameter variable">--replacepkgs</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>如果误删了某个重要文件，如 <code v-pre>/etc/crontab</code> ，但不知道它属于哪一个软件，怎么办？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qf /etc/crontab </span></span>
<span class="line">crontabs-1.11-6.20121102git.el7.noarch</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h2 id="rpm-验证与数字签名-verify、signature" tabindex="-1"><a class="header-anchor" href="#rpm-验证与数字签名-verify、signature"><span>RPM 验证与数字签名（Verify、signature）</span></a></h2>
<p>验证功能主要作用是使用 <code v-pre>/var/lib/rpm</code> 下的数据库内容来比对目前 LInux 系统的环境下的偶有软件文件，是否有被修改过（笔者猜测可能是和原始安装文件中的文件对比？）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-Va</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-V</span> 已安装的软件名称</span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-Vp</span> 某个 RPM 文件的文件名</span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-Vf</span> 在系统上的某个文件</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-V：后面加的是软件名称，若该软件所含的文件被修改过，才会列出来</span>
<span class="line">	-Va：列出目前系统上所有可能被修改过的文件</span>
<span class="line">	-Vp：后面加的是文件名，列出该软件内可能被修改过的文件</span>
<span class="line">	-Vf：列出某个文件是否被修改过</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出你的 Linux 内的 logrotate 软件是否被修改过</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -V logrotate</span></span>
<span class="line"><span class="token comment"># 没有任何信息，表示没有被修改过</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：查询下 /etc/crontab 是否被修改过</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -Vf /etc/crontab </span></span>
<span class="line">S.5<span class="token punctuation">..</span><span class="token punctuation">..</span>T.  c /etc/crontab</span>
<span class="line"><span class="token comment"># 因为被更改过，所以列出更改过的信息类型</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你是否有一个疑问？哪些文件是可以被用来查询是否有修改过的？还记得 rpm 的<code v-pre>-ql：列出该软件所有的文件与目录所在完整文件名（list）</code>？下面就来实践下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -ql logrotate</span></span>
<span class="line">/etc/cron.daily/logrotate</span>
<span class="line">/etc/logrotate.conf</span>
<span class="line">/etc/logrotate.d</span>
<span class="line">/etc/rwtab.d/logrotate</span>
<span class="line">/usr/sbin/logrotate</span>
<span class="line">/usr/share/doc/logrotate-3.8.6</span>
<span class="line">/usr/share/doc/logrotate-3.8.6/CHANGES</span>
<span class="line">/usr/share/doc/logrotate-3.8.6/COPYING</span>
<span class="line">/usr/share/man/man5/logrotate.conf.5.gz</span>
<span class="line">/usr/share/man/man8/logrotate.8.gz</span>
<span class="line">/var/lib/logrotate</span>
<span class="line">/var/lib/logrotate/logrotate.status</span>
<span class="line"><span class="token comment"># 该软件一共有 12 个文件，修改 /etc/logrotate.conf 内的 rotate 变成 6</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再看看该软件有哪些文件被修改过了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -V logrotate</span></span>
<span class="line"><span class="token punctuation">..</span><span class="token number">5</span><span class="token punctuation">..</span><span class="token punctuation">..</span>T.  c /etc/logrotate.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>文件名前面有一个 c 表示是 configuration （配置文件），前面一堆的含义如下：</p>
<ul>
<li>S：file Size differs，文件的容量大小已经改变</li>
<li>M：Mode differs，文件的类型或文件的属性（rwx）已经改变</li>
<li>5：MD5 sum differs，MD5 指纹码的内容已经改变</li>
<li>D：Device major/minor number mis-match，设备的主/次代码已经改变</li>
<li>L：readLink(2) path mis-match，Link 路径已经改变</li>
<li>U：User ownership differs，文件的所属人已经改变</li>
<li>G：Group ownership differs，文件的所属群组已被改变</li>
<li>T：mTime differs，文件的建立时间已被改变</li>
<li>P：caPabilities differ，功能已经改变</li>
</ul>
<p>所以当一个配置文件的所有信息都被修改过，则会显示 <code v-pre>SM5DLUGTP c filename</code></p>
<p>文件名前面的 c 表示是文件类型，有以下几类：</p>
<ul>
<li>c：配置文件 config file</li>
<li>d：文件数据文件 documentation</li>
<li>g：鬼文件 ghost file，通常是该文件不被某个软件包含，较少发生</li>
<li>l：许可证文件 license file</li>
<li>r：自述文件 read me</li>
</ul>
<p>通过该功能，如果这些修改是预期中的，就是正常的，比如你的 binary progran 都被修改过了，那么就要小心了（作者通过 rpm -Va 找出来好多 binary program 被修改过，被黑了，当成了跳板机）</p>
<h3 id="数字签名-digital-signature" tabindex="-1"><a class="header-anchor" href="#数字签名-digital-signature"><span>数字签名（digital signature）</span></a></h3>
<p>首先，安装软件时，去对比官方释出的 MD5 指纹，能对上则表示是官方释出的，但是 MD5 也可能被串改？用数字签名来校验软件的来源</p>
<p>厂商可以数字签名系统产生一个专属于该软件的签章，并将该签章的公钥（public key）释出，当安装一个 RPM 软件时：</p>
<ol>
<li>首先比如要先安装原厂释出的公钥文件</li>
<li>实际安装原厂的 RPM 软件时，rpm 指令会去读取 RPM 文件的签章信息，与本机系统内的签章信息比对</li>
<li>若签章相同则安装，若找不到相关的签章信息时，则给予警告并且停止安装</li>
</ol>
<p>CentOS 使用的数字签名系统为 GNU 计划的 GnuPG（GNU Privacy Guard）。有兴趣可以去详细了解下 GPG 的加密机制，这里简单的说明数字签名在 RPM 文件上的应用。</p>
<p>那么首选比如安装原厂释出的 GPG 数字签名的公钥文件，CentOS 的数字签名位于</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7 </span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">1690</span> <span class="token number">9</span>月   <span class="token number">5</span> <span class="token number">2019</span> /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7</span></span>
<span class="line">-----BEGIN PGP PUBLIC KEY BLOCK-----</span>
<span class="line">Version: GnuPG v1.4.5 <span class="token punctuation">(</span>GNU/Linux<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">mQINBFOn/0sBEADLDyZ+DQHkcTHDQSE0a0B2iYAEXwpPvs67cJ4tmhe/iMOyVMh9</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"><span class="token operator">=</span>OGYX</span>
<span class="line">-----END PGP PUBLIC KEY BLOCK-----</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么该文件可以通过如下的方式来安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>由于不同版本 GPG 密钥文件放置的位置可能不同，不过大多是以 GPG-KEY 来命名的，可以简单时候 locate 或 find 来寻找</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># locate GPG-KEY</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># find /etc -name '*GPG-KEY*'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>安装完成后，这个密钥的内容基本上以 pubkey 的软件名称来呈现</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qa | grep pubkey</span></span>
<span class="line">gpg-pubkey-f4a80eb5-53a7ff4b</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qi gpg-pubkey-f4a80eb5-53a7ff4b</span></span>
<span class="line">Name        <span class="token builtin class-name">:</span> gpg-pubkey</span>
<span class="line">Version     <span class="token builtin class-name">:</span> f4a80eb5</span>
<span class="line">Release     <span class="token builtin class-name">:</span> 53a7ff4b</span>
<span class="line">Architecture: <span class="token punctuation">(</span>none<span class="token punctuation">)</span></span>
<span class="line">Install Date: <span class="token number">2020</span>年04月05日 星期日 <span class="token number">16</span>时21分30秒</span>
<span class="line">Group       <span class="token builtin class-name">:</span> Public Keys</span>
<span class="line">Size        <span class="token builtin class-name">:</span> <span class="token number">0</span></span>
<span class="line">License     <span class="token builtin class-name">:</span> pubkey</span>
<span class="line">Signature   <span class="token builtin class-name">:</span> <span class="token punctuation">(</span>none<span class="token punctuation">)</span></span>
<span class="line">Source RPM  <span class="token builtin class-name">:</span> <span class="token punctuation">(</span>none<span class="token punctuation">)</span></span>
<span class="line">Build Date  <span class="token builtin class-name">:</span> <span class="token number">2014</span>年06月23日 星期一 <span class="token number">18</span>时19分55秒</span>
<span class="line">Build Host  <span class="token builtin class-name">:</span> localhost</span>
<span class="line">Relocations <span class="token builtin class-name">:</span> <span class="token punctuation">(</span>not relocatable<span class="token punctuation">)</span></span>
<span class="line">Packager    <span class="token builtin class-name">:</span> CentOS-7 Key <span class="token punctuation">(</span>CentOS <span class="token number">7</span> Official Signing Key<span class="token punctuation">)</span> <span class="token operator">&lt;</span>security@centos.org<span class="token operator">></span></span>
<span class="line">Summary     <span class="token builtin class-name">:</span> gpg<span class="token punctuation">(</span>CentOS-7 Key <span class="token punctuation">(</span>CentOS <span class="token number">7</span> Official Signing Key<span class="token punctuation">)</span> <span class="token operator">&lt;</span>security@centos.org<span class="token operator">></span><span class="token punctuation">)</span></span>
<span class="line">Description <span class="token builtin class-name">:</span></span>
<span class="line">-----BEGIN PGP PUBLIC KEY BLOCK-----</span>
<span class="line">Version: rpm-4.11.3 <span class="token punctuation">(</span>NSS-3<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">mQINBFOn/0sBEADLDyZ+DQHkcTHDQSE0a0B2iYAEXwpPvs67cJ4tmhe/iMOyVMh9</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"><span class="token operator">=</span>OGYX</span>
<span class="line">-----END PGP PUBLIC KEY BLOCK-----</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重点是最后面出现的一串数据，如果你忘记加上数字签名，很多原版软件就不能让你安装，除非使用 rpm 时选择忽略数字签名的选项</p>
<p>笔者疑问：这个数值签名是系统自动安装的，是随机的吗？那么多版本的系统和软件，难道都公用同一个？这个笔者有点想不通</p>
<h2 id="rpm-卸载与重建数据库-erase-rebuilddb" tabindex="-1"><a class="header-anchor" href="#rpm-卸载与重建数据库-erase-rebuilddb"><span>RPM 卸载与重建数据库（erase/rebuilddb）</span></a></h2>
<p>卸载软件，要注意的是，由最上层往下卸载，啥意思？由于有函数库软件依赖等原因，要正常卸载的话，只能卸载掉一个没有被依赖的软件或则函数库，有依赖的就会导致无法卸载。下面一个案例说明</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 好处与 pam 有关的软件名称，并尝试移除 pam 软件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qa | grep pam</span></span>
<span class="line">fprintd-pam-0.8.1-2.el7.x86_64</span>
<span class="line">gnome-keyring-pam-3.28.2-1.el7.x86_64</span>
<span class="line">pam-1.1.8-22.el7.x86_64</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -e pam </span></span>
<span class="line">error: Failed dependencies: <span class="token comment"># 检测到有很多软件依赖了它，不能删除</span></span>
<span class="line">	libpam.so.0<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span> is needed by <span class="token punctuation">(</span>installed<span class="token punctuation">)</span> libpwquality-1.2.3-5.el7.x86_64</span>
<span class="line">	libpam.so.0<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span> is needed by <span class="token punctuation">(</span>installed<span class="token punctuation">)</span> libuser-0.60-9.el7.x86_64</span>
<span class="line">	libpam.so.0<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span> is needed by <span class="token punctuation">(</span>installed<span class="token punctuation">)</span> passwd-0.79-5.el7.x86_64</span>
<span class="line">	libpam.so.0<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>64bit<span class="token punctuation">)</span> is needed by <span class="token punctuation">(</span>installed<span class="token punctuation">)</span> util-linux-2.23.2-61.el7.x86_64</span>
<span class="line">	</span>
<span class="line"><span class="token comment"># 2. 若移除 rp-pppoe 软件就可以</span></span>
<span class="line"><span class="token comment"># rp-pppoe 软件是本章练习安装的，所以没有任何软件依赖它</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -e rp-pppoe</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于 RPM 文件常常会安装、移除、升级等，某些动作可能会导致 RPM 数据库 <code v-pre>/var/lib/rpm/</code> 内的文件破损。此时你可以重建它</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">rpm</span> <span class="token parameter variable">--rebuilddb</span>   <span class="token comment"># 重建数据库</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


