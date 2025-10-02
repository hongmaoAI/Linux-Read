<template><div><h1 id="分析登录文件" tabindex="-1"><a class="header-anchor" href="#分析登录文件"><span>分析登录文件</span></a></h1>
<p>日志文件的分析是很重要的，可以使用 vim 或则是 journalctl 查阅相关信息，还有之前提到过的 last、lastlog、dmesg 等软件。</p>
<p>不过数据非常的分散，所以提供了 logwatch 软件来帮助我们</p>
<h2 id="centos-预设提供的-logwatch" tabindex="-1"><a class="header-anchor" href="#centos-预设提供的-logwatch"><span>CentOS 预设提供的 logwatch</span></a></h2>
<p>该工具每天分析一次日志文件，并将数据以 email 的格式寄送给 root。更详细的信息可以到 logwatch 官网 http://www.logwatch.org 查看</p>
<p>老样子，该工具默认未安装，拿出你的光盘挂载后，开始安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># yum install /mnt/Packages/perl-5.*.rpm  /mnt/Packages/perl-Date-Manip-*.rpm /mnt/Packages/perl-Sys-CPU-*.rpm /mnt/Packages/perl-Sys-MemInfo-*.rpm /mnt/Packages/logwatch-*.rpm</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 需要安装 perl 依赖与软件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /etc/cron.daily/0logwatch </span></span>
<span class="line">-rwxr-xr-x. <span class="token number">1</span> root root <span class="token number">434</span> Aug <span class="token number">16</span>  <span class="token number">2018</span> /etc/cron.daily/0logwatch</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># /etc/cron.daily/0logwatch </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装完成之后，它已经把脚本写到 cron 下面去了，一天会自动运行一次，然后通过邮件发送给 root；也可以直接运行 <code v-pre>/etc/cron.daily/0logwatch </code>，笔者看了下内容，内部直接运行了 <code v-pre>/usr/sbin/logwatch</code> 指令。手动运行之后，使用 root 账户去查看 email 就可以了。提示：手动运行的话，如果数据流很大当前终端机会阻塞，直到分析完成</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mail</span></span>
<span class="line">Heirloom Mail version <span class="token number">12.5</span> <span class="token number">7</span>/5/10.  Type ? <span class="token keyword">for</span> help.</span>
<span class="line"><span class="token string">"/var/spool/mail/root"</span><span class="token builtin class-name">:</span> <span class="token number">1</span> message <span class="token number">1</span> new</span>
<span class="line"><span class="token operator">></span>N  <span class="token number">1</span> logwatch@study.cento  Mon Mar <span class="token number">16</span> 04:07 <span class="token number">128</span>/4920  <span class="token string">"Logwatch for study.centos.mrcode (Linux)"</span></span>
<span class="line"><span class="token operator">&amp;</span> <span class="token number">1</span></span>
<span class="line">Message  <span class="token number">1</span>:</span>
<span class="line">From root@study.centos.mrcode  Mon Mar <span class="token number">16</span> 04:07:23 <span class="token number">2020</span></span>
<span class="line">Return-Path: <span class="token operator">&lt;</span>root@study.centos.mrcode<span class="token operator">></span></span>
<span class="line">X-Original-To: root</span>
<span class="line">Delivered-To: root@study.centos.mrcode</span>
<span class="line">To: root@study.centos.mrcode</span>
<span class="line">From: logwatch@study.centos.mrcode</span>
<span class="line">Subject: Logwatch <span class="token keyword">for</span> study.centos.mrcode <span class="token punctuation">(</span>Linux<span class="token punctuation">)</span></span>
<span class="line">Auto-Submitted: auto-generated</span>
<span class="line">Precedence: bulk</span>
<span class="line">Content-Type: text/plain<span class="token punctuation">;</span> <span class="token assign-left variable">charset</span><span class="token operator">=</span><span class="token string">"iso-8859-1"</span></span>
<span class="line">Date: Mon, <span class="token number">16</span> Mar <span class="token number">2020</span> 04:07:22 +0800 <span class="token punctuation">(</span>CST<span class="token punctuation">)</span></span>
<span class="line">Status: R</span>
<span class="line"></span>
<span class="line"> <span class="token comment"># 告知当前 logwatch 版本，当次分析的时间等信息</span></span>
<span class="line"> <span class="token comment">################### Logwatch 7.4.0 (03/01/11) #################### </span></span>
<span class="line">        Processing Initiated: Mon Mar <span class="token number">16</span> 04:07:22 <span class="token number">2020</span></span>
<span class="line">        Date Range Processed: yesterday</span>
<span class="line">                              <span class="token punctuation">(</span> <span class="token number">2020</span>-Mar-15 <span class="token punctuation">)</span></span>
<span class="line">                              Period is day.</span>
<span class="line">        Detail Level of Output: <span class="token number">0</span></span>
<span class="line">        Type of Output/Format: mail / text</span>
<span class="line">        Logfiles <span class="token keyword">for</span> Host: study.centos.mrcode</span>
<span class="line"> <span class="token comment">################################################################## </span></span>
<span class="line"> <span class="token comment"># 下面开始一项一项的分析</span></span>
<span class="line"> --------------------- Cron Begin ------------------------ </span>
<span class="line"></span>
<span class="line"> **Unmatched Entries**</span>
<span class="line"> INFO <span class="token punctuation">(</span>RANDOM_DELAY will be scaled with factor <span class="token number">25</span>% <span class="token keyword">if</span> used.<span class="token punctuation">)</span></span>
<span class="line"> ---------------------- Cron End ------------------------- </span>
<span class="line"></span>
<span class="line"> </span>
<span class="line"> --------------------- Kernel Begin ------------------------ </span>
<span class="line"></span>
<span class="line"> </span>
<span class="line"> WARNING:  Kernel Errors Present</span>
<span class="line">    <span class="token punctuation">[</span>drm:vmw_host_log <span class="token punctuation">[</span>vmwgfx<span class="token punctuation">]</span><span class="token punctuation">]</span> *ERROR* Failed to send  <span class="token punctuation">..</span>.:  <span class="token number">2</span> Time<span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line"> </span>
<span class="line"> ---------------------- Kernel End ------------------------- </span>
<span class="line"></span>
<span class="line"> </span>
<span class="line"> --------------------- pam_unix Begin ------------------------ </span>
<span class="line"></span>
<span class="line"> gdm-launch-environment:</span>
<span class="line">    Unknown Entries:</span>
<span class="line">       session opened <span class="token keyword">for</span> user gdm by <span class="token punctuation">(</span>uid<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">)</span>: <span class="token number">1</span> Time<span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line"> </span>
<span class="line"> su-l:</span>
<span class="line">    Sessions Opened:</span>
<span class="line">       mrcode -<span class="token operator">></span> root: <span class="token number">3</span> Time<span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line"> <span class="token punctuation">..</span><span class="token punctuation">..</span></span>
<span class="line"> </span>
<span class="line"> --------------------- SSHD Begin ------------------------ </span>
<span class="line"></span>
<span class="line"> </span>
<span class="line"> SSHD Started: <span class="token number">2</span> Time<span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line"> </span>
<span class="line"> Users logging <span class="token keyword">in</span> through sshd:</span>
<span class="line">    mrcode:</span>
<span class="line">       <span class="token number">192.168</span>.0.105: <span class="token number">4</span> <span class="token builtin class-name">times</span></span>
<span class="line"> </span>
<span class="line"> **Unmatched Entries**</span>
<span class="line"> error: no <span class="token function">more</span> sessions <span class="token builtin class-name">:</span> <span class="token number">8</span> time<span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line"> </span>
<span class="line"> ---------------------- SSHD End ------------------------- </span>
<span class="line"></span>
<span class="line"> <span class="token comment"># 还有对磁盘的使用状态</span></span>
<span class="line"> --------------------- Disk Space Begin ------------------------ </span>
<span class="line"></span>
<span class="line"> Filesystem               Size  Used Avail Use% Mounted on</span>
<span class="line"> devtmpfs                 565M     <span class="token number">0</span>  565M   <span class="token number">0</span>% /dev</span>
<span class="line"> /dev/mapper/centos-root   10G  <span class="token number">5</span>.1G  <span class="token number">5</span>.0G  <span class="token number">51</span>% /</span>
<span class="line"> /dev/sda2               1014M  181M  834M  <span class="token number">18</span>% /boot</span>
<span class="line"> /dev/mapper/centos-home  <span class="token number">5</span>.0G  927M  <span class="token number">4</span>.1G  <span class="token number">19</span>% /home</span>
<span class="line"> </span>
<span class="line"> </span>
<span class="line"> ---------------------- Disk Space End ------------------------- </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="作者写的文件分析工具" tabindex="-1"><a class="header-anchor" href="#作者写的文件分析工具"><span>作者写的文件分析工具</span></a></h2>
<p>下载地址：http://linux.vbird.org//linux_basic/0570syslog//logfile_centos7.tar.gz</p>
<p>下载之后，在根目录解压，文件会进入相应的目录，包括定时任务的文件，每日 00:10 分析一次系统注册表文件，该工具只适用于 journalctl 的数据系统（CentOS 7.x）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tar -zxvf logfile_centos7.tar.gz -C /</span></span>
<span class="line">etc/cron.d/vbirdlogfile</span>
<span class="line">root/bin/logfile/</span>
<span class="line">root/bin/logfile/function/</span>
<span class="line">root/bin/logfile/function/samba</span>
<span class="line">root/bin/logfile/function/dovecot</span>
<span class="line">root/bin/logfile/function/sendmail</span>
<span class="line">root/bin/logfile/function/proftp</span>
<span class="line">root/bin/logfile/function/pop3</span>
<span class="line">root/bin/logfile/function/procmail</span>
<span class="line">root/bin/logfile/function/zzz.sh</span>
<span class="line">root/bin/logfile/function/ssh</span>
<span class="line">root/bin/logfile/function/ports</span>
<span class="line">root/bin/logfile/function/postfix</span>
<span class="line">root/bin/logfile/function/openwebmail</span>
<span class="line">root/bin/logfile/function/wuftp</span>
<span class="line">root/bin/logfile/logfile.sh</span>
<span class="line"><span class="token comment"># 可以看到函数挺多的</span></span>
<span class="line"><span class="token comment"># 这个是定时任务的文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/cron.d/vbirdlogfile </span></span>
<span class="line"><span class="token number">10</span> <span class="token number">0</span> * * * root /bin/bash /root/bin/logfile/logfile.sh <span class="token operator">&amp;></span> /dev/null</span>
<span class="line"><span class="token comment"># 手动执行</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sh /root/bin/logfile/logfile.sh </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sh /root/bin/logfile/logfile.sh </span></span>
<span class="line">/sbin/restorecon:  Warning no default label <span class="token keyword">for</span> /dev/shm/logfile/logfile_mail.txt</span>
<span class="line"></span>
<span class="line">grep: /etc/postfix/body_checks: No such <span class="token function">file</span> or directory</span>
<span class="line">cat: /dev/shm/logfile//postlog.1: No such <span class="token function">file</span> or directory</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 打开邮件，就看到有信息了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mail</span></span>
<span class="line">Heirloom Mail version <span class="token number">12.5</span> <span class="token number">7</span>/5/10.  Type ? <span class="token keyword">for</span> help.</span>
<span class="line"><span class="token string">"/var/spool/mail/root"</span><span class="token builtin class-name">:</span> <span class="token number">2</span> messages <span class="token number">1</span> new</span>
<span class="line">    <span class="token number">1</span> logwatch@study.cento  Mon Mar <span class="token number">16</span> 04:07 <span class="token number">129</span>/4931  <span class="token string">"Logwatch for study.centos.mrcode (Linux)"</span></span>
<span class="line"><span class="token operator">></span>N  <span class="token number">2</span> root                  Mon Mar <span class="token number">16</span> 04:24  <span class="token number">67</span>/3085  <span class="token string">"study.centos.mrcode logfile analysis results"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看内容，感觉还是可以的</span></span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> system summary <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span></span>
<span class="line">Linux kernel  <span class="token builtin class-name">:</span>  Linux version <span class="token number">3.10</span>.0-1062.el7.x86_64 <span class="token punctuation">(</span>mockbuild@kbuilder.bsys.centos.org<span class="token punctuation">)</span></span>
<span class="line">CPU informatin:  <span class="token number">1</span> Intel<span class="token punctuation">(</span>R<span class="token punctuation">)</span> Core<span class="token punctuation">(</span>TM<span class="token punctuation">)</span> i7-7820HQ CPU @ <span class="token number">2</span>.90GHz</span>
<span class="line">CPU speed     <span class="token builtin class-name">:</span>  <span class="token number">2904.000</span> MHz</span>
<span class="line"><span class="token function">hostname</span> is   <span class="token builtin class-name">:</span>  study.centos.mrcode</span>
<span class="line">Network IP    <span class="token builtin class-name">:</span>  <span class="token number">192.168</span>.0.128 <span class="token number">192.168</span>.122.1</span>
<span class="line">Check <span class="token function">time</span>    <span class="token builtin class-name">:</span>  <span class="token number">2020</span>/March/16 04:23:52 <span class="token punctuation">(</span> Monday <span class="token punctuation">)</span></span>
<span class="line">Summary <span class="token function">date</span>  <span class="token builtin class-name">:</span>  Mar <span class="token number">15</span></span>
<span class="line">Up <span class="token builtin class-name">times</span>      <span class="token builtin class-name">:</span>  <span class="token number">8</span>:10,</span>
<span class="line">Filesystem summary: </span>
<span class="line">       Filesystem              Type      Size  Used Avail Use% Mounted on</span>
<span class="line">       devtmpfs                devtmpfs  565M     <span class="token number">0</span>  565M   <span class="token number">0</span>% /dev</span>
<span class="line">       tmpfs                   tmpfs     582M  144K  582M   <span class="token number">1</span>% /dev/shm</span>
<span class="line">       tmpfs                   tmpfs     582M  <span class="token number">1</span>.3M  581M   <span class="token number">1</span>% /run</span>
<span class="line">       tmpfs                   tmpfs     582M     <span class="token number">0</span>  582M   <span class="token number">0</span>% /sys/fs/cgroup</span>
<span class="line">       /dev/mapper/centos-root xfs        10G  <span class="token number">5</span>.1G  <span class="token number">5</span>.0G  <span class="token number">51</span>% /</span>
<span class="line">       /dev/sda2               xfs      1014M  181M  834M  <span class="token number">18</span>% /boot</span>
<span class="line">       /dev/mapper/centos-home xfs       <span class="token number">5</span>.0G  927M  <span class="token number">4</span>.1G  <span class="token number">19</span>% /home</span>
<span class="line">       tmpfs                   tmpfs     117M   12K  117M   <span class="token number">1</span>% /run/user/42</span>
<span class="line">       tmpfs                   tmpfs     117M     <span class="token number">0</span>  117M   <span class="token number">0</span>% /run/user/1000</span>
<span class="line">       /dev/sr0                iso9660   <span class="token number">4</span>.4G  <span class="token number">4</span>.4G     <span class="token number">0</span> <span class="token number">100</span>% /mnt</span>
<span class="line"> </span>
<span class="line"> </span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> Ports 的相關分析資訊 <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span></span>
<span class="line">主機啟用的 port 與相關的 process owner：</span>
<span class="line">對外部介面開放的 </span>
<span class="line">   ports <span class="token punctuation">(</span>PID<span class="token operator">|</span>owner<span class="token operator">|</span><span class="token builtin class-name">command</span><span class="token punctuation">)</span></span>
<span class="line">       tcp <span class="token number">22</span><span class="token operator">|</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token operator">|</span>/usr/sbin/sshd <span class="token parameter variable">-D</span></span>
<span class="line">       tcp <span class="token number">25</span><span class="token operator">|</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token operator">|</span>/usr/libexec/postfix/master <span class="token parameter variable">-w</span></span>
<span class="line">       tcp <span class="token number">53</span><span class="token operator">|</span><span class="token punctuation">(</span>nobody<span class="token punctuation">)</span><span class="token operator">|</span>/usr/sbin/dnsmasq --conf-file<span class="token operator">=</span>/var/lib/libvirt/dnsmasq/de</span>
<span class="line">       tcp <span class="token number">111</span><span class="token operator">|</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token operator">|</span>/usr/lib/systemd/systemd --switched-root <span class="token parameter variable">--system</span> <span class="token parameter variable">--deseri</span></span>
<span class="line">       tcp <span class="token number">514</span><span class="token operator">|</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token operator">|</span>/usr/sbin/rsyslogd <span class="token parameter variable">-n</span></span>
<span class="line">       tcp <span class="token number">631</span><span class="token operator">|</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token operator">|</span>/usr/sbin/cupsd <span class="token parameter variable">-f</span></span>
<span class="line">       udp <span class="token number">53</span><span class="token operator">|</span><span class="token punctuation">(</span>nobody<span class="token punctuation">)</span><span class="token operator">|</span>/usr/sbin/dnsmasq --conf-file<span class="token operator">=</span>/var/lib/libvirt/dnsmasq/de</span>
<span class="line">       udp <span class="token number">67</span><span class="token operator">|</span><span class="token punctuation">(</span>nobody<span class="token punctuation">)</span><span class="token operator">|</span>/usr/sbin/dnsmasq --conf-file<span class="token operator">=</span>/var/lib/libvirt/dnsmasq/de</span>
<span class="line">       udp <span class="token number">111</span><span class="token operator">|</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token operator">|</span>/usr/lib/systemd/systemd --switched-root <span class="token parameter variable">--system</span> <span class="token parameter variable">--deseri</span></span>
<span class="line">       udp <span class="token number">1008</span><span class="token operator">|</span><span class="token punctuation">(</span>rpc<span class="token punctuation">)</span><span class="token operator">|</span>/sbin/rpcbind <span class="token parameter variable">-w</span></span>
<span class="line">       udp <span class="token number">5353</span><span class="token operator">|</span><span class="token punctuation">(</span>avahi<span class="token punctuation">)</span><span class="token operator">|</span>avahi-daemon: running <span class="token punctuation">[</span>study.local<span class="token punctuation">]</span></span>
<span class="line">       udp <span class="token number">45105</span><span class="token operator">|</span><span class="token punctuation">(</span>avahi<span class="token punctuation">)</span><span class="token operator">|</span>avahi-daemon: running <span class="token punctuation">[</span>study.local<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> SSH 的登錄檔資訊彙整 <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span></span>
<span class="line">一共成功登入的次數：   <span class="token number">4</span></span>
<span class="line">       帳號     來源位址    次數</span>
<span class="line">       mrcode     <span class="token number">192.168</span>.0.105     <span class="token number">4</span></span>
<span class="line"> </span>
<span class="line"> </span>
<span class="line"><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> Postfix 的登錄檔資訊彙整 <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span></span>
<span class="line">使用者信箱受信次數：</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


