<template><div><h1 id="selinux-初探" tabindex="-1"><a class="header-anchor" href="#selinux-初探"><span>SELinux 初探</span></a></h1>
<p>CentOS 5.x 之后，SELinux 已经是个非常完备的核心模块了，尤其是 CentOS 提供了很多管理 SELinux 的指令与机制，因此在整理架构上面是单纯且容易操作管理的，所以在没有自行开发网络服务软件以及使用其他第三方协力软件的情况下，也就是全部使用 CentOS 官方提供的软件来使用我们服务器的情况下，建议不要关闭 SELinux</p>
<h2 id="什么是-selinux" tabindex="-1"><a class="header-anchor" href="#什么是-selinux"><span>什么是 SELinux</span></a></h2>
<p>Security Enhanced Linux 的缩写 SELinux，字面意思是安全强化的 LInux。至于强化的是哪个部分？下面来了解下</p>
<h3 id="当初设计的目标-避免资源的误用" tabindex="-1"><a class="header-anchor" href="#当初设计的目标-避免资源的误用"><span>当初设计的目标：避免资源的误用</span></a></h3>
<p>SELinux 是由美国国家安全局（NSA）开发的，需求来源于内部员工资源误用导致系统出现问题；</p>
<p>资源误用：将一个 <code v-pre>/var/www/html/</code> 目录权限设置成 777，那么当启动 www 服务器软件，就意味着这个软件触发的进程拥有对该目录写入的权限，只要通过该进程服务器对目录大量写入，就会导致系统硬盘资源被爆破</p>
<p>SELinux 是在进行进程、文件等西部权限设置依据的一个核心模块，由于启动网络服务的也是进程，因此刚好也能够控制网络服务是否能存取系统资源的一道关卡</p>
<p>在讲解 SELinux 之前，先回顾一下之前讲到的：系统文件权限与用户之间的关系</p>
<h3 id="传统的文件权限与账户关系-自主式访问控制-dac" tabindex="-1"><a class="header-anchor" href="#传统的文件权限与账户关系-自主式访问控制-dac"><span>传统的文件权限与账户关系：自主式访问控制 DAC</span></a></h3>
<p>第 13 章中讲到：系统账户主要分为系统管理员（root）与一般用户，他们能否使用系统上的文件资源与 rwx 权限设置有关。（各种权限设置对 root 无效）。当某个进程想要对文件进行存取时，系统会根据该进程的拥有者、群组，并比对文件的权限，若通过权限检查，就可以存取该文件</p>
<p>这种存取文件的方式被称为 <strong>自主式访问控制 Discretionary Access Controller 简称 DAC</strong>，基本上就是依据进程的拥有者与文件资源的 rwx 权限来决定有无存取的能力。DAC 有如下困扰：</p>
<ul>
<li>root 具有最高的权限：只要取得属于 root 的进程，那么就很危险</li>
<li>使用者可以取得进程来变更文件资源的访问权限：如果将某个目录权限不小心设置为 777，由于对任何人的权限会变成 rwx，因此该目录就会被任何人所任意存取</li>
</ul>
<h3 id="以政策规则规定特定进程读取特定文件-委任式访问控制-mac" tabindex="-1"><a class="header-anchor" href="#以政策规则规定特定进程读取特定文件-委任式访问控制-mac"><span>以政策规则规定特定进程读取特定文件：委任式访问控制 MAC</span></a></h3>
<p>为了避免 DAC 的困扰，SELinux 导入了委任式访问控制 Mandatory Access Control 简称 MAC</p>
<p>MAC 可以针对特定的进程与特定的文件资源来进行权限的控制。即使你是 root，那么在使用不同的进程时，你所能取得的权限并不一定是 root，而需要看当时该进程的设置。如此一来针对控制的「主体」变成了「进程」而不是使用者，但是真个系统进程很多、文件也很多，一项一项控制太麻烦，所以 SELinux 也提供一些预设的政策 <strong>Policy</strong> ，并在该政策内提供多个规则 <strong>rule</strong>，让你可以选择是否启用该控制规则</p>
<p>在该种模式下，进程能够活动的空变小了。比如：www 服务器软件达成进程为 httpd 这个程序，默认情况下， httpd 仅能在 <code v-pre>/var/www</code> 目录下存取文件，如果 httpd 进程要去其他目录存储数据时，除了规则设置要开放外，目标目录也要设置成 httpd 可读取的模式 type 才行，限制非常多，所以，即使 httpd 这个进程被黑客取得了控制权限，它也无权限浏览其他的目录文件</p>
<p>简单说，针对 Apache 这个 www 网络服务使用 DAC 或 MAC 的结果来说，两者的关系可用下图来说明</p>
<p><img src="@source/tutorial-basis/16/assets/image-20200316175339460.png" alt="image-20200316175339460"></p>
<p>圆环表示画地为牢，DAC 模式下，由于是 root，牢房对 root 无效。在 MAC 下，牢房就生效了</p>
<h2 id="selinux-的运作模式" tabindex="-1"><a class="header-anchor" href="#selinux-的运作模式"><span>SELinux 的运作模式</span></a></h2>
<p><strong>强调</strong>：SELinux 是通过 MAC 方式来管控 <strong>进程</strong>，进程是主体，而目标则是该进程能否读取的文件资源。</p>
<ul>
<li>
<p>主体 Subject：可以看成就是 进程</p>
</li>
<li>
<p>目标 Object：目标资源，一般就是文件系统</p>
</li>
<li>
<p>政策 Policy：会根据某些服务来制定基本的存取安全性政策，政策内还会有详细的规则 rule 来指定不同的服务开放某些资源的存取。在目前的 CentOS 7.x 里面仅提供 3 个主要的政策：</p>
<ul>
<li>targeted：针对网络服务限制较多，针对本机限制较少，是预设的政策</li>
<li>minimum：由 target 修正而来，仅针对选择的进程来保护</li>
<li>mls：完整的 SELinux 限制，限制方面较严格</li>
</ul>
</li>
<li>
<p>安全性本文 security context</p>
<p>主体是否能存取目标除了政策指定之外，<strong>主体与目标的安全性本文必须一致才能够顺利存取</strong></p>
<p>security context 类似文件系统的 rwx，如果设置错误，你的某些服务（主体进程）就无法存取文件系统（目标资源），就会出现权限不符对的错误信息了</p>
</li>
</ul>
<p>由于 SELinux 重点在保护进程读取文件系统的权限，上述说明的示意图如下：</p>
<p><img src="@source/tutorial-basis/16/assets/image-20200317094948523.png" alt="image-20200317094948523"></p>
<p>传统的进程与文件的 rwx 方式，在这中间增加了 SELinux 月 安全性本文 <em>规则</em> ，通过了这些规则之后，才和传统的进程与文件的 rwx 方式一致。</p>
<p>笔者理解为是通过拦截器的方式，出台了 SELinux ，前面通过 SElinux 拦截细化权限，符合要求的再去到传统的方式，这样一来就对传统的加强了</p>
<h3 id="安全性本文-security-context" tabindex="-1"><a class="header-anchor" href="#安全性本文-security-context"><span>安全性本文 Security Context</span></a></h3>
<p>CentOS 7.x 的 target 政策提供了非常多的规则，只需要如何开启关闭某项规则即可。</p>
<p>安全性本文则非常麻烦，可能需要自行配置它，比如你常常设置文件的 rwx 权限，那么这个安全性本文就类似，可以看成是 SELinux 中的 rwx</p>
<p>安全性本文存在于主体进程中与目标文件资源中，物理位置是放在文件的 inode 中，因此主体进程想要读取目标文件资源时，同样需要读取 inode，这就可以对比安全性本文一级 rwx 等权限是否正确了。</p>
<p>观察安全性本文可使用 <code v-pre>ls -Z</code> ，但是前提是需要启动 SELinux 才行，下个小节会介绍如何启动 SELinux，这里先介绍知识点</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ls -Z</span></span>
<span class="line">-rw-r--r--. root root unconfined_u:object_r:admin_home_t:s0 accountadd.sh</span>
<span class="line">-rw-r--r--. root root unconfined_u:object_r:admin_home_t:s0 accountadd.txt</span>
<span class="line">-rwxr--r--+ root root unconfined_u:object_r:admin_home_t:s0 acl_test1</span>
<span class="line">-rw-r--r--. root root unconfined_u:object_r:admin_home_t:s0 addaccount2.sh</span>
<span class="line">-rw-------. root root system_u:object_r:admin_home_t:s0 anaconda-ks.cfg</span>
<span class="line">-rw-r--r--. root root system_u:object_r:admin_home_t:s0 initial-setup-ks.cfg</span>
<span class="line"><span class="token comment"># 上述字段很长的那一栏就是安全性本文了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安全性本文主要用冒号分割为三个字段，含义如下：</p>
<ul>
<li>
<p>identify：身份</p>
<p>相当于账户方面的身份识别，常见有几下几种类型</p>
<ul>
<li>
<p>unconfined_u：不受限的用户</p>
<p>该文件来自不受限的进程所产生的，一般来说，可以使用可登录账号来取得 bash，预设的 bash 环境是不受 SELinux 管制的，因为 bash 并不是什么特别的网络服务，因此在该 bash 进程所产生的文件，其身份识别大多就是该类型了</p>
</li>
<li>
<p>system_u：系统用户</p>
<p>基本上，如果是系统会软件本身所提供的文件，大多就是该类型，如果是用户通过 bash 自己建立的文件，大多则是不受限的 unconfined_u 身份，如果是网络服务所产生的文件，或则是系统服务运行过程中所产生的文件，则大部分是 system_u</p>
</li>
</ul>
</li>
<li>
<p>role：角色</p>
<p>通过该字段，可以知道这个资料是属于进程、文件资源还是代表使用者，一般的角色有：</p>
<ul>
<li>object_r：代表的是文件或目录等文件资源</li>
<li>system_r：代表的是进程，不过一般使用者也会被指定为 system_r</li>
</ul>
</li>
<li>
<p>type：类型，最重要</p>
<p>在预设的 targeted 政策中， identify 与 role 字段基本上是不重要的，而 type 是最重要的，基本上，一个主体进程能不能读取到这个文件资源，与类型字段有关，而类型字段在文件与进程的定义不相同：</p>
<ul>
<li>type：在文件资源（object）上面称为类型（type）</li>
<li>domain：在主体进程（subject）则称为领域（domain）</li>
</ul>
<p>domain 需要与 type 搭配，则该进程才能够顺利的读取文件资源</p>
<h2 id="进程与文件-selinux-type-字段的相关性" tabindex="-1"><a class="header-anchor" href="#进程与文件-selinux-type-字段的相关性"><span>进程与文件 SELinux type 字段的相关性</span></a></h2>
<p>通过身份识别与角色字段的定义，我们可以大概某个进程所代表的意义</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 观察下系统 进程的 SELinux 相关信息</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ps -eZ</span></span>
<span class="line">LABEL                             PID TTY          TIME CMD</span>
<span class="line">system_u:system_r:init_t:s0         <span class="token number">1</span> ?        00:00:01 systemd</span>
<span class="line">system_u:system_r:kernel_t:s0       <span class="token number">2</span> ?        00:00:00 kthreadd</span>
<span class="line">system_u:system_r:kernel_t:s0       <span class="token number">4</span> ?        00:00:00 kworker/0:0H</span>
<span class="line">system_u:system_r:kernel_t:s0       <span class="token number">5</span> ?        00:00:00 kworker/u2:0</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">system_u:system_r:sshd_t:s0-s0:c0.c1023 <span class="token number">2344</span> ? 00:00:00 sshd</span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2350</span> ? 00:00:00 sshd</span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2353</span> pts/0 00:00:00 <span class="token function">bash</span></span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2415</span> pts/0 00:00:00 <span class="token function">su</span></span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2424</span> pts/0 00:00:00 <span class="token function">bash</span></span>
<span class="line">system_u:system_r:kernel_t:s0    <span class="token number">2726</span> ?        00:00:00 kworker/u2:2</span>
<span class="line">system_u:system_r:kernel_t:s0    <span class="token number">2778</span> ?        00:00:00 kworker/0:1</span>
<span class="line">system_u:system_r:kernel_t:s0    <span class="token number">2836</span> ?        00:00:00 kworker/0:3</span>
<span class="line">system_u:system_r:kernel_t:s0    <span class="token number">2877</span> ?        00:00:00 kworker/0:0</span>
<span class="line">system_u:system_r:ksmtuned_t:s0  <span class="token number">2885</span> ?        00:00:00 <span class="token function">sleep</span></span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2886</span> pts/0 00:00:00 <span class="token function">ps</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 基本上进程主要分为两大类，</span></span>
<span class="line"><span class="token comment"># 一种是系统有受限的 system_u:system_r，</span></span>
<span class="line"><span class="token comment"># 另一种可能是用户自己的，比较不受限的进程（通常是本机用户自己执行的程序 ） unconfined_u:unconfined_r</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 2424 pts/0 00:00:00 bash</span></span>
<span class="line"><span class="token comment"># 比如上面这个进程，就是我们自己执行命令所在的 bash</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基本上，这些对于资料在 targeted 政策下的对应对下</p>
<table>
<thead>
<tr>
<th>身份识别</th>
<th>角色</th>
<th>对应在 targeted 的意义</th>
</tr>
</thead>
<tbody>
<tr>
<td>unconfined_u</td>
<td>unconfined_r</td>
<td>一般可登陆使用者的进程，比较没有受限的进程。大多数都是用户已经顺利登陆系统（不论是网络还是本机登陆来取得可用的 shell）后，所用来操作系统的进程，如 bash x window 相关富安居等</td>
</tr>
<tr>
<td>system_u</td>
<td>system_r</td>
<td>由于为系统账户，因此是非交谈式的系统运行进程，大多数的系统进程均是这种类型</td>
</tr>
</tbody>
</table>
<p>如上所述，在预设的 target 政策下，最重要的是 type 字段，主体与目标之间是否具有可读写的权限，与进程的 domain 与文件的 type 有关。这两者的关系可以使用 crond 以及他的配置文件来说明</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先看看 crond 这个进程的安全本文内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ps -eZ | grep cron</span></span>
<span class="line">system_u:system_r:crond_t:s0-s0:c0.c1023 <span class="token number">1398</span> ? 00:00:00 atd</span>
<span class="line">system_u:system_r:crond_t:s0-s0:c0.c1023 <span class="token number">1400</span> ? 00:00:00 crond</span>
<span class="line"><span class="token comment"># 这个安全本文的类型名称为 crond_t 格式</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 看看 /usr/ssbin/crond 、 /etc/cron.d、/etc/cron.d 文件的安全本文内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -Zd /usr/sbin/crond /etc/crontab /etc/cron.d</span></span>
<span class="line">drwxr-xr-x. root root system_u:object_r:system_cron_spool_t:s0 /etc/cron.d</span>
<span class="line">-rw-r--r--. root root system_u:object_r:system_cron_spool_t:s0 /etc/crontab</span>
<span class="line">-rwxr-xr-x. root root system_u:object_r:crond_exec_t:s0 /usr/sbin/crond</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行 <code v-pre>/usr/ssbin/crond</code> 后，该程序编程的进程 domain 类似是 crond_t，它能够读取的配置文件是 <code v-pre>system_cron_spool_t</code> 类型。因此无论 <code v-pre>/etc/crontab</code>与 <code v-pre>/etc/cron.d</code> 以及 <code v-pre>/var/spool/cron</code> 都会是相关的 SELinux 类型（<code v-pre>/var/spool/cron</code> 为 <code v-pre>user_cron_spool_t</code> 类型）。下面图示说明</p>
<p><img src="@source/tutorial-basis/16/assets/image-20200317115128966.png" alt="image-20200317115128966"></p>
</li>
</ul>
<ol>
<li>crond 执行后，具有 crond_exec_t 类型</li>
<li>该文件类型会造成主体进程 Subject 具有 crond 这个领域 domain，政策针对这个领域有许多规则，其中就包括可以读取的目标资源类型</li>
<li>由于 crond domain 被设置为可以读取 system_cron_spool_t 类型的目标文件 object，因此你的配置文件放到 <code v-pre>/etc/cron.d/</code> 目录下，就能够被 crond 进程读取了</li>
<li>但是最终能不能读到正确的资料，还需要看传统的 rwx 是否符合 Linux 的权限规范</li>
</ol>
<p>下面来测试上述说明</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 假设你因为不熟悉的缘故，因此是在 root 家目录建立一个如下的 cron 设置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim checktime</span></span>
<span class="line"><span class="token number">10</span> * * * * root <span class="token function">sleep</span> 60s</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 发现文件放错目录了，又不想要保留副本，因此使用 mv 移动到正确的目录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mv checktime /etc/cron.d/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /etc/cron.d/checktime </span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">26</span> Mar <span class="token number">17</span> <span class="token number">13</span>:12 /etc/cron.d/checktime</span>
<span class="line"><span class="token comment"># 权限是 644，任何进程都可以读取</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 强制重新启动 crond，然后查看登录日志</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart crond          </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tail /var/log/cron</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:01:01 study run-parts<span class="token punctuation">(</span>/etc/cron.hourly<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">3889</span><span class="token punctuation">]</span>: finished mcelog.cron</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:10:01 study CROND<span class="token punctuation">[</span><span class="token number">3972</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>root<span class="token punctuation">)</span> CMD <span class="token punctuation">(</span>/usr/lib64/sa/sa1 <span class="token number">1</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:14:01 study crond<span class="token punctuation">[</span><span class="token number">1400</span><span class="token punctuation">]</span>: <span class="token variable"><span class="token punctuation">((</span>null<span class="token punctuation">))</span></span> Unauthorized SELinux <span class="token assign-left variable">context</span><span class="token operator">=</span>system_u:system_r:system_cronjob_t:s0-s0:c0.c1023 <span class="token assign-left variable">file_context</span><span class="token operator">=</span>unconfined_u:object_r:admin_home_t:s0 <span class="token punctuation">(</span>/etc/cron.d/checktime<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:14:01 study crond<span class="token punctuation">[</span><span class="token number">1400</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>root<span class="token punctuation">)</span> FAILED <span class="token punctuation">(</span>loading <span class="token function">cron</span> table<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:15:08 study crond<span class="token punctuation">[</span><span class="token number">1400</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>Shutting down<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:15:08 study crond<span class="token punctuation">[</span><span class="token number">4073</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>RANDOM_DELAY will be scaled with factor <span class="token number">13</span>% <span class="token keyword">if</span> used.<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:15:08 study crond<span class="token punctuation">[</span><span class="token number">4073</span><span class="token punctuation">]</span>: <span class="token variable"><span class="token punctuation">((</span>null<span class="token punctuation">))</span></span> Unauthorized SELinux <span class="token assign-left variable">context</span><span class="token operator">=</span>system_u:system_r:system_cronjob_t:s0-s0:c0.c1023 <span class="token assign-left variable">file_context</span><span class="token operator">=</span>unconfined_u:object_r:admin_home_t:s0 <span class="token punctuation">(</span>/etc/cron.d/checktime<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:15:08 study crond<span class="token punctuation">[</span><span class="token number">4073</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>root<span class="token punctuation">)</span> FAILED <span class="token punctuation">(</span>loading <span class="token function">cron</span> table<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:15:08 study crond<span class="token punctuation">[</span><span class="token number">4073</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>running with inotify support<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">13</span>:15:08 study crond<span class="token punctuation">[</span><span class="token number">4073</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>@reboot <span class="token function">jobs</span> will be run at computer's startup.<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 上述日志中有 Unauthorized 的信息，表示有错误，因为原本的安全本文与文件的实际安全本文无法搭配的缘故，</span></span>
<span class="line"><span class="token comment"># 信息还列出了 SELinux context 与 file_context 的信息，表示的确不匹配</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从如上的测试来看，上述测试由于安全本文不匹配导致进程无法读取该文件</p>
<h2 id="selinux-三种模式的启动、关闭与观察" tabindex="-1"><a class="header-anchor" href="#selinux-三种模式的启动、关闭与观察"><span>SELinux 三种模式的启动、关闭与观察</span></a></h2>
<p>并非所有的 Linux distribution 都支持 SELinux，CentOS 7.x 本身就有支持 SELinux，所以你不需要自行编译 SELinux 到你的 Linux 核心中。目前 SELinux 是否启动有三种模式：</p>
<ul>
<li>enforcing：强制模式，表示 SELinux 运行中，且已经正确的开始限制 domain/type 了</li>
<li>permissive：宽容模式，表示 SELinux 运行中，不过仅有警告进行并不会实际限制 domain/type 的存取。这种模式可以用来 debug SELinux 的配置</li>
<li>disabled：SELinux 关闭中</li>
</ul>
<p>三种模式的示意图如下：</p>
<p><img src="@source/tutorial-basis/16/assets/image-20200317132323274.png" alt="image-20200317132323274"></p>
<p>注意：并非有所的进程都受 SELinux 的管控，注意是有 <strong>受限的进程主体</strong>，可以通过 <code v-pre>ps -eZ</code> 来观察该进程是否有受限（confined）。下面来观察 crond 与 bash 程序是否有被限制</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ps -eZ | grep -E 'cron|bash'</span></span>
<span class="line">system_u:system_r:crond_t:s0-s0:c0.c1023 <span class="token number">1398</span> ? 00:00:00 atd</span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2353</span> pts/0 00:00:00 <span class="token function">bash</span></span>
<span class="line">unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 <span class="token number">2424</span> pts/0 00:00:00 <span class="token function">bash</span></span>
<span class="line">system_u:system_r:crond_t:s0-s0:c0.c1023 <span class="token number">4073</span> ? 00:00:00 crond</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为目前 target 这个政策下，只有第 3 个字段 type 会有影响，因此可以看到 crond 有 <code v-pre>crond_t</code> 类型，是受限的，而 bash 是 <code v-pre>unconfined_t</code> 类型，是不受限的，也就是说 bash 不会经过上图的流程，而直接去判定 rwx</p>
<p>可以通过以下方式获取当前的 SELinux 模式</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># getenforce </span></span>
<span class="line">Enforcing</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>查询当前 SELinux 的政策（Policy）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">sestatus <span class="token punctuation">[</span>-vb<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-v：检查 /etc/sestatus.conf 内的文件与进程的安全性本文内容</span>
<span class="line">	-b：将目前政策的规则布尔值列出，即某些规则 rule 是否要启动（0/1）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出目前 SELinux 使用的哪个政策 Policy</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sestatus   		</span></span>
<span class="line">SELinux status:                 enabled				<span class="token comment"># SELinux 是否启动</span></span>
<span class="line">SELinuxfs mount:                /sys/fs/selinux		<span class="token comment"># SELinux 的相关文件数据挂载点</span></span>
<span class="line">SELinux root directory:         /etc/selinux		<span class="token comment"># SELinux 的根目录所在</span></span>
<span class="line">Loaded policy name:             targeted			<span class="token comment"># 当前的政策</span></span>
<span class="line">Current mode:                   enforcing			<span class="token comment"># 当前模式</span></span>
<span class="line">Mode from config file:          enforcing			<span class="token comment"># 目前配置文件内规范的 SELinux 模式</span></span>
<span class="line">Policy MLS status:              enabled				<span class="token comment"># 是否含有 MLS 的模式机制</span></span>
<span class="line">Policy deny_unknown status:     allowed				<span class="token comment"># 是否预设抵挡未知的主体进程</span></span>
<span class="line">Max kernel policy version:      <span class="token number">31</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述信息科知道，SELinux 目前的政策是 targeted ，可通过如下方式修改</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/selinux/config </span></span>
<span class="line"><span class="token comment"># This file controls the state of SELinux on the system.</span></span>
<span class="line"><span class="token comment"># SELINUX= can take one of these three values:</span></span>
<span class="line"><span class="token comment">#     enforcing - SELinux security policy is enforced.</span></span>
<span class="line"><span class="token comment">#     permissive - SELinux prints warnings instead of enforcing.</span></span>
<span class="line"><span class="token comment">#     disabled - No SELinux policy is loaded.</span></span>
<span class="line"><span class="token assign-left variable">SELINUX</span><span class="token operator">=</span>enforcing		 	<span class="token comment"># 可选择为上述 3 个</span></span>
<span class="line"><span class="token comment"># SELINUXTYPE= can take one of three values:</span></span>
<span class="line"><span class="token comment">#     targeted - Targeted processes are protected,</span></span>
<span class="line"><span class="token comment">#     minimum - Modification of targeted policy. Only selected processes are protected. </span></span>
<span class="line"><span class="token comment">#     mls - Multi Level Security protection.</span></span>
<span class="line"><span class="token assign-left variable">SELINUXTYPE</span><span class="token operator">=</span>targeted		<span class="token comment"># 可选值为上述 3 个</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="selinux-的启动与关闭" tabindex="-1"><a class="header-anchor" href="#selinux-的启动与关闭"><span>SElinux 的启动与关闭</span></a></h3>
<p>由于 SElinux 是整合到核心中去的，因此修改上述配置文件之后，需要重新启动。</p>
<p>注意：如果从 disable 转到启动 SELinux 的模式时，由于系统必须要针对文件写入安全性本文信息，因此开机过程需要耗费不少时间等待重新写入 SELinux 安全性本文（有时也称为SELinux Label），而且在写完之后还需要重新启动一次，启动成功之后，再使用 <code v-pre>getenforce 和 sestatus</code> 来观察是否有成功启动到 Enforcing 模式</p>
<p>如果当前已经是 Enforcing 模式，可能由于一些设置问题大道至 SELinux 让某些服务无法正常的运行，此时可将模式修改为宽容模式（permissive），让 SELinux 只发出警告信息</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">setenforce <span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">|</span><span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	<span class="token number">0</span>：转成 permissive 宽容模式</span>
<span class="line">	<span class="token number">1</span>：转成 Enforcing 强制模式</span>
<span class="line">注意：无法在 Disabled 模式下进程模式的切换	</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>某些时候从 Disabled 换成 Enforcing 之后，有部分服务可能无法顺利启动，可能会报错 <code v-pre>/lib/xxx</code> 数据没有权限读取的错误信息。这大多数是由于重新写入 Selinux type（Relabel）出错的原因，使用 Permissive 模式就没有该错误。最简单的办法是在 Permissive 模式下使用指令 <code v-pre>restorecon -Rv  /</code> 重新还原所有 SELinux 的类型</p>
<h2 id="selinux-政策内的规则管理" tabindex="-1"><a class="header-anchor" href="#selinux-政策内的规则管理"><span>SELinux 政策内的规则管理</span></a></h2>
<h3 id="selinux-各个规则的布尔值查询-getsebool" tabindex="-1"><a class="header-anchor" href="#selinux-各个规则的布尔值查询-getsebool"><span>SELinux 各个规则的布尔值查询：getsebool</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">getsebool <span class="token punctuation">[</span>-a<span class="token punctuation">]</span> <span class="token punctuation">[</span>规则名称<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-a：列出目前系统上所有 SELinux 规则的布尔值为开启或关闭（on/off）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：查询所有的布尔值设置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># getsebool -a</span></span>
<span class="line">abrt_anon_write --<span class="token operator">></span> off</span>
<span class="line">abrt_handle_event --<span class="token operator">></span> off</span>
<span class="line">abrt_upload_watch_anon_write --<span class="token operator">></span> on</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">cron_can_relabel --<span class="token operator">></span> off		<span class="token comment"># 这个与 cron 有关</span></span>
<span class="line">cron_system_cronjob_use_shares --<span class="token operator">></span> off</span>
<span class="line">cron_userdomain_transition --<span class="token operator">></span> on</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">httpd_anon_write --<span class="token operator">></span> off		<span class="token comment"># 与网页 http 有关</span></span>
<span class="line">httpd_builtin_scripting --<span class="token operator">></span> on</span>
<span class="line">httpd_can_check_spam --<span class="token operator">></span> off</span>
<span class="line"><span class="token comment"># 每一行都是一个规则</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="selinux-各个规则规范的主体进程能够读取的文件-selinux-type-查询-seinfo、sesearch" tabindex="-1"><a class="header-anchor" href="#selinux-各个规则规范的主体进程能够读取的文件-selinux-type-查询-seinfo、sesearch"><span>SELinux 各个规则规范的主体进程能够读取的文件 SELinux type 查询 seinfo、sesearch</span></a></h3>
<p>上述指令知道了所有的规则开启情况，可以通过 seinfo、sesearch 等工具来查看每个规则具体在限制什么。</p>
<p>上述工具并未预装，<RouteLink to="/tutorial-basis/07/03.html#%E6%8C%82%E8%BD%BD-cd-%E6%88%96-dvd-%E5%85%89%E7%9B%98">请拿出安装光盘挂载到 /mnt 目录下</RouteLink>，安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid </span></span>
<span class="line">/dev/sr0: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"2019-09-11-18-50-31-00"</span> <span class="token assign-left variable">LABEL</span><span class="token operator">=</span><span class="token string">"CentOS 7 x86_64"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"iso9660"</span> <span class="token assign-left variable">PTTYPE</span><span class="token operator">=</span><span class="token string">"dos"</span> </span>
<span class="line">/dev/sda1: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"e9d54afb-2afe-42de-87fe-9f55d747fcd9"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> </span>
<span class="line">/dev/sda2: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"CNUXwS-J3Lh-0nDA-TssW-l1vT-90us-MHYnT1"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"LVM2_member"</span> </span>
<span class="line">/dev/mapper/centos_study-root: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"d7e09bb4-2f04-4ed4-b377-91a22fe85ce7"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> </span>
<span class="line">/dev/mapper/centos_study-swap: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"684eebc0-3f70-4fc1-9a5d-d683f6a07cd0"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"swap"</span> </span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount /dev/sr0 /mnt/</span></span>
<span class="line">mount: /dev/sr0 is write-protected, mounting read-only</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># yum install /mnt/Packages/setools-console-*                               </span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">Complete<span class="token operator">!</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># umount /mnt/  # 卸载光盘</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">seinfo <span class="token punctuation">[</span>-Atrub<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-A：列出 SELinux 的状态、规则布尔值、身份识别、角色、类型等所有信息</span>
<span class="line">	-u：列出 SELinux 的所有身份识别 user 种类</span>
<span class="line">	-r：列出 SELinux 的所有角色 role 种类</span>
<span class="line">	-t：列出 SELinux 的所有类型 <span class="token builtin class-name">type</span> 种类</span>
<span class="line">	-b：列出所有规则的种类（布尔值）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出 SELinux 在此政策下的统计状态</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># seinfo </span></span>
<span class="line"></span>
<span class="line">Statistics <span class="token keyword">for</span> policy file: /sys/fs/selinux/policy</span>
<span class="line">Policy Version <span class="token operator">&amp;</span> Type: v.31 <span class="token punctuation">(</span>binary, mls<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">   Classes:           <span class="token number">130</span>    Permissions:       <span class="token number">272</span></span>
<span class="line">   Sensitivities:       <span class="token number">1</span>    Categories:       <span class="token number">1024</span></span>
<span class="line">   Types:            <span class="token number">4792</span>    Attributes:        <span class="token number">253</span></span>
<span class="line">   Users:               <span class="token number">8</span>    Roles:              <span class="token number">14</span></span>
<span class="line">   Booleans:          <span class="token number">316</span>    Cond. Expr.:       <span class="token number">362</span></span>
<span class="line">   Allow:          <span class="token number">107360</span>    Neverallow:          <span class="token number">0</span></span>
<span class="line">   Auditallow:        <span class="token number">157</span>    Dontaudit:       <span class="token number">10020</span></span>
<span class="line">   Type_trans:      <span class="token number">18129</span>    Type_change:        <span class="token number">74</span></span>
<span class="line">   Type_member:        <span class="token number">35</span>    Role allow:         <span class="token number">39</span></span>
<span class="line">   Role_trans:        <span class="token number">416</span>    Range_trans:      <span class="token number">5899</span></span>
<span class="line">   Constraints:       <span class="token number">143</span>    Validatetrans:       <span class="token number">0</span></span>
<span class="line">   Initial SIDs:       <span class="token number">27</span>    Fs_use:             <span class="token number">32</span></span>
<span class="line">   Genfscon:          <span class="token number">103</span>    Portcon:           <span class="token number">614</span></span>
<span class="line">   Netifcon:            <span class="token number">0</span>    Nodecon:             <span class="token number">0</span></span>
<span class="line">   Permissives:         <span class="token number">0</span>    Polcap:              <span class="token number">5</span></span>
<span class="line">   </span>
<span class="line"><span class="token comment"># 当前政策是 targeted ？ （哪里显示的？），此政策下的 Types 类型有 4792 个</span></span>
<span class="line"><span class="token comment"># SELinux 的规则（Booleans）有 316 条</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在前面讲到过几个身份识别 user 与 角色 role，seinfo 可以查询到所有的种类，可自行查询</p>
<p>在前面讲到 <code v-pre>/etc/cron.d/checktime</code>  的 SElinux type 类型不太对，我们知道 crond 进程的 type 是 <code v-pre>crond_t</code>，那么查找下 <code v-pre>crond_t</code> 能够读取的文件 SELinux type 有哪些</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">sesearch <span class="token punctuation">[</span>-A<span class="token punctuation">]</span> <span class="token punctuation">[</span>-s 主体类别<span class="token punctuation">]</span> <span class="token punctuation">[</span>-t 目标类别<span class="token punctuation">]</span> <span class="token punctuation">[</span>-b 布尔值<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-A：列出后面数据中，允许「读取或放行」的相关数据</span>
<span class="line">	-t：后面还要接 type、例如 <span class="token parameter variable">-t</span> httpd_t</span>
<span class="line">	-b：后面接 SELinux 的规则，例如 <span class="token parameter variable">-b</span> httpd_enable_ftp_server</span>
<span class="line">	</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：找出 crond_t 主体进程能够读取的文件 SELinux type</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sesearch -A -s crond_t | grep spool</span></span>
<span class="line">   allow crond_t var_spool_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t system_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t user_cron_spool_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t user_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> create getattr setattr lock append unlink <span class="token function">link</span> <span class="token function">rename</span> <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t system_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> create getattr setattr lock append unlink <span class="token function">link</span> <span class="token function">rename</span> <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t var_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> create getattr setattr lock append unlink <span class="token function">link</span> <span class="token function">rename</span> <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow daemon user_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> getattr lock append <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> getattr lock add_name remove_name search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t user_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> getattr lock add_name remove_name search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t user_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> create getattr setattr lock append unlink <span class="token function">link</span> <span class="token function">rename</span> <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t system_cron_spool_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> create getattr setattr lock append unlink <span class="token function">link</span> <span class="token function">rename</span> <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span></span>
<span class="line">   </span>
<span class="line"><span class="token comment"># allow 后面是主体进程以及文件的 SELinux type，上面数据是截取出来的</span></span>
<span class="line"><span class="token comment"># crond_t 可以读取 system_cron_spool_t 的文件/目录类型等</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：找出 crond_t 是否能读取 /etc/cron.d/checktime 这个我们自定义的配置文件？</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -Z /etc/cron.d/checktime </span></span>
<span class="line">-rw-r--r--. root root unconfined_u:object_r:admin_home_t:s0 /etc/cron.d/checktime</span>
<span class="line"><span class="token comment"># 两个重点：SELinux type 为 admin_home_t，一个是文件（file）</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sesearch -A -s crond_t | grep admin_home_t</span></span>
<span class="line">   allow domain admin_home_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> getattr search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t admin_home_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow userdom_filetrans_type admin_home_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow userdom_filetrans_type admin_home_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> <span class="token function">write</span> getattr lock add_name remove_name search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow domain admin_home_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow crond_t admin_home_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span></span>
<span class="line">   </span>
<span class="line"><span class="token comment"># 发现有 crond_t admin_home_t 存在，不过这个是总体的信息</span></span>
<span class="line"><span class="token comment"># 没有针对某些规则的查询，所以不能确定 checktime 能否被读取，但是基本上就是 SELinux type 出现问题，才无法读取的</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在知道了 <code v-pre>/etc/cron.d/checktime</code> 是 SELinux type 错误导致无法读取的。看来在 <code v-pre>getsebool -a</code> 中看到的 <code v-pre>httpd_enable_homedirs</code> 是什么？又是规范了哪些主体进程能够读取的 SELinux type</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage boolean -l | grep httpd_enable_homedirs</span></span>
<span class="line">httpd_enable_homedirs          <span class="token punctuation">(</span>off  ,  off<span class="token punctuation">)</span>  Allow httpd to <span class="token builtin class-name">enable</span> homedirs</span>
<span class="line"><span class="token comment"># httpd_enable_homedirs 的功能是允许 httpd 进程读取用户家目录</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 3：列出该规则中，主体进程能够读取的文件  SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sesearch -A -b httpd_enable_homedirs</span></span>
<span class="line">Found <span class="token number">77</span> semantic av rules:</span>
<span class="line">   allow httpd_t user_home_type <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_suexec_t user_home_type <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_suexec_t user_home_dir_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_t nfs_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t nfs_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t cifs_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_user_script_t user_home_type <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_user_script_t user_home_type <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> getattr search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_t cifs_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t nfs_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> getattr search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t nfs_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t nfs_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> getattr search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t nfs_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_t user_home_dir_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> getattr search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t cifs_t <span class="token builtin class-name">:</span> <span class="token function">file</span> <span class="token punctuation">{</span> ioctl <span class="token builtin class-name">read</span> getattr lock <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t user_home_dir_t <span class="token builtin class-name">:</span> <span class="token function">dir</span> <span class="token punctuation">{</span> getattr search <span class="token function">open</span> <span class="token punctuation">}</span> <span class="token punctuation">;</span> </span>
<span class="line">   allow httpd_sys_script_t user_home_dir_t <span class="token builtin class-name">:</span> lnk_file <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> getattr <span class="token punctuation">}</span> <span class="token punctuation">;</span></span>
<span class="line">   xxx</span>
<span class="line"> <span class="token comment"># 从上面的数据才可以理解，主要是放行 httpd_t 能否读取用户家目录的文件 （笔者这里是懵逼的没有看出来）</span></span>
<span class="line"> <span class="token comment"># 所以，如果该规则没有启动，基本上 httpd_t 这种进程就无法读取用户家目录下的文件</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-selinux-规则的布尔值-setsebool" tabindex="-1"><a class="header-anchor" href="#修改-selinux-规则的布尔值-setsebool"><span>修改 SELinux 规则的布尔值 setsebool</span></a></h3>
<p>查询到某个 SELinux rule ，并且以 seaserch 知道该规则的用途后，可以通过下面的方式来管理</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">setsebool <span class="token punctuation">[</span>-p<span class="token punctuation">]</span> <span class="token punctuation">[</span>规则名称<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token operator">|</span><span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">-P：直接将设置值写入配置文件，该设置数据未来会生效</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：查询 httpd_enable_homedirs 这个规则的状态，并且修改这个规则为不同的布尔值</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># getsebool httpd_enable_homedirs</span></span>
<span class="line">httpd_enable_homedirs --<span class="token operator">></span> off			<span class="token comment"># 关闭状态</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># setsebool -P httpd_enable_homedirs 1		# 开启它</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># getsebool httpd_enable_homedirs</span></span>
<span class="line">httpd_enable_homedirs --<span class="token operator">></span> on</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="selinux-安全本文的修改" tabindex="-1"><a class="header-anchor" href="#selinux-安全本文的修改"><span>SELinux 安全本文的修改</span></a></h2>
<p>SELinux 对受限的主体进程没有影响：</p>
<ol>
<li>考虑 SELinux 的三种类型</li>
<li>考虑 SELinux的政策规则是否放行</li>
<li>比对 SELinux type 关系</li>
</ol>
<p>上面讲解过可以通过 sesearch 来找到主体进程与文件的 SELinux type 关系，那么怎么修改文件的 SELinux type，能让主体进程读到呢？</p>
<h3 id="使用-chcon-手动修改文件的-selinux-type" tabindex="-1"><a class="header-anchor" href="#使用-chcon-手动修改文件的-selinux-type"><span>使用 chcon 手动修改文件的 SELinux type</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">chcon <span class="token punctuation">[</span>-R<span class="token punctuation">]</span> <span class="token punctuation">[</span>-t type<span class="token punctuation">]</span> <span class="token punctuation">[</span>-u user<span class="token punctuation">]</span> <span class="token punctuation">[</span>-r role<span class="token punctuation">]</span> 文件</span>
<span class="line">chcon <span class="token punctuation">[</span>-R<span class="token punctuation">]</span> <span class="token parameter variable">--reference</span><span class="token operator">=</span>范例文件 文件</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-R：连同该目录下的次目录也同时修改</span>
<span class="line">	-t：后面接安全性本文的类型字段，例如 httpd_sys_content_t</span>
<span class="line">	-u：后面接身份识别，例如 system_u <span class="token punctuation">(</span>不重要<span class="token punctuation">)</span></span>
<span class="line">	-r：后面接角色，例如 system_r （不重要）</span>
<span class="line">	-v：若有变化成功，将变动的结果列出来</span>
<span class="line">	<span class="token parameter variable">--reference</span><span class="token operator">=</span>文件：拿某个文件档范例来修改后续接的文件的类型</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：查询 /etc/hosts 的 SELinux type，并将该类型套用到 /etc/cron.d/checktime 上</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -Z /etc/hosts</span></span>
<span class="line">-rw-r--r--. root root system_u:object_r:net_conf_t:s0  /etc/hosts</span>
<span class="line"><span class="token comment"># net_conf_t 是上面文件中的类型</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chcon -v -t net_conf_t /etc/cron.d/checktime </span></span>
<span class="line">changing security context of <span class="token string">'/etc/cron.d/checktime'</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -Z /etc/cron.d/checktime </span></span>
<span class="line">-rw-r--r--. root root unconfined_u:object_r:net_conf_t:s0 /etc/cron.d/checktime</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：直接以 /etc/shadow 的 type 套用</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chcon -v --reference=/etc/shadow /etc/cron.d/checktime</span></span>
<span class="line">changing security context of <span class="token string">'/etc/cron.d/checktime'</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -Z /etc/shadow /etc/cron.d/checktime </span></span>
<span class="line">-rw-r--r--. root root system_u:object_r:shadow_t:s0    /etc/cron.d/checktime</span>
<span class="line">----------. root root system_u:object_r:shadow_t:s0    /etc/shadow</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的示例并不能解决 crond 不能读取 <code v-pre>/etc/cron.d/checktime</code> 的问题，因为需要改成 <code v-pre>/etc/cron.d</code> 下的标准 type 才行。可以使用 restorecon 来让 SELinux 自己默认解决目录下的 type 问题</p>
<h3 id="使用-restorecon-让文件恢复正确的-selinux-type" tabindex="-1"><a class="header-anchor" href="#使用-restorecon-让文件恢复正确的-selinux-type"><span>使用 restorecon 让文件恢复正确的 SELinux type</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">restorecon <span class="token punctuation">[</span>-Rv<span class="token punctuation">]</span> 文件或目录</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-R：连同次目录一起修改</span>
<span class="line">	-v：将过程显示到屏幕上</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：将 /etc/cron.d/ 下的文件都恢复成预设的 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># restorecon -Rv /etc/cron.d/</span></span>
<span class="line">restorecon reset /etc/cron.d/checktime context system_u:object_r:shadow_t:s0-<span class="token operator">></span>system_u:object_r:system_cron_spool_t:s0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 上面将  shadow_t 改成了 system_cron_spool_t 类型</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 4：重新启动 crond 看看有没有正确启动 checktime</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart crond          </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tail /var/log/cron</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:01:01 study CROND<span class="token punctuation">[</span><span class="token number">5886</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>root<span class="token punctuation">)</span> CMD <span class="token punctuation">(</span>run-parts /etc/cron.hourly<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:01:01 study run-parts<span class="token punctuation">(</span>/etc/cron.hourly<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">5886</span><span class="token punctuation">]</span>: starting 0anacron</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:01:01 study run-parts<span class="token punctuation">(</span>/etc/cron.hourly<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">5898</span><span class="token punctuation">]</span>: finished 0anacron</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:01:01 study run-parts<span class="token punctuation">(</span>/etc/cron.hourly<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">5886</span><span class="token punctuation">]</span>: starting mcelog.cron</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:01:01 study run-parts<span class="token punctuation">(</span>/etc/cron.hourly<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">5904</span><span class="token punctuation">]</span>: finished mcelog.cron</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:10:01 study CROND<span class="token punctuation">[</span><span class="token number">5989</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>root<span class="token punctuation">)</span> CMD <span class="token punctuation">(</span>/usr/lib64/sa/sa1 <span class="token number">1</span> <span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:12:48 study crond<span class="token punctuation">[</span><span class="token number">4073</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>Shutting down<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:12:48 study crond<span class="token punctuation">[</span><span class="token number">6068</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>RANDOM_DELAY will be scaled with factor <span class="token number">62</span>% <span class="token keyword">if</span> used.<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:12:49 study crond<span class="token punctuation">[</span><span class="token number">6068</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>running with inotify support<span class="token punctuation">)</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">16</span>:12:49 study crond<span class="token punctuation">[</span><span class="token number">6068</span><span class="token punctuation">]</span>: <span class="token punctuation">(</span>CRON<span class="token punctuation">)</span> INFO <span class="token punctuation">(</span>@reboot <span class="token function">jobs</span> will be run at computer's startup.<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 没有报错信息</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从这里看来 restorecon 很方便，chcon 还是比较麻烦的</p>
<h3 id="semanage-默认目录的安全性本文查询与修改" tabindex="-1"><a class="header-anchor" href="#semanage-默认目录的安全性本文查询与修改"><span>semanage 默认目录的安全性本文查询与修改</span></a></h3>
<p>为什么 restorecon 可以恢复原本的 SELinux type 呢？那一定是有个地方在记录每个文件/目录的 SELinux 默认类型</p>
<ol>
<li>如何查询预设的 SELinux type</li>
<li>如何增加、修改、删除 预设的 SELinux type</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">semanage <span class="token punctuation">{</span>login<span class="token operator">|</span>user<span class="token operator">|</span>port<span class="token operator">|</span>interface<span class="token operator">|</span>fcontext<span class="token operator">|</span>translation<span class="token punctuation">}</span> <span class="token parameter variable">-l</span></span>
<span class="line">semanage fcontext -<span class="token punctuation">{</span>a<span class="token operator">|</span>d<span class="token operator">|</span>m<span class="token punctuation">}</span> <span class="token punctuation">[</span>-frst<span class="token punctuation">]</span> file_spec</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	fcontext：主要用在安全性本文方面的用途， <span class="token parameter variable">-l</span> 为查询</span>
<span class="line">	-a：增加；可以增加一些目录的默认安全性本文类型设置</span>
<span class="line">	-m：修改</span>
<span class="line">	-d：删除</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：查询 /etc/   /etc/cron.d/ 的预设 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage fcontext -l | grep -E '^/etc |^/etc/cron'</span></span>
<span class="line">/etc/cron.daily<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                              all files          system_u:object_r:bin_t:s0 </span>
<span class="line">/etc/cron.weekly<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                             all files          system_u:object_r:bin_t:s0 </span>
<span class="line">/etc/cron.hourly<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                             all files          system_u:object_r:bin_t:s0 </span>
<span class="line">/etc/cron.monthly<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                            all files          system_u:object_r:bin_t:s0 </span>
<span class="line">/etc/cron.minutely/openshift-facts                 regular <span class="token function">file</span>       system_u:object_r:openshift_cron_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>monthly<span class="token punctuation">)</span>/acct                    regular <span class="token function">file</span>       system_u:object_r:acct_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>weekly<span class="token punctuation">)</span>/sysklogd                 regular <span class="token function">file</span>       system_u:object_r:logrotate_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>monthly<span class="token punctuation">)</span>/mailman                 regular <span class="token function">file</span>       system_u:object_r:mailman_queue_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>weekly<span class="token punctuation">)</span>/man-db.*                 regular <span class="token function">file</span>       system_u:object_r:mandb_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>monthly<span class="token punctuation">)</span>/radiusd                 regular <span class="token function">file</span>       system_u:object_r:radiusd_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>weekly<span class="token punctuation">)</span>/ntp-simple               regular <span class="token function">file</span>       system_u:object_r:ntpd_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token punctuation">(</span>daily<span class="token operator">|</span>weekly<span class="token punctuation">)</span>/ntp-server               regular <span class="token function">file</span>       system_u:object_r:ntpd_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.<span class="token variable"><span class="token punctuation">((</span>daily<span class="token punctuation">)</span><span class="token operator">|</span><span class="token punctuation">(</span>weekly<span class="token punctuation">)</span><span class="token operator">|</span><span class="token punctuation">(</span>monthly<span class="token punctuation">))</span></span>/freeradius regular <span class="token function">file</span>       system_u:object_r:radiusd_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.d<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                                 all files          system_u:object_r:system_cron_spool_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.daily/<span class="token punctuation">[</span>sm<span class="token punctuation">]</span>locate                        regular <span class="token function">file</span>       system_u:object_r:locate_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.weekly/<span class="token punctuation">(</span>c<span class="token punctuation">)</span>?fingerd                      regular <span class="token function">file</span>       system_u:object_r:fingerd_exec_t:s0 </span>
<span class="line">/etc                                               all files          system_u:object_r:etc_t:s0 </span>
<span class="line">/etc/crontab                                       regular <span class="token function">file</span>       system_u:object_r:system_cron_spool_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.daily/prelink                           regular <span class="token function">file</span>       system_u:object_r:prelink_cron_system_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.daily/calamaris                         regular <span class="token function">file</span>       system_u:object_r:calamaris_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.daily/certwatch                         regular <span class="token function">file</span>       system_u:object_r:certwatch_exec_t:s0 </span>
<span class="line">/etc/cron<span class="token punctuation">\</span>.monthly/proftpd                         regular <span class="token function">file</span>       system_u:object_r:ftpd_exec_t:s0</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看 <code v-pre>/etc/cron\.d(/.*)?                                 all files          system_u:object_r:system_cron_spool_t:s0</code>  这一行，这也是为什么直接使用 vim 在 <code v-pre>/etc/cron.d</code> 下新建文件时，预设 SELinux type 是正确的。</p>
<p>练习：下面要建立一个 <code v-pre>/srv/mycron</code> 目录，默认也是需要变成 <code v-pre>system_cron_spool_t</code> 时</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先建立 mycron 目录，再放入配置文件，观察 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /srv/mycron</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cp /etc/cron.d/checktime /srv/mycron/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -dZ /srv/mycron/ /srv/mycron/checktime </span></span>
<span class="line">drwxr-xr-x. root root unconfined_u:object_r:var_t:s0   /srv/mycron/</span>
<span class="line">-rw-r--r--. root root unconfined_u:object_r:var_t:s0   /srv/mycron/checktime</span>
<span class="line"><span class="token comment"># 发现变成了 var_t</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 观察上层 /srv 的 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage fcontext -l | grep '^/srv'</span></span>
<span class="line">/srv/.*                                            all files          system_u:object_r:var_t:s0 </span>
<span class="line">/srv/<span class="token punctuation">(</span><span class="token punctuation">[</span>^/<span class="token punctuation">]</span>*/<span class="token punctuation">)</span>?www<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                            all files          system_u:object_r:httpd_sys_content_t:s0 </span>
<span class="line">/srv/<span class="token punctuation">(</span><span class="token punctuation">[</span>^/<span class="token punctuation">]</span>*/<span class="token punctuation">)</span>?ftp<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                            all files          system_u:object_r:public_content_t:s0 </span>
<span class="line">/srv/<span class="token punctuation">(</span><span class="token punctuation">[</span>^/<span class="token punctuation">]</span>*/<span class="token punctuation">)</span>?rsync<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                          all files          system_u:object_r:public_content_t:s0 </span>
<span class="line">/srv/<span class="token punctuation">(</span><span class="token punctuation">[</span>^/<span class="token punctuation">]</span>*/<span class="token punctuation">)</span>?www/logs<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                       all files          system_u:object_r:httpd_log_t:s0 </span>
<span class="line">/srv/node<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                                    all files          system_u:object_r:swift_data_t:s0 </span>
<span class="line">/srv/gallery2<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                                all files          system_u:object_r:httpd_sys_content_t:s0 </span>
<span class="line">/srv/lib/gitosis<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                             all files          system_u:object_r:gitosis_var_lib_t:s0 </span>
<span class="line">/srv/gallery2/smarty<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                         all files          system_u:object_r:httpd_sys_rw_content_t:s0 </span>
<span class="line">/srv/loopback-device<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                         all files          system_u:object_r:swift_data_t:s0 </span>
<span class="line">/srv                                               all files          system_u:object_r:var_t:s0</span>
<span class="line"><span class="token comment"># 可以看到这里默认就是  var_t 类型的</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 将 mycron 默认值改为 system_cron_spool_t</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage fcontext -a -t system_cron_spool_t "/srv/mycron(/.*)?"</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage fcontext -l | grep '^/srv/mycron'</span></span>
<span class="line">/srv/mycron<span class="token punctuation">(</span>/.*<span class="token punctuation">)</span>?                                  all files          system_u:object_r:system_cron_spool_t:s0 </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 回复 /srv/mycron 以及子目录相关的 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># restorecon -Rv /srv/mycron/</span></span>
<span class="line">restorecon reset /srv/mycron context unconfined_u:object_r:var_t:s0-<span class="token operator">></span>unconfined_u:object_r:system_cron_spool_t:s0</span>
<span class="line">restorecon reset /srv/mycron/checktime context unconfined_u:object_r:var_t:s0-<span class="token operator">></span>unconfined_u:object_r:system_cron_spool_t:s0</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过这个例子来看，restorecon 的确是很方便 ，学会这些基础的工具，对于 SELinux 来说基本上也够用了</p>
<h2 id="一个网络服务案例及登录文件协助" tabindex="-1"><a class="header-anchor" href="#一个网络服务案例及登录文件协助"><span>一个网络服务案例及登录文件协助</span></a></h2>
<p>本章在 SELinux 小节中介绍到的各个指令，尤其是 setsebool、chcon、restorecon 等都是为了当你的某些网络服务无法正常提供相关功能时，才需要进行修改的一些指令动作。</p>
<p>可以通过主动检查的方式来检查是否有 SELinux 产生的错误。而不是等客户端联机失败来反馈</p>
<h3 id="setroubleshoot-错误信息写入-var-log-messages" tabindex="-1"><a class="header-anchor" href="#setroubleshoot-错误信息写入-var-log-messages"><span>setroubleshoot：错误信息写入 <code v-pre>/var/log/messages</code></span></a></h3>
<p>几乎所有 SELinux 相关的程序都是以 se 开头，该服务时错误克服，启动后，会将关于 SELinux 的错误信息与克服方法记录到 <code v-pre>/var/log/messages</code> 与 <code v-pre>/var/log/setroubleshoot/*</code> 中</p>
<p>需要安装：setroubleshoot 与 setroubleshoot-server。原本 SELinux 信息是两个服务来记录的，分别是 auditd 与 setroubleshoot。在 CentOS 6.x 起整合成 auditd 了。所以安装好 setroubleshoot-server 后，需要重新启动 auditd 服务，否则 setroubleshoot 功能不会被启动</p>
<p>实际上。CentOS 7.x 对 setroubleshoot 的运行方式是：先由 auditd 去呼叫 audispd 服务，然后 audispd 服务启动 sedispatch 程序， sedispatch 再将原本的 auditd 信息转成 setroubleshoot 的信息，存储下来</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rpm -qa | grep setroubleshoot</span></span>
<span class="line">setroubleshoot-3.2.30-7.el7.x86_64</span>
<span class="line">setroubleshoot-plugins-3.0.67-4.el7.noarch</span>
<span class="line">setroubleshoot-server-3.2.30-7.el7.x86_64</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在预设的情况下 setroubleshoot 被安装了，记得刚安装 setroubleshoot 的话，需要重新启动 auditd 服务的、</p>
<p>目前我们没有任何受限的网络服务主体进程在运行，下面使用一个简单的 FTP 服务器软件示例，来了解上面讲到的许多重点应用</p>
<h3 id="实例说明-通过-vsftpd-这个-ftp-服务器来存取系统上的文件" tabindex="-1"><a class="header-anchor" href="#实例说明-通过-vsftpd-这个-ftp-服务器来存取系统上的文件"><span>实例说明：通过 vsftpd 这个 FTP 服务器来存取系统上的文件</span></a></h3>
<p>在 CentOS 7.x 环境下， FTP 的默认服务器软件主要是 vsftpd</p>
<p>详细的 FTP 协议在服务器篇讲解，这里简单利用 vsftpd 与 FTP 的协议来讲解 SELinux 的问题与错误克服。</p>
<p>下面只接受一些简单的 FTP  知识：客户端需要使用 FTP 账户登录 FTP 服务器，有一个称为「匿名 （anonymous）」的账户可以登录系统，但是这个匿名的账户登录后，只能存取一个特定的目录，而无法脱离该目录</p>
<p>在 vsftpd 中，一般用户与匿名者的家目录说明如下：</p>
<ul>
<li>匿名者：如果使用浏览器来联机到 FTP 服务器，那预设就是使用匿名者登录系统。匿名者的家目录默认是在 <code v-pre>/var/ftp</code> 中，同时，匿名者在家目录下只能下载数据，不能上传数据到 FTP 服务器，同时匿名者无法离开 FTP 服务器的 <code v-pre>/var/ftp</code> 目录</li>
<li>一般 FTP 账户：在预设情况下，所有 UID 大于 1000 的账户，都可以使用 FTP 来登录系统，登录系统后，所有的账户都能够取得自己家目录下的文件数据，预设也可以上传、下载文件的</li>
</ul>
<p>为了避免与之前章节的用户产生误解情况，创建一个名为 ftptest 的账户，且账户密码为 myftp123</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># useradd -s /sbin/nologin ftptest</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo "myftp123" | passwd --stdin ftptest</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user ftptest.</span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面来安装 vsftp 服务器软件（还是在光盘中安装，前面挂载那样）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># yum install /mnt/Packages/vsftpd-3*                    </span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl start vsftpd		# 启动 vsftpd 服务</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl enable vsftpd		# 设置为开机启动</span></span>
<span class="line">Created symlink from /etc/systemd/system/multi-user.target.wants/vsftpd.service to /usr/lib/systemd/system/vsftpd.service.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># netstat -tlnp</span></span>
<span class="line">Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span></span>
<span class="line">Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:631           <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1374</span>/cupsd          </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:25            <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6010          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">192.168</span>.122.1:53        <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:22              <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:631                 :::*                    LISTEN      <span class="token number">1374</span>/cupsd          </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:25                  :::*                    LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6010                :::*                    LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                    LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::21                   :::*                    LISTEN      <span class="token number">6656</span>/vsftpd         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::22                   :::*                    LISTEN      <span class="token number">1378</span>/sshd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以看到   6656/vsftpd 这行数据，代表已经启动了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="匿名者无法下载的问题" tabindex="-1"><a class="header-anchor" href="#匿名者无法下载的问题"><span>匿名者无法下载的问题</span></a></h3>
<p>模拟一些 FTP 的常用状态，假设将 <code v-pre>/etc/securetty</code> 以及主要的 <code v-pre>/etc/sysctl.conf</code> 放置给所有人下载，那么可以能会这样做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cp -a /etc/securetty /etc/sysctl.conf /var/ftp/pub</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /var/ftp/pub/</span></span>
<span class="line">total <span class="token number">8</span></span>
<span class="line">-rw-------. <span class="token number">1</span> root root <span class="token number">221</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> securetty</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">449</span> Aug  <span class="token number">9</span>  <span class="token number">2019</span> sysctl.conf</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般来说，默认要给用户下载的 FTP 文件会放在 <code v-pre>/var/ftp/pub</code> 目录中。下面使用简单的终端机浏览器 curl 来观察</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 查看 FTP 根目录下有哪些内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost</span></span>
<span class="line">drwxr-xr-x    <span class="token number">2</span> <span class="token number">0</span>        <span class="token number">0</span>              <span class="token number">42</span> Mar <span class="token number">17</span> 09:03 pub</span>
<span class="line"><span class="token comment"># 确实看到了 pub 目录</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 查看 pub 目录内的内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost/pub</span></span>
<span class="line">curl: <span class="token punctuation">(</span><span class="token number">78</span><span class="token punctuation">)</span> RETR response: <span class="token number">550</span></span>
<span class="line"><span class="token comment"># 无法访问，是因为 pub 是一个目录需要后缀 / 结尾</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost/pub/</span></span>
<span class="line">-rw-------    <span class="token number">1</span> <span class="token number">0</span>        <span class="token number">0</span>             <span class="token number">221</span> Oct <span class="token number">30</span>  <span class="token number">2018</span> securetty</span>
<span class="line">-rw-r--r--    <span class="token number">1</span> <span class="token number">0</span>        <span class="token number">0</span>             <span class="token number">449</span> Aug 08  <span class="token number">2019</span> sysctl.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 查看里面的文件内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost/pub/sysctl.conf</span></span>
<span class="line"><span class="token comment"># sysctl settings are defined through files in</span></span>
<span class="line"><span class="token comment"># /usr/lib/sysctl.d/, /run/sysctl.d/, and /etc/sysctl.d/.</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment"># Vendors settings live in /usr/lib/sysctl.d/.</span></span>
<span class="line"><span class="token comment"># To override a whole file, create a new file with the same in</span></span>
<span class="line"><span class="token comment"># /etc/sysctl.d/ and put new settings there. To override</span></span>
<span class="line"><span class="token comment"># only specific settings, add a file with a lexically later</span></span>
<span class="line"><span class="token comment"># name in /etc/sysctl.d/ and put new settings there.</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment"># For more information, see sysctl.conf(5) and sysctl.d(5).</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 上面不是错误信息，是哪个文件的内容</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 继续查看下一个文件内容</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost/pub/securetty  </span></span>
<span class="line">curl: <span class="token punctuation">(</span><span class="token number">78</span><span class="token punctuation">)</span> RETR response: <span class="token number">550</span></span>
<span class="line"><span class="token comment"># 这里看不到了，但是 securetty 的确是一个文件而不是一个目录，基本原因应该是权限问题</span></span>
<span class="line"><span class="token comment"># 因为 vsftpd 默认放在 /var/ftp/pub 内的资料，无论什么 SELinux type 几乎都可以被读取才对</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 修正权限后，再观察一次 securetty 文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /var/ftp/pub/</span></span>
<span class="line">total <span class="token number">8</span></span>
<span class="line">-rw-------. <span class="token number">1</span> root root <span class="token number">221</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> securetty</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">449</span> Aug  <span class="token number">9</span>  <span class="token number">2019</span> sysctl.conf</span>
<span class="line"><span class="token comment"># 可以看到 securetty 的其他人权限没有。改变成其他人也可以读取</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chmod a+r /var/ftp/pub/securetty </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost/pub/securetty</span></span>
<span class="line">console</span>
<span class="line">vc/1</span>
<span class="line">vc/2</span>
<span class="line">vc/3</span>
<span class="line"><span class="token comment"># 此时已经能看到文件内容了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6. 修正 SELinux type 的内容（非必须）</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># restorecon -Rv /var/ftp/</span></span>
<span class="line">restorecon reset /var/ftp/pub/securetty context system_u:object_r:etc_runtime_t:s0-<span class="token operator">></span>system_u:object_r:public_content_t:s0</span>
<span class="line">restorecon reset /var/ftp/pub/sysctl.conf context system_u:object_r:system_conf_t:s0-<span class="token operator">></span>system_u:object_r:public_content_t:s0</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述列子告诉我们，要先从权限角度来检查，如果无法被读取 ，可能是因为没有 r 或则没有 rx 权限，并不一定是 SELinux 引起的。下面看看用一般账户登录</p>
<h3 id="无法从家目录下载文件的问题分析与解决" tabindex="-1"><a class="header-anchor" href="#无法从家目录下载文件的问题分析与解决"><span>无法从家目录下载文件的问题分析与解决</span></a></h3>
<p>由于通过一般账户，前面建立的 ftptest 账户登录的话，文字型的 FTP 客户端软件，默认会将用户引导在根目录，而不是家目录，因此，访问的 URL 需要更改一下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 0. 在 ftptest 家目录下创建一些数据</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo  ~ftptest/</span></span>
<span class="line">/home/ftptest/</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo "testing" >  ~ftptest/test.txt</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cp -a /etc/hosts /etc/sysctl.conf ~ftptest/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll ~ftptest/</span></span>
<span class="line">total <span class="token number">12</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">158</span> Jun  <span class="token number">7</span>  <span class="token number">2013</span> hosts</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">449</span> Aug  <span class="token number">9</span>  <span class="token number">2019</span> sysctl.conf</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root   <span class="token number">8</span> Mar <span class="token number">17</span> <span class="token number">17</span>:23 test.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 一般账户直接登录 FTP 服务器，同时变换目录到家目录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost/~/</span></span>
<span class="line">curl: <span class="token punctuation">(</span><span class="token number">67</span><span class="token punctuation">)</span> Access denied: <span class="token number">530</span>			<span class="token comment"># 这里报错了</span></span>
<span class="line"><span class="token comment"># 注意：书上在增加 ftptest 用户的时候，使用的是 /sbin/nologin，就无法访问 ftp，这里修改下，就可以了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># usermod -s  /bin/bash ftptest</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost/~/</span></span>
<span class="line">-rw-r--r--    <span class="token number">1</span> <span class="token number">0</span>        <span class="token number">0</span>             <span class="token number">158</span> Jun 07  <span class="token number">2013</span> hosts</span>
<span class="line">-rw-r--r--    <span class="token number">1</span> <span class="token number">0</span>        <span class="token number">0</span>             <span class="token number">449</span> Aug 08  <span class="token number">2019</span> sysctl.conf</span>
<span class="line">-rw-r--r--    <span class="token number">1</span> <span class="token number">0</span>        <span class="token number">0</span>               <span class="token number">8</span> Mar <span class="token number">17</span> 09:23 test.txt</span>
<span class="line"><span class="token comment"># 看左边的权限也是没有问题的</span></span>
<span class="line"><span class="token comment"># 从这里开始，笔者的实验和书上的结果对不上了，下面只记录书上的操作指令</span></span>
<span class="line"><span class="token comment"># 就是因为上面修改用户的 bash 后，虽然可以访问了，但是下面的却可以下载文件，无法达到和书上的效果一样</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 下载上面可以阅读的权限文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost/~/test.txt</span></span>
<span class="line">curl:<span class="token punctuation">(</span><span class="token number">78</span><span class="token punctuation">)</span> RETR response:550</span>
<span class="line"><span class="token comment"># 无法访下载，是否是 SELinux 造成的？</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 将 SELinux 从 Enforce 转成 Permissive </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># setenforce 0</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost/~/test.txt</span></span>
<span class="line">testing</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># setenforce 1	# 确定是 SELinux 权限问题后，改回来</span></span>
<span class="line"><span class="token comment"># 需要该规则还是该 type？现在不知道</span></span>
<span class="line"><span class="token comment"># 所以先查询下登录日志有没有相关的信息提供给我们处理</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /var/log/messages</span></span>
<span class="line">Aug <span class="token number">9</span> 02:55:58 station3-39 setroubleshoot:SELinux is preventing /usr/sbin/vsftpd</span>
<span class="line">	from lock access on the <span class="token function">file</span> /home/ftptest/test.txt. For complete SELinux messages.</span>
<span class="line">	run sealert <span class="token parameter variable">-l</span> 3axxxxxxxx</span>
<span class="line"><span class="token comment"># 之类的字样，关键词就是 sealert ，执行这条命令</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sealert -l 3axxxxxxxx</span></span>
<span class="line">SELinux is preventing /usr/sbin/vsftpd from lock access on the <span class="token function">file</span> /home/ftptest/test/txt.</span>
<span class="line"><span class="token comment"># 下面说有 47.5% 的几率是由于这个原因所发生，并且可以使用 setsebool 去解决的意思</span></span>
<span class="line">******* Plugin catchall_boolean<span class="token punctuation">(</span><span class="token number">47.5</span> confidence<span class="token punctuation">)</span> suggests ********</span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> you want to allow <span class="token function">ftp</span> to home <span class="token function">dir</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">Do</span>
<span class="line">setsebool <span class="token parameter variable">-P</span> ftp_home_dir <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">******* Plugin catchall<span class="token punctuation">(</span><span class="token number">6</span>.38confidence<span class="token punctuation">)</span> suggests ********</span>
<span class="line">DO</span>
<span class="line"><span class="token comment"># grep vsftpd /var/log/audit/audit.log | audit2allow -M mypol</span></span>
<span class="line"><span class="token comment"># semodule -i mypol.pp</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下面就重要了，是整个问题发生的主要原因</span></span>
<span class="line">Additional Information:</span>
<span class="line">Source Context	system_u:system_r:ftpd_t:s0-s0:c0.c1023</span>
<span class="line">Target Context	unconfined_u:object_r:user_home_t:s0</span>
<span class="line">Target Objects	/home/ftptest/test/txt <span class="token punctuation">[</span> <span class="token function">file</span> <span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过上面的测试，知道主要的问题发生在 SElinux 的 type 不是 vsftpd_t 所能读取的原因，上面 47.5 的概率问题，ftp_home_dir 是 SELinux rules 的配置</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 确认下 SELinux 的模式，并且无法访问</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># getenforce </span></span>
<span class="line">Enforcing</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost/~/test.txt</span></span>
<span class="line">curl:<span class="token punctuation">(</span><span class="token number">78</span><span class="token punctuation">)</span> RETR response:550</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># setsebool -P ftp_home_dir 1</span></span>
<span class="line">Boolean ftp_home_dir is not defined</span>
<span class="line"><span class="token comment"># 可惜笔者这里提示没有被定义，与书上对不上啊</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="一般账户用户从非正规目录上传-下载文件" tabindex="-1"><a class="header-anchor" href="#一般账户用户从非正规目录上传-下载文件"><span>一般账户用户从非正规目录上传/下载文件</span></a></h3>
<p>提供 <code v-pre>/srv/gogogo</code> 目录给 ftptest 用户使用，该如何处理？假设不考虑 SELiunx 的话，就是如下方式</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 处理好所需要的目录数据</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /srv/gogogo</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chgrp ftptest /srv/gogogo/</span></span>
<span class="line"><span class="token comment"># 把用户组改成 ftptest 这个组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -d /srv/gogogo/</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root ftptest <span class="token number">22</span> <span class="token number">3</span>月  <span class="token number">17</span> <span class="token number">22</span>:43 /srv/gogogo/</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># echo "test" > /srv/gogogo/test.txt</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost//srv/gogogo/test.txt</span></span>
<span class="line">curl: <span class="token punctuation">(</span><span class="token number">78</span><span class="token punctuation">)</span> RETR response: <span class="token number">550</span></span>
<span class="line"><span class="token comment"># 访问不了，查看日志</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grep sealert /var/log/messages | tail</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">22</span>:46:35 study setroubleshoot: SELinux is preventing /usr/sbin/vsftpd from <span class="token builtin class-name">read</span> access on the <span class="token function">file</span> test.txt. For complete SELinux messages run: sealert <span class="token parameter variable">-l</span> 88f08c09-c510-4518-bbcc-58bcee06ffb0</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sealert -l 88f08c09-c510-4518-bbcc-58bcee06ffb0</span></span>
<span class="line">SELinux is preventing /usr/sbin/vsftpd from <span class="token builtin class-name">read</span> access on the <span class="token function">file</span> test.txt.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 虽然这个可信度很高，不过，因为会全部方向 FTP，所以不考虑</span></span>
<span class="line">*****  Plugin catchall_boolean <span class="token punctuation">(</span><span class="token number">57.6</span> confidence<span class="token punctuation">)</span> suggests   ******************</span>
<span class="line"></span>
<span class="line">If you want to allow ftpd to full access</span>
<span class="line">Then you must tell SELinux about this by enabling the <span class="token string">'ftpd_full_access'</span> boolean.</span>
<span class="line"></span>
<span class="line">Do</span>
<span class="line">setsebool <span class="token parameter variable">-P</span> ftpd_full_access <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 因为是非正规目录的使用，所以这边加上预设 SELinux type 恐怕能解决</span></span>
<span class="line">*****  Plugin catchall_labels <span class="token punctuation">(</span><span class="token number">36.2</span> confidence<span class="token punctuation">)</span> suggests   *******************</span>
<span class="line"></span>
<span class="line">If you want to allow vsftpd to have <span class="token builtin class-name">read</span> access on the test.txt <span class="token function">file</span></span>
<span class="line">Then you need to change the label on test.txt</span>
<span class="line">Do</span>
<span class="line"><span class="token comment"># 下面这一条数据</span></span>
<span class="line"><span class="token comment"># semanage fcontext -a -t FILE_TYPE 'test.txt'</span></span>
<span class="line"><span class="token punctuation">..</span><span class="token punctuation">..</span> 很多数据</span>
<span class="line">Then execute:</span>
<span class="line">restorecon <span class="token parameter variable">-v</span> <span class="token string">'test.txt'</span>		<span class="token comment"># 还有这一条数据，都是要参考的解决方案</span></span>
<span class="line"></span>
<span class="line">*****  Plugin catchall <span class="token punctuation">(</span><span class="token number">7.64</span> confidence<span class="token punctuation">)</span> suggests   **************************</span>
<span class="line"></span>
<span class="line">If you believe that vsftpd should be allowed <span class="token builtin class-name">read</span> access on the test.txt <span class="token function">file</span> by default.</span>
<span class="line">Then you should report this as a bug.</span>
<span class="line">You can generate a <span class="token builtin class-name">local</span> policy module to allow this access.</span>
<span class="line">Do</span>
<span class="line">allow this access <span class="token keyword">for</span> now by executing:</span>
<span class="line"><span class="token comment"># ausearch -c 'vsftpd' --raw | audit2allow -M my-vsftpd</span></span>
<span class="line"><span class="token comment"># semodule -i my-vsftpd.pp</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Additional Information:</span>
<span class="line">Source Context                system_u:system_r:ftpd_t:s0-s0:c0.c1023</span>
<span class="line">Target Context                unconfined_u:object_r:var_t:s0</span>
<span class="line">Target Objects                test.txt <span class="token punctuation">[</span> <span class="token function">file</span> <span class="token punctuation">]</span></span>
<span class="line">Source                        vsftpd</span>
<span class="line">Source Path                   /usr/sbin/vsftpd</span>
<span class="line">Port                          <span class="token operator">&lt;</span>Unknown<span class="token operator">></span></span>
<span class="line">Host                          study.centos.mrcode</span>
<span class="line">Source RPM Packages           </span>
<span class="line">Target RPM Packages           </span>
<span class="line">Policy RPM                    selinux-policy-3.13.1-252.el7.noarch</span>
<span class="line">Selinux Enabled               True</span>
<span class="line">Policy Type                   targeted</span>
<span class="line">Enforcing Mode                Enforcing</span>
<span class="line">Host Name                     study.centos.mrcode</span>
<span class="line">Platform                      Linux study.centos.mrcode <span class="token number">3.10</span>.0-1062.el7.x86_64</span>
<span class="line">                              <span class="token comment">#1 SMP Wed Aug 7 18:08:02 UTC 2019 x86_64 x86_64</span></span>
<span class="line">Alert Count                   <span class="token number">2</span></span>
<span class="line">First Seen                    <span class="token number">2020</span>-03-17 <span class="token number">22</span>:46:17 CST</span>
<span class="line">Last Seen                     <span class="token number">2020</span>-03-17 <span class="token number">22</span>:46:32 CST</span>
<span class="line">Local ID                      88f08c09-c510-4518-bbcc-58bcee06ffb0</span>
<span class="line"></span>
<span class="line">Raw Audit Messages</span>
<span class="line"><span class="token assign-left variable">type</span><span class="token operator">=</span>AVC <span class="token assign-left variable">msg</span><span class="token operator">=</span>audit<span class="token punctuation">(</span><span class="token number">1584456392.386</span>:979<span class="token punctuation">)</span>: avc:  denied  <span class="token punctuation">{</span> <span class="token builtin class-name">read</span> <span class="token punctuation">}</span> <span class="token keyword">for</span>  <span class="token assign-left variable">pid</span><span class="token operator">=</span><span class="token number">10979</span> <span class="token assign-left variable">comm</span><span class="token operator">=</span><span class="token string">"vsftpd"</span> <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"test.txt"</span> <span class="token assign-left variable">dev</span><span class="token operator">=</span><span class="token string">"dm-0"</span> <span class="token assign-left variable">ino</span><span class="token operator">=</span><span class="token number">35108539</span> <span class="token assign-left variable">scontext</span><span class="token operator">=</span>system_u:system_r:ftpd_t:s0-s0:c0.c1023 <span class="token assign-left variable">tcontext</span><span class="token operator">=</span>unconfined_u:object_r:var_t:s0 <span class="token assign-left variable">tclass</span><span class="token operator">=</span>file <span class="token assign-left variable">permissive</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Hash: vsftpd,ftpd_t,var_t,file,read</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 查看 /var/ftp 的 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment">#  ll -Zd /var/ftp/</span></span>
<span class="line">drwxr-xr-x. root root system_u:object_r:public_content_t:s0 /var/ftp/</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment">#  ll -Zd /srv/gogogo/</span></span>
<span class="line">drwxr-xr-x. root ftptest unconfined_u:object_r:var_t:s0   /srv/gogogo/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 以 sealert 建议的方法来处理好 SELinux type</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage fcontext -a -t public_content_t '/srv/gogogo(/.*)?'</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># restorecon -Rv /srv/gogogo</span></span>
<span class="line">restorecon reset /srv/gogogo context unconfined_u:object_r:var_t:s0-<span class="token operator">></span>unconfined_u:object_r:public_content_t:s0</span>
<span class="line">restorecon reset /srv/gogogo/test.txt context unconfined_u:object_r:var_t:s0-<span class="token operator">></span>unconfined_u:object_r:public_content_t:s0</span>
<span class="line"><span class="token comment"># 再次访问就可以了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://ftptest:myftp123@localhost//srv/gogogo/test.txt</span></span>
<span class="line"><span class="token builtin class-name">test</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个范例中，修改的是 type，前一个范例中修改的是 rule，不太一样的</p>
<h3 id="无法变更-ftp-联机端口问题分析解决" tabindex="-1"><a class="header-anchor" href="#无法变更-ftp-联机端口问题分析解决"><span>无法变更 FTP 联机端口问题分析解决</span></a></h3>
<p>比如你想要改变 FTP 默认的启动端口 21 改成 555，基本上，既然 SELinux 的主体进程大多是被受限的网络服务，很有可能连端口也限制了，下面尝试修改端口，来查看是怎么解决问题的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先处理 vsftpd 的配置文件，加入 port 的端口参数</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/vsftpd/vsftpd.conf </span></span>
<span class="line"><span class="token assign-left variable">listen_port</span><span class="token operator">=</span><span class="token number">555</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重启服务，并查看日志</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart vsftpd</span></span>
<span class="line">Job <span class="token keyword">for</span> vsftpd.service failed because the control process exited with error code. See <span class="token string">"systemctl status vsftpd.service"</span> and <span class="token string">"journalctl -xe"</span> <span class="token keyword">for</span> details.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grep sealert /var/log/messages</span></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">23</span>:03:23 study setroubleshoot: SELinux is preventing /usr/sbin/vsftpd from name_bind access on the tcp_socket port <span class="token number">555</span>. For complete SELinux messages run: sealert <span class="token parameter variable">-l</span> e3e3dee0-83eb-4cb8-b894-8be590fee082</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sealert -l e3e3dee0-83eb-4cb8-b894-8be590fee082</span></span>
<span class="line">SELinux is preventing /usr/sbin/vsftpd from name_bind access on the tcp_socket port <span class="token number">555</span>.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这个 92.2 的概率，基本上就是这个了</span></span>
<span class="line">*****  Plugin bind_ports <span class="token punctuation">(</span><span class="token number">92.2</span> confidence<span class="token punctuation">)</span> suggests   ************************</span>
<span class="line"></span>
<span class="line">If you want to allow /usr/sbin/vsftpd to <span class="token builtin class-name">bind</span> to network port <span class="token number">555</span></span>
<span class="line">Then you need to modify the port type.</span>
<span class="line">Do</span>
<span class="line"><span class="token comment"># semanage port -a -t PORT_TYPE -p tcp 555</span></span>
<span class="line">    where PORT_TYPE is one of the following: certmaster_port_t, cluster_port_t, ephemeral_port_t, ftp_data_port_t, ftp_port_t, hadoop_datanode_port_t, hplip_port_t, isns_port_t, port_t, postgrey_port_t, unreserved_port_t.</span>
<span class="line"></span>
<span class="line">*****  Plugin catchall_boolean <span class="token punctuation">(</span><span class="token number">7.83</span> confidence<span class="token punctuation">)</span> suggests   ******************</span>
<span class="line"></span>
<span class="line">If you want to allow nis to enabled</span>
<span class="line">Then you must tell SELinux about this by enabling the <span class="token string">'nis_enabled'</span> boolean.</span>
<span class="line"></span>
<span class="line">Do</span>
<span class="line">setsebool <span class="token parameter variable">-P</span> nis_enabled <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">*****  Plugin catchall <span class="token punctuation">(</span><span class="token number">1.41</span> confidence<span class="token punctuation">)</span> suggests   **************************</span>
<span class="line"></span>
<span class="line">If you believe that vsftpd should be allowed name_bind access on the port <span class="token number">555</span> tcp_socket by default.</span>
<span class="line">Then you should report this as a bug.</span>
<span class="line">You can generate a <span class="token builtin class-name">local</span> policy module to allow this access.</span>
<span class="line">Do</span>
<span class="line">allow this access <span class="token keyword">for</span> now by executing:</span>
<span class="line"><span class="token comment"># ausearch -c 'vsftpd' --raw | audit2allow -M my-vsftpd</span></span>
<span class="line"><span class="token comment"># semodule -i my-vsftpd.pp</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">Additional Information:</span>
<span class="line">Source Context                system_u:system_r:ftpd_t:s0-s0:c0.c1023</span>
<span class="line">Target Context                system_u:object_r:hi_reserved_port_t:s0</span>
<span class="line">Target Objects                port <span class="token number">555</span> <span class="token punctuation">[</span> tcp_socket <span class="token punctuation">]</span></span>
<span class="line">Source                        vsftpd</span>
<span class="line">Source Path                   /usr/sbin/vsftpd</span>
<span class="line">Port                          <span class="token number">555</span></span>
<span class="line">Host                          study.centos.mrcode</span>
<span class="line">Source RPM Packages           vsftpd-3.0.2-25.el7.x86_64</span>
<span class="line">Target RPM Packages           </span>
<span class="line">Policy RPM                    selinux-policy-3.13.1-252.el7.noarch</span>
<span class="line">Selinux Enabled               True</span>
<span class="line">Policy Type                   targeted</span>
<span class="line">Enforcing Mode                Enforcing</span>
<span class="line">Host Name                     study.centos.mrcode</span>
<span class="line">Platform                      Linux study.centos.mrcode <span class="token number">3.10</span>.0-1062.el7.x86_64</span>
<span class="line">                              <span class="token comment">#1 SMP Wed Aug 7 18:08:02 UTC 2019 x86_64 x86_64</span></span>
<span class="line">Alert Count                   <span class="token number">1</span></span>
<span class="line">First Seen                    <span class="token number">2020</span>-03-17 <span class="token number">23</span>:03:20 CST</span>
<span class="line">Last Seen                     <span class="token number">2020</span>-03-17 <span class="token number">23</span>:03:20 CST</span>
<span class="line">Local ID                      e3e3dee0-83eb-4cb8-b894-8be590fee082</span>
<span class="line"></span>
<span class="line">Raw Audit Messages</span>
<span class="line"><span class="token assign-left variable">type</span><span class="token operator">=</span>AVC <span class="token assign-left variable">msg</span><span class="token operator">=</span>audit<span class="token punctuation">(</span><span class="token number">1584457400.225</span>:1008<span class="token punctuation">)</span>: avc:  denied  <span class="token punctuation">{</span> name_bind <span class="token punctuation">}</span> <span class="token keyword">for</span>  <span class="token assign-left variable">pid</span><span class="token operator">=</span><span class="token number">11443</span> <span class="token assign-left variable">comm</span><span class="token operator">=</span><span class="token string">"vsftpd"</span> <span class="token assign-left variable">src</span><span class="token operator">=</span><span class="token number">555</span> <span class="token assign-left variable">scontext</span><span class="token operator">=</span>system_u:system_r:ftpd_t:s0-s0:c0.c1023 <span class="token assign-left variable">tcontext</span><span class="token operator">=</span>system_u:object_r:hi_reserved_port_t:s0 <span class="token assign-left variable">tclass</span><span class="token operator">=</span>tcp_socket <span class="token assign-left variable">permissive</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">type</span><span class="token operator">=</span>SYSCALL <span class="token assign-left variable">msg</span><span class="token operator">=</span>audit<span class="token punctuation">(</span><span class="token number">1584457400.225</span>:1008<span class="token punctuation">)</span>: <span class="token assign-left variable">arch</span><span class="token operator">=</span>x86_64 <span class="token assign-left variable">syscall</span><span class="token operator">=</span>bind <span class="token assign-left variable">success</span><span class="token operator">=</span>no <span class="token assign-left variable">exit</span><span class="token operator">=</span>EACCES <span class="token assign-left variable">a0</span><span class="token operator">=</span><span class="token number">4</span> <span class="token assign-left variable">a1</span><span class="token operator">=</span>55e9e4d4e800 <span class="token assign-left variable">a2</span><span class="token operator">=</span>1c <span class="token assign-left variable">a3</span><span class="token operator">=</span><span class="token number">3</span> <span class="token assign-left variable">items</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ppid</span><span class="token operator">=</span><span class="token number">11440</span> <span class="token assign-left variable">pid</span><span class="token operator">=</span><span class="token number">11443</span> <span class="token assign-left variable">auid</span><span class="token operator">=</span><span class="token number">4294967295</span> <span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">euid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">suid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">fsuid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">egid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">sgid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">fsgid</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">tty</span><span class="token operator">=</span><span class="token punctuation">(</span>none<span class="token punctuation">)</span> <span class="token assign-left variable">ses</span><span class="token operator">=</span><span class="token number">4294967295</span> <span class="token assign-left variable">comm</span><span class="token operator">=</span>vsftpd <span class="token assign-left variable">exe</span><span class="token operator">=</span>/usr/sbin/vsftpd <span class="token assign-left variable">subj</span><span class="token operator">=</span>system_u:system_r:ftpd_t:s0-s0:c0.c1023 <span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token punctuation">(</span>null<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Hash: vsftpd,ftpd_t,hi_reserved_port_t,tcp_socket,name_bind</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 根据建议解决执行指令, 92% 哪个指令下面 PORT_TYPE 下面又可选的 ftp_port_t</span></span>
<span class="line"><span class="token comment"># 但是笔者还是懵逼的，不知道为什么那么多里面就选这个了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># semanage port -a -t ftp_port_t -p tcp 555</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart vsftpd</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># netstat -tlnp</span></span>
<span class="line">Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span></span>
<span class="line">Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:631           <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1374</span>/cupsd          </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:25            <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6010          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6011          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">192.168</span>.122.1:53        <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1975</span>/dnsmasq        </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:22              <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:631                 :::*                    LISTEN      <span class="token number">1374</span>/cupsd          </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:25                  :::*                    LISTEN      <span class="token number">1578</span>/master         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6010                :::*                    LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6011                :::*                    LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::555                  :::*                    LISTEN      <span class="token number">11573</span>/vsftpd        </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                    LISTEN      <span class="token number">1</span>/systemd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::22                   :::*                    LISTEN      <span class="token number">1378</span>/sshd     </span>
<span class="line"><span class="token comment"># 可以看到 vsftpd 的端口变成了 555 了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 实验看看该 port 是否可用</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># curl ftp://localhost:555</span></span>
<span class="line">drwxr-xr-x    <span class="token number">2</span> <span class="token number">0</span>        <span class="token number">0</span>              <span class="token number">42</span> Mar <span class="token number">17</span> 09:03 pub</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


