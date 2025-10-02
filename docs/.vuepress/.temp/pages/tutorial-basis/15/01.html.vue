<template><div><h1 id="什么是例行性工作排程" tabindex="-1"><a class="header-anchor" href="#什么是例行性工作排程"><span>什么是例行性工作排程</span></a></h1>
<p>翻译下就是：定时任务，按你设置的时间轨迹执行脚本</p>
<p>在 Linux 中是通过 crontab 与 at 来实现的</p>
<h2 id="种类-at、cron" tabindex="-1"><a class="header-anchor" href="#种类-at、cron"><span>种类：at、cron</span></a></h2>
<p>两种定时任务方式：</p>
<ul>
<li>循环：每隔一定的周期执行一次</li>
<li>一次：只触发一次</li>
</ul>
<h3 id="at" tabindex="-1"><a class="header-anchor" href="#at"><span>at</span></a></h3>
<p>可以处理仅执行一次就结束的指令，不过执行 at 时，必须有 atd 服务（第 17 章会讲解）。</p>
<p>在某些新版的 distribution 中，atd 可能预设并没有启动，那么 at 制造令就会失效。不过我们按照的 CentOS 预设是启动的</p>
<h3 id="crontab" tabindex="-1"><a class="header-anchor" href="#crontab"><span>crontab</span></a></h3>
<p>循环触发，可循环的时间为分钟、小时、每周、每月或每年等。</p>
<p>crontab 除了可以使用指令执行外，还可以编辑 <code v-pre>/etc/crontab</code> 来支持。</p>
<p>让 crontab 可以生效的服务是 crond 服务</p>
<p>下面你来谈谈 Linux 系统为什么有那么多的功定时任务进行？然后再来谈 at 和 crontab</p>
<h2 id="centos-系统上常见的例行工作" tabindex="-1"><a class="header-anchor" href="#centos-系统上常见的例行工作"><span>CentOS 系统上常见的例行工作</span></a></h2>
<p>你大概会发现 Linux 会主动帮我们进行一些工作，比如自动进行在线更新（on-line update），自动进行 <RouteLink to="/tutorial-basis/06/05.html#locate-updatedb"> updatedb</RouteLink> 更新文件名数据库、自动的对登录文件分析（所以 root 常常会收到标题为 logwatch 的信件）等。基本上 Linux 系统常见的例行任务有：</p>
<ul>
<li>
<p>进行登录文件的轮替（log rotate）</p>
<p>Linux 会将系统所发生的各种信息记录下来，这就是登录文件（第 18 章讲解）。所以文件会越来越大，log rotate 将旧的数据和新的数据分辨存放（类似归档），这是系统必要的例行任务</p>
</li>
<li>
<p>登录文件分析 logwatch 任务</p>
<p>如果系统发生了软件问题、硬件错误等问题，绝大部分的错误信息都会被记录到登录文件中，由于该文件数据很复杂，使用 vim 观察难度太大，可以使用 logwatch 来主动分析登录信息，所以你的 root 账户可能会经常受到标题为 logwatch 的信件</p>
</li>
<li>
<p>建立 locate 数据库</p>
<p>第 6 章中讲解到 locate 指令，通过已经存在的文件名数据库来进行系统上文件名的查询，<code v-pre>/var/lib/mlocate</code> 数据库文件，定时任务定期执行 updatedb 指令完成的</p>
</li>
<li>
<p>man page 查询数据库的建立</p>
<p>与 locate 的数据库类似，可提供快速查询的 man page db 也是个数据库，需要使用 mandb 来定期自动执行</p>
</li>
<li>
<p>RPM 软件登录文件的建立</p>
<p>RPM（第 22 章）是一种软件管理机制。软件的新安装、非经常性更新等，都会造成软件文件名的差异，为了方便未来追踪，系统会将文件名作个排序记录，有时候会动过排程来帮忙 RPM 数据库的重新建立</p>
</li>
<li>
<p>移除暂存文件</p>
<p>某些软件运行过程中会产生一些暂存文件，软件关闭时，可能不会主动的移除这些文件，有些暂存盘则有时性，超过一段时间后，这个暂存就没有效了，系统会通过排程来执行 tmpwatch 指令来删除这些暂存文件</p>
</li>
<li>
<p>与网络服务有关的分析行为</p>
<p>类似 www 服务器软件（apache），那么 Linux 系统通常会主动的分析该软件的登录文件。同时某些凭证与认证的网络信息是否过期的问题，也会自动检查</p>
</li>
</ul>
<p>还有一部分软件安装之后，会附上分析功能，那么也会多出来一些定时任务</p>
</div></template>


