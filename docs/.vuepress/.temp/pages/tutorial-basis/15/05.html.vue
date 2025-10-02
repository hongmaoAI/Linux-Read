<template><div><h1 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h1>
<ul>
<li>系统可以通过 at 指令来定时执行一次的任务，<code v-pre>at TIME</code> 为指令下达方式，当任务执行时，会进入到下达指令所在目录进行任务</li>
<li>at 的执行必须要有 atd 服务的支持，且 <code v-pre>/etc/at.deny</code> 控制是否能够执行的使用者账户</li>
<li>通过 atq、atrm 可以查询与删除 at 的工作</li>
<li>batch 与 at 相同，不过 batch 可以在 CPU 工作负载小于 0.8 时才进行后续的工作任务</li>
<li>系统的循环定时任务使用 crond 服务，同时利用 <code v-pre>crontab -e</code> 及 <code v-pre>/etc/crontab</code> 进行工作任务的安排</li>
<li><code v-pre>crontab -e</code> 设置项目分为 6 栏：分、时、日、月、周、指令</li>
<li><code v-pre>/etc/crontab</code> 设置项目分为 7 栏，分、时、日、月、周、执行者、指令</li>
<li>anacron 配合 <code v-pre>/etc/anacrontab</code> 的设置，可以唤醒停机期间系统未进行的 crontab 任务</li>
</ul>
</div></template>


