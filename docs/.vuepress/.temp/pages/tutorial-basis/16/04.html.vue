<template><div><h2 id="特殊文件与进程" tabindex="-1"><a class="header-anchor" href="#特殊文件与进程"><span>特殊文件与进程</span></a></h2>
<p>在第 6 章中讲到特殊权限 SUID、SGID、SBIT，那么这些权限对于你的 <strong>进程</strong> 是如何影响的？进程用到的系统资源，比如硬盘资源，使用 umount 硬盘时，出现提示 「device is busy」的提示是怎么回事？</p>
<h2 id="具有-suid、sgid-权限的指令执行状态" tabindex="-1"><a class="header-anchor" href="#具有-suid、sgid-权限的指令执行状态"><span>具有 SUID、SGID 权限的指令执行状态</span></a></h2>
<p>SUID 的权限与进程的相关性非常大，SUID 的程序是如何被一般用户执行，具有什么特色？</p>
<ul>
<li>SUID 权限仅对二进制程序（binary program）有效</li>
<li>执行者对于该进程需要具有 x 的可执行权限</li>
<li>本权限仅在执行程序的过程中有效（run-time）</li>
<li>执行者将具有该程序拥有者（owner）的权限</li>
</ul>
<p>所以，整个 SUID 的权限会生效是由于<strong>具有该权限的程序被触发</strong>，一个进程表示一个程序的运行，所以执行者可以具有程序拥有者的权限就是在该程序变成进程的时候</p>
<p>比如执行了 passwd 后你就具有 root 的权限？是因为你再触发 passwd 后，会取得一个新的进程与 PID，该 PID 产生时通过 SUID 来给予该 PID 特殊的权限设置</p>
<p>下面使用 mrcode 登录系统并执行 passwd 后，通过工作控制来理解</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>C</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">passwd</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user mrcode.</span>
<span class="line">Changing password <span class="token keyword">for</span> mrcode.</span>
<span class="line"><span class="token punctuation">(</span>current<span class="token punctuation">)</span> UNIX password: 		<span class="token comment"># 这里按下 ctrl + z，并按下 enter 键</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>+  Stopped                 <span class="token function">passwd</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ pstree <span class="token parameter variable">-uA</span></span>
<span class="line">systemd-+-ModemManager---2*<span class="token punctuation">[</span><span class="token punctuation">{</span>ModemManager<span class="token punctuation">}</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token operator">|</span>-sshd-+-sshd---sshd<span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>-+-bash---su<span class="token punctuation">(</span>root<span class="token punctuation">)</span>---bash</span>
<span class="line">        <span class="token operator">|</span>      <span class="token operator">|</span>                     <span class="token operator">|</span>-bash---top</span>
<span class="line">        <span class="token operator">|</span>      <span class="token operator">|</span>                     <span class="token operator">|</span>-bash---sleep</span>
<span class="line">        <span class="token operator">|</span>      <span class="token operator">|</span>                     <span class="token variable"><span class="token variable">`</span>-sftp-server</span>
<span class="line">        <span class="token operator">|</span>      <span class="token variable">`</span></span>-sshd---sshd<span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>-+-bash-+-passwd<span class="token punctuation">(</span>root<span class="token punctuation">)</span></span>
<span class="line">        <span class="token operator">|</span>                            <span class="token operator">|</span>      <span class="token variable"><span class="token variable">`</span><span class="token parameter variable">-pstree</span></span>
<span class="line">        <span class="token operator">|</span>                            <span class="token operator">|</span>-bash---top</span>
<span class="line">        <span class="token operator">|</span>                            <span class="token operator">|</span>-bash---sleep</span>
<span class="line">        <span class="token operator">|</span>                            <span class="token variable">`</span></span>-sftp-server</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面的进程来看，在执行 passwd 前是 mrcode 的权限，passwd 则是 root 权限，passwd 是由 bash 衍生出来的，但是权限不一样，这样一来就能理解为什么不同程序所产生的权限不同了，是由于 SUID 程序运行过程中产生的进程的关系</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">type</span> <span class="token function">passwd</span></span>
<span class="line"><span class="token function">passwd</span> is hashed <span class="token punctuation">(</span>/usr/bin/passwd<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll /usr/bin/passwd</span>
<span class="line">-rwsr-xr-x. <span class="token number">1</span> root root <span class="token number">27856</span> Aug  <span class="token number">9</span>  <span class="token number">2019</span> /usr/bin/passwd</span>
<span class="line"><span class="token comment">#可以看到，的确该指令也有 s 权限</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还可以通过以下指令查找 SUID/SGID 的文件</span></span>
<span class="line"><span class="token function">find</span> / <span class="token parameter variable">-perm</span> /6000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="proc-代表的意义" tabindex="-1"><a class="header-anchor" href="#proc-代表的意义"><span><code v-pre>/proc/*</code> 代表的意义</span></a></h2>
<p>进程在内存中，内存中的数据都是写入到 <code v-pre>/proc/*</code> 目录下的，可以直接查看该目录</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll /proc/</span>
<span class="line">total <span class="token number">0</span></span>
<span class="line">dr-xr-xr-x.  <span class="token number">9</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 <span class="token number">1</span></span>
<span class="line">dr-xr-xr-x.  <span class="token number">9</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 <span class="token number">10</span></span>
<span class="line">dr-xr-xr-x.  <span class="token number">9</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 <span class="token number">11</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">dr-xr-xr-x.  <span class="token number">2</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 sysvipc</span>
<span class="line">-r--r--r--.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 timer_list</span>
<span class="line">-rw-r--r--.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 timer_stats</span>
<span class="line">dr-xr-xr-x.  <span class="token number">4</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 <span class="token function">tty</span></span>
<span class="line">-r--r--r--.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:16 <span class="token function">uptime</span></span>
<span class="line">-r--r--r--.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 version</span>
<span class="line">-r--------.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 vmallocinfo</span>
<span class="line">-r--r--r--.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 <span class="token function">vmstat</span></span>
<span class="line">-r--r--r--.  <span class="token number">1</span> root           root                         <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:54 zoneinfo</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基本上，目前主机上面的各个进程的 PID 都是以目录的形态存在该目录中。如第 1 行的 PID 为 1，它是开机执行的第一个程序 systemd，该 PID 的所有相关信息都写入在 <code v-pre>/proc/1/*</code> 下面</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /proc/1</span></span>
<span class="line">total <span class="token number">0</span></span>
<span class="line">dr-xr-xr-x. <span class="token number">2</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:48 attr</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:53 autogroup</span>
<span class="line">-r--------. <span class="token number">1</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:53 auxv</span>
<span class="line">-r--r--r--. <span class="token number">1</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 cgroup</span>
<span class="line">-r--r--r--. <span class="token number">1</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 cmdline			<span class="token comment"># 指令串</span></span>
<span class="line">-r--------. <span class="token number">1</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 environ			<span class="token comment"># 一些环节变量</span></span>
<span class="line">lrwxrwxrwx. <span class="token number">1</span> root root <span class="token number">0</span> Mar <span class="token number">15</span> <span class="token number">20</span>:13 exe -<span class="token operator">></span> /usr/lib/systemd/systemd</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>里面数据很多，可以查询下 cmdline 的内容</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /proc/1/cmdline</span></span>
<span class="line">/usr/lib/systemd/systemd--switched-root--system--deserialize22</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>上面指令显示了是以什么参数启动的 systemd 指令，这个是针对 PID 有关的内容，下面是针对整个 Linux 系统相关的参数，对应与 /proc 目录下的文件如下</p>
<table>
<thead>
<tr>
<th>文件名</th>
<th>文件内容</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>/proc/cmdline</code></td>
<td>加载 kernel 时所下达的相关指令与参数，查询此文件，可了解指令是如何启动的</td>
</tr>
<tr>
<td><code v-pre>/proc/cpuinfo</code></td>
<td>本机的 CPU 相关信息，包含频率、类型与计算功能等</td>
</tr>
<tr>
<td><code v-pre>/proc/devices</code></td>
<td>系统各个主要装置的主要装置代号，与 mknod 有关</td>
</tr>
<tr>
<td><code v-pre>/proc/filesystems</code></td>
<td>目前系统已经加载的文件系统</td>
</tr>
<tr>
<td><code v-pre>/proc/interrupts</code></td>
<td>目前系统上 IRQ 分配状态</td>
</tr>
<tr>
<td><code v-pre>/proc/ioports</code></td>
<td>目前系统上各个装置所配置的 I/O 地址</td>
</tr>
<tr>
<td><code v-pre>/proc/kcore</code></td>
<td>内存大小，很大？不要读取该文件</td>
</tr>
<tr>
<td><code v-pre>/proc/loadavg</code></td>
<td>top 以及 uptime 的三个平均数值就是记录在这里的</td>
</tr>
<tr>
<td><code v-pre>/proc/meminfo</code></td>
<td>使用 free 列出的内存信息，在这里也可以查询到</td>
</tr>
<tr>
<td><code v-pre>/proc/modules</code></td>
<td>目前我们 LInux 已经加载的模块列表，可以看成是驱动程序</td>
</tr>
<tr>
<td><code v-pre>/proc/mounts</code></td>
<td>系统已经挂载的数据，就是用 mount 指令查询出来的数据</td>
</tr>
<tr>
<td><code v-pre>/proc/swaps</code></td>
<td>系统挂载的内存在哪里？使用掉的 partition 记录在这里</td>
</tr>
<tr>
<td><code v-pre>/proc/partitions</code></td>
<td>使用 fsidk -l 会出现目前所有的 partition，在该文件中也有记录</td>
</tr>
<tr>
<td><code v-pre>/proc/uptime</code></td>
<td>使用 uptime 出现的信息</td>
</tr>
<tr>
<td><code v-pre>/proc/version</code></td>
<td>核心的版本，使用 uname -a 显示的信息</td>
</tr>
<tr>
<td><code v-pre>/proc/bus/*</code></td>
<td>一些总线的装置，还有 USB 的装置也记录在这里</td>
</tr>
</tbody>
</table>
<p>这些文件内容建议使用 cat 去查阅看看，不必深入了解，如果未来你要写某些工具软件，那么这个目录下相关文件可能会对你有点帮助</p>
<h2 id="查询已开启文件或已执行进程开启之文件" tabindex="-1"><a class="header-anchor" href="#查询已开启文件或已执行进程开启之文件"><span>查询已开启文件或已执行进程开启之文件</span></a></h2>
<p>还有一些与进程相关的指令可以参考与应用</p>
<h3 id="fuser-由文件-或文件系统-找出正在使用该文件的进程" tabindex="-1"><a class="header-anchor" href="#fuser-由文件-或文件系统-找出正在使用该文件的进程"><span>fuser：由文件（或文件系统）找出正在使用该文件的进程</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">fuser</span> <span class="token punctuation">[</span>-umv<span class="token punctuation">]</span> <span class="token punctuation">[</span>-k <span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token punctuation">[</span>signal<span class="token punctuation">]</span><span class="token punctuation">]</span> file/dir</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-u：除了进程的 PID 之外，同时列出该进程的拥有者</span>
<span class="line">	-m：后面接的文件名会主动的上提到该文件系统的最顶层，对 <span class="token function">umount</span> 不成功很有效</span>
<span class="line">	-v：可以列出每个文件与进程还有指令的完整相关性</span>
<span class="line">	-k：找出使用该文件/目录的 PID，并试图以 SIGKILL 这个信号给予该 PID</span>
<span class="line">	-i：必须与 <span class="token parameter variable">-k</span> 配合使用，在删除 PID 之前会先询问使用者</span>
<span class="line">	-signal：例如 <span class="token parameter variable">-1</span> <span class="token parameter variable">-15</span> 等，若不加的话，预设是 -9：SIGKILL</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：找出目前所在目录的使用 PID、所属账户、权限</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fuser -uv .</span></span>
<span class="line">                     <span class="token environment constant">USER</span>        PID ACCESS COMMAND</span>
<span class="line">/root:               root       <span class="token number">2604</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>bash</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有一个进程属于 root，而 ACCESS 项则略为复杂一点：</p>
<ul>
<li>c：此进程在当前的目录下（非次目录）</li>
<li>e：可被触发为执行状态</li>
<li>f：是一个被开启的文件</li>
<li>r：代表顶层目录（root directory）</li>
<li>F：该文件被开启了，不过在等待回应中</li>
<li>m：可能为分享的动态函数库</li>
</ul>
<p>如果想知道某个文件系统下又多少进程正在占用该文件系统时，可以使用 <code v-pre>-m</code> 选项</p>
<p>下面做几个简单测试，包括实体文件系统挂载与 /proc 虚拟文件系统的内容，看看有多少的进程对这些挂载点或其他目录的使用状态</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：找到所有使用到 /proc 这个文件系统的进程</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fuser -uv /proc/</span></span>
<span class="line">                     <span class="token environment constant">USER</span>        PID ACCESS COMMAND</span>
<span class="line">/proc:               root     kernel <span class="token function">mount</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>/proc</span>
<span class="line">                     rtkit       <span class="token number">834</span> .rc<span class="token punctuation">..</span> <span class="token punctuation">(</span>rtkit<span class="token punctuation">)</span>rtkit-daemon</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fuser -muv /proc/</span></span>
<span class="line">                     <span class="token environment constant">USER</span>        PID ACCESS COMMAND</span>
<span class="line">/proc:               root     kernel <span class="token function">mount</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>/proc</span>
<span class="line">                     root          <span class="token number">1</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>systemd</span>
<span class="line">                     root        <span class="token number">589</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>systemd-journal</span>
<span class="line">                     rtkit       <span class="token number">834</span> .rc<span class="token punctuation">..</span> <span class="token punctuation">(</span>rtkit<span class="token punctuation">)</span>rtkit-daemon</span>
<span class="line">                     root        <span class="token number">844</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>udisksd</span>
<span class="line">                     root        <span class="token number">929</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>NetworkManager</span>
<span class="line">                     root       <span class="token number">1277</span> F<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>libvirtd</span>
<span class="line">                     root       <span class="token number">1638</span> F<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>X</span>
<span class="line">                     gdm        <span class="token number">1693</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>gdm<span class="token punctuation">)</span>gnome-shell</span>
<span class="line">                     root       <span class="token number">1759</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>packagekitd</span>
<span class="line">                     mrcode     <span class="token number">2280</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>top</span>
<span class="line">                     mrcode     <span class="token number">7722</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>top</span>
<span class="line"><span class="token comment"># 这就能看到有几个程序在对该目录进行存取</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：找到所有使用到 /home 这个文件系统的进程</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo $$</span></span>
<span class="line"><span class="token number">2604</span>				<span class="token comment"># 先确定下自己的 bash 的进程 PID</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment">#  cd /home/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study home<span class="token punctuation">]</span><span class="token comment"># fuser -muv .</span></span>
<span class="line">                     <span class="token environment constant">USER</span>        PID ACCESS COMMAND</span>
<span class="line">/home:               root     kernel <span class="token function">mount</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>/home</span>
<span class="line">                     mrcode     <span class="token number">1346</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>bash</span>
<span class="line">                     mrcode     <span class="token number">1371</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>bash</span>
<span class="line">                     mrcode     <span class="token number">1378</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>sleep</span>
<span class="line">                     mrcode     <span class="token number">1399</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>sleep</span>
<span class="line">                     mrcode     <span class="token number">1958</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>bash</span>
<span class="line">                     mrcode     <span class="token number">1991</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>sftp-server</span>
<span class="line">                     mrcode     <span class="token number">1992</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>bash</span>
<span class="line">                     mrcode     <span class="token number">2280</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>top</span>
<span class="line">                     root       <span class="token number">2604</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>bash			<span class="token comment"># 看这里，自己的 bash 存在列表中</span></span>
<span class="line">                     mrcode     <span class="token number">7294</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>bash</span>
<span class="line">                     mrcode     <span class="token number">7358</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>sftp-server</span>
<span class="line">                     mrcode     <span class="token number">7362</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>bash</span>
<span class="line">                     mrcode     <span class="token number">7722</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>top</span>
<span class="line">                     root       <span class="token number">8884</span> <span class="token punctuation">..</span>c<span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>passwd</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study home<span class="token punctuation">]</span><span class="token comment"># cd ~</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># umount /home/</span></span>
<span class="line">umount: /home: target is busy.</span>
<span class="line">        <span class="token punctuation">(</span>In some cases useful info about processes that use</span>
<span class="line">         the device is found by lsof<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> or fuser<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">))</span></span>
<span class="line"><span class="token comment"># 通过 fuser 知道有好几个进程在该目录下运行，可以通过如下的方式一个一个删除</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fuser -mki /home/</span></span>
<span class="line">/home:                7294c  7358c  7362c  7722c  8884c 19238c 19289c 19291c 19601c 25650c 25674c 25685c 25746c</span>
<span class="line">Kill process <span class="token number">7294</span> ? <span class="token punctuation">(</span>y/N<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 以上指令有一个问题，颇为棘手，就是很容易杀到自己 bash 的进程，那么久直接把直接踢掉了</span></span>
<span class="line"><span class="token comment"># 不知道这个这么排除掉是出方便的</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面可以针对整个文件系统，其实也可以针对单一文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 4：找到 /run 下属于 FIFO 类型的文件，并找出存取该文件的进程</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># find /run -type p</span></span>
<span class="line">/run/dmeventd-client</span>
<span class="line">/run/dmeventd-server</span>
<span class="line">/run/systemd/inhibit/7.ref</span>
<span class="line">/run/systemd/inhibit/6.ref</span>
<span class="line">/run/systemd/inhibit/5.ref</span>
<span class="line">/run/systemd/inhibit/4.ref</span>
<span class="line">/run/systemd/inhibit/2.ref</span>
<span class="line">/run/systemd/inhibit/1.ref</span>
<span class="line">/run/systemd/sessions/13.ref</span>
<span class="line">/run/systemd/sessions/5.ref</span>
<span class="line">/run/systemd/sessions/c1.ref</span>
<span class="line">/run/systemd/initctl/fifo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 随便找到文件测试</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fuser -uv /run/systemd/sessions/c1.ref</span></span>
<span class="line">                     <span class="token environment constant">USER</span>        PID ACCESS COMMAND</span>
<span class="line">/run/systemd/sessions/c1.ref:</span>
<span class="line">                     root        <span class="token number">842</span> f<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>systemd-logind</span>
<span class="line">                     root       <span class="token number">1649</span> F<span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>root<span class="token punctuation">)</span>gdm-session-wor</span>
<span class="line"><span class="token comment"># 通常系统的 FIFO 文件都会放置到 /run 下，通过该方式来追踪该文件存取的 process</span></span>
<span class="line"><span class="token comment"># 同样也能够看到系统有多忙碌（进程多当然就忙碌）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>fuser 的重点是可以让我们了解到某个文件系统或文件目前正在被哪些进程所使用</p>
<h3 id="lsof-列出被进程所开启的文件名" tabindex="-1"><a class="header-anchor" href="#lsof-列出被进程所开启的文件名"><span>lsof：列出被进程所开启的文件名</span></a></h3>
<p>fuser 是通过文件或则装置名去找使用它的进程，而 lsof 则是通过某个进程去找它开启或使用的文件与装置</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">lsof</span> <span class="token punctuation">[</span>-aUu<span class="token punctuation">]</span> <span class="token punctuation">[</span>+d<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-a：多想数据需要同时成立才显示出结果时</span>
<span class="line">	-U：仅列出 Unix like 系统的 socket 文件类型</span>
<span class="line">	-u：后面接 username，列出该使用者相关进程所开启的文件</span>
<span class="line">	+d：后面接目录，找出某个目录下已经被开启的文件</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出目前系统上所有已经被开启的文件与装置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsof</span></span>
<span class="line">libvirtd   <span class="token number">1277</span> <span class="token number">1318</span>           root  mem       REG              <span class="token number">253,0</span>     <span class="token number">53848</span>    <span class="token number">9645351</span> /usr/lib64/libavahi-common.so.3.5.3</span>
<span class="line">libvirtd   <span class="token number">1277</span> <span class="token number">1318</span>           root  mem       REG              <span class="token number">253,0</span>    <span class="token number">155784</span>    <span class="token number">8569818</span> /usr/lib64/libselinux.so.1</span>
<span class="line">libvirtd   <span class="token number">1277</span> <span class="token number">1318</span>           root  mem       REG              <span class="token number">253,0</span>     <span class="token number">37056</span>    <span class="token number">8655202</span> /usr/lib64/libacl.so.1.1.0</span>
<span class="line"><span class="token comment"># 文件很多很多，直接刷屏了</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：仅列出关于 root 的所有进程开启的 socket 文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsof -u root -a -U</span></span>
<span class="line">COMMAND     PID <span class="token environment constant">USER</span>   FD   TYPE             DEVICE SIZE/OFF   NODE NAME</span>
<span class="line">systemd       <span class="token number">1</span> root   12u  unix 0xffff8922437ed800      0t0  <span class="token number">12513</span> /run/systemd/private</span>
<span class="line">systemd       <span class="token number">1</span> root   13u  unix 0xffff892243dc2c00      0t0  <span class="token number">25917</span> /run/systemd/journal/stdout</span>
<span class="line">systemd       <span class="token number">1</span> root   15u  unix 0xffff892243e71800      0t0  <span class="token number">25941</span> /run/systemd/journal/stdout</span>
<span class="line">systemd       <span class="token number">1</span> root   16u  unix 0xffff892243e8fc00      0t0  <span class="token number">25942</span> /run/systemd/journal/stdout</span>
<span class="line">systemd       <span class="token number">1</span> root   17u  unix 0xffff892243e6ec00      0t0  <span class="token number">26002</span> /run/systemd/journal/stdout</span>
<span class="line">systemd       <span class="token number">1</span> root   18u  unix 0xffff892243e6dc00      0t0  <span class="token number">26009</span> /run/systemd/journal/stdout</span>
<span class="line">systemd       <span class="token number">1</span> root   23u  unix 0xffff89224359a800      0t0   <span class="token number">7620</span> /run/systemd/notify</span>
<span class="line"><span class="token comment"># 注意 -a 参数，分别执行 lsof -u root 及 lsof -U 信息都不同</span></span>
<span class="line"><span class="token comment"># -a 取他们的交集结果</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：列出目前系统上所有被启动的周边装置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsof +d /dev/</span></span>
<span class="line">COMMAND     PID           <span class="token environment constant">USER</span>   FD   TYPE             DEVICE SIZE/OFF NODE NAME</span>
<span class="line">systemd       <span class="token number">1</span>           root    0u   CHR                <span class="token number">1,3</span>      0t0 <span class="token number">5342</span> /dev/null</span>
<span class="line">systemd       <span class="token number">1</span>           root    1u   CHR                <span class="token number">1,3</span>      0t0 <span class="token number">5342</span> /dev/null</span>
<span class="line">systemd       <span class="token number">1</span>           root    2u   CHR                <span class="token number">1,3</span>      0t0 <span class="token number">5342</span> /dev/null</span>
<span class="line">systemd       <span class="token number">1</span>           root   27r   CHR             <span class="token number">10,235</span>      0t0 <span class="token number">7250</span> /dev/autofs</span>
<span class="line">systemd       <span class="token number">1</span>           root   30u  unix 0xffff8922436ce000      0t0 <span class="token number">7645</span> /dev/log</span>
<span class="line">kdevtmpfs    <span class="token number">13</span>           root  cwd    DIR                <span class="token number">0,5</span>     <span class="token number">3340</span>    <span class="token number">3</span> /dev</span>
<span class="line"><span class="token comment"># 因为都在目录中，所以搜索目录即可</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 4：列出 root 的 bash 程序开启的文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsof -u root | grep bash</span></span>
<span class="line">ksmtuned    <span class="token number">921</span> root  txt       REG              <span class="token number">253,0</span>    <span class="token number">964600</span>     <span class="token number">309027</span> /usr/bin/bash</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  cwd       DIR              <span class="token number">253,0</span>      <span class="token number">4096</span>   <span class="token number">25165889</span> /root</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  rtd       DIR              <span class="token number">253,0</span>       <span class="token number">251</span>         <span class="token number">64</span> /</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  txt       REG              <span class="token number">253,0</span>    <span class="token number">964600</span>     <span class="token number">309027</span> /usr/bin/bash</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span> <span class="token number">106075056</span>     <span class="token number">309022</span> /usr/lib/locale/locale-archive</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span>     <span class="token number">61624</span>    <span class="token number">8548289</span> /usr/lib64/libnss_files-2.17.so</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span>   <span class="token number">2156160</span>    <span class="token number">8532847</span> /usr/lib64/libc-2.17.so</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span>     <span class="token number">19288</span>    <span class="token number">8532853</span> /usr/lib64/libdl-2.17.so</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span>    <span class="token number">174576</span>    <span class="token number">8548350</span> /usr/lib64/libtinfo.so.5.9</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span>    <span class="token number">163400</span>    <span class="token number">8532840</span> /usr/lib64/ld-2.17.so</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  mem       REG              <span class="token number">253,0</span>     <span class="token number">26254</span>   <span class="token number">16946906</span> /usr/lib64/gconv/gconv-modules.cache</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root    0u      CHR              <span class="token number">136,0</span>       0t0          <span class="token number">3</span> /dev/pts/0</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root    1u      CHR              <span class="token number">136,0</span>       0t0          <span class="token number">3</span> /dev/pts/0</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root    2u      CHR              <span class="token number">136,0</span>       0t0          <span class="token number">3</span> /dev/pts/0</span>
<span class="line"><span class="token function">bash</span>      <span class="token number">20030</span> root  255u      CHR              <span class="token number">136,0</span>       0t0          <span class="token number">3</span> /dev/pts/0</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以通过范例 4 找出某个进程是否有启用哪些信息</p>
<h3 id="pidof-找出某个正在运行的程序的-pid" tabindex="-1"><a class="header-anchor" href="#pidof-找出某个正在运行的程序的-pid"><span>pidof：找出某个正在运行的程序的 PID</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">pidof <span class="token punctuation">[</span>-sx<span class="token punctuation">]</span> program_name</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-s：仅列出一个 PID 而不列出所有的 PID</span>
<span class="line">	-x：同时列出该程序可能的 <span class="token environment constant">PPID</span> 那个进程的 PID</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出目前系统上 systemd 以及 rsyslogd 这两个程序的 PID</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pidof systemd rsyslogd</span></span>
<span class="line"><span class="token number">1</span> <span class="token number">1265</span></span>
<span class="line"><span class="token comment"># 结果显示的是两个 PID</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>pidof 指令较简单，可配合 pas aux 与正则表示法，就可以很轻易的找到你想要的进程内容了。如果要找的是 bash，那就  pidof bash ，就列出一堆 PID 号码了</p>
</div></template>


