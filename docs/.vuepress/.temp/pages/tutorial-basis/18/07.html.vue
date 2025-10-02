<template><div><h1 id="本章习题" tabindex="-1"><a class="header-anchor" href="#本章习题"><span>本章习题</span></a></h1>
<h2 id="简答题" tabindex="-1"><a class="header-anchor" href="#简答题"><span>简答题</span></a></h2>
<ul>
<li>
<p>将 auth 服务的结果中，需需要等级高于 warn 就给予发送 email 到 root 的信箱，如何做？</p>
<p>利用 vim 编辑 <code v-pre>/etc/rsyslog.conf</code> 文件，内容为 auth.warn root</p>
</li>
<li>
<p>启动系统注册表信息时，需要启动哪两个 daemon？</p>
<p>systemd-journald.service、rsyslog.service</p>
</li>
<li>
<p>rsyslogd 以及 logrotate 通过什么机制来执行？</p>
<p>rsyslogd 是 stand alone daemon 的机制；logrotate 则是通过 crontab 来执行的，只是个指令</p>
</li>
</ul>
</div></template>


