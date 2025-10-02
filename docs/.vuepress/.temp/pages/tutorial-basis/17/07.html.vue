<template><div><h1 id="本章习题" tabindex="-1"><a class="header-anchor" href="#本章习题"><span>本章习题</span></a></h1>
<h1 id="情景模拟题" tabindex="-1"><a class="header-anchor" href="#情景模拟题"><span>情景模拟题</span></a></h1>
<p>通过设置、启动、观察等机制，完整了解一个服务的启动与观察</p>
<ul>
<li>目标：了解 daemon 的管控机制，以 sshd daemon 为例</li>
<li>前提：需要对本章已经了解，尤其是 systemd 的管理部分</li>
<li>需求：已经有 sshd 这个服务，但是没有修改过端口</li>
</ul>
<p>启动两个 sshd 服务，另一个一个使用端口 222</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 查看 sshd 服务是否存在</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># systemctl status sshd.service </span></span>
<span class="line">* sshd.service - OpenSSH server daemon</span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/sshd.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span></span>
<span class="line">   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Tue <span class="token number">2020</span>-03-17 <span class="token number">10</span>:49:56 CST<span class="token punctuation">;</span> <span class="token number">3</span> days ago</span>
<span class="line">     Docs: man:sshd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span></span>
<span class="line">           man:sshd_config<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line"> Main PID: <span class="token number">1378</span> <span class="token punctuation">(</span>sshd<span class="token punctuation">)</span></span>
<span class="line">    Tasks: <span class="token number">1</span></span>
<span class="line">   CGroup: /system.slice/sshd.service</span>
<span class="line">           `-1378 /usr/sbin/sshd <span class="token parameter variable">-D</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:55 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting OpenSSH server daemon<span class="token punctuation">..</span>.</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:56 study.centos.mrcode sshd<span class="token punctuation">[</span><span class="token number">1378</span><span class="token punctuation">]</span>: Server listening on <span class="token number">0.0</span>.0.0 port <span class="token number">22</span>.</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:56 study.centos.mrcode sshd<span class="token punctuation">[</span><span class="token number">1378</span><span class="token punctuation">]</span>: Server listening on :: port <span class="token number">22</span>.</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:49:56 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started OpenSSH server daemon.</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">10</span>:51:42 study.centos.mrcode sshd<span class="token punctuation">[</span><span class="token number">2344</span><span class="token punctuation">]</span>: Accepted password <span class="token keyword">for</span> mrcode from <span class="token number">192.168</span>.4.170 port <span class="token number">60750</span> ssh2</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">17</span>:35:40 study.centos.mrcode sshd<span class="token punctuation">[</span><span class="token number">7250</span><span class="token punctuation">]</span>: Accepted password <span class="token keyword">for</span> ftptest from <span class="token number">192.168</span>.4.170 port <span class="token number">59071</span> ssh2</span>
<span class="line">Mar <span class="token number">17</span> <span class="token number">22</span>:22:50 study.centos.mrcode sshd<span class="token punctuation">[</span><span class="token number">10579</span><span class="token punctuation">]</span>: Accepted password <span class="token keyword">for</span> root from <span class="token number">192.168</span>.4.170 port <span class="token number">59851</span> ssh2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看他的启动脚本文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /usr/lib/systemd/system/sshd.service</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>OpenSSH server daemon</span>
<span class="line"><span class="token assign-left variable">Documentation</span><span class="token operator">=</span>man:sshd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> man:sshd_config<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>network.target sshd-keygen.service</span>
<span class="line"><span class="token assign-left variable">Wants</span><span class="token operator">=</span>sshd-keygen.service</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>notify</span>
<span class="line"><span class="token assign-left variable">EnvironmentFile</span><span class="token operator">=</span>/etc/sysconfig/sshd</span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/sshd <span class="token parameter variable">-D</span> <span class="token variable">$OPTIONS</span></span>
<span class="line"><span class="token assign-left variable">ExecReload</span><span class="token operator">=</span>/bin/kill <span class="token parameter variable">-HUP</span> <span class="token variable">$MAINPID</span></span>
<span class="line"><span class="token assign-left variable">KillMode</span><span class="token operator">=</span>process</span>
<span class="line"><span class="token assign-left variable">Restart</span><span class="token operator">=</span>on-failure</span>
<span class="line"><span class="token assign-left variable">RestartSec</span><span class="token operator">=</span>42s</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 通过 man ssshd 中的 FILES 信息中，找到了他的配置文件地址</span></span>
<span class="line">/etc/ssh/sshd_config</span>
<span class="line">             Contains configuration data <span class="token keyword">for</span> sshd.  The <span class="token function">file</span> <span class="token function">format</span> and configuration options are described <span class="token keyword">in</span> sshd_config<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 复制该配置文件，并修改端口号为 222</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cd /etc/ssh/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ssh<span class="token punctuation">]</span><span class="token comment"># cp sshd_config sshd2_config</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ssh<span class="token punctuation">]</span><span class="token comment"># vim sshd2_config</span></span>
<span class="line">Port <span class="token number">222</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 修改启动脚本等文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ssh<span class="token punctuation">]</span><span class="token comment"># cd /etc/systemd/system/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># cp /usr/lib/systemd/system/sshd.service sshd2.service</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># vim sshd2.service</span></span>
<span class="line"><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Description</span><span class="token operator">=</span>OpenSSH server daemon <span class="token number">2</span></span>
<span class="line"><span class="token assign-left variable">Documentation</span><span class="token operator">=</span>man:sshd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> man:sshd_config<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token assign-left variable">After</span><span class="token operator">=</span>network.target sshd-keygen.service</span>
<span class="line"><span class="token assign-left variable">Wants</span><span class="token operator">=</span>sshd-keygen.service</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Service<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">Type</span><span class="token operator">=</span>notify</span>
<span class="line"><span class="token assign-left variable">EnvironmentFile</span><span class="token operator">=</span>/etc/sysconfig/sshd</span>
<span class="line"><span class="token comment"># 主要是这里</span></span>
<span class="line"><span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/sshd <span class="token parameter variable">-f</span> /etc/ssh/sshd2_config <span class="token parameter variable">-D</span> <span class="token variable">$OPTIONS</span></span>
<span class="line"><span class="token assign-left variable">ExecReload</span><span class="token operator">=</span>/bin/kill <span class="token parameter variable">-HUP</span> <span class="token variable">$MAINPID</span></span>
<span class="line"><span class="token assign-left variable">KillMode</span><span class="token operator">=</span>process</span>
<span class="line"><span class="token assign-left variable">Restart</span><span class="token operator">=</span>on-failure</span>
<span class="line"><span class="token assign-left variable">RestartSec</span><span class="token operator">=</span>42s</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>Install<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target</span>
<span class="line"><span class="token comment"># 上述增加了 -f 参数指定了刚刚我们复制出来的配置文件</span></span>
<span class="line"><span class="token comment"># 该语法是从这个脚本中的 Documentation=man:sshd(8)，然后使用 man 8 sshd 资料中 SYNOPSIS 中的  [-f config_file] 得知，可以指定一个配置文件</span></span>
<span class="line"><span class="token comment"># 所以，其实这一步应该在最开始的时候去查阅，然后才是来达成这个配置文件的操作</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 重新加载配置与这个服务的启动等观察</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl daemon-reload </span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl enable sshd2.service </span></span>
<span class="line">Created symlink from /etc/systemd/system/multi-user.target.wants/sshd2.service to /etc/systemd/system/sshd2.service.</span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl start sshd2.service  </span></span>
<span class="line">Job <span class="token keyword">for</span> sshd2.service failed because the control process exited with error code. See <span class="token string">"systemctl status sshd2.service"</span> and <span class="token string">"journalctl -xe"</span> <span class="token keyword">for</span> details.</span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># systemctl status sshd2.service </span></span>
<span class="line">* sshd2.service - OpenSSH server daemon <span class="token number">2</span></span>
<span class="line">   Loaded: loaded <span class="token punctuation">(</span>/etc/systemd/system/sshd2.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span></span>
<span class="line">   Active: activating <span class="token punctuation">(</span>auto-restart<span class="token punctuation">)</span> <span class="token punctuation">(</span>Result: exit-code<span class="token punctuation">)</span> since Fri <span class="token number">2020</span>-03-20 <span class="token number">14</span>:04:25 CST<span class="token punctuation">;</span> 12s ago</span>
<span class="line">     Docs: man:sshd<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span></span>
<span class="line">           man:sshd_config<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line">  Process: <span class="token number">21511</span> <span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/sbin/sshd <span class="token parameter variable">-f</span> /etc/ssh/sshd2_config <span class="token parameter variable">-D</span> <span class="token variable">$OPTIONS</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">255</span><span class="token punctuation">)</span></span>
<span class="line"> Main PID: <span class="token number">21511</span> <span class="token punctuation">(</span>code<span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">255</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Mar <span class="token number">20</span> <span class="token number">14</span>:04:25 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: sshd2.service: main process exited, <span class="token assign-left variable">code</span><span class="token operator">=</span>exited, <span class="token assign-left variable">status</span><span class="token operator">=</span><span class="token number">255</span>/n/a</span>
<span class="line">Mar <span class="token number">20</span> <span class="token number">14</span>:04:25 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Failed to start OpenSSH server daemon <span class="token number">2</span>.</span>
<span class="line">Mar <span class="token number">20</span> <span class="token number">14</span>:04:25 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Unit sshd2.service entered failed state.</span>
<span class="line">Mar <span class="token number">20</span> <span class="token number">14</span>:04:25 study.centos.mrcode systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: sshd2.service failed.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 发现没有启动起来，启动失败了，去观察他的日志记录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># tail -n 20 /var/log/messages</span></span>
<span class="line">Mar <span class="token number">20</span> <span class="token number">14</span>:05:08 study python: SELinux is preventing /usr/sbin/sshd from name_bind access on the tcp_socket port <span class="token number">222</span>.<span class="token comment">#012#012*****  Plugin bind_ports (99.5 confidence) suggests   ************************#012#012If you want to allow /usr/sbin/sshd to bind to network port 222#012Then you need to modify the port type.#012Do#012# semanage port -a -t PORT_TYPE -p tcp 222#012    where PORT_TYPE is one of the following: ssh_port_t, vnc_port_t, xserver_port_t.#012#012*****  Plugin catchall (1.49 confidence) suggests   **************************#012#012If you believe that sshd should be allowed name_bind access on the port 222 tcp_socket by default.#012Then you should report this as a bug.#012You can generate a local policy module to allow this access.#012Do#012allow this access for now by executing:#012# ausearch -c 'sshd' --raw | audit2allow -M my-sshd#012# semodule -i my-sshd.pp#012</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 会发现触发了 SELInux ，没有通过检查， 99.5 的那个配置方案的解决告知我们需要执行</span></span>
<span class="line">semanage port <span class="token parameter variable">-a</span> <span class="token parameter variable">-t</span> ssh_port_t <span class="token parameter variable">-p</span> tcp <span class="token number">222</span></span>
<span class="line"><span class="token punctuation">[</span>root@study system<span class="token punctuation">]</span><span class="token comment"># netstat -tlnp | grep ssh</span></span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6010          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:6011          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:222             <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">21918</span>/sshd          </span>
<span class="line">tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:22              <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1378</span>/sshd           </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6010                :::*                    LISTEN      <span class="token number">2350</span>/sshd: mrcode@p </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> ::1:6011                :::*                    LISTEN      <span class="token number">10579</span>/sshd: root@pt </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::222                  :::*                    LISTEN      <span class="token number">21918</span>/sshd          </span>
<span class="line">tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::22                   :::*                    LISTEN      <span class="token number">1378</span>/sshd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 就会发现已经启动成功了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="简单部分" tabindex="-1"><a class="header-anchor" href="#简单部分"><span>简单部分</span></a></h2>
<ul>
<li>
<p>使用 <code v-pre>netstat -tul</code> 与 <code v-pre>netstat -tunl</code> 有什么差别</p>
<p>使用 n 时，netstat 不会使用主机名与服务名表示，而是以 IP 和 端口来显示。IP 的分析与 <code v-pre>/etc/hosts</code> 和 <code v-pre>/etc/resolv.conf</code> 有关，port 则与 <code v-pre>/etc/services</code> 有关</p>
</li>
<li>
<p>找到 port 3306 的端口号的服务是什么</p>
<p>可以通过搜索 <code v-pre>/etc/services</code> 搜索到 3306 对应与 mysql 服务。</p>
<p>并且通过 <code v-pre>netstat -tlnp | grep 3306</code> 的方式也能得到他的服务名称（如果运行中的话）</p>
</li>
<li>
<p>可以通过哪些指令查询到目前系统默认开机启动的服务</p>
<p><code v-pre>systemctl list-units</code> 和 <code v-pre>systemctl list-unit-files</code></p>
</li>
<li>
<p>获取哪些服务在启动状态?</p>
<p>通过上面查询出来的服务，应该使用 <code v-pre>systemctl status [unit.service]</code> 一项一项查询</p>
</li>
</ul>
</div></template>


