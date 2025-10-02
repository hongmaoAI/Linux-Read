<template><div><h1 id="鸟哥的备份策略" tabindex="-1"><a class="header-anchor" href="#鸟哥的备份策略"><span>鸟哥的备份策略</span></a></h1>
<p>关于备份来说，需要根据场景，数据的重要程度，成本等方式来综合考虑，而作者这里将备份分为两大部分：</p>
<ul>
<li>每日备份经常性变化的重要数据</li>
<li>每周备份不常变动的信息</li>
</ul>
<p>编写两个简单的 scripts 来完整这两项工作。</p>
<p>这里针对作者的网站来说，备份策略如下：</p>
<ol>
<li>主机硬件：使用一个独立的 filesystem 来存储备份数据，此 filesystem 挂载到 /backup 中</li>
<li>每日进行：目前仅备份 MySql 数据库</li>
<li>每周进行：包括 <code v-pre>/home</code>、<code v-pre>/var</code>、<code v-pre>/etc</code>、<code v-pre>/boot</code>、<code v-pre>/boot</code>、<code v-pre>/usr/local</code> 等目录与特殊服务的目录</li>
<li>自动处理：利用 <code v-pre>/etc/crontab</code> 来自动提供备份的功能</li>
<li>异地备份：每月定期的将数据分别
<ol>
<li>刻录到光盘上</li>
<li>使用网络传输到另一台数据上</li>
</ol>
</li>
</ol>
<p>下面演示作者对以上需求编写的 script</p>
<h2 id="每周系统备份的-script" tabindex="-1"><a class="header-anchor" href="#每周系统备份的-script"><span>每周系统备份的 script</span></a></h2>
<p><code v-pre>/backup/backupwk.sh</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 用户输入位置，用来存储此脚本所预计备份的数据目录（使用独立文件系统较好）</span></span>
<span class="line"><span class="token assign-left variable">basedir</span><span class="token operator">=</span>/backup/weekly</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/bin:/usr/bin:/sbin:/usr/sbin<span class="token punctuation">;</span> </span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token environment constant">PATH</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>C</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置要备份的服务的配置文件，以及备份目录</span></span>
<span class="line"><span class="token assign-left variable">named</span><span class="token operator">=</span><span class="token variable">$basedir</span>/named</span>
<span class="line"><span class="token assign-left variable">postfixd</span><span class="token operator">=</span><span class="token variable">$basedir</span>/postfix</span>
<span class="line"><span class="token assign-left variable">vsftpd</span><span class="token operator">=</span><span class="token variable">$basedir</span>/vsftp</span>
<span class="line"><span class="token assign-left variable">sshd</span><span class="token operator">=</span><span class="token variable">$basedir</span>/ssh</span>
<span class="line"><span class="token assign-left variable">sambad</span><span class="token operator">=</span><span class="token variable">$basedir</span>/samba</span>
<span class="line"><span class="token assign-left variable">wwwd</span><span class="token operator">=</span><span class="token variable">$basedir</span>/www</span>
<span class="line"><span class="token assign-left variable">others</span><span class="token operator">=</span><span class="token variable">$basedir</span>/others</span>
<span class="line"><span class="token assign-left variable">userinfod</span><span class="token operator">=</span><span class="token variable">$basedir</span>/userinfo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 判断目录是否存在，若不存在则建立</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">dirs</span> <span class="token keyword">in</span> <span class="token variable">$named</span> <span class="token variable">$postfixd</span> <span class="token variable">$vsftpd</span> <span class="token variable">$sshd</span> <span class="token variable">$sambad</span> <span class="token variable">$wwwd</span> <span class="token variable">$others</span> <span class="token variable">$userinfod</span></span>
<span class="line"><span class="token keyword">do</span></span>
<span class="line">	<span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-d</span> <span class="token string">"<span class="token variable">$dirs</span>"</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$dirs</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 将系统主要的服务配置文件分别备份下来，同时也备份 /etc/ 全部</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /var/named/chroot/<span class="token punctuation">{</span>etc,var<span class="token punctuation">}</span> <span class="token variable">$named</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /etc/postfix /etc/dovecot.conf <span class="token variable">$postfixd</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /etc/vsftpd/* <span class="token variable">$vsftpd</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /etc/ssh/* <span class="token variable">$sshd</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /etc/samba/* <span class="token variable">$sambad</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /etc/<span class="token punctuation">{</span>my.cnf,php.ini,httpd<span class="token punctuation">}</span> <span class="token variable">$wwwd</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">cd</span> /var/lib</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$wwwd</span>/mysql.tar.bz2 mysql</span>
<span class="line"><span class="token builtin class-name">cd</span> /var/www</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$wwwd</span>/html.tar.bz2 html cgi-bin</span>
<span class="line"><span class="token builtin class-name">cd</span> /</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$others</span>/etc/tar.bz2 etc</span>
<span class="line"><span class="token builtin class-name">cd</span> /usr/</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$others</span>/local.tar.bz2 <span class="token builtin class-name">local</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 关于使用者方面</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-a</span> /etc/<span class="token punctuation">{</span>passwd,shadow,group<span class="token punctuation">}</span> <span class="token variable">$userinfod</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /var/spool</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$userinfod</span>/mail.tar.bz2 mail</span>
<span class="line"><span class="token builtin class-name">cd</span> /</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$userinfod</span>/home.tar.bz2 home</span>
<span class="line"><span class="token builtin class-name">cd</span> /var/spool</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$userinfod</span>/cron.tar.bz2 <span class="token function">cron</span> at</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更改脚本权限与执行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">chmod</span> <span class="token number">700</span> /backup/backupwk.sh</span>
<span class="line">/backup/backupwk.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="每日备份数据的-script" tabindex="-1"><a class="header-anchor" href="#每日备份数据的-script"><span>每日备份数据的 script</span></a></h2>
<p><code v-pre>/backup/backupday.sh</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># 备份到的目录</span></span>
<span class="line"><span class="token assign-left variable">basedir</span><span class="token operator">=</span>/backup/daily</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/bin:/usr/bin:/sbin:/usr/sbin<span class="token punctuation">;</span> </span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token environment constant">PATH</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>C</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">basefile1</span><span class="token operator">=</span><span class="token variable">$basedir</span>/mysql.<span class="token variable"><span class="token variable">$(</span>data +%Y-%m-%d<span class="token variable">)</span></span>.tar.bz2</span>
<span class="line"><span class="token assign-left variable">basefile2</span><span class="token operator">=</span><span class="token variable">$basedir</span>/cgi-bin.<span class="token variable"><span class="token variable">$(</span>data +%Y-%m-%d<span class="token variable">)</span></span>.tar.bz2</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span> <span class="token parameter variable">-d</span> <span class="token string">"<span class="token variable">$basedir</span>"</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">mkdir</span> <span class="token variable">$basedir</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. mysql 数据库目录咋 /var/lib/mysql</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /var/lib</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$basefile1</span> mysql</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. www 的 CGI 程序</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /var/www</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-jpc</span> <span class="token parameter variable">-f</span> <span class="token variable">$basefile2</span> cgi-bin</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面提供每周与每日的 crontab 配置</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /etc/crontab</span>
<span class="line"><span class="token comment"># 每周日的 3:30 进行重要文件备份</span></span>
<span class="line"><span class="token number">30</span> <span class="token number">3</span> * * <span class="token number">0</span> root /backup/backupwk.sh</span>
<span class="line"><span class="token comment"># 每天 2：30 进行数据库的备份</span></span>
<span class="line"><span class="token number">30</span> <span class="token number">2</span> * * * root /backup/backupday.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个备份方案中有一个问题就是：当你备份的时候，如果恰巧有有人发表文章（mysql 数据变更了），那么就有可能导致出现一些错误信息，这里只能是先停掉 mysql 服务，在开始备份</p>
<h2 id="远程备份-script" tabindex="-1"><a class="header-anchor" href="#远程备份-script"><span>远程备份 script</span></a></h2>
<p>如果你有两台 Linux 主机时，那么互相将对方的重要数据保存一份在自己的系统中也是一个不错的办法，可以用 sshd 服务来完成主机之间的数据传输</p>
<h3 id="使用-rsync-上传备份数据" tabindex="-1"><a class="header-anchor" href="#使用-rsync-上传备份数据"><span>使用 rsync 上传备份数据</span></a></h3>
<p>使用 rsync 必须要在你的服务器上取得某个账户的使用权后，并让该账户可用不用密码即可登录才可以。</p>
<p>假设你已经设置好 mrcode 免密登录远程服务器，需要将 <code v-pre>/backup/weekly</code> 整个备份到 <code v-pre>/home/backup/weekly</code> 时，可以简单这样做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /backup/rsync.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token assign-left variable">remotedir</span><span class="token operator">=</span>/home/backup/</span>
<span class="line"><span class="token assign-left variable">basedir</span><span class="token operator">=</span>/backup/weekly</span>
<span class="line"><span class="token assign-left variable">host</span><span class="token operator">=</span><span class="token number">127.0</span>.0.1</span>
<span class="line"><span class="token assign-left variable">id</span><span class="token operator">=</span>mrcode</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下面为实际的指令</span></span>
<span class="line"><span class="token function">rsync</span> <span class="token parameter variable">-av</span> <span class="token parameter variable">-e</span> <span class="token function">ssh</span> <span class="token variable">$basedir</span> <span class="token variable">${id}</span>@<span class="token variable">${host}</span><span class="token builtin class-name">:</span><span class="token variable">${remotedir}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>rsync 可以通过 ssh 来进行镜像备份，所以没有变更的文件将不需要上传，非常的方便</p>
</div></template>


