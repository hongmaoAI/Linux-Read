<template><div><h1 id="systemctl-针对-service-类型的配置" tabindex="-1"><a class="header-anchor" href="#systemctl-针对-service-类型的配置"><span>systemctl 针对 service 类型的配置</span></a></h1>
<p>以前需要建立系统服务，需要在 <code v-pre>/etc/init.d/</code> 创建对应的 bash shell script 来处理，如今在 systemd 环境下，该怎么设置相关的服务启动环境？</p>
<h2 id="配置文件相关目录简介" tabindex="-1"><a class="header-anchor" href="#配置文件相关目录简介"><span>配置文件相关目录简介</span></a></h2>
<p>systemd 的配置文件大部分在 <code v-pre>/usr/lib/systemd/system/</code> 目录内，Red Hat 官方文件指出，该目录的文件主要是原本软件所提供的设置，建议不要修改。修改的位置在 <code v-pre>/etc/systemd/system/</code> 目录内</p>
<p>比如：想要额外修改  vsftpd.service ，建议放到的位置如下：</p>
<ul>
<li>
<p><code v-pre>/usr/lib/systemd/vsftpd.service</code> ：官方的预设配置文件</p>
</li>
<li>
<p><code v-pre>/etc/systemd/system/vsftp.service.d/custom.conf</code>：</p>
<p>建立同名并已 <code v-pre>.d</code> 后缀结尾的目录，该目录下的文件会「累加其他设置」进入 <code v-pre>/usr/lib/systemd/vsftpd.service</code></p>
<p>意思应该是：这里是配置会覆盖掉 <code v-pre>/usr/lib/systemd/vsftpd.service</code> 中的同名配置</p>
</li>
<li>
<p><code v-pre>/etc/systemd/system/vsftpd.service.wants/*</code></p>
<p>此目录内的文件为链接文件，设置相依服务的链接。作用是启动了 vsftpd.service 后，最好再加上该目录下的建议服务</p>
</li>
<li>
<p><code v-pre>/etc/systemd/system/vsftpd.service.requires/*</code></p>
<p>此目录内的文件为链接文件，设置相依服务的链接。作用是，在启动 vsftpd.service 之前，需要事先启动哪些服务</p>
</li>
</ul>
<p>基本上在配置文件中，你可以自由设置相依服务的检查，并且设置加入到哪些 target 里。就是建议不要修改原始的配置文件，在上述建议目录下去操作修改</p>
<h2 id="配置文件的设置项目简介" tabindex="-1"><a class="header-anchor" href="#配置文件的设置项目简介"><span>配置文件的设置项目简介</span></a></h2>
<p>这次通过 sshd.service 的配置文件来讲解配置文件的内容</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /usr/lib/systemd/system/sshd.service</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>OpenSSH server daemon</span>
<span class="line"><span class="token assign-left variable">Documentation</span><span class="token operator">=</span>man:sshd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> man:sshd_config<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>network.target sshd-keygen.service</span>
<span class="line"><span class="token assign-left variable">Wants</span><span class="token operator">=</span>sshd-keygen.service</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span>		<span class="token comment"># 该项目于实际执行的指令参数有关</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>notify</span>
<span class="line"><span class="token assign-left variable">EnvironmentFile</span><span class="token operator">=</span>/etc/sysconfig/sshd</span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/sshd <span class="token parameter variable">-D</span> <span class="token variable">$OPTIONS</span></span>
<span class="line"><span class="token assign-left variable">ExecReload</span><span class="token operator">=</span>/bin/kill <span class="token parameter variable">-HUP</span> <span class="token variable">$MAINPID</span></span>
<span class="line"><span class="token assign-left variable">KillMode</span><span class="token operator">=</span>process</span>
<span class="line"><span class="token assign-left variable">Restart</span><span class="token operator">=</span>on-failure</span>
<span class="line"><span class="token assign-left variable">RestartSec</span><span class="token operator">=</span>42s</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span>		<span class="token comment"># 此 unit 要挂载到哪个 target 下</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析上述文件，大概分为三个部分：</p>
<ul>
<li>
<p><code v-pre>[Unit]</code></p>
<p>unit 本身的说明，以及其他相依 daemon 的设置，包括在什么服务之后才启动此 unit 之类的设置</p>
</li>
<li>
<p><code v-pre>[Service]、[Socket][Timer][Mount][Path]...</code></p>
<p>不同的 unit type 需要使用对应的设置项目。对于 service 来说，主要在规范服务启动脚本、环境配置文件名、重新启动的方式等</p>
</li>
<li>
<p><code v-pre>[Install]</code>：将此 unit 安装到哪个 target 里面</p>
</li>
</ul>
<p>配置文件内有些设置规则如下：</p>
<ul>
<li>
<p>设置项目通常是可以重复的</p>
<p>例如可以设置两个 After 在配置文件中，不过，后面的设置会取代前面的，可以使用 <code v-pre>After=</code>  的方式，将该项清空归零</p>
</li>
<li>
<p>如果设置参数需要有「是/否 boolean 类型值」的项目，可以使用 1、yes、true、on 代表启动，0、no、false、off 代表关闭</p>
</li>
<li>
<p>空白行、开头为 <code v-pre>#</code> 或 <code v-pre>;</code> 都表示批注信息</p>
</li>
</ul>
<p>每个部分的说明如下：</p>
<h3 id="unit-部分" tabindex="-1"><a class="header-anchor" href="#unit-部分"><span><code v-pre>[unit]</code> 部分</span></a></h3>
<ul>
<li>
<p>Description</p>
<p>使用 systemctl list-units 时，展示出来的简易说明。systemctl status 中输出的服务说明也是该值</p>
</li>
<li>
<p>Documentation</p>
<p>提供管理员能够进一步的文件查询功能，提供的文件可以是如下的资料</p>
<ul>
<li><code v-pre>=http://www..</code></li>
<li><code v-pre>=man:sshd(8)</code></li>
<li><code v-pre>=file:/etc/ssh/sshd_config</code></li>
</ul>
</li>
<li>
<p>After：说明此 unit 是在哪个 daemon 启动之后才能启动。</p>
<p>基本上仅是说明启动顺序，并无强制要求里面的服务一定要启动后此 unit 才能启动。它与 Requires 的设置含义是有差异的。</p>
</li>
<li>
<p>Before：在什么服务启动前，启动本服务</p>
<p>同样，并非强制性的</p>
</li>
<li>
<p>Rrquires：相依性配置</p>
<p>明确定义此 unit 需要在哪个 daemon 启动后才能启动。如果依赖的服务没有启动，则该服务不会被启动</p>
</li>
<li>
<p>Wants：</p>
<p>此 unit 启动之后，还需要启动哪些服务。不是强制性的，只是希望建立让使用者比较好的操作环境</p>
</li>
<li>
<p>Conflicts：冲突服务</p>
<p>如果这里申明的服务已经启动，那么本 unit 就不能启动。如果我们的 unit 有启动，那么这里定义的服务不能启动。</p>
</li>
</ul>
<h3 id="service-部分" tabindex="-1"><a class="header-anchor" href="#service-部分"><span><code v-pre>[service]</code> 部分</span></a></h3>
<ul>
<li>
<p>Type：启动方式，会影响到 ExecStart。一般有如下几种</p>
<ul>
<li>
<p>simple：默认值，主要由 ExecStart 定义的指令串来启动，启动后常驻于内存中</p>
</li>
<li>
<p>forking：</p>
<p>由 ExecStart 启动的程序通过 spawns 延伸出其他子程序来作为此 daemon 的主要服务。原生的父程序在启动结束后就会终止运行。传统的 unit 服务大多属于这种项目。</p>
<p>例如：httpd 这个 www 服务，当 httpd 的程序因为运行过久因此即将终结了，则 systemd 会再重新生出另一个子程序持续运行后，再将父程序删除。据说这样的效率比较好</p>
</li>
<li>
<p>oneshot：与 simple 类似，不过该程序工作完毕后就结束了，不会常驻内存中</p>
</li>
<li>
<p>dbus：与 simple 类似，但是这个 daemon 必须要在取得一个 D-Bus 的名称后，才会继续运行，因此设置该项目时，通常也要设置 BusName 才行</p>
</li>
<li>
<p>idle：与 simple 类似，要执行这个 daemon 必须要所有的工作都顺利执行完成后，才会执行，这里的 daemon 通常是开机到最后才执行的服务</p>
</li>
</ul>
<p>比较重要的 simple、forking 与 oneshot，很多服务需要子程序 forking，还有很多服务只需要在开机的时候执行一次 oneshot</p>
</li>
<li>
<p>EnvironmentFile：指定启动脚本的环境配置文件</p>
<p>例如：sshd.service 的配置文件写入到 <code v-pre>/etc/sysconfig/sshd</code> 中，也可以直接在该项后面用多个不同的 Shell 变量来设置</p>
</li>
<li>
<p>ExecStart：实际执行此 daemon 的指令或脚本程序</p>
<p>也可以使用 ExecStartPre（之前） 以及 ExecStartPost（之后）在实际启动服务前后进行额外的指令行为。但是仅支持「指令 参数 参数...」格式，不能接受 <code v-pre>&lt; &gt;  &gt;&gt; | &amp; </code> 等特殊字符，很多 bash 语法也不支持，如果需要这些特殊字符的时候，最好直接写到指令脚本里面。还有一种方式可以支持完整的语法；将 Type=oneshot 就可以了</p>
</li>
<li>
<p>ExecStop：与 systemctl stop 的执行有关，关闭此服务时所执行的指令</p>
</li>
<li>
<p>ExecReload：与 systemctl reload 有关的指令行为</p>
</li>
<li>
<p>Restart：</p>
<p>当设置 Restart=1 时，当此 daemon 服务终止后，会再次启动该服务</p>
<p>除非使用 systemctl 强制将此服务关闭，否则该功能会一直生效</p>
</li>
<li>
<p>RemainAfterExit</p>
<p>当值设置为 1 时， 当该 daemon 所属的所有程序都终止后，此服务会再尝试启动。这对于 Type=oneshot 的服务有帮助</p>
</li>
<li>
<p>TimeoutSec：若这个服务在启动或是关闭时，因为某些缘故导致无法顺利「正常启动或正常结束」的情况下，则需要等待多久才进入「强制结束」的状态</p>
</li>
<li>
<p>KillMode</p>
<p>可以是 process、control-group、none 其中的一种：</p>
<ul>
<li>process：终止时，只会终止主要的程序（ExecStart 后面指令串启动的）</li>
<li>control-group：则由此 daemon 所产生的其他 control-group 的程序，也会被关闭</li>
<li>one：没有程序会被关闭</li>
</ul>
</li>
<li>
<p>RestartSec：</p>
<p>与 Restart 有相关性，如果该服务被关闭，需要重新启动时，大概要 sleep 多少时间再重新启动。预设是 100ms</p>
</li>
</ul>
<h3 id="install-部分" tabindex="-1"><a class="header-anchor" href="#install-部分"><span><code v-pre>[Install]</code> 部分</span></a></h3>
<ul>
<li>
<p>WantedBy：该 unit 本身是附挂在哪一个 target unit 下</p>
<p>该项设置大部分都是 <code v-pre>*.target unit</code> 。大多数服务性质的 unit 都是附挂在 multi-user.target 下</p>
</li>
<li>
<p>Also：相依性 enable</p>
<p>当前 unit 本身被 enable 时，Also 声明的 unit 也 enable</p>
</li>
<li>
<p>Alias：别名</p>
<p>当 systemctl enable 相关的服务时，此服务会进行连接文件的建立，以 <code v-pre>multi-user.target</code> 为例，它是用来预设操作环境 default.target 的规划，因此当设置用 default.target 时， <code v-pre>/etc/systed/system/default.target</code> 就会连结到 <code v-pre>/usr/lib/systemd/system/multi-user.target</code></p>
</li>
</ul>
<p>配置讲解之后，下面用这些知识点来练习</p>
<h2 id="两个-vsftpd-运行的实例" tabindex="-1"><a class="header-anchor" href="#两个-vsftpd-运行的实例"><span>两个 vsftpd 运行的实例</span></a></h2>
<p>在上一章将 vsftpd 的 port 修改成了 555。这里再运行一个端口为 21 的 vsftpd 程序，需要两个配置文件以及两个启动脚本来设置了：</p>
<ul>
<li>port 21:
<ul>
<li><code v-pre>/etc/vsftpd/vsftpd.conf</code> 配置文件</li>
<li><code v-pre>/usr/lib/systemd/system/vsftpd.service</code> 启动脚本</li>
</ul>
</li>
<li>port 555:
<ul>
<li><code v-pre>/etc/vsftpd/vsftpd2.conf</code> 配置文件</li>
<li><code v-pre>/usr/lib/systemd/system/vsftpd2.service</code> 启动脚本</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 建立好需要的配置文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cd /etc/vsftpd/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># ll</span></span>
<span class="line">total <span class="token number">20</span></span>
<span class="line">-rw-------. <span class="token number">1</span> root root  <span class="token number">125</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> ftpusers</span>
<span class="line">-rw-------. <span class="token number">1</span> root root  <span class="token number">361</span> Mar <span class="token number">17</span> <span class="token number">21</span>:59 user_list</span>
<span class="line">-rw-------. <span class="token number">1</span> root root <span class="token number">5199</span> Mar <span class="token number">17</span> <span class="token number">23</span>:02 vsftpd.conf</span>
<span class="line">-rwxr--r--. <span class="token number">1</span> root root  <span class="token number">338</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> vsftpd_conf_migrate.sh</span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># cp vsftpd.conf vsftpd2.conf</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># vim vsftpd.conf</span></span>
<span class="line"><span class="token comment"># listen_port=555</span></span>
<span class="line"><span class="token comment"># 把端口注释掉，他默认的端口是 21.</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># diff vsftpd.conf vsftpd2.conf</span></span>
<span class="line">131c131</span>
<span class="line"><span class="token operator">&lt;</span> <span class="token comment"># listen_port=555</span></span>
<span class="line">---</span>
<span class="line"><span class="token operator">></span> <span class="token assign-left variable">listen_port</span><span class="token operator">=</span><span class="token number">555</span></span>
<span class="line"><span class="token comment"># 通过对比，两个文件只有端口号不同</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 开始处理启动脚本设置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># cd /etc/systemd/system/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># ll | grep vsftp</span></span>
<span class="line"><span class="token comment"># 由于我们没有额外修改过启动脚本，所以该目录下是没有 vsftp 相关的脚本的</span></span>
<span class="line"><span class="token comment"># 从原始的启动脚本目录复制一份过来</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># cp /usr/lib/systemd/system/vsftpd.service vsftpd2.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># vim vsftpd2.service</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>Vsftpd2 <span class="token function">ftp</span> daemon</span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>network.target</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>forking</span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/vsftpd /etc/vsftpd/vsftpd2.conf</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"><span class="token comment"># 重点只是修改 ExecStart 后面的配置文件</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 重新加载 systemd 的脚本配置文件内容</span></span>
<span class="line"><span class="token comment"># systemctl daemon-reload</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl list-unit-files --all | grep vsftpd</span></span>
<span class="line">vsftpd.service                                enabled</span>
<span class="line">vsftpd2.service                               disabled		<span class="token comment"># 已经能找到了</span></span>
<span class="line">vsftpd@.service                               disabled</span>
<span class="line">vsftpd.target                                 disabled</span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl status vsftpd2.service</span></span>
<span class="line">* vsftpd2.service - Vsftpd2 <span class="token function">ftp</span> daemon</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/etc/systemd/system/vsftpd2.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 由于之前直接修改的 vsftp 的配置文件，所以 vsftp 也需要重新启动</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl restart vsftpd.service vsftpd2.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl enable vsftpd.service vsftpd2.service</span></span>
<span class="line">Created symlink from /etc/systemd/system/multi-user.target.wants/vsftpd2.service to /etc/systemd/system/vsftpd2.service.</span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl status vsftpd.service vsftpd2.service</span></span>
<span class="line">* vsftpd.service - Vsftpd <span class="token function">ftp</span> daemon</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/vsftpd.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Thu <span class="token number">2020</span>-03-19 <span class="token number">16</span>:50:22 CST<span class="token punctuation">;</span> 27s ago</span>
<span class="line"> Main PID: <span class="token number">5986</span> <span class="token punctuation">(</span>vsftpd<span class="token punctuation">)</span></span>
<span class="line">   CGroup: /system.slice/vsftpd.service</span>
<span class="line">           <span class="token variable"><span class="token variable">`</span><span class="token parameter variable">-5986</span> /usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf</span>
<span class="line"></span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">16</span>:50:22 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped Vsftpd <span class="token function">ftp</span> daemon.</span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">16</span>:50:22 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting Vsftpd <span class="token function">ftp</span> daemon<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">16</span>:50:22 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started Vsftpd <span class="token function">ftp</span> daemon.</span>
<span class="line"></span>
<span class="line">* vsftpd2.service - Vsftpd2 <span class="token function">ftp</span> daemon</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/etc/systemd/system/vsftpd2.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Thu <span class="token number">2020</span>-03-19 <span class="token number">16</span>:50:22 CST<span class="token punctuation">;</span> 27s ago</span>
<span class="line"> Main PID: <span class="token number">5987</span> <span class="token punctuation">(</span>vsftpd<span class="token punctuation">)</span></span>
<span class="line">   CGroup: /system.slice/vsftpd2.service</span>
<span class="line">           <span class="token variable">`</span></span>-5987 /usr/sbin/vsftpd /etc/vsftpd/vsftpd2.conf</span>
<span class="line"></span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">16</span>:50:22 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped Vsftpd2 <span class="token function">ftp</span> daemon.</span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">16</span>:50:22 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting Vsftpd2 <span class="token function">ftp</span> daemon<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">16</span>:50:22 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started Vsftpd2 <span class="token function">ftp</span> daemon.</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># netstat -tlnp | grep vsftp</span></span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::555                  :::*                    LISTEN      <span class="token number">5987</span>/vsftpd         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::21                   :::*                    LISTEN      <span class="token number">5986</span>/vsftpd</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样一个启动脚本的完成了</p>
<h2 id="多重的重复设置方式-以-getty-为例" tabindex="-1"><a class="header-anchor" href="#多重的重复设置方式-以-getty-为例"><span>多重的重复设置方式：以 getty 为例</span></a></h2>
<p>CentOS 7 开机后，有 6 个终端机可以使用（tty1 ~ tty6），是由 agetty 指令搞定的。终端机的功能涉及很多层面，主要管理的是 getty.target 这个 target unit，实际产生 tty1~tty6 的则是由 getty@.service 所提供的。</p>
<p>通过这个 getty@.service  的启动脚本来获取 @ 是啥含义</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># cat /usr/lib/systemd/system/getty@.service</span></span>
<span class="line"><span class="token comment">#  This file is part of systemd.</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment">#  systemd is free software; you can redistribute it and/or modify it</span></span>
<span class="line"><span class="token comment">#  under the terms of the GNU Lesser General Public License as published by</span></span>
<span class="line"><span class="token comment">#  the Free Software Foundation; either version 2.1 of the License, or</span></span>
<span class="line"><span class="token comment">#  (at your option) any later version.</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>Getty on %I</span>
<span class="line"><span class="token assign-left variable">Documentation</span><span class="token operator">=</span>man:agetty<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> man:systemd-getty-generator<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token assign-left variable">Documentation</span><span class="token operator">=</span>http://0pointer.de/blog/projects/serial-console.html</span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>systemd-user-sessions.service plymouth-quit-wait.service getty-pre.target</span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>rc-local.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># If additional gettys are spawned during boot then we should make</span></span>
<span class="line"><span class="token comment"># sure that this is synchronized before getty.target, even though</span></span>
<span class="line"><span class="token comment"># getty.target didn't actually pull it in.</span></span>
<span class="line"><span class="token assign-left variable">Before</span><span class="token operator">=</span>getty.target</span>
<span class="line"><span class="token assign-left variable">IgnoreOnIsolate</span><span class="token operator">=</span>yes</span>
<span class="line"></span>
<span class="line"><span class="token comment"># On systems without virtual consoles, don't start any getty. Note</span></span>
<span class="line"><span class="token comment"># that serial gettys are covered by serial-getty@.service, not this</span></span>
<span class="line"><span class="token comment"># unit.</span></span>
<span class="line"><span class="token assign-left variable">ConditionPathExists</span><span class="token operator">=</span>/dev/tty0</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># the VT is cleared by TTYVTDisallocate</span></span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>-/sbin/agetty <span class="token parameter variable">--noclear</span> %I <span class="token environment constant">$TERM</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>idle</span>
<span class="line"><span class="token assign-left variable">Restart</span><span class="token operator">=</span>always</span>
<span class="line"><span class="token assign-left variable">RestartSec</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token assign-left variable">UtmpIdentifier</span><span class="token operator">=</span>%I</span>
<span class="line"><span class="token assign-left variable">TTYPath</span><span class="token operator">=</span>/dev/%I</span>
<span class="line"><span class="token assign-left variable">TTYReset</span><span class="token operator">=</span>yes</span>
<span class="line"><span class="token assign-left variable">TTYVHangup</span><span class="token operator">=</span>yes</span>
<span class="line"><span class="token assign-left variable">TTYVTDisallocate</span><span class="token operator">=</span>yes</span>
<span class="line"><span class="token assign-left variable">KillMode</span><span class="token operator">=</span>process</span>
<span class="line"><span class="token assign-left variable">IgnoreSIGPIPE</span><span class="token operator">=</span>no</span>
<span class="line"><span class="token assign-left variable">SendSIGHUP</span><span class="token operator">=</span>yes</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Unset locale for the console getty since the console has problems</span></span>
<span class="line"><span class="token comment"># displaying some internationalized messages.</span></span>
<span class="line"><span class="token assign-left variable">Environment</span><span class="token operator">=</span><span class="token environment constant">LANG</span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LANGUAGE</span></span><span class="token operator">=</span> <span class="token assign-left variable">LC_CTYPE</span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_NUMERIC</span></span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_TIME</span></span><span class="token operator">=</span> <span class="token assign-left variable">LC_COLLATE</span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_MONETARY</span></span><span class="token operator">=</span> <span class="token assign-left variable">LC_MESSAGES</span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_PAPER</span></span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_NAME</span></span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_ADDRESS</span></span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_TELEPHONE</span></span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_MEASUREMENT</span></span><span class="token operator">=</span> <span class="token assign-left variable"><span class="token environment constant">LC_IDENTIFICATION</span></span><span class="token operator">=</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>getty.target</span>
<span class="line"><span class="token assign-left variable">DefaultInstance</span><span class="token operator">=</span>tty1</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重要项： ExecStart，通过  man agetty 时发现它的语法应该是 <code v-pre>agetty --noclear tty1</code> （笔者没有看懂里面哪里写的有这个，内容有点多），那么启动 6 个的话，就需要有 6 个 启动配置来分别配置启动指令 tty1~tty6，是在很繁琐，这就出现了 <code v-pre>getty@.service</code> 中的  @ 。先来看看他的上游 <code v-pre>Before=getty.target</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl show getty.target</span></span>
<span class="line"><span class="token assign-left variable">Id</span><span class="token operator">=</span>getty.target</span>
<span class="line"><span class="token assign-left variable">Names</span><span class="token operator">=</span>getty.target</span>
<span class="line"><span class="token assign-left variable">Wants</span><span class="token operator">=</span>getty@tty1.service</span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"><span class="token assign-left variable">Conflicts</span><span class="token operator">=</span>shutdown.target</span>
<span class="line"><span class="token assign-left variable">Before</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>getty@tty1.service</span>
<span class="line"><span class="token comment"># 这里，笔者的环境上与书上不一致了，书上是 getty@tty1.service getty@tty2.service 等 6 个</span></span>
<span class="line"><span class="token comment"># 注意，这里笔者发现了为什么不一样</span></span>
<span class="line"><span class="token comment"># cat /usr/lib/systemd/system/getty.target 里面内容很少，没有上面这些定义</span></span>
<span class="line"><span class="token comment"># 但是用 show 可以显示出来，这个书上目前没有讲解</span></span>
<span class="line"><span class="token comment"># 但是，通过切换到 tty2 tty3 上去的时候，使用  systemctl show getty.target 查看状态时，After 后面就会出现已经切换过之后的 tty。和书上展示是一样的效果</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>书上说，上面的 After 的配置，当 执行完 getty.target 之后，会持续要求 getty@tty1.service  等 6 个服务继续启动。那么 systemd 就会如下做：</p>
<ul>
<li>先查找 <code v-pre>/usr/lib/systemd/system/</code>、<code v-pre>/etc/systemd/system/</code> 有无 <code v-pre>getty@tty1.service</code> 的设置，若有就启动，没有则执行下一步</li>
<li>找到 <code v-pre>getty@.service</code> 的设置，则将 @ 后面的数据代入成 <code v-pre>%I</code> 的变量，进入 gett@.service 执行</li>
</ul>
<p>也就是说 <code v-pre>getty@tty1.service</code> 实际上是不存在的，主要是通过 <code v-pre>getty@.service</code> 来执行，来简化多个执行的启动设置，他的命名方式如下：</p>
<ul>
<li>源文件：执行服务名称@.service</li>
<li>执行文件：执行服务名称@范例名称.service</li>
</ul>
<p><code v-pre>getty@.service</code> 中的启动指令<code v-pre>ExecStart=-/sbin/agetty --noclear %I $TERM</code>，根据 getty.target 的信息输出来看，<code v-pre>getty@tty1.service</code> 的 <code v-pre>%I</code> 的值是 tty1，因此执行脚本会变成 <code v-pre>/sbin/agetty --noclear tty1</code></p>
<h3 id="将-tty-的数量由-6-个降低到-4-个" tabindex="-1"><a class="header-anchor" href="#将-tty-的数量由-6-个降低到-4-个"><span>将 tty 的数量由 6 个降低到 4 个</span></a></h3>
<p>这个配置是在 <code v-pre>/etc/systemd/logind.conf</code> 里面配置的。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 打开注释信息，并修改成 4 个</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># vim /etc/systemd/logind.conf</span></span>
<span class="line"><span class="token punctuation">[</span>Login<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">NAutoVTs</span><span class="token operator">=</span><span class="token number">4</span></span>
<span class="line"><span class="token assign-left variable">ReserveVT</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># 2. 如果你切换到 tty5 和 tty6 的话，请将他们关闭后重启 getty.target</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop getty@tty5.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl stop getty@tty6.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl restart systemd-logind.service</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当你回到桌面环境下，再切换到 tty5 和 tty6 时就切换不过去了。</p>
<p>到这里笔者貌似迷糊了，getty.target 只是一个定义，类似组，里面并没有定义什么，被其他的 unit 附加。有点不太明白和这里启动 1~6 个有什么关系？这里启动的是  systemd-logind.service ，而且切换只能在桌面环境下，也就是说 tty1~tty6 的切换是这个指令的功能，只是实际启动时用 getty@.service 启动的。但是具体怎么关联上的，是在是迷糊，看不懂</p>
<p>那么其实可以通过指令方式直接启动一个 tty。而无需其他的配置文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">systemctl start getty@tty8.service</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如果只单独看这里的演示的话，笔者能明白的就是 getty@.service 是一个功能，可以通过 @ 传递参数给服务</p>
<h3 id="暂时新增-vsftpd-到-2121-端口" tabindex="-1"><a class="header-anchor" href="#暂时新增-vsftpd-到-2121-端口"><span>暂时新增 vsftpd 到 2121 端口</span></a></h3>
<p>vsftpd 也提供了 @ 的服务方式</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /usr/lib/systemd/system | grep vsftpd</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root  <span class="token number">171</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> vsftpd.service</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root   <span class="token number">89</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> vsftpd.target</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root  <span class="token number">184</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> vsftpd@.service		<span class="token comment"># 这里</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /usr/lib/systemd/system/vsftpd@.service</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>Vsftpd <span class="token function">ftp</span> daemon</span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>network.target</span>
<span class="line"><span class="token assign-left variable">PartOf</span><span class="token operator">=</span>vsftpd.target</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>forking</span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/vsftpd /etc/vsftpd/%i.conf</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>vsftpd.target</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里使用了 <code v-pre>%i</code>，也就是说大小写的的变量都可以，这里启动指令拼接了一个配置文件路径 <code v-pre>/etc/vsftpd/%i.conf</code></p>
<p>那么先创建这个配置文件，然后通过 @ 方式启动</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 制作一个 vsftpd3.conf ，并吧端口修改为 2121</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cd /etc/vsftpd/    </span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># ll</span></span>
<span class="line">total <span class="token number">28</span></span>
<span class="line">-rw-------. <span class="token number">1</span> root root  <span class="token number">125</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> ftpusers</span>
<span class="line">-rw-------. <span class="token number">1</span> root root  <span class="token number">361</span> Mar <span class="token number">17</span> <span class="token number">21</span>:59 user_list</span>
<span class="line">-rw-------. <span class="token number">1</span> root root <span class="token number">5201</span> Mar <span class="token number">19</span> <span class="token number">16</span>:35 vsftpd.conf</span>
<span class="line">-rw-------. <span class="token number">1</span> root root <span class="token number">5199</span> Mar <span class="token number">19</span> <span class="token number">16</span>:35 vsftpd2.conf</span>
<span class="line">-rwxr--r--. <span class="token number">1</span> root root  <span class="token number">338</span> Oct <span class="token number">31</span>  <span class="token number">2018</span> vsftpd_conf_migrate.sh</span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># cp vsftpd.conf vsftpd3.conf</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># vim vsftpd3.conf</span></span>
<span class="line"><span class="token assign-left variable">listen_port</span><span class="token operator">=</span><span class="token number">2121</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 暂时启动，不要开机启动</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># systemctl start vsftpd@vsftpd3.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># systemctl status vsftpd@vsftpd3.service</span></span>
<span class="line">* vsftpd@vsftpd3.service - Vsftpd <span class="token function">ftp</span> daemon</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/vsftpd@.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Thu <span class="token number">2020</span>-03-19 <span class="token number">17</span>:48:57 CST<span class="token punctuation">;</span> 5s ago</span>
<span class="line">  Process: <span class="token number">7536</span> <span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/vsftpd /etc/vsftpd/%i.conf <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">0</span>/SUCCESS<span class="token punctuation">)</span></span>
<span class="line"> Main PID: <span class="token number">7538</span> <span class="token punctuation">(</span>vsftpd<span class="token punctuation">)</span></span>
<span class="line">   CGroup: /system.slice/system-vsftpd.slice/vsftpd@vsftpd3.service</span>
<span class="line">           `-7538 /usr/sbin/vsftpd /etc/vsftpd/vsftpd3.conf</span>
<span class="line"></span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">17</span>:48:57 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting Vsftpd <span class="token function">ftp</span> daemon<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">19</span> <span class="token number">17</span>:48:57 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started Vsftpd <span class="token function">ftp</span> daemon.</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study vsftpd<span class="token punctuation">]</span><span class="token comment"># netstat -tlnp | grep vsftpd</span></span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::2121                 :::*                    LISTEN      <span class="token number">7538</span>/vsftpd         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::555                  :::*                    LISTEN      <span class="token number">5987</span>/vsftpd         </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::21                   :::*                    LISTEN      <span class="token number">5986</span>/vsftpd</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到通过这种 @ 的方式，能让我们制作启动脚本的时候更为灵活一点</p>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>有一件事情，这次使用了 2121 端口，却不用修改 SELinux？因为默认启动小于 1024 以下的端口时，需要使用到 root 的权限，大于 2014 的相对来说对系统的影响可能小一些，就忽略了 SELinux 的限制了</p>
<p>笔者看这句话，貌似记不起有关 SELinux 端口限制的知识了？懵逼状态</p>
</div>
<h2 id="自己的服务自己做" tabindex="-1"><a class="header-anchor" href="#自己的服务自己做"><span>自己的服务自己做</span></a></h2>
<p>下面模拟自己做一个服务：制作一个可以备份自己系统的服务，这脚本放在 <code v-pre>/backups</code> 下，内容如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /backups		# 下面脚本，上层目录不存在，都无法保存的</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /backups/backup.sh</span></span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">source</span><span class="token operator">=</span><span class="token string">"/etc /home /root /var/lib /var/spool/{cron,at,mail}"</span></span>
<span class="line"><span class="token assign-left variable">target</span><span class="token operator">=</span><span class="token string">"/backups/backup-system-<span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y-%m-%d<span class="token variable">)</span></span>.tar.gz"</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-d</span> /backups <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">mkdir</span> /backups</span>
<span class="line"></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-zcvf</span> <span class="token variable">${target}</span> <span class="token variable">${source}</span> $<span class="token operator">></span> /backups/backup.log</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chmod a+x /backups/backup.sh</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /backups/backup.sh</span></span>
<span class="line">-rwxr-xr-x. <span class="token number">1</span> root root <span class="token number">222</span> Mar <span class="token number">20</span> 09:24 /backups/backup.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>准备 backup.service 的启动脚本</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/systemd/system/backup.service</span></span>
<span class="line"><span class="token punctuation">[</span>unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>backup my server</span>
<span class="line"><span class="token assign-left variable">Requires</span><span class="token operator">=</span>atd.service</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>simple</span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/bin/bash <span class="token parameter variable">-c</span> <span class="token string">" echo /backups/backup.sh | at now"</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 因为 ExecStart 里面用到了 at 指令，因此 atd.service 是一定需要的服务</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl daemon-reload</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl start backup.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status backup.service</span></span>
<span class="line">* backup.service - backup my server</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/etc/systemd/system/backup.service<span class="token punctuation">;</span> disabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span></span>
<span class="line">   Active: inactive <span class="token punctuation">(</span>dead<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">20</span> 09:30:56 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started backup my server.</span>
<span class="line">Mar <span class="token number">20</span> 09:30:56 study.centos.mrcode bash<span class="token punctuation">[</span><span class="token number">17748</span><span class="token punctuation">]</span>: job <span class="token number">8</span> at Fri Mar <span class="token number">20</span> 09:30:00 <span class="token number">2020</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以看到服务在执行了，状态是 inactive ，这不是一个驻留内存的服务，执行完成就退出了</span></span>
<span class="line"><span class="token comment"># 这里笔者看不懂为啥用 echo /backups/backup.sh | at now； 而不是直接直接给定脚本路径，而且貌似脚本里面的内容执行也有问题</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


