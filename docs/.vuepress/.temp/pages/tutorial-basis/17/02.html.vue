<template><div><h1 id="通过-systemctl-管理服务" tabindex="-1"><a class="header-anchor" href="#通过-systemctl-管理服务"><span>通过 systemctl 管理服务</span></a></h1>
<p>基本那个，systemd 启动服务的机制，主要是通过 systemctl 指令来处理。</p>
<p>而以前的 systemV 需要 service、chkconfig、setup、init 等指令来完成。</p>
<h2 id="管理单一服务-service-unit-的启动、开机启动与观察状态" tabindex="-1"><a class="header-anchor" href="#管理单一服务-service-unit-的启动、开机启动与观察状态"><span>管理单一服务 service unit 的启动、开机启动与观察状态</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">systemctl <span class="token punctuation">[</span>command<span class="token punctuation">]</span> <span class="token punctuation">[</span>unit<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">commond 主要有：</span>
<span class="line">	start： 立刻启动后面的 unit</span>
<span class="line">	stop：立刻关闭后面的 unit</span>
<span class="line">	restart：立刻关闭后启动后面的 unit</span>
<span class="line">	reload：不关闭后面的 unit 的情况下，重载配置文件，让设置生效</span>
<span class="line">	enable：设置开机启动</span>
<span class="line">	disable：取消开机启动</span>
<span class="line">	status：列出 unit 有没有正在执行、开机预设执行、登录等信息</span>
<span class="line">	is-active：目前是否在运行</span>
<span class="line">	is-enable：是否开机启动</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：看看目前 atd 这个服务的状态</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status atd.service </span></span>
<span class="line">* atd.service - Job spooling tools</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/atd.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:55 CST<span class="token punctuation">;</span> <span class="token number">1</span> day 5h ago</span>
<span class="line"> Main PID: <span class="token number">1398</span> <span class="token punctuation">(</span>atd<span class="token punctuation">)</span></span>
<span class="line">    Tasks: <span class="token number">1</span></span>
<span class="line">   CGroup: /system.slice/atd.service</span>
<span class="line">           `-1398 /usr/sbin/atd <span class="token parameter variable">-f</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:55 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started Job spooling tools.</span>
<span class="line"><span class="token comment"># 重点在第 2、3 行数据</span></span>
<span class="line"><span class="token comment"># Loaded：开机是否启动</span></span>
<span class="line"><span class="token comment"># Active：是否正在运行中</span></span>
<span class="line"><span class="token comment"># 最后一行：该服务的启动信息</span></span>
<span class="line"><span class="token comment"># 登录文件格式为：时间、信息发送主机、哪一个服务的信息、实际信息内容</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：正常关闭 atd 服务，非 kill -9</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop atd.service </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status atd.service </span></span>
<span class="line">* atd.service - Job spooling tools</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/atd.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span> since Wed <span class="token number">2020</span>-03-18 <span class="token number">16</span>:40:06 CST<span class="token punctuation">;</span> 13s ago</span>
<span class="line">  Process: <span class="token number">1398</span> <span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/atd <span class="token parameter variable">-f</span> <span class="token variable">$OPTS</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">0</span>/SUCCESS<span class="token punctuation">)</span></span>
<span class="line"> Main PID: <span class="token number">1398</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">0</span>/SUCCESS<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:55 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started Job spooling tools.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">16</span>:40:06 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopping Job spooling tools<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">16</span>:40:06 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped Job spooling tools.</span>
<span class="line"><span class="token comment"># 这下就明白了。后面两行信息是执行 stop 后发生的事件日志信息</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不要使用 kill 的方式来关掉一个正常的服务，否则 systemctl 无法监控该服务。上面信息的 Active 状态有如下几个常见的状态：</p>
<ul>
<li>
<p>active（running）：有一个或多个程序正在运行</p>
</li>
<li>
<p>active（exited）：仅执行一次就正常结束的服务，目前并没有任何程序在系统中执行。</p>
<p>比如：开机或是挂载时才会进行一次的 quotaon 功能，就是这种模式，quotaon 不需要一直执行，只需要执行一次之后，就交给文件系统自行处理了。通常用 bash shell 写的小型服务，大多属于此种类型（无需常驻内存）</p>
</li>
<li>
<p>active（waiting）：正在执行中中，不过在在等待其他的事件才能继续处理</p>
</li>
<li>
<p>inactive：这个服务目前没有运行</p>
</li>
</ul>
<p>开机预设状态有以下：</p>
<ul>
<li>enabled：开机执行</li>
<li>disabled：开机不执行</li>
<li>static：不可以自己启动。不过可能会被其他的 enabled 的服务来唤醒（依赖服务）</li>
<li>mask：无法被启动，因为已经被强制注销（非删除）。可通过 systemctl unmask 方式改回原本的状态</li>
</ul>
<h3 id="服务启动、关闭与观察联系" tabindex="-1"><a class="header-anchor" href="#服务启动、关闭与观察联系"><span>服务启动、关闭与观察联系</span></a></h3>
<p>习题 1：找到系统中名为 chronyd 的服务，观察此服务状态，并将服务设置为：</p>
<ol>
<li>开机不会启动</li>
<li>现在状态是关闭的情况</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status chronyd.service </span></span>
<span class="line">* chronyd.service - NTP client/server</span>
<span class="line">	<span class="token comment"># 开机启动</span></span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/chronyd.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   <span class="token comment"># 正在运行中</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:42 CST<span class="token punctuation">;</span> <span class="token number">1</span> day 6h ago</span>
<span class="line">     Docs: man:chronyd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span></span>
<span class="line">           man:chrony.conf<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line">    Tasks: <span class="token number">1</span></span>
<span class="line">   CGroup: /system.slice/chronyd.service</span>
<span class="line">           `-933 /usr/sbin/chronyd</span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:39 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting NTP client/server<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:39 study.centos.mrcode chronyd<span class="token punctuation">[</span><span class="token number">933</span><span class="token punctuation">]</span>: chronyd version <span class="token number">3.4</span> starting <span class="token punctuation">(</span>+CMDMON +NTP +REFCLOCK +RTC +PRIVDROP +SCFILTER +SIGND +ASYNCDNS +SECHASH +IPV6 +DEBUG<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:39 study.centos.mrcode chronyd<span class="token punctuation">[</span><span class="token number">933</span><span class="token punctuation">]</span>: Frequency <span class="token number">0.000</span> +/- <span class="token number">1000000.000</span> ppm <span class="token builtin class-name">read</span> from /var/lib/chrony/drift</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:42 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Permission denied <span class="token keyword">while</span> opening PID <span class="token function">file</span> or unsafe symlink chain: /var/run/chrony/chronyd.pid</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:42 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started NTP client/server.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 取消开机启动</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl disable chronyd.service </span></span>
<span class="line">Removed symlink /etc/systemd/system/multi-user.target.wants/chronyd.service.</span>
<span class="line"><span class="token comment"># 取消开机启动，这里其实就是移除了 /etc/systemd/system 该目录下的一个链接文件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止该服务</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop chronyd.service </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status chronyd.service </span></span>
<span class="line">* chronyd.service - NTP client/server</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/chronyd.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span></span>
<span class="line">     Docs: man:chronyd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span></span>
<span class="line">           man:chrony.conf<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:39 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting NTP client/server<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:39 study.centos.mrcode chronyd<span class="token punctuation">[</span><span class="token number">933</span><span class="token punctuation">]</span>: chronyd version <span class="token number">3.4</span> starting <span class="token punctuation">(</span>+CMDMON +NTP +REFCLOCK +RTC +PRIVDROP +SCFILTER +SIGND +ASYNCDNS +SECHASH +IPV6 +DEBUG<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:39 study.centos.mrcode chronyd<span class="token punctuation">[</span><span class="token number">933</span><span class="token punctuation">]</span>: Frequency <span class="token number">0.000</span> +/- <span class="token number">1000000.000</span> ppm <span class="token builtin class-name">read</span> from /var/lib/chrony/drift</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:42 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Permission denied <span class="token keyword">while</span> opening PID <span class="token function">file</span> or unsafe symlink chain: /var/run/chrony/chronyd.pid</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:42 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started NTP client/server.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">16</span>:53:11 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopping NTP client/server<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">16</span>:53:11 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped NTP client/server.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>习题 2：将 cups 服务整个关闭（因为没有打印机安装在服务器上，也没有网络打印机）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status cups.service </span></span>
<span class="line">* cups.service - CUPS Printing Service</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/cups.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   <span class="token comment"># 书上这里状态是 inactive(dead) 没有运行状态，笔者这里确实在运行状态</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:55 CST<span class="token punctuation">;</span> <span class="token number">1</span> day 6h ago</span>
<span class="line"> Main PID: <span class="token number">1374</span> <span class="token punctuation">(</span>cupsd<span class="token punctuation">)</span></span>
<span class="line">   CGroup: /system.slice/cups.service</span>
<span class="line">           <span class="token variable"><span class="token variable">`</span><span class="token parameter variable">-1374</span> /usr/sbin/cupsd <span class="token parameter variable">-f</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:55 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started CUPS Printing Service.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 停止服务</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop cups.service </span></span>
<span class="line">Warning: Stopping cups.service, but it can still be activated by:</span>
<span class="line">  cups.path</span>
<span class="line">  cups.socket</span>
<span class="line"><span class="token comment"># 取消开机启动</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl disable cups.service </span></span>
<span class="line">Removed symlink /etc/systemd/system/multi-user.target.wants/cups.path.</span>
<span class="line">Removed symlink /etc/systemd/system/multi-user.target.wants/cups.service.</span>
<span class="line">Removed symlink /etc/systemd/system/sockets.target.wants/cups.socket.</span>
<span class="line">Removed symlink /etc/systemd/system/printer.target.wants/cups.service.</span>
<span class="line"><span class="token comment"># 这里一共移除了 4 个连结文件，说明这几个文件可能是相依赖性</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># netstat -tlunp | grep cups</span></span>
<span class="line"><span class="token comment"># cups 服务没有被启动，所以没有端口产生</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 尝试启动 cups.socket 监听客户端的需求</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl start cups.socket</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status cups.service cups.socket cups.path </span></span>
<span class="line">* cups.service - CUPS Printing Service</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/cups.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span> since Wed <span class="token number">2020</span>-03-18 <span class="token number">16</span>:57:19 CST<span class="token punctuation">;</span> 4min 8s ago</span>
<span class="line"> Main PID: <span class="token number">1374</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">0</span>/SUCCESS<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:55 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started CUPS Printing Service.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">16</span>:57:19 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopping CUPS Printing Service<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">16</span>:57:19 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped CUPS Printing Service.</span>
<span class="line"></span>
<span class="line">* cups.socket - CUPS Printing Service Sockets</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/cups.socket<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>listening<span class="token punctuation">)</span> since Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:38 CST<span class="token punctuation">;</span> <span class="token number">1</span> day 6h ago</span>
<span class="line">   Listen: /var/run/cups/cups.sock <span class="token punctuation">(</span>Stream<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:38 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Listening on CUPS Printing Service Sockets.</span>
<span class="line"></span>
<span class="line">* cups.path - CUPS Printer Service Spool</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/cups.path<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>waiting<span class="token punctuation">)</span> since Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:38 CST<span class="token punctuation">;</span> <span class="token number">1</span> day 6h ago</span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:38 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started CUPS Printer Service Spool.</span>
<span class="line"><span class="token comment"># 笔者这里和书上又不一样，书上 cups.path 是 inactive(dead) 状态，我这里则是等待状态</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 尝试使用 lp 指令打印</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo "testing" | lp</span></span>
<span class="line">lp: Error - no default destination available.</span>
<span class="line"><span class="token comment"># 实际上没有打印机，出现错误也正常</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status cups.service                       </span></span>
<span class="line">* cups.service - CUPS Printing Service</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/cups.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   <span class="token comment"># 被启动了</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Wed <span class="token number">2020</span>-03-18 <span class="token number">17</span>:03:17 CST<span class="token punctuation">;</span> 41s ago</span>
<span class="line"> Main PID: <span class="token number">23325</span> <span class="token punctuation">(</span>cupsd<span class="token punctuation">)</span></span>
<span class="line">    Tasks: <span class="token number">1</span></span>
<span class="line">   CGroup: /system.slice/cups.service</span>
<span class="line">           <span class="token variable">`</span></span><span class="token parameter variable">-23325</span> /usr/sbin/cupsd <span class="token parameter variable">-f</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:03:17 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started CUPS Printing Service.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># netstat -tlunp | grep cups</span></span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:631           <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">23325</span>/cupsd         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:631                 :::*                    LISTEN      <span class="token number">23325</span>/cupsd </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这里竟然被自动启动了，我们刚刚操作命名是 stop 了这个服务</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子充分演示了很多服务之间是有相依性的，cups 是一种打印服务，会启用 631 port 来提供网络打印机的打印功能。但是我们无需一直启动 631 的端口，因此，多了一个 cups.socket 的服务，这个服务可以在「用户有需要打印时，才会主动唤醒 cups.service」，由于有了这个特性，所以就算事先吧 3 个 cups 的服务都 stop 掉，当用户向其他两个 cups.path、cups.socket 提出要求时， cups.service 就会被唤醒</p>
<h3 id="强迫服务注销-mask-的练习" tabindex="-1"><a class="header-anchor" href="#强迫服务注销-mask-的练习"><span>强迫服务注销 mask 的练习</span></a></h3>
<p>比较正常的做法是：要关闭 cups.service 时，连同其他两个会唤醒 service 的 cups.socket 与 cups.path 都关闭，那就没有事情了。</p>
<p>不正常的做法是：强迫 cups.service 注销，通过 mask 方式</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop cups.service </span></span>
<span class="line">Warning: Stopping cups.service, but it can still be activated by:</span>
<span class="line">  cups.socket</span>
<span class="line">  cups.path</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl mask cups.service </span></span>
<span class="line">Created symlink from /etc/systemd/system/cups.service to /dev/null.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status cups.service </span></span>
<span class="line">* cups.service</span>
<span class="line">   Loaded: masked <span class="token punctuation">(</span>/dev/null<span class="token punctuation">;</span> bad<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span> since Wed <span class="token number">2020</span>-03-18 <span class="token number">17</span>:11:29 CST<span class="token punctuation">;</span> 32s ago</span>
<span class="line"> Main PID: <span class="token number">23325</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">0</span>/SUCCESS<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:03:17 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started CUPS Printing Service.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:11:29 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopping CUPS Printing Service<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:11:29 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped CUPS Printing Service.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl start cups.service </span></span>
<span class="line">Failed to start cups.service: Unit is masked.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过 mask 之后，他的连结文件被连结到了 <code v-pre>/dev/null</code>，所以就无法启动了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 取消注销</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl unmask cups.service </span></span>
<span class="line">Removed symlink /etc/systemd/system/cups.service.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status cups.service </span></span>
<span class="line">* cups.service - CUPS Printing Service</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/cups.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span> since Wed <span class="token number">2020</span>-03-18 <span class="token number">17</span>:11:29 CST<span class="token punctuation">;</span> 2min 30s ago</span>
<span class="line"> Main PID: <span class="token number">23325</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">0</span>/SUCCESS<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:03:17 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started CUPS Printing Service.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:11:29 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopping CUPS Printing Service<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">18</span> <span class="token number">17</span>:11:29 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped CUPS Printing Service.</span>
<span class="line"><span class="token comment"># 恢复正常了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="观察系统上所有的服务" tabindex="-1"><a class="header-anchor" href="#观察系统上所有的服务"><span>观察系统上所有的服务</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">systemctl <span class="token punctuation">[</span>command<span class="token punctuation">]</span><span class="token punctuation">[</span>--type<span class="token operator">=</span>TYPE<span class="token punctuation">]</span><span class="token punctuation">[</span>--all<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">command：</span>
<span class="line">	list-units：按 unit 列出目前有启动的 unit。若加上 <span class="token parameter variable">--all</span> 才会列出没有启动的</span>
<span class="line">	list-unit-files：按 <span class="token variable"><span class="token variable">`</span>/usr/lib/systemd/system<span class="token variable">`</span></span> 内的文件，将所有文件列表说明</span>
<span class="line">--type：之前提到过的 unit type，主要有 service、socket、target 等</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">范例 <span class="token number">1</span>：列出系统上有启动的 unit</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl</span></span>
<span class="line">UNIT                                                                                     LOAD   ACTIVE SUB       DESCRIPTION</span>
<span class="line">proc-sys-fs-binfmt_misc.automount                                                        loaded active waiting   Arbitrary Executable File Formats File System Automount Point</span>
<span class="line">sys-devices-pci0000:00-0000:00:03.0-net-enp0s3.device                                    loaded active plugged   82540EM Gigabit Ethernet Controller <span class="token punctuation">(</span>PRO/1000 MT Desktop Adapter<span class="token punctuation">)</span></span>
<span class="line">sys-devices-pci0000:00-0000:00:05.0-sound-card0.device                                   loaded active plugged   82801AA AC<span class="token string">'97 Audio Controller</span>
<span class="line">sys-devices-pci0000:00-0000:00:0d.0-ata3-host2-target2:0:0-2:0:0:0-block-sda-sda1.device loaded active plugged   VBOX_HARDDISK 1</span>
<span class="line">...</span>
<span class="line">vsftpd.service  loaded active running   Vsftpd ftp daemon</span>
<span class="line"></span>
<span class="line">LOAD   = Reflects whether the unit definition was properly loaded.</span>
<span class="line">ACTIVE = The high-level unit activation state, i.e. generalization of SUB.</span>
<span class="line">SUB    = The low-level unit activation state, values depend on unit type.</span>
<span class="line"></span>
<span class="line">152 loaded units listed. Pass --all to see loaded but inactive units, too.</span>
<span class="line">To show all installed unit files use '</span>systemctl list-unit-files'.</span>
<span class="line">lines <span class="token number">106</span>-160/160 <span class="token punctuation">(</span>END<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 服务太多了，个别字段含义如下</span></span>
<span class="line"><span class="token comment"># UNIT：项目名称，包括各个 unit 的类型（看扩展名）</span></span>
<span class="line"><span class="token comment"># LOAD：开机时是否会被加载，默认 systemctl 显示的是有加载的项目</span></span>
<span class="line"><span class="token comment"># ACTIVE：目前的状态，续与后续的 SUB 搭配，就是用 systemctl status 观察时，active 项目</span></span>
<span class="line"><span class="token comment"># DESCRIPTION：详细描述</span></span>
<span class="line"><span class="token comment"># 另外，systemctl 不加参数，预设是 list-units </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：列出所有已经安装的 unit 有哪些</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-unit-files </span></span>
<span class="line">UNIT FILE                                     STATE   </span>
<span class="line">proc-sys-fs-binfmt_misc.automount             static  </span>
<span class="line">dev-hugepages.mount                           static  </span>
<span class="line">dev-mqueue.mount                              static  </span>
<span class="line">proc-fs-nfsd.mount                            static  </span>
<span class="line">proc-sys-fs-binfmt_misc.mount                 static  </span>
<span class="line">sys-fs-fuse-connections.mount                 static  </span>
<span class="line">sys-kernel-config.mount                       static  </span>
<span class="line">sys-kernel-debug.mount                        static  </span>
<span class="line">tmp.mount                                     disabled</span>
<span class="line">var-lib-nfs-rpc_pipefs.mount                  static  </span>
<span class="line">brandbot.path                                 disabled</span>
<span class="line">cups.path                                     disabled</span>
<span class="line">systemd-ask-password-console.path             static  </span>
<span class="line">systemd-ask-password-plymouth.path            static  </span>
<span class="line">systemd-ask-password-wall.path                static  </span>
<span class="line">session-2.scope                               static  </span>
<span class="line">session-92.scope                              static  </span>
<span class="line">session-c1.scope                              static  </span>
<span class="line">abrt-ccpp.service                             enabled </span>
<span class="line">abrt-oops.service                             enabled </span>
<span class="line"><span class="token comment"># 会将系统上所有的服务都列出来，STATE 则是前面讲到过的</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：只列出某种类型的 unit</span></span>
<span class="line"><span class="token comment"># 这样就只会显示 .service 类型的服务了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-units --type=service --all</span></span>
<span class="line">  UNIT                                                  LOAD      ACTIVE   SUB     DESCRIPTION</span>
<span class="line">  abrt-ccpp.service                                     loaded    active   exited  Install ABRT coredump hook</span>
<span class="line">  abrt-oops.service                                     loaded    active   running ABRT kernel log watcher</span>
<span class="line">  abrt-vmcore.service                                   loaded    inactive dead    Harvest vmcores <span class="token keyword">for</span> ABRT</span>
<span class="line">  abrt-xorg.service                                     loaded    active   running ABRT Xorg log watcher</span>
<span class="line">  abrtd.service                                         loaded    active   running ABRT Automated Bug Reporting Tool</span>
<span class="line">  accounts-daemon.service                               loaded    active   running Accounts Service</span>
<span class="line">  alsa-restore.service                                  loaded    inactive dead    Save/Restore Sound Card State</span>
<span class="line">  alsa-state.service                                    loaded    active   running Manage Sound Card State <span class="token punctuation">(</span>restore and store<span class="token punctuation">)</span></span>
<span class="line">* apparmor.service                                      not-found inactive dead    apparmor.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查找是否有 cpu 为名的服务</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-units --type=service --all | grep cpu</span></span>
<span class="line">  cpupower.service                                      loaded    inactive dead    Configure CPU power related settings</span>
<span class="line"><span class="token comment"># CPU 电源管理机制的服务 </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="管理不同的操作环境-target-unit" tabindex="-1"><a class="header-anchor" href="#管理不同的操作环境-target-unit"><span>管理不同的操作环境（target unit）</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-units --type=target --all            </span></span>
<span class="line">  UNIT                   LOAD      ACTIVE   SUB    DESCRIPTION</span>
<span class="line">  basic.target           loaded    active   active Basic System</span>
<span class="line">  cryptsetup.target      loaded    active   active Local Encrypted Volumes</span>
<span class="line">* dbus.target            not-found inactive dead   dbus.target</span>
<span class="line">  emergency.target       loaded    inactive dead   Emergency Mode</span>
<span class="line">  final.target           loaded    inactive dead   Final Step</span>
<span class="line">  getty-pre.target       loaded    active   active Login Prompts <span class="token punctuation">(</span>Pre<span class="token punctuation">)</span></span>
<span class="line">  getty.target           loaded    active   active Login Prompts</span>
<span class="line">  graphical.target       loaded    active   active Graphical Interface</span>
<span class="line">  local-fs-pre.target    loaded    active   active Local File Systems <span class="token punctuation">(</span>Pre<span class="token punctuation">)</span></span>
<span class="line">  local-fs.target        loaded    active   active Local File Systems</span>
<span class="line">  multi-user.target      loaded    active   active Multi-User System</span>
<span class="line">  network-online.target  loaded    active   active Network is Online</span>
<span class="line">  network-pre.target     loaded    active   active Network <span class="token punctuation">(</span>Pre<span class="token punctuation">)</span></span>
<span class="line">  network.target         loaded    active   active Network</span>
<span class="line">  nfs-client.target      loaded    active   active NFS client services</span>
<span class="line">  nss-lookup.target      loaded    inactive dead   Host and Network Name Lookups</span>
<span class="line">  nss-user-lookup.target loaded    active   active User and Group Name Lookups</span>
<span class="line">  paths.target           loaded    active   active Paths</span>
<span class="line">  remote-fs-pre.target   loaded    active   active Remote File Systems <span class="token punctuation">(</span>Pre<span class="token punctuation">)</span></span>
<span class="line">  remote-fs.target       loaded    active   active Remote File Systems</span>
<span class="line">  rescue.target          loaded    inactive dead   Rescue Mode</span>
<span class="line">  rpc_pipefs.target      loaded    active   active rpc_pipefs.target</span>
<span class="line">  rpcbind.target         loaded    active   active RPC Port Mapper</span>
<span class="line">  shutdown.target        loaded    inactive dead   Shutdown</span>
<span class="line">  slices.target          loaded    active   active Slices</span>
<span class="line">  sockets.target         loaded    active   active Sockets</span>
<span class="line">  sound.target           loaded    active   active Sound Card</span>
<span class="line">  swap.target            loaded    active   active Swap</span>
<span class="line">  sysinit.target         loaded    active   active System Initialization</span>
<span class="line">* syslog.target          not-found inactive dead   syslog.target</span>
<span class="line">  time-sync.target       loaded    inactive dead   System Time Synchronized</span>
<span class="line">  timers.target          loaded    active   active Timers</span>
<span class="line">  umount.target          loaded    inactive dead   Unmount All Filesystems</span>
<span class="line"></span>
<span class="line">LOAD   <span class="token operator">=</span> Reflects whether the unit definition was properly loaded.</span>
<span class="line">ACTIVE <span class="token operator">=</span> The high-level unit activation state, i.e. generalization of SUB.</span>
<span class="line">SUB    <span class="token operator">=</span> The low-level unit activation state, values depend on unit type.</span>
<span class="line"></span>
<span class="line"><span class="token number">33</span> loaded <span class="token function">units</span> listed.</span>
<span class="line">To show all installed unit files use <span class="token string">'systemctl list-unit-files'</span><span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>笔者这里与书上也不太一样（可能还是因为系统版本的原因，我的比较新一点），有 33 个 target unit，与操作界面相关性较高的 target 主要有下面几个</p>
<ul>
<li>graphical.target：文字 + 图形界面，该项目已包含了下面的 multi-user.target 项目</li>
<li>multi-user.target：纯文本模式</li>
<li>rescue.target：在无法使用 root 登录的情况下，systemd 在开机时会多加一个额外的暂时系统，与你原本的系统无关。这时就可以取得 root 的权限来维护你的系统。由于是额外的系统，可能需要使用 chroot 方式来取得原有的系统（后续会讲解）</li>
<li>emergency.target：紧急处理系统的错误，需要使用 root 登录的情况，在无法使用 rescue.target 时，可以尝试使用该模式</li>
<li>shutdown.target：关机流程</li>
<li>getty.target：可以设置你需要几个 tty 之类的，如果想要降低 tty 的项目，可以修改该配置文件</li>
</ul>
<p>按功能分类如下：</p>
<ul>
<li>正常模式：graphical.target、multi-user.target</li>
<li>救援模式：rescue.target、emergency.target</li>
</ul>
<p>如何获取当前的模式与修改</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">systemctl <span class="token punctuation">[</span>command<span class="token punctuation">]</span> <span class="token punctuation">[</span>unit.target<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">command：</span>
<span class="line">	get-default：取得目前的 target</span>
<span class="line">	set-default：将 target 设置为默认的操作模式</span>
<span class="line">	isolate：切换到后面指定的操作模式</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：我们的测试机器默认是图形界面，先观察是否是图形模式，再将默认模式设置为文字模式</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl get-default </span></span>
<span class="line">graphical.target			<span class="token comment"># 果真是</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl set-default multi-user.target </span></span>
<span class="line">Removed symlink /etc/systemd/system/default.target.</span>
<span class="line">Created symlink from /etc/systemd/system/default.target to /usr/lib/systemd/system/multi-user.target.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl get-default </span></span>
<span class="line">multi-user.target</span>
<span class="line"><span class="token comment"># 已切换到文字模式为默认模式了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：在不重新启动的情况下，将目前的操作环境改为纯文本模式，关掉图形界面</span></span>
<span class="line">systemctl isolate multi-user.target</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：切换到图形界面</span></span>
<span class="line">systemctl isolate graphical.target</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：在 service 部分用 start、stop、restart ，在 target 中使用 上述提到的指令，isolate 切换；还提供了几个简单直观的指令使用</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">systemctl poweroff		<span class="token comment"># 系统关机</span></span>
<span class="line">systemctl <span class="token function">reboot</span>		<span class="token comment"># 重新启动</span></span>
<span class="line">systemctl <span class="token function">suspend</span>		<span class="token comment"># 进入暂停模式</span></span>
<span class="line">systemctl hibernate		<span class="token comment"># 进入休眠模式</span></span>
<span class="line">systemctl rescue		<span class="token comment"># 强制进入救援模式</span></span>
<span class="line">systemctl emergency		<span class="token comment"># 强制进入紧急救援模式</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>suspend：暂停模式</p>
<p>该模式会将系统的状态数据保存在内存中，然后关闭掉大部分的系统硬件，当用户按下唤醒机器的按钮，系统数据会从内存中恢复，然后重新驱动被大部分关闭的硬件，唤醒速度很快；</p>
</li>
<li>
<p>hibernate：休眠模式</p>
<p>将系统状态保存到硬盘中，保存完成后，计算机关闭。当用户尝试唤醒系统时，会开始正常工作，然后将保存在硬盘中的系统状态恢复回来。由于数据从硬盘读取，所以唤醒效率与硬盘速度有关</p>
</li>
</ul>
<h2 id="分析个服务之间的相依性" tabindex="-1"><a class="header-anchor" href="#分析个服务之间的相依性"><span>分析个服务之间的相依性</span></a></h2>
<p>本章开始讲到过 systemd 相依性的问题客服，那么，如何追踪某一个 unit 的相依性呢？比如怎么知道 <code v-pre>graphical.target</code> 会用到 <code v-pre>multi-user.target</code> ？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">systemctl list-dependencies <span class="token punctuation">[</span>unit<span class="token punctuation">]</span> <span class="token punctuation">[</span>--reverse<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">-- reverse：反向追踪谁使用这个 unit</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出目前的 target 环境下，用到什么特别的 unit</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl get-default </span></span>
<span class="line">multi-user.target</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-dependencies </span></span>
<span class="line">default.target</span>
<span class="line">* <span class="token operator">|</span>-abrt-ccpp.service</span>
<span class="line">* <span class="token operator">|</span>-abrt-oops.service</span>
<span class="line">* <span class="token operator">|</span>-abrt-vmcore.service</span>
<span class="line">* <span class="token operator">|</span>-abrt-xorg.service</span>
<span class="line">* <span class="token operator">|</span>-abrtd.service</span>
<span class="line">* <span class="token operator">|</span>-atd.service</span>
<span class="line">* <span class="token operator">|</span>-getty.target</span>
<span class="line">* <span class="token operator">|</span> <span class="token variable"><span class="token variable">`</span>-getty@tty1.service</span>
<span class="line">* <span class="token operator">|</span>-nfs-client.target</span>
<span class="line">* <span class="token operator">|</span> <span class="token operator">|</span>-auth-rpcgss-module.service</span>
<span class="line">* <span class="token operator">|</span> <span class="token operator">|</span>-rpc-statd-notify.service</span>
<span class="line">* <span class="token operator">|</span> <span class="token variable">`</span></span>-remote-fs-pre.target</span>
<span class="line">* <span class="token variable"><span class="token variable">`</span>-remote-fs.target</span>
<span class="line">*   <span class="token variable">`</span></span>-nfs-client.target</span>
<span class="line">*     <span class="token operator">|</span>-auth-rpcgss-module.service</span>
<span class="line">*     <span class="token operator">|</span>-rpc-statd-notify.service</span>
<span class="line">*     `-remote-fs-pre.target</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里不加 unit 则是使用默认的 target，可以看到一颗依赖树，非常直观</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 反向追踪</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-dependencies --reverse </span></span>
<span class="line">default.target</span>
<span class="line">* <span class="token variable"><span class="token variable">`</span><span class="token parameter variable">-graphical.target</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 graphical.target 使用了多少服务</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-dependencies graphical.target</span></span>
<span class="line">graphical.target</span>
<span class="line">* <span class="token operator">|</span>-accounts-daemon.service</span>
<span class="line">* <span class="token operator">|</span>-gdm.service</span>
<span class="line">* <span class="token operator">|</span>-initial-setup-reconfiguration.service</span>
<span class="line">* <span class="token operator">|</span>-network.service</span>
<span class="line">* <span class="token operator">|</span>-rtkit-daemon.service</span>
<span class="line">* <span class="token operator">|</span>-systemd-update-utmp-runlevel.service</span>
<span class="line">* <span class="token operator">|</span>-udisks2.service</span>
<span class="line">* <span class="token variable">`</span></span>-multi-user.target</span>
<span class="line">*   <span class="token operator">|</span>-abrt-ccpp.service</span>
<span class="line">*   <span class="token operator">|</span>-abrt-oops.service</span>
<span class="line">*   <span class="token operator">|</span>-abrt-vmcore.service</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="与-systemd-的-deaemon-运行过程相关目录简介" tabindex="-1"><a class="header-anchor" href="#与-systemd-的-deaemon-运行过程相关目录简介"><span>与 systemd 的 deaemon 运行过程相关目录简介</span></a></h2>
<p>比较重要的 systemd 启动脚本配置文件在 <code v-pre>/usr/lib/systemd/system/</code>、<code v-pre>/etc/systemd/system/</code> 目录下，还有以下目录与系统的 daemon 运行有关：</p>
<ul>
<li>
<p><code v-pre>/usr/lib/systemd/system/</code>：</p>
<p>使用 CentOS 官方提供的软件安装后，默认的启动脚本配置文件都放在这里，这里的数据尽量不要修改，要修改时，可以到 <code v-pre>/etc/systemd/system/</code> 下修改</p>
</li>
<li>
<p><code v-pre>/run/systemd/system/</code>：</p>
<p>系统执行过程中所产生的服务脚本，这些脚本的优先顺序比 <code v-pre>/usr/lib/systemd/system/</code> 高</p>
</li>
<li>
<p><code v-pre>/etc/systemd/system/</code>：</p>
<p>管理员根据需求建立的执行脚本，执行优先顺序比 <code v-pre>/run/systemd/system/</code> 高</p>
</li>
<li>
<p><code v-pre>/etc/sysconfig/*</code>：</p>
<p>几乎所有的服务都会将初始化的一些选项设置写入到这个目录下。</p>
<p>比如 mandb 要更新的 man page 索引中，需要加入的参数就写入到此目录下的 man-db 中。而网络的设置写在 <code v-pre>/etc/sysconfig/network-scripts/</code> ；所以该目录也很重要</p>
</li>
<li>
<p><code v-pre>/var/lib/</code>：</p>
<p>一些会产生数据的服务都会讲它的数据写入到该目录中。</p>
<p>比如：数据库管理系统 Mariadb 的数据库默认写入到 <code v-pre>/var/lib/mysql/</code> 目录下的</p>
</li>
<li>
<p><code v-pre>/run/</code>：存放了很多 daemon 的暂存文件，包括 lock file 以及 PID file 等</p>
</li>
</ul>
<p>我们知道 systemd 有很多本机会用到的 socket 服务，会产生很多的 socket file，可以通过以下方式知道这些 socket file 的存放位置</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-sockets </span></span>
<span class="line">LISTEN                          UNIT                         ACTIVATES</span>
<span class="line">/dev/log                        systemd-journald.socket      systemd-journald.service</span>
<span class="line">/run/dbus/system_bus_socket     dbus.socket                  dbus.service</span>
<span class="line">/run/dmeventd-client            dm-event.socket              dm-event.service</span>
<span class="line">/run/dmeventd-server            dm-event.socket              dm-event.service</span>
<span class="line">/run/lvm/lvmetad.socket         lvm2-lvmetad.socket          lvm2-lvmetad.service</span>
<span class="line">/run/lvm/lvmpolld.socket        lvm2-lvmpolld.socket         lvm2-lvmpolld.service</span>
<span class="line">/run/systemd/initctl/fifo       systemd-initctl.socket       systemd-initctl.service</span>
<span class="line">/run/systemd/journal/socket     systemd-journald.socket      systemd-journald.service</span>
<span class="line">/run/systemd/journal/stdout     systemd-journald.socket      systemd-journald.service</span>
<span class="line">/run/systemd/shutdownd          systemd-shutdownd.socket     systemd-shutdownd.service</span>
<span class="line">/run/udev/control               systemd-udevd-control.socket systemd-udevd.service</span>
<span class="line">/var/run/avahi-daemon/socket    avahi-daemon.socket          avahi-daemon.service</span>
<span class="line">/var/run/cups/cups.sock         cups.socket                  cups.service</span>
<span class="line">/var/run/libvirt/virtlockd-sock virtlockd.socket             virtlockd.service</span>
<span class="line">/var/run/libvirt/virtlogd-sock  virtlogd.socket              virtlogd.service</span>
<span class="line">/var/run/rpcbind.sock           rpcbind.socket               rpcbind.service</span>
<span class="line"><span class="token number">0.0</span>.0.0:111                     rpcbind.socket               rpcbind.service</span>
<span class="line"><span class="token number">0.0</span>.0.0:111                     rpcbind.socket               rpcbind.service</span>
<span class="line">@ISCSIADM_ABSTRACT_NAMESPACE    iscsid.socket                iscsid.service</span>
<span class="line">@ISCSID_UIP_ABSTRACT_NAMESPACE  iscsiuio.socket              iscsiuio.service</span>
<span class="line"><span class="token punctuation">[</span>::<span class="token punctuation">]</span>:111                        rpcbind.socket               rpcbind.service</span>
<span class="line"><span class="token punctuation">[</span>::<span class="token punctuation">]</span>:111                        rpcbind.socket               rpcbind.service</span>
<span class="line">kobject-uevent <span class="token number">1</span>                systemd-udevd-kernel.socket  systemd-udevd.service</span>
<span class="line"></span>
<span class="line"><span class="token number">23</span> sockets listed.</span>
<span class="line">Pass <span class="token parameter variable">--all</span> to see loaded but inactive sockets, too.</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面列出了正在监听本地服务需求的 socket file 所在的文件名位置</p>
<h2 id="网络服务于端口对应简介" tabindex="-1"><a class="header-anchor" href="#网络服务于端口对应简介"><span>网络服务于端口对应简介</span></a></h2>
<p>IP 与 PORT 是英特网联机的最重要机制之一，还有各种的通信协议，如 http、ftp；在 <code v-pre>/etc/services</code> 里面对应了协议与端口号的映射关系</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/services</span></span>
<span class="line"><span class="token comment"># daemon name	port/封包协议	服务说明</span></span>
<span class="line"><span class="token function">ftp</span>             <span class="token number">21</span>/tcp</span>
<span class="line"><span class="token function">ftp</span>             <span class="token number">21</span>/udp          fsp fspd</span>
<span class="line"><span class="token function">ssh</span>             <span class="token number">22</span>/tcp                          <span class="token comment"># The Secure Shell (SSH) Protocol</span></span>
<span class="line"><span class="token function">ssh</span>             <span class="token number">22</span>/udp                          <span class="token comment"># The Secure Shell (SSH) Protocol</span></span>
<span class="line">http            <span class="token number">80</span>/tcp          www www-http    <span class="token comment"># WorldWideWeb HTTP</span></span>
<span class="line">http            <span class="token number">80</span>/udp          www www-http    <span class="token comment"># HyperText Transfer Protocol</span></span>
<span class="line">http            <span class="token number">80</span>/sctp                         <span class="token comment"># HyperText Transfer Protocol</span></span>
<span class="line">https           <span class="token number">443</span>/tcp                         <span class="token comment"># http protocol over TLS/SSL</span></span>
<span class="line">https           <span class="token number">443</span>/udp                         <span class="token comment"># http protocol over TLS/SSL</span></span>
<span class="line">https           <span class="token number">443</span>/sctp                        <span class="token comment"># http protocol over TLS/SSL</span></span>
<span class="line"><span class="token comment"># 该文件下有大量的数据</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不建议修改这些端口，除非你想吧这些隐藏起来，不让外部访问到</p>
<h2 id="关闭网络服务" tabindex="-1"><a class="header-anchor" href="#关闭网络服务"><span>关闭网络服务</span></a></h2>
<p>当你第一次使用 systemctl 观察本地服务器启动的服务时，会发现有很多 daemon，这是因为 systemd 将许多原本不被列为 daemon 的程序也纳入管理检测范围内，但是那些大部分都属于 Linux 系统基础运行所需的环境，你不清楚的情况下，最好不要去修改他们</p>
<p>除了本地服务之外，要观察网络服务，虽然网络服务默认有 SELinux 管理，不过，还是建议非必要的网络服务就关闭它。基本上会产生一个网络监听端口的程序，就可以称它为网络服务了，可通过如下方式观察网络端口</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># netstat -tlunp</span></span>
<span class="line">Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span></span>
<span class="line">Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:25            <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6010          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6011          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">192.168</span>.122.1:53        <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:22              <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:25                  :::*                    LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6010                :::*                    LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6011                :::*                    LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::555                  :::*                    LISTEN      <span class="token number">11573</span>/vsftpd        </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                    LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::22                   :::*                    LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">192.168</span>.122.1:53        <span class="token number">0.0</span>.0.0:*                           <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:67              <span class="token number">0.0</span>.0.0:*                           <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*                           <span class="token number">1</span>/systemd           </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:33017           <span class="token number">0.0</span>.0.0:*                           <span class="token number">920</span>/avahi-daemon: r </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:669             <span class="token number">0.0</span>.0.0:*                           <span class="token number">925</span>/rpcbind         </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:5353            <span class="token number">0.0</span>.0.0:*                           <span class="token number">920</span>/avahi-daemon: r </span>
<span class="line">udp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                                <span class="token number">1</span>/systemd           </span>
<span class="line">udp6       <span class="token number">0</span>      <span class="token number">0</span> :::669                  :::*                                <span class="token number">925</span>/rpcbind </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>比如上面显示 <code v-pre>avahi-daemon</code> 服务监听了 5353 和 33017 端口，可以通过 systemctl 查找是否真的有 avahi-daemon 服务</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-units --all | grep avahi-daemon</span></span>
<span class="line">  avahi-daemon.service                                                                                           loaded    active   running   Avahi mDNS/DNS-SD Stack</span>
<span class="line">  avahi-daemon.socket                                                                                            loaded    active   running   Avahi mDNS/DNS-SD Stack Activation Socket</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>avahi-daemon 的目的是在局域网进行类似网芳的搜索，因此这个服务可以协助你在区网内随时了解即插即用的设备。包括笔记本电脑等，只要你连上区网，你就能知道谁进来了。问题是，你可能不需要这个协议，关闭它</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 关闭两个服务，并且取消开机启动</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop avahi-daemon.service </span></span>
<span class="line">Warning: Stopping avahi-daemon.service, but it can still be activated by:</span>
<span class="line">  avahi-daemon.socket</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop avahi-daemon.socket  </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl disable avahi-daemon.service avahi-daemon.socket </span></span>
<span class="line">Removed symlink /etc/systemd/system/multi-user.target.wants/avahi-daemon.service.</span>
<span class="line">Removed symlink /etc/systemd/system/sockets.target.wants/avahi-daemon.socket.</span>
<span class="line">Removed symlink /etc/systemd/system/dbus-org.freedesktop.Avahi.service.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># netstat -tlunp</span></span>
<span class="line">Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span></span>
<span class="line">Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:25            <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6010          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6011          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">192.168</span>.122.1:53        <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:22              <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:25                  :::*                    LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6010                :::*                    LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6011                :::*                    LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::555                  :::*                    LISTEN      <span class="token number">11573</span>/vsftpd        </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                    LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::22                   :::*                    LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">192.168</span>.122.1:53        <span class="token number">0.0</span>.0.0:*                           <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:67              <span class="token number">0.0</span>.0.0:*                           <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*                           <span class="token number">1</span>/systemd           </span>
<span class="line">udp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:669             <span class="token number">0.0</span>.0.0:*                           <span class="token number">925</span>/rpcbind         </span>
<span class="line">udp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                                <span class="token number">1</span>/systemd           </span>
<span class="line">udp6       <span class="token number">0</span>      <span class="token number">0</span> :::669                  :::*                                <span class="token number">925</span>/rpcbind  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般来说，你本地服务器至少需要 25 端口，而 22 端口最好加上防火墙来管理远程联机登录比较妥当。555 端口是我们前面练习测试修改的。这样的系统能够被黑的机会已经少很多了。</p>
</div></template>


