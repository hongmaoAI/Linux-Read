<template><div><h1 id="本章习题" tabindex="-1"><a class="header-anchor" href="#本章习题"><span>本章习题</span></a></h1>
<ul>
<li>
<p>如果要知道整个系统的周边硬件设备，可以使用哪个指令查询？</p>
<p><code v-pre>lspci</code> 可以查询到，还可以使用 <code v-pre>lsoci -v</code> 来查询更详细的数据</p>
</li>
<li>
<p>如果单纯只想知道 USB 设备，如何查询</p>
<p><code v-pre>lsusb</code></p>
</li>
<li>
<p>如果你的网络设置好了，但是却发现网络不通，你觉得如何处理？</p>
<ol>
<li>先检查硬件，每个环节（网卡、hub/switch、路由器等）的灯信号是否有亮?</li>
<li>使用 ifconfig 检查 IP 与 netmask 的数据是否正确</li>
<li>使用 route 看看 default gateway 是否正确</li>
<li>使用 <code v-pre>ping -c 3 [gateway IP]</code></li>
<li>使用 <code v-pre>ping -c 3 [外部 IP]</code>，若无响应请检查 gateway 的设置</li>
<li>使用 <code v-pre>dig www.goole.com</code> 看是否能找到 IP，若找不到请检查 <code v-pre>/etc/resolv.conf</code> 设置</li>
</ol>
<p>以上每一步都成功则继续下一步</p>
</li>
<li>
<p>挑战题：尝试将你再本书所进行的各项任务备份下来，然后删除你的系统，重新安装最新的 CentOS 7.x ，再将你备份的资料复原回来，看看能否成功让你的系统恢复到之前的状态</p>
</li>
<li>
<p>挑战题：查询下何为企鹅龙软件，讨论下该软件的还原进制属于累积备份还是完整备份？</p>
</li>
<li>
<p>常用的完整备份（full backup）工具指令有哪些？</p>
<p><code v-pre>xfsdump + xfsrestore</code>、dd、cpio 搭配 find 等软件</p>
</li>
<li>
<p>你所看到的常见的存储设备有哪些？</p>
<p>Floppy、Mo、zip、CD-RW、DVD-RW、外接式 USB 硬盘、Tape、外接式存储数组（RAID）、额外的存储架构，如 SNA、NAS 等</p>
</li>
</ul>
</div></template>


