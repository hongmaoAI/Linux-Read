<template><div><h1 id="systemctl-针对-timer-的配置文件" tabindex="-1"><a class="header-anchor" href="#systemctl-针对-timer-的配置文件"><span>systemctl 针对 timer 的配置文件</span></a></h1>
<p>某些时候需要定期执行某项工作，或则是开机后执行，或则是某服务启动多久后执行等等的需求。在以前可以使用 crond 来定期处理，如今有 systemd 这个长期驻留在内存中好用的服务，另外还提供了一个协力服务 timers.target ，它可以协助定期处理各种任务</p>
<h2 id="systemd-timer-的优势" tabindex="-1"><a class="header-anchor" href="#systemd-timer-的优势"><span>systemd.timer 的优势</span></a></h2>
<p>在 archlinux 的官网 wiki 上有提到，为啥要用 systemd.timer ?</p>
<ul>
<li>由于所有的 systemd 的服务产生的信息都会被记录（log），因此比 crond 在 debug 上要更清楚方便</li>
<li>各项 timer 的工作可以跟 systemd 的服务相结合</li>
<li>各项 timer 的工作可以跟 control group（cgroup 用来取代 /etc/secure/limit.conf 的功能）结合，来限制该工作的资源利用</li>
<li>时间安排可以精确到毫秒的单位</li>
</ul>
<p>弱点就是：没有 email 通知功能（除非自己实现 email 通知），也没有类似 anacron 一段时间内的随机取样功能（random_delay）</p>
<h2 id="任务需求" tabindex="-1"><a class="header-anchor" href="#任务需求"><span>任务需求</span></a></h2>
<p>想要用 systemd 的 timer 功能，必须有如下条件：</p>
<ul>
<li>系统的 timer.target 必须启动</li>
<li>要有 sname.service 的服务存在：sname 是我们自定义的名称</li>
<li>要有 sname.timer 的时间启动服务存在</li>
</ul>
<p>使用前一小节写好的  backup.service 来测试</p>
<h2 id="sname-timer-的设置" tabindex="-1"><a class="header-anchor" href="#sname-timer-的设置"><span>sname.timer 的设置</span></a></h2>
<p><code v-pre>[Timer]</code> 部分</p>
<ul>
<li>
<p>OnActiveSec：当 timers.target 启动多久后才执行该 unit</p>
</li>
<li>
<p>OnBootSec：当开机后多久之后才执行</p>
</li>
<li>
<p>OnStartupSec：当 systemd 第一次启动后多久才执行</p>
</li>
<li>
<p>OnUnitActiveSec：这个 timer 配置文件所管理的那个 unit 服务在最后一次启动后，相隔多久后再执行一次</p>
</li>
<li>
<p>OnUnitInactiveSec：这个 timer 配置文件所管理的那个 unit 服务在最后一次停止后，隔多久再执行一次</p>
</li>
<li>
<p>OnCalendar：使用实际时间（非循环时间）的方式来启动服务。时间格式后续讲解</p>
</li>
<li>
<p>Unit：</p>
<p>一般来说不太需要设置，当你的 sname.service 与 sname.timer 中的 sname 不一致时，这里指向的 service unit</p>
</li>
<li>
<p>Persistent</p>
<p>当使用 OnCalendar 的设置时，指定该功能要不要持续进行。通常设置为 yes，比较能满足类似 anacron 的功能</p>
</li>
</ul>
<h2 id="使用-oncalendar-的时间" tabindex="-1"><a class="header-anchor" href="#使用-oncalendar-的时间"><span>使用 OnCalendar 的时间</span></a></h2>
<p>想要从 crontab 转成 timer 的功能，对于时间格式需要了解，基本上的格式如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">语法：英文周名 YYYY-MM-DD HH:MM:SS</span>
<span class="line">范例：Thu	  <span class="token number">2020</span>-03-20 <span class="token number">10</span>:00:00</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以使用时间间隔时间来处理，常用的时间间隔单位有：</p>
<ul>
<li>us 或 usec：微秒</li>
<li>ms 或 msec：毫秒</li>
<li>s、sec、second、seconds</li>
<li>m、min、minute、minutes</li>
<li>h、hr、hour、hours</li>
<li>d、day、days</li>
<li>w、week、weeks</li>
<li>month、months</li>
<li>y、year、years</li>
</ul>
<p>常见的范例有</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">隔 <span class="token number">3</span> 小时：				3h 或 3hr 或 3hours</span>
<span class="line">隔 <span class="token number">300</span> 分钟过 <span class="token number">10</span> 秒：	   10s 300m	</span>
<span class="line">隔 <span class="token number">5</span> 天又 <span class="token number">100</span> 分钟：	   100m 5day</span>
<span class="line"><span class="token comment"># 通常英文的写法：小单位写在前面，大单位写后面、先秒、分、小时、天等</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此外，还可以使用英文常用的口语化日期代表，例如 today、tomorrow 等，假设今天是 2015-08-13 13:50:00 那么</p>
<ul>
<li>now：Thu 2015-08-13 13:50:00</li>
<li>today：Thu 2015-08-13 00:00:00</li>
<li>tomorrow：Thu 2015-08-14 00:00:00</li>
<li>hourly：<code v-pre>*-*-* *:00:00</code></li>
<li>daily：<code v-pre>*-*-* 00:00:00</code></li>
<li>weekly：<code v-pre>Mon *-*-* 00:00:00</code></li>
<li>monthly：<code v-pre>*-*-01 00:00:00</code></li>
<li>+3h10m：Thu 2015-08-13 17:00:00</li>
<li>2015-08-16：Sun 2015-08-16 00:00:00</li>
</ul>
<h2 id="一个循环时间运行的案例" tabindex="-1"><a class="header-anchor" href="#一个循环时间运行的案例"><span>一个循环时间运行的案例</span></a></h2>
<p>需求如下：</p>
<ul>
<li>开机后 2 小时开始执行一次  backup.service</li>
<li>自从第一次执行后，未来每两天执行一次 backup.service</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/systemd/system/backup.timer</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>backup my server timer</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Timer<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">OnBootSec</span><span class="token operator">=</span>2hrs</span>
<span class="line"><span class="token assign-left variable">OnUnitActiveSec</span><span class="token operator">=</span>2days</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl daemon-reload </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl enable backup.timer</span></span>
<span class="line">Created symlink from /etc/systemd/system/multi-user.target.wants/backup.timer to /etc/systemd/system/backup.timer.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart backup.timer    </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-unit-files | grep backup</span></span>
<span class="line">backup.service                                disabled		<span class="token comment"># 只需要 timer 启动就 ok</span></span>
<span class="line">backup.timer                                  enabled</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl show timers.target </span></span>
<span class="line"><span class="token assign-left variable">ConditionTimestamp</span><span class="token operator">=</span>Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:38 CST		<span class="token comment"># timer 这个 unit 启动的时间</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl show backup.service | grep ExecMainStartTimestamp</span></span>
<span class="line"><span class="token assign-left variable">ExecMainStartTimestamp</span><span class="token operator">=</span>Fri <span class="token number">2020</span>-03-20 09:38:19 CST	<span class="token comment"># backup.service 上一次执行的时间</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl show backup.timer | grep NextElapseUSecMonotonic </span></span>
<span class="line"><span class="token assign-left variable">NextElapseUSecMonotonic</span><span class="token operator">=</span>4d 22h 48min <span class="token number">56</span>.756775s		<span class="token comment"># 下一次执行距离 timers.target 的时间</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关于这个 NextElapseUSecMonotonic 值得说明，上次执行 backup.service 的时间在 2020-03-20 09:38:19，由于 2 天执行一次，下一次执行时间应该是 2020-03-22 09:38:19 才对，但是由于 timer 是由 timers.target 这个 unit 所管理的，而这个 timers.target 启动时间是在 2020-03-17 10:49:38，注意的是，这个 NextElapseUSecMonotonic  记录的下次运行的时间，其实是与 timers.target 所记录的时间差，因此是 <code v-pre>2020-03-22 09:38:19 -</code>  2020-03-17 10:49:38` 结果就是相差 4d 22h 48min;</p>
<p>计算公式：NextElapseUSecMonotonic  = 实际下一次运行的时间 - timers.target 的启动时间</p>
<h2 id="一个固定日期运行的案例" tabindex="-1"><a class="header-anchor" href="#一个固定日期运行的案例"><span>一个固定日期运行的案例</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/systemd/system/backup2.timer</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>backup my server timer2</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Timer<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">OnCalendar</span><span class="token operator">=</span>Sun *-*-* 02:00:00</span>
<span class="line"><span class="token assign-left variable">Persistent</span><span class="token operator">=</span>true</span>
<span class="line"><span class="token assign-left variable">Unit</span><span class="token operator">=</span>backup.service		<span class="token comment"># 这里的 timer 名称与原来的 service 不一致，这里指定下</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl daemon-reload</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl enable backup2.timer</span></span>
<span class="line">Created symlink from /etc/systemd/system/multi-user.target.wants/backup2.timer to /etc/systemd/system/backup2.timer.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart backup2.timer </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl list-unit-files | grep backup</span></span>
<span class="line">backup.service                                disabled</span>
<span class="line">backup.timer                                  enabled </span>
<span class="line">backup2.timer                                 enabled </span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl show timers.target | grep ConditionTimestamp</span></span>
<span class="line"><span class="token assign-left variable">ConditionTimestamp</span><span class="token operator">=</span>Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:38 CST</span>
<span class="line"><span class="token assign-left variable">ConditionTimestampMonotonic</span><span class="token operator">=</span><span class="token number">15862087</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment">#  systemctl show backup.service | grep ExecMainStartTimestamp</span></span>
<span class="line"><span class="token assign-left variable">ExecMainStartTimestamp</span><span class="token operator">=</span>Fri <span class="token number">2020</span>-03-20 09:38:19 CST</span>
<span class="line"><span class="token assign-left variable">ExecMainStartTimestampMonotonic</span><span class="token operator">=</span><span class="token number">254936756737</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl show backup2.timer | grep NextElapseUSecRealtime</span></span>
<span class="line"><span class="token assign-left variable">NextElapseUSecRealtime</span><span class="token operator">=</span>50y 2month 2w 5d 9h</span>
<span class="line"><span class="token comment"># 由于只有一次运行，所以没有 NextElapseUSecMonotonic 值了。</span></span>
<span class="line"><span class="token comment"># 这里的时间是 Unix 标准时间，也就是是 1970-01-01 00:00:00 去比较的</span></span>
<span class="line"><span class="token comment"># 这里是 50 年 2个月 2周 5天 9小时才会执行，这个是对比的日历时间（1970-01-01 00:00:00）</span></span>
<span class="line"><span class="token comment"># 时间的基准值不一样。一定要注意</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


