<template><div><h1 id="使用者身份切换" tabindex="-1"><a class="header-anchor" href="#使用者身份切换"><span>使用者身份切换</span></a></h1>
<p>身份变化可能有以下几个原因：</p>
<ul>
<li>
<p>使用一般账户：系统平时操作的好习惯</p>
<p>为了安全，一般都会建议尽量以一般身份使用者来操作 Linux 的日常工作。等到需要设置系统环境时，才切换成 root 来管理系统，相对比较安全，避免误操作一些严重的指令，例如 <code v-pre>rm -rf /</code></p>
</li>
<li>
<p>用较低权限启动系统服务</p>
<p>比如：apache 软件，创建一个 apache 用户来启动它，就算该软件被攻破了，至少不至于损坏整个系统；</p>
</li>
<li>
<p>软件本身的限制</p>
<p>在远古时代的 telnet 程序中，默认是不允许使用 root 身份登录的，若发现是 UID=0 的登录直接拒绝登录；此外 ssh 也可以设置拒绝 root 登录的</p>
</li>
</ul>
<p>由于上述考虑，没有系统设定等的特殊需求下，都是使用的一般账户登录，如果有则可以变换身份，主要有两种方式：</p>
<ul>
<li>
<p><code v-pre>su</code>：以 <code v-pre>su -</code> 指令直接将身份变成 root</p>
<p>该指令需要 root 密码，输入验证成功后才可以切换成 root 身份</p>
</li>
<li>
<p><code v-pre>sudo</code>：以 <code v-pre>sudo 指令</code> 执行指令串</p>
<p>由于 sudo 需要实现设置，且 sudo 需要输入用户自己的密码，因此多人共同管理同一部主机时， sudo 要比 su 好，至少 root 密码不会流传出去</p>
</li>
</ul>
<h2 id="su" tabindex="-1"><a class="header-anchor" href="#su"><span>su</span></a></h2>
<p>最简单的身份切换指令，可以进行任何身份的切换</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">su</span> <span class="token punctuation">[</span>-lm<span class="token punctuation">]</span> <span class="token punctuation">[</span>-c 指令<span class="token punctuation">]</span> <span class="token punctuation">[</span>username<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li><code v-pre>-</code>：单纯使用 <code v-pre>su -</code> 表示使用 login-shell 的变量文件读取方式来登录系统，若使用者名称没有加上去，则代表切换为 root 身份</li>
<li><code v-pre>-l</code>：与 <code v-pre>-</code> 类似，单后面需要加要切换的使用者账户，也是 login-shell 的方式</li>
<li><code v-pre>m</code>：与 <code v-pre>-p</code> 是一样的，表示：使用目前的环境设置，而不读取新使用者的配置文件</li>
<li><code v-pre>-c</code>：仅进行一次指令，所以 <code v-pre>-c</code> 后面可以加上指令</li>
</ul>
<p>前面讲解过 <RouteLink to="/tutorial-basis/13/10/04.html#login-%E4%B8%8E-non-login-shell"> login-shell </RouteLink>  是啥，这里有没有加上 <code v-pre>-</code> 的指令涉及到了 login-shell 与 non-login shell 的变量读取方式，下面以例子说明</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 假设现在身份是 mrcode , 想要使用 non-login shell 的方式变成 root</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">su</span>			<span class="token comment"># 注意提示字符是 mrcode 身份</span></span>
<span class="line">Password: </span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># id	</span></span>
<span class="line"><span class="token comment"># id 识别的确是 root 身份</span></span>
<span class="line"><span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token assign-left variable">groups</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token assign-left variable">context</span><span class="token operator">=</span>unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看环境变量中</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># env | grep 'mrcode'</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">HOSTNAME</span></span><span class="token operator">=</span>study.centos.mrcode</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">USER</span></span><span class="token operator">=</span>mrcode			<span class="token comment"># 当前用户还是 mrcode</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/usr/lib64/qt-3.3/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/mrcode/.local/bin:/home/mrcode/bin		<span class="token comment"># 这个影响最大，只找了 /home/mrcode</span></span>
<span class="line"><span class="token assign-left variable">MAIL</span><span class="token operator">=</span>/var/spool/mail/mrcode		<span class="token comment"># 信箱也是</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PWD</span></span><span class="token operator">=</span>/home/mrcode				<span class="token comment"># 也并非是 root 的家的目录</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">LOGNAME</span></span><span class="token operator">=</span>mrcode</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">XDG_DATA_DIRS</span></span><span class="token operator">=</span>/home/mrcode/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share:/usr/share</span>
<span class="line"><span class="token comment"># 虽然 UID 已经具有 root 的身份，但是还有一堆变量是原本 mrcode 的身份，所以还是有很多数据无法直接利用</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 离开当前的 su 环境</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># exit</span></span>
<span class="line"><span class="token builtin class-name">exit</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以单纯的使用 su 切换成 root 方式，。读取的变量设定方式为 non-login shell 的方式，这种方式很多原本的变量不会被改变，尤其是很重要的 PATH 变量，由于没有改变为 root 环境，因此很多 root 管惯用的指令就只能使用绝对路径来执行。所以执行切换身份时，务必使用以下范例</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：使用 login shell 的方式切换为 root 的身份并观察变量</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">su</span> -</span>
<span class="line">Password: 					<span class="token comment"># 输入 root 密码登录</span></span>
<span class="line">Last login: Tue Feb <span class="token number">25</span> <span class="token number">10</span>:47:26 CST <span class="token number">2020</span> on pts/1</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># env | grep root</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">USER</span></span><span class="token operator">=</span>root</span>
<span class="line"><span class="token assign-left variable">MAIL</span><span class="token operator">=</span>/var/spool/mail/root</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span>/usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">PWD</span></span><span class="token operator">=</span>/root</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">HOME</span></span><span class="token operator">=</span>/root</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">LOGNAME</span></span><span class="token operator">=</span>root</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">XDG_DATA_DIRS</span></span><span class="token operator">=</span>/root/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share:/usr/share</span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">XAUTHORITY</span></span><span class="token operator">=</span>/root/.xauthL0s7Pj</span>
<span class="line"><span class="token comment"># 可以看到环境变量都变成 root 的了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># env | grep mrcode</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">HOSTNAME</span></span><span class="token operator">=</span>study.centos.mrcode</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样可以使用 exit 指令离开 root 身份，如果只是想使用 root 执行一次命令，就恢复原本的身份可以使用 <code v-pre>-c</code> 选项</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：mrcode 要执行  hread -n 3 /etc/shadow 一次，已知 root 密码</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">head</span> <span class="token parameter variable">-n</span> <span class="token number">3</span>  /etc/shadow</span>
<span class="line">head: cannot <span class="token function">open</span> <span class="token string">'/etc/shadow'</span> <span class="token keyword">for</span> reading: Permission denied</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">su</span> - <span class="token parameter variable">-c</span> <span class="token string">"head -n 3 /etc/shadow"</span></span>
<span class="line">Password: 				<span class="token comment"># 输入 root 密码</span></span>
<span class="line">root:<span class="token variable">$6</span><span class="token variable">$eC75oi</span>.rU.wJPhgN<span class="token variable">$C</span>.C.qFXTvmJ64qFnez88TdcsHuuQAqtAYrukgBYBspgSZbCgzvJuv4OVJ9gaEfA2/.T7e68AZW7RoZt6ubeHD0::0:99999:7:::</span>
<span class="line">bin:*:17834:0:99999:7:::</span>
<span class="line">daemon:*:17834:0:99999:7:::</span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ 				<span class="token comment"># 注意看这里的身份还是 mrcode</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么怎么切换为其他账户呢？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 4：原本是 mrcode 使用者，想要变换身份为 mrcode1</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">su</span> <span class="token parameter variable">-l</span> mrcode1</span>
<span class="line">Password: 				<span class="token comment"># 输入 mrcode1 的密码</span></span>
<span class="line">Last login: Mon Feb <span class="token number">24</span> <span class="token number">17</span>:35:35 CST <span class="token number">2020</span> from <span class="token number">192.168</span>.4.170 on pts/2</span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ <span class="token function">su</span> -			</span>
<span class="line">密码：				<span class="token comment"># 输入 root 的密码，切换到 root</span></span>
<span class="line">上一次登录：二 <span class="token number">2</span>月 <span class="token number">25</span> <span class="token number">10</span>:58:09 CST 2020pts/1 上</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># id sshd			# 查看这个账户，发现有该账户</span></span>
<span class="line"><span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">74</span><span class="token punctuation">(</span>sshd<span class="token punctuation">)</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">74</span><span class="token punctuation">(</span>sshd<span class="token punctuation">)</span> 组<span class="token operator">=</span><span class="token number">74</span><span class="token punctuation">(</span>sshd<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># su -l sshd			</span></span>
<span class="line">This account is currently not available.  <span class="token comment"># 提示无法切换到 sshd</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># finger sshd		# 查看他的信息如下</span></span>
<span class="line">Login: sshd           			Name: Privilege-separated SSH</span>
<span class="line">Directory: /var/empty/sshd          	Shell: /sbin/nologin		<span class="token comment"># 这里的 nologin 问题</span></span>
<span class="line">Last login 二 <span class="token number">2</span>月 <span class="token number">25</span> <span class="token number">11</span>:00 <span class="token punctuation">(</span>CST<span class="token punctuation">)</span> on pts/1</span>
<span class="line">No mail.</span>
<span class="line">No Plan.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># exit</span></span>
<span class="line">登出		<span class="token comment"># 离开第 2 次的 su</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">exit</span></span>
<span class="line">登出		<span class="token comment"># 离开第 1 次的 su</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ 		<span class="token comment"># 这里又回到了最初的 mrcode  身份</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="小结用法" tabindex="-1"><a class="header-anchor" href="#小结用法"><span>小结用法</span></a></h3>
<ul>
<li>若要完整的切换到新使用者的环境，比如要使用 <code v-pre>su - username 或 su -l username</code>，才会连同 PATH、USER、MAIL 等变量都转成新用户的环境</li>
<li>如果仅想要执行一次 root 的指令，可以利用 <code v-pre>su -c &quot;指令串&quot;</code> 的方式来处理</li>
<li>使用 root 切换称为任何使用者时，并不需要输入新用户的密码</li>
</ul>
<h2 id="sudo" tabindex="-1"><a class="header-anchor" href="#sudo"><span>sudo</span></a></h2>
<p>相对于 su 需要了解切换用户的密码（常常是 root 的密码），而 sudo 的执行仅需要自己的密码，还可以设置不需要密码就可以执行 sudo；由于 sudo 可以让你以其他用户的身份执行指令，（通常是利用 root 身份执行命令），所以并非所有人都能够执行 sudo，而是需要规范到 <code v-pre>/etc/sudoers</code>内的用户才能够执行 sudo 指令</p>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>一般用户能够具有 sudo 的使用权，是经过管理员审核通过后，也就是受信任的账户，否则一般用户默认是不能操作 sudo 的</p>
</div>
<h3 id="sudo-的指令用法" tabindex="-1"><a class="header-anchor" href="#sudo-的指令用法"><span>sudo 的指令用法</span></a></h3>
<p>由于系统默认仅有 root 可以执行 sudo，因此下面的范例先使用 root 来执行。等谈到 visudo 时，再已一般使用者来讨论其他 sudo 的用法</p>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>最初情况下是只有 root 能执行 sudo 的，但是在安装 CentOs 时，创建了一个用户，这个用户也具有 sudo 的权限</p>
</div>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">sudo</span> <span class="token punctuation">[</span>-b<span class="token punctuation">]</span><span class="token punctuation">[</span>-u 新使用者账户<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-b：将后续的指令放到背景中让系统自动执行，而不与目前的 shell 产生影响</span>
<span class="line">	-u：后面可以接要切换的使用者账户，若没此项，则表示切换到 root 身份</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：想要以 sshd 的身份在 /tmp 下创建一个名为 myssh 的文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sudo -u sshd touch /tmp/mysshd</span></span>
<span class="line">您在 /var/spool/mail/root 中有新邮件</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /tmp/mysshd </span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> sshd sshd <span class="token number">0</span> <span class="token number">2</span>月  <span class="token number">25</span> <span class="token number">13</span>:04 /tmp/mysshd</span>
<span class="line"><span class="token comment"># 可以看到是由 ssh 创建的</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：以 mrcode1 的身份创建 ~Vbird1/www 并在其中创建 index.html 文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># sudo -u mrcode1 sh -c "mkdir ~mrcode1/www; cd ~mrcode1/www; echo 'This is index.html'  > index.html"</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -a ~mrcode1/www/</span></span>
<span class="line">总用量 <span class="token number">4</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> mrcode1 mrcode1  <span class="token number">24</span> <span class="token number">2</span>月  <span class="token number">25</span> <span class="token number">13</span>:15 <span class="token builtin class-name">.</span></span>
<span class="line">drwx------. <span class="token number">7</span> mrcode1 mrcode1 <span class="token number">201</span> <span class="token number">2</span>月  <span class="token number">25</span> <span class="token number">13</span>:15 <span class="token punctuation">..</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode1 mrcode1  <span class="token number">19</span> <span class="token number">2</span>月  <span class="token number">25</span> <span class="token number">13</span>:15 index.html</span>
<span class="line"><span class="token comment"># 注意上面 那个 sh -c ""  这一串不是 sudo 的参数，是指令；sh --help 可以看到 sh -c "指令串"，是利用 sh 执行命令</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>范例 2 使用 sh -c 来执行多重指令。</p>
<p>为什么 sudo 预设仅有 root 能使用？是因为 sudo 的执行流程如下：</p>
<ol>
<li>当用户执行 sudo 时，系统与 <code v-pre>/etc/sudoers</code> 文件中搜索该使用者是否有执行 sudo 的权限</li>
<li>若使用者具有可执行 sudo 的权限后，便让使用者「输入用户自己的密码」来确认</li>
<li>若密码输入成功，变开始进行 sudo 后续接的指令（root 执行 sudo 时不需要密码）</li>
<li>若要切换的身份与执行者身份相同，也不需要输入密码</li>
</ol>
<p>所以是否能使用 sudo ，必须要看 <code v-pre>/etc/sudoers</code> 中是否有配置，这种文件都有自己的规范，所以提供了一个 visudo 指令来帮助管理该文件</p>
<h3 id="visudo-与-etc-sudoers" tabindex="-1"><a class="header-anchor" href="#visudo-与-etc-sudoers"><span>visudo 与 <code v-pre>/etc/sudoers</code></span></a></h3>
<p>使用 visudo 来修改，在结束离开时，会校验 <code v-pre>/etc/sudoers</code> 的语法，来避免修改错误的语法导致 sudo 无法使用</p>
<p>一般来说，visduo 的设置方式有几种简单的方法，下面介绍几个简单的例子来说明</p>
<h3 id="单一用户使用-sudo" tabindex="-1"><a class="header-anchor" href="#单一用户使用-sudo"><span>单一用户使用 sudo</span></a></h3>
<p>单一用户可进行 root 所有指令，与 sudoers 文件语法：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 让 mrcode1 账户可以使用 root 的任何指令，基本上有两种方式：</span></span>
<span class="line"><span class="token comment"># 1. 直接修改 /etc/sudoers</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># visudo </span></span>
<span class="line">:set nu			<span class="token comment"># 显示行号</span></span>
<span class="line">    <span class="token number">100</span> root    <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">    <span class="token number">101</span> mrcode1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL			<span class="token comment"># 在 100 行后，添加 mrcode1 的数据</span></span>
<span class="line"><span class="token comment"># 然后保存离开</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实 visudo 利用 vi 将文件打开修改。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">使用者账户	登陆者的来源主机名<span class="token operator">=</span>（可切换的身份）	可下达的指令</span>
<span class="line">root    	<span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       				ALL</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>各字段含义如下：</p>
<ol>
<li>使用者账户：系统中那个账户可以使用 sudo 指令</li>
<li>登陆者的来源主机名：就是信任哪一台网络主机可以联机，这个值可以指定客户端计算机。默认的 ALL 是允许任何一台网络主机</li>
<li>可切换的身份：这个账户可以切换成什么身份来下达后续的指令。默认 root 可以切换成任何人</li>
<li>可下达的指令：可用该身份下达什么指令？<strong>这个指令请务必使用绝对路径</strong>，预设 root 可以切换任何身份且下达任何指令</li>
</ol>
<p>All 是特殊的关键词，代表任何身份、主机、指令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 进行测试</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> /etc/shadow		<span class="token comment"># 这里是 mrcode1 登录的</span></span>
<span class="line"><span class="token comment"># 提示权限不足</span></span>
<span class="line">tail: cannot <span class="token function">open</span> <span class="token string">'/etc/shadow'</span> <span class="token keyword">for</span> reading: Permission denied</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 sudo 来执行</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> /etc/shadow</span>
<span class="line"></span>
<span class="line">We trust you have received the usual lecture from the <span class="token builtin class-name">local</span> System</span>
<span class="line">Administrator. It usually boils down to these three things:</span>
<span class="line"></span>
<span class="line">    <span class="token comment">#1) Respect the privacy of others.</span></span>
<span class="line">    <span class="token comment">#2) Think before you type.</span></span>
<span class="line">    <span class="token comment">#3) With great power comes great responsibility.</span></span>
<span class="line"><span class="token comment"># 上面只是提示，大概意思是能力越大责任越大，慎重之类的意思</span></span>
<span class="line"><span class="token punctuation">[</span>sudo<span class="token punctuation">]</span> password <span class="token keyword">for</span> mrcode1: 				<span class="token comment"># 然后输入 mrcode1 自己的密码，就可以执行了</span></span>
<span class="line">pro3:<span class="token variable">$6</span><span class="token variable">$oku6c8Az</span><span class="token variable">$GUOVL1SkmFnSnVHvUCKnToNv8l7094dQ17</span>/GOw/R5mdxqiE0THtkFaO4GpzFMxJy30rZbpWgQcNSpMqHN8KWT/:18316:0:99999:7:::</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>利用 wheel 群组以及免密码的功能处理 visudo</p>
<h3 id="wheel-群组使用-sudo" tabindex="-1"><a class="header-anchor" href="#wheel-群组使用-sudo"><span>wheel 群组使用 sudo</span></a></h3>
<p>之前曾建立过 pro1、pro2、pro3  让这 3 个用户也可以使用 sudo，但是通过群组的方式来支持</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 使用 visudo 设置 whell 群组</span></span>
<span class="line">visudo</span>
<span class="line"></span>
<span class="line">     <span class="token number">99</span> <span class="token comment">## Allow root to run any commands anywhere</span></span>
<span class="line">    <span class="token number">100</span> root    <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">    <span class="token number">101</span> mrcode1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">    <span class="token number">102</span> </span>
<span class="line">    <span class="token number">103</span> <span class="token comment">## Allows members of the 'sys' group to run networking, software,</span></span>
<span class="line">    <span class="token number">104</span> <span class="token comment">## service management apps and more.</span></span>
<span class="line">    <span class="token number">105</span> <span class="token comment"># %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS</span></span>
<span class="line">    <span class="token number">106</span> </span>
<span class="line">    <span class="token number">107</span> <span class="token comment">## Allows people in group wheel to run all commands</span></span>
<span class="line">    <span class="token number">108</span> %wheel  <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">    </span>
<span class="line"><span class="token comment"># 在最左边增加 % 表示是一个群组，注意在编辑的时候，当时笔者吧 $wheel 这一行写在 上面 root 后面，报错就报错说有语法错误，不知道是否也有识别，需要写到这个 Allows people in group wheel to run all commands 这一行下面呢？</span></span>
<span class="line"><span class="token comment"># 注意： whell 这个配置默认已经配置过了，并且该组也已经存在了。应该是系统初始化就有的</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 将 pro1 添加进 wheel 群组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># usermod -a -G wheel pro1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 切换到 pro1 、pro2 并执行 sudo 命令查看</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># su -l pro1</span></span>
<span class="line"><span class="token punctuation">[</span>pro1@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> /etc/shadow</span>
<span class="line"></span>
<span class="line">We trust you have received the usual lecture from the <span class="token builtin class-name">local</span> System</span>
<span class="line">Administrator. It usually boils down to these three things:</span>
<span class="line"></span>
<span class="line">    <span class="token comment">#1) Respect the privacy of others.</span></span>
<span class="line">    <span class="token comment">#2) Think before you type.</span></span>
<span class="line">    <span class="token comment">#3) With great power comes great responsibility.</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>sudo<span class="token punctuation">]</span> password <span class="token keyword">for</span> pro1: </span>
<span class="line">pro3:<span class="token variable">$6</span><span class="token variable">$oku6c8Az</span><span class="token variable">$GUOVL1SkmFnSnVHvUCKnToNv8l7094dQ17</span>/GOw/R5mdxqiE0THtkFaO4GpzFMxJy30rZbpWgQcNSpMqHN8KWT/:18316:0:99999:7:::</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 切换到 pro2 </span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># su -l pro2</span></span>
<span class="line"><span class="token punctuation">[</span>pro2@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>C</span>
<span class="line"><span class="token punctuation">[</span>pro2@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> /etc/shadow</span>
<span class="line"></span>
<span class="line">We trust you have received the usual lecture from the <span class="token builtin class-name">local</span> System</span>
<span class="line">Administrator. It usually boils down to these three things:</span>
<span class="line"></span>
<span class="line">    <span class="token comment">#1) Respect the privacy of others.</span></span>
<span class="line">    <span class="token comment">#2) Think before you type.</span></span>
<span class="line">    <span class="token comment">#3) With great power comes great responsibility.</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>sudo<span class="token punctuation">]</span> password <span class="token keyword">for</span> pro2: </span>
<span class="line">pro2 is not <span class="token keyword">in</span> the sudoers file.  This incident will be reported.</span>
<span class="line"><span class="token comment"># 提示 pro2 不在 sudoers 文件中</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么这里对群组进行了支持，pro2 和 pro3 也要支持 sudo 的话，直接使用 usermod 将他们添加到 wheel 组中即可</p>
<p>前面说安装系统创建的用户，直接设置为了管理员的话，也是可以使用 sudo 指令的，这个操作就是将那个账户添加到了 wheel 组了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">id</span> mrcode </span>
<span class="line"><span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">1000</span><span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">1000</span><span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span> <span class="token assign-left variable">groups</span><span class="token operator">=</span><span class="token number">1000</span><span class="token punctuation">(</span>mrcode<span class="token punctuation">)</span>,100<span class="token punctuation">(</span>users<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">id</span> pro1</span>
<span class="line"><span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">1505</span><span class="token punctuation">(</span>pro1<span class="token punctuation">)</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">1508</span><span class="token punctuation">(</span>pro1<span class="token punctuation">)</span> <span class="token assign-left variable">groups</span><span class="token operator">=</span><span class="token number">1508</span><span class="token punctuation">(</span>pro1<span class="token punctuation">)</span>,10<span class="token punctuation">(</span>wheel<span class="token punctuation">)</span>,1507<span class="token punctuation">(</span>projecta<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">cat</span> /etc/shadow</span>
<span class="line"><span class="token punctuation">[</span>sudo<span class="token punctuation">]</span> password <span class="token keyword">for</span> mrcode: </span>
<span class="line">mrcode is not <span class="token keyword">in</span> the sudoers file.  This incident will be reported.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 我们这里看到，这里的账户并没有加入 wheel 这个组，实际执行 sudo 的话，也会提示不支持；</span></span>
<span class="line"><span class="token comment"># 这就说明当时我并没有选择添加为管理员</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从 Centos 7 开始， <code v-pre>%wheel</code> 这行默认存在，并且也有这个组</p>
<h3 id="免密使用-sudo" tabindex="-1"><a class="header-anchor" href="#免密使用-sudo"><span>免密使用 sudo</span></a></h3>
<p>既然管理员都信任这些用户了，是否可以提供：不需要密码就可以使用 sudo 呢？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># visudo </span></span>
<span class="line"><span class="token comment">## Allows people in group wheel to run all commands</span></span>
<span class="line"><span class="token comment"># %wheel        ALL=(ALL)       ALL</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment">## Same thing without a password</span></span>
<span class="line">%wheel  <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       NOPASSWD: ALL</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>找到上述地方，在第三个字段，将 NOPASSWD 哪一行放开，把上面原始的注释掉。也就是在可下达的指令前使用 <code v-pre>NOPASSWD:</code> 来标识不需要密码</p>
<h3 id="有限制的指令操作" tabindex="-1"><a class="header-anchor" href="#有限制的指令操作"><span>有限制的指令操作</span></a></h3>
<p>上面的配置可以让使用者利用 root 身份进行任何事情，如果要配置只能够允许进行一部分事情的话，比如 myuser1 只能帮 root 修改其他用户的密码，可以如下做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># visudo </span></span>
<span class="line"><span class="token comment">## Allow root to run any commands anywhere</span></span>
<span class="line">root    <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">mrcode1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">myuser1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       /usr/bin/passwd		<span class="token comment"># 使用绝对路径，来给定使用的指令</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再使用 myuser1 来测试是否成功</span></span>
<span class="line"><span class="token punctuation">[</span>myuser1@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">cat</span> /etc/shadow</span>
<span class="line"><span class="token punctuation">[</span>sudo<span class="token punctuation">]</span> password <span class="token keyword">for</span> myuser1: </span>
<span class="line">Sorry, user myuser1 is not allowed to execute <span class="token string">'/bin/cat /etc/shadow'</span> as root on study.centos.mrcode.</span>
<span class="line"><span class="token comment"># 可以看到不支持 /bin/cat 指令</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再使用 sudo passwd ，发现可以执行</span></span>
<span class="line"><span class="token punctuation">[</span>myuser1@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">passwd</span> myuser3</span>
<span class="line">Changing password <span class="token keyword">for</span> user myuser3.</span>
<span class="line">New password: </span>
<span class="line">BAD PASSWORD: The password is shorter than <span class="token number">8</span> characters</span>
<span class="line">Retype new password: </span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"><span class="token comment"># 上面修改了 myuser3 的密码</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这里不加参数，发现可以直接修改 root 的密码，这样就不行了</span></span>
<span class="line"><span class="token punctuation">[</span>myuser1@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">passwd</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user root.</span>
<span class="line">New password: </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还可以限制指令的参数</span></span>
<span class="line">myuser1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       <span class="token operator">!</span>/usr/bin/passwd, <span class="token operator">!</span>/usr/bin/passwd root, /usr/bin/passwd <span class="token punctuation">[</span>A-Za-z<span class="token punctuation">]</span>*</span>
<span class="line"><span class="token comment"># 不可执行的指令添加上了感叹号 !</span></span>
<span class="line"><span class="token comment"># 上面直接执行 passwd 和 passwd root 都不允许，后面一个用正则规定了参数，必须使用字母开头的参数</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试，就会提示不被允许执行</span></span>
<span class="line"><span class="token punctuation">[</span>myuser1@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">passwd</span></span>
<span class="line">Sorry, user myuser1 is not allowed to execute <span class="token string">'/bin/passwd'</span> as root on study.centos.mrcode.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通过别名建立-visudo" tabindex="-1"><a class="header-anchor" href="#通过别名建立-visudo"><span>通过别名建立 visudo</span></a></h3>
<p>比如我有 15 个用户加入刚刚的管理员，那么是否都需要将上述限制命令的代码复制 15 行配置到 visudo 中呢？</p>
<p>可以通过 visudo 的别名功能，可以是：指令别名、账户别名、主机别名等。这里仅介绍账户别名</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 假设 pro1、pro2、pro3 与 myuser1、myuser2 要加入上述的密码管理员的 sudo 列表中</span></span>
<span class="line"><span class="token comment"># 那么可以创建一个账户别名为 ADMPW，然后配置该账户别名</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">## User Aliases</span></span>
<span class="line"><span class="token comment">## These aren't often necessary, as you can use regular groups</span></span>
<span class="line"><span class="token comment">## (ie, from files, LDAP, NIS, etc) in this file - just use %groupname</span></span>
<span class="line"><span class="token comment">## rather than USERALIAS</span></span>
<span class="line"><span class="token comment"># User_Alias ADMINS = jsmith, mikem</span></span>
<span class="line">User_Alias ADMPW <span class="token operator">=</span> pro1, pro2, pro3, myuser1, myuser2</span>
<span class="line"></span>
<span class="line"><span class="token comment">## Command Aliases</span></span>
<span class="line"><span class="token comment">## These are groups of related commands...</span></span>
<span class="line">Cmnd_Alias ADMPWCOM <span class="token operator">=</span> <span class="token operator">!</span>/usr/bin/passwd, <span class="token operator">!</span>/usr/bin/passwd root, /usr/bin/passwd <span class="token punctuation">[</span>A-Za-z<span class="token punctuation">]</span>*</span>
<span class="line"></span>
<span class="line"><span class="token comment">## Allow root to run any commands anywhere</span></span>
<span class="line">root    <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">mrcode1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ALL</span>
<span class="line">myuser1 <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       <span class="token operator">!</span>/usr/bin/passwd, <span class="token operator">!</span>/usr/bin/passwd root, /usr/bin/passwd <span class="token punctuation">[</span>A-Za-z<span class="token punctuation">]</span>*</span>
<span class="line">ADMPW   <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>ALL<span class="token punctuation">)</span>       ADMPWCOM</span>
<span class="line"><span class="token comment"># 上面定义了 User_Alias 用户别名 和 Cmnd_Alias 命令别名</span></span>
<span class="line"><span class="token comment"># 并在之前配置用户的地方使用上了这两个别名</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>别名建议使用大写；后续对用户的维护直接修改别名中的即可</p>
<h3 id="sudo-的时间间隔问题" tabindex="-1"><a class="header-anchor" href="#sudo-的时间间隔问题"><span>sudo 的时间间隔问题</span></a></h3>
<p>如果使用同一个账户在极短时间内重复操作 sudo 来运行指令的话，在第二次执行 sudo 时，并不需要输入自己的密码！也可以正常运行</p>
<p>这是因为有一个机制，sudo 两次操作间隔超过 5 分钟，那么就需要重新输入一次密码。这个机制也是为了安全，比如你输入密码执行过一次 sudo，这个时候去厕所了，超过了 5 分钟还没有回来，防止别人动你的电脑执行 sudo</p>
<h3 id="sudo-搭配-su-的使用方式" tabindex="-1"><a class="header-anchor" href="#sudo-搭配-su-的使用方式"><span>sudo 搭配 su 的使用方式</span></a></h3>
<p>有时候需要大量执行很多 root 的工作，一直使用 sudo 就很麻烦，可以通过下面的方式结合 su，并且还使用用户自己的密码来变成 root</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">visudo</span>
<span class="line">User_Alias ADMINS <span class="token operator">=</span> pro1, pro2, pro3, myuser1</span>
<span class="line">ADMINS  <span class="token assign-left variable">ALL</span><span class="token operator">=</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>      /bin/su -</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建一个 ADMINS 的用户别名，再限制该用户只能切换到 root，并且只能执行 su -</span></span>
<span class="line"><span class="token comment"># 注意使用是：用 sudo 命令来执行 su</span></span>
<span class="line"><span class="token punctuation">[</span>pro2@study ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> <span class="token function">su</span> -</span>
<span class="line"><span class="token punctuation">[</span>sudo<span class="token punctuation">]</span> password <span class="token keyword">for</span> pro2: </span>
<span class="line">Last login: Tue Feb <span class="token number">25</span> <span class="token number">15</span>:09:19 CST <span class="token number">2020</span> on pts/1</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># 		# 看这里的提示，变成了 root</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方式是这样的：</p>
<ol>
<li>限制了可切换为 root，那么这些用户只能切换到 root</li>
<li>并且这些用户只能通过 sudo 执行 <code v-pre>su -</code> 的操作</li>
<li>sudo 需要输入用户自己的密码，通过之后相当于是 root 身份了，用 root 身份执行 su -  切换到 root 身份，就不需要 root 密码了（root 使用 su 不需要密码）</li>
</ol>
<p>通过中方式也能授权管理员账户。</p>
</div></template>


