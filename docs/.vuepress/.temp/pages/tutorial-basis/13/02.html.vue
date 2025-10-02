<template><div><h1 id="账号管理" tabindex="-1"><a class="header-anchor" href="#账号管理"><span>账号管理</span></a></h1>
<p>由新增与移除使用者开始讲解</p>
<h2 id="新增与移除账户-使用者" tabindex="-1"><a class="header-anchor" href="#新增与移除账户-使用者"><span>新增与移除账户（使用者）</span></a></h2>
<p>涉及到 useradd、相关配置文件、passwd、usermod、userdel 等知识点</p>
<h3 id="useradd" tabindex="-1"><a class="header-anchor" href="#useradd"><span>useradd</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">useradd</span> <span class="token punctuation">[</span>-u <span class="token environment constant">UID</span><span class="token punctuation">]</span> <span class="token punctuation">[</span>-g 初始群组<span class="token punctuation">]</span> <span class="token punctuation">[</span>-G 次要群组<span class="token punctuation">]</span> <span class="token punctuation">[</span>-mM<span class="token punctuation">]</span> <span class="token punctuation">[</span>-c 说明栏<span class="token punctuation">]</span> <span class="token punctuation">[</span>-d 家目录绝对路径<span class="token punctuation">]</span> <span class="token punctuation">[</span>-s shell<span class="token punctuation">]</span> 使用者账户</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line"></span>
<span class="line">	-u：<span class="token environment constant">UID</span> 是一组数字。直接指定一个特定的 <span class="token environment constant">UID</span> 给该账户</span>
<span class="line">	-g：字符串的初始组名，该字符串的 GID 在 /etc/passwd 的第 <span class="token number">3</span> 个字段内</span>
<span class="line">	-G：字符串的次要群组，该选项会修改 /etc/group 内的相关字段</span>
<span class="line">	-M：强制！不要建立用户家目录（系统账户默认值）</span>
<span class="line">	-m：强制！要建立用户家目录（一般账户默认）</span>
<span class="line">	-c：/etc/passwd 中第 <span class="token number">5</span> 字段的说明内容，可以随便设置</span>
<span class="line">	-d：指定某个目录成为家目录，请务必使用决定路径</span>
<span class="line">	-r：建立一个系统账户，该账户的 <span class="token environment constant">UID</span> 有限制（参考 /etc/login.defs）</span>
<span class="line">	-s：后面接一个 shell，若没有指定则预设是 /bin/bash</span>
<span class="line">	-e：后面接一个日期，格式为 YYYY-MM-DD ，此项可写入 shadow 第 <span class="token number">8</span> 字段，即是账户失效日期</span>
<span class="line">	-f：后面接 shadow 的第 <span class="token number">7</span> 字段，该密码是否会失效。0 为立刻失效，-1 为永远不失效（密码只会过期而强制域登录时重新设置）</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意这里是没有密码配置的，密码的设置需要用到 passwd 指令</p>
<p>实践练习，创建一般账户</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 完全参考默认值创建一个用户，名称为 mrcode1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># useradd mrcode1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -d /home/mrcode1/</span></span>
<span class="line">drwx------. <span class="token number">3</span> mrcode1 mrcode1 <span class="token number">78</span> Feb <span class="token number">20</span> <span class="token number">17</span>:12 /home/mrcode1/</span>
<span class="line"><span class="token comment"># 默认会创建家目录，且权限为 700，这是重点！</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grep mrcode1 /etc/passwd /etc/shadow /etc/group</span></span>
<span class="line">/etc/passwd:mrcode1:x:1001:1001::/home/mrcode1:/bin/bash</span>
<span class="line">/etc/shadow:mrcode1:<span class="token operator">!</span><span class="token operator">!</span>:18312:0:99999:7:::</span>
<span class="line">/etc/group:mrcode1:x:1001:			<span class="token comment"># 预设会建立一个与账户同名的群组名</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到系统规定好了非常多的默认值，所以可以简单的使用 useradd 账户名 来创建使用者。 CentOS 这些默认值主要会帮我们处理几个操作</p>
<ul>
<li>在 <code v-pre>/etc/passwd</code> 中创建一行与账户相关的数据，包括建立 UID、GID、家目录等</li>
<li>在 <code v-pre>/etc/shadow</code> 中创建该账户的密码相关参数，但是无密码</li>
<li>在 <code v-pre>/etc/group</code> 中创建一个与账户名同名的组名</li>
<li>在 <code v-pre>/home</code> 下创建一个与账户同名的目录作为家的目录，且权限为 700</li>
</ul>
<p>对于账户密码需要使用 passwd 指令来完成。如果需要定制相关参数，就需要使用选项与参数来详细定制了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：假设已知道系统中有一个组名为 users，且 UID 1500 并不存在，请用 users 为初始群组，以及 UID 为 1500 创建一个名为 mrcode2 的账户</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># useradd -u 1500 -g users mrcode2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -d /home/mrcode2</span></span>
<span class="line">drwx------. <span class="token number">3</span> mrcode2 <span class="token function">users</span> <span class="token number">78</span> Feb <span class="token number">20</span> <span class="token number">17</span>:20 /home/mrcode2</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grep mrcode2 /etc/passwd /etc/shadow /etc/group</span></span>
<span class="line">/etc/passwd:mrcode2:x:1500:100::/home/mrcode2:/bin/bash</span>
<span class="line">/etc/shadow:mrcode2:<span class="token operator">!</span><span class="token operator">!</span>:18312:0:99999:7:::</span>
<span class="line"><span class="token comment"># 对比上述文件，是不是发现少了一个 mrcode2 的群组？因为初始群组是 users（并且已经存在了），所以就没有必要创建 mrcode2 群组了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建系统账户（system account）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3 ：创建一个系统账户，名为 mrcode3</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># useradd -r mrcode3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以看到没有创建家的目录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -d /home/mrcode3</span></span>
<span class="line">ls: cannot access /home/mrcode3: No such <span class="token function">file</span> or directory</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grep /etc/passwd /etc/shadow /etc/group</span></span>
<span class="line">/etc/passwd:mrcode3:x:988:982::/home/mrcode3:/bin/bash</span>
<span class="line">/etc/shadow:mrcode3:<span class="token operator">!</span><span class="token operator">!</span>:18312::::::</span>
<span class="line">/etc/group:mrcode3:x:982:</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意上面的 988:982,前面谈到过，一般账户的 UID 为 1000 以后，那么用户创建的系统账户一般是小于 1000 的。另外由于系统账户要是用来进行运行操作系统所需服务的权限设置，所以系统账户默认都不会主动建立家的目录</p>
<p>系统内置了默认值，那么这些默认值是出自哪里的呢？这就需要了解下 useradd 所使用的参考文件了</p>
<h3 id="相关配置文件-useradd-参考文件" tabindex="-1"><a class="header-anchor" href="#相关配置文件-useradd-参考文件"><span>相关配置文件（useradd 参考文件）</span></a></h3>
<p>可以使用 <code v-pre>useradd -D</code>显示默认值</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># useradd -D</span></span>
<span class="line"><span class="token assign-left variable">GROUP</span><span class="token operator">=</span><span class="token number">100</span>						<span class="token comment"># 预设群组</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">HOME</span></span><span class="token operator">=</span>/home						<span class="token comment"># 默认加目录所在目录</span></span>
<span class="line"><span class="token assign-left variable">INACTIVE</span><span class="token operator">=</span>-1						<span class="token comment"># 密码失效日，在 shadow 内的第 7 字段</span></span>
<span class="line"><span class="token assign-left variable">EXPIRE</span><span class="token operator">=</span>							<span class="token comment"># 账户失效日，在 shadow 内的第 8 字段</span></span>
<span class="line"><span class="token assign-left variable"><span class="token environment constant">SHELL</span></span><span class="token operator">=</span>/bin/bash					<span class="token comment"># 预设的 shell</span></span>
<span class="line"><span class="token assign-left variable">SKEL</span><span class="token operator">=</span>/etc/skel					<span class="token comment"># 用户家的目录内容数据参考目录</span></span>
<span class="line"><span class="token assign-left variable">CREATE_MAIL_SPOOL</span><span class="token operator">=</span>yes			<span class="token comment"># 是否主动帮使用者建立邮件信息（mailbox）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="etc-default-useradd" tabindex="-1"><a class="header-anchor" href="#etc-default-useradd"><span><code v-pre>/etc/default/useradd</code></span></a></h4>
<p>以上信息是存在 <code v-pre>/etc/default/useradd</code> 文件中的，那么默认值造成的行为是：</p>
<ul>
<li>
<p><code v-pre>GROUP=100</code>：100 这个 GID 对应的群组也就是 users</p>
<p>但是对于 mrcode1 来说，他的初始群组是 mrcode1，而不是 users，这是因为针对群组的角度有以下两种：</p>
<ul>
<li>
<p>私有群组机制</p>
<p>系统会建立一个与账户一样的群组给使用者作为初始群组。这种机制比较有保密性，因为使用者都有自己的群组，而家目录权限也将会设定为 700（仅有自己可以进入自己的家目录）。代表性的 distributions 有 RHEL、Fedora、CentOS 等</p>
</li>
<li>
<p>公共群组机制</p>
<p>就是以默认值来给定初始群组，因此每个账户都属于 users（默认值）群组，且默认家目录通常的权限会是 <code v-pre>drwx-xr-x ... username users ...</code>。代表 distributions 有 SuSE 等</p>
</li>
</ul>
<p>我们的学习机是 CentOS，所以看到的不是默认值</p>
</li>
<li>
<p><code v-pre>HOME=/home</code>：用户家目录的基准目录（basedir）</p>
<p>用户名的家目录通常是与账户名相同的，比如 /home/mrcode1</p>
</li>
<li>
<p><code v-pre>INACTIVE=-1</code>：密码过期后是否会失效的设定值</p>
<p>在前面讲到 shadow 文件结构，第 7 个字段将会影响密码过期后，在多久时间内还可以使用旧密码登录。0 表示立刻失效，-1 表示永远不失效，如 30 ，则标识过期 30 天后失效</p>
</li>
<li>
<p><code v-pre>EXPIRE=</code> ：账户失效日期</p>
<p>shadow 文件中第 8 字段内容，设置账户在哪个日期后直接失效，通常不会设置此项目，如果是付费的回会员系统，则有可能使用</p>
</li>
<li>
<p><code v-pre>SHELL=/bin/bash</code>：默认使用的 shell 程序文件名</p>
<p>假如你的系统为 mail server，希望每个账户只能使用 email 的收发信功能，不允许用户登录系统取得 shell，就可以在这里设置为 <code v-pre>/sbin/nologin</code>，那么预设新用户创建后就无法登录了。</p>
</li>
<li>
<p><code v-pre>SKEL=/etc/skel</code>：用户家目录参考基准目录</p>
<p>比如一个新用户 mrcode1 ，那么他的家的目录 <code v-pre>/home/mrcode1</code> 中的数据是由这里的基准目录中的数据复制过去的。</p>
</li>
<li>
<p><code v-pre>CREATE_MAIL_SPOOL=yes</code>：建立使用者的 mailbox</p>
<p><code v-pre>ll /var/spool/mail/mrcode1</code> 查看会存在该文件，</p>
</li>
</ul>
<h4 id="etc-login-defs" tabindex="-1"><a class="header-anchor" href="#etc-login-defs"><span><code v-pre>/etc/login.defs</code></span></a></h4>
<p>初上上述的基本设置之外， UID/GID 密码参数是在 <code v-pre>/etc/login.defs</code> 中配置的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 这里去掉了原始文件中的注释描述</span></span>
<span class="line">MAIL_DIR	/var/spool/mail				<span class="token comment"># 用户默认邮箱目录</span></span>
<span class="line"></span>
<span class="line">PASS_MAX_DAYS	<span class="token number">99999</span>					<span class="token comment"># /etc/shadow 内的第 5 字段，多少天需要变更密码</span></span>
<span class="line">PASS_MIN_DAYS	<span class="token number">0</span>						<span class="token comment"># /etc/shadow 内的第 4 字段，多少天不可重新设置密码</span></span>
<span class="line">PASS_MIN_LEN	<span class="token number">5</span>						<span class="token comment"># 密码最短的字符长度，已被 pam 模块取代，该配置已失效</span></span>
<span class="line">PASS_WARN_AGE	<span class="token number">7</span>						<span class="token comment"># /etc/shadow 内的第 6 字段，过期前 7 天会发送警告消息</span></span>
<span class="line"></span>
<span class="line">UID_MIN                  <span class="token number">1000</span>			<span class="token comment"># 用户的最小 UID ，1000 以下由系统保留</span></span>
<span class="line">UID_MAX                 <span class="token number">60000</span>			<span class="token comment"># 最大的 UID</span></span>
<span class="line">SYS_UID_MIN               <span class="token number">201</span>			<span class="token comment"># 保留给用户自行创建的系统账户最小 UID</span></span>
<span class="line">SYS_UID_MAX               <span class="token number">999</span>			<span class="token comment"># 保留给用户自行创建的系统账户最大 UID</span></span>
<span class="line"></span>
<span class="line">GID_MIN                  <span class="token number">1000</span>			<span class="token comment"># 自定义组的最小 GID</span></span>
<span class="line">GID_MAX                 <span class="token number">60000</span>			<span class="token comment"># 自定义组的最大 GID</span></span>
<span class="line">SYS_GID_MIN               <span class="token number">201</span>			<span class="token comment"># 保留给用户创建的系统账户组 ID</span></span>
<span class="line">SYS_GID_MAX               <span class="token number">999</span>			</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">CREATE_HOME	<span class="token function">yes</span>							<span class="token comment"># 在不加 —M 或 -m 时，是否主动创建用户家目录</span></span>
<span class="line"></span>
<span class="line">UMASK           077						<span class="token comment"># 用户家目录建立的 umask，因此权限会是 700</span></span>
<span class="line"></span>
<span class="line">USERGROUPS_ENAB <span class="token function">yes</span>						<span class="token comment"># 使用 userdel 删除时，是否删除初始群组</span></span>
<span class="line">	</span>
<span class="line">ENCRYPT_METHOD SHA512					<span class="token comment"># 密码加密的机制使用的是  sha512 </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体如下：</p>
<ul>
<li>
<p><code v-pre>mailbox</code> 所在目录</p>
<p>用户的默认 mailbox 文件存放目录 <code v-pre>/var/spool/mail</code></p>
</li>
<li>
<p><code v-pre>shadow</code> 面膜第 4、5、6 字段内容</p>
<p><code v-pre>/etc/shadow</code> 内每一行基本上都有  <code v-pre>0:99999:7</code> 的存在，就是这里预设的</p>
</li>
<li>
<p><code v-pre>UID/GID</code> 数值相关</p>
<p>虽然 LInux 核心支持的账户可大 2的32次方 ，但是一台主机上管理这么多账户也很麻烦。</p>
<p>那么数值自增原理是：拿到这里配置的 <code v-pre>UID_MIN</code>和 <code v-pre>/etc/passwd</code> 中搜寻最大的 UID 数值，并找出两个源中最大的一个+1 得到新用户的 UID</p>
<p>比如使用 <code v-pre>useradd -r sysaccount</code> 就会得到 大于 201 小于 1000 的 UID 了</p>
</li>
<li>
<p>用户家目录设置</p>
<p><code v-pre>CREATE_HOME	yes</code> 会让你在使用 useradd 时，自动加上 -m 属性创建家的目录，如果不需要则会加上 -M ，家的目录全是是 <code v-pre>drwx------</code> 是因为 UMASk=077 的缘故</p>
</li>
<li>
<p>用户删除与密码设置</p>
<p><code v-pre>USERGROUPS_ENAB yes	</code> 使用 userdel 删除时，且该账户所属的初始群组已经没有人在该组下了，则删掉该组。</p>
</li>
</ul>
<p>小结：使用 useradd 指令在 linux 上创建账户时，至少会参考：</p>
<ul>
<li><code v-pre>/etc/default/useradd</code></li>
<li><code v-pre>/etc/login.defs</code></li>
<li><code v-pre>/etc/skel/*</code></li>
</ul>
<p>这些文件作为默认值等参考，而承载与记录数据则是 <code v-pre>/etc/passwd</code>、<code v-pre>/etc/shadow</code>、<code v-pre>/etc/group</code>、<code v-pre>/etc/gshadow</code> 与家目录。所以如果你了解整个程序修改的是那些文件和内容，也可以直接手动修改这些文件。</p>
<h3 id="passwd" tabindex="-1"><a class="header-anchor" href="#passwd"><span>passwd</span></a></h3>
<p>使用 useradd 创建账户之后，在预设的情况下，该账户暂时无法登录，因为在 <code v-pre>/etc/shadow</code> 第 2 个字段中内容为 <code v-pre>!!</code>，这个是一个无效密码，所以无法被登录。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">passwd</span> <span class="token punctuation">[</span>--stdin<span class="token punctuation">]</span> <span class="token punctuation">[</span>账户名称<span class="token punctuation">]</span>		<span class="token comment"># 所有人均可使用来修改自己的密码</span></span>
<span class="line"><span class="token function">passwd</span> <span class="token punctuation">[</span>-l<span class="token punctuation">]</span> <span class="token punctuation">[</span>-u<span class="token punctuation">]</span> <span class="token punctuation">[</span>--stdin<span class="token punctuation">]</span> <span class="token punctuation">[</span>-S<span class="token punctuation">]</span> <span class="token punctuation">[</span>-n 天数<span class="token punctuation">]</span> <span class="token punctuation">[</span>-x 天数<span class="token punctuation">]</span> <span class="token punctuation">[</span>-w 天数<span class="token punctuation">]</span> <span class="token punctuation">[</span>-i 日期<span class="token punctuation">]</span> 账户			<span class="token comment"># root 功能</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line"></span>
<span class="line">	--stdin：可以接受前一个管线的数据，作为密码输入，对 shell script 中有较大作用</span>
<span class="line">	-l：Lock 意思，就是会将 /etc/shadow 第 <span class="token number">2</span> 字段前面加上 <span class="token operator">!</span> 使密码失效</span>
<span class="line">	-u：Unlock，与 <span class="token parameter variable">-l</span> 相反</span>
<span class="line">	-S：列出密码相关参数，也就是 shadow 文件内的大部分信息</span>
<span class="line">	-n：后面接天数，shadow 第 <span class="token number">4</span> 字段，多久不可修改密码</span>
<span class="line">	-x：后面接天数，shadow 第 <span class="token number">5</span> 字段，多久内必须要修改密码</span>
<span class="line">	-w：后面接天数，shadow 第 <span class="token number">6</span> 字段，密码过期天的警告天数</span>
<span class="line">	-i：后面接天数，shadow 第 <span class="token number">7</span> 字段，密码失效天数，当密码过期后多久失效</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实战练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 用 root 给 mrcode2 设置密码</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd mrcode2</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">New password: 						<span class="token comment"># 这里我输入了 12345678，有一个警告</span></span>
<span class="line">BAD PASSWORD: The password fails the dictionary check - it is too simplistic/systematic</span>
<span class="line">Retype new password: 				<span class="token comment"># 这里还是输入 12345678 成功了</span></span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 root 账户下，虽然有提示，但是最后还是会给你过，可见 root 账户的威力有多大。那么使用一般账户来修改自己的密码</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2 ：使用 mrcode2 登录后，修改 mrcode2 自己的密码</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode2@study ~<span class="token punctuation">]</span>$ <span class="token function">passwd</span> </span>
<span class="line">Changing password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">Changing password <span class="token keyword">for</span> mrcode2.</span>
<span class="line"><span class="token punctuation">(</span>current<span class="token punctuation">)</span> UNIX password: </span>
<span class="line">New password: </span>
<span class="line"><span class="token comment"># 密码太简单，无法通过</span></span>
<span class="line">BAD PASSWORD: The password fails the dictionary check - it is based on a dictionary word</span>
<span class="line">New password: </span>
<span class="line"><span class="token comment"># 与旧密码类似，无法通过</span></span>
<span class="line">BAD PASSWORD: The password is too similar to the old one</span>
<span class="line">New password: </span>
<span class="line">BAD PASSWORD: The password fails the dictionary check - it does not contain enough DIFFERENT characters</span>
<span class="line"><span class="token comment"># 超过重试次数，直接结束了</span></span>
<span class="line">passwd: Have exhausted maximum number of retries <span class="token keyword">for</span> <span class="token function">service</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode2@study ~<span class="token punctuation">]</span>$ </span>
<span class="line"><span class="token punctuation">[</span>mrcode2@study ~<span class="token punctuation">]</span>$ <span class="token function">passwd</span> </span>
<span class="line">Changing password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">Changing password <span class="token keyword">for</span> mrcode2.</span>
<span class="line"><span class="token punctuation">(</span>current<span class="token punctuation">)</span> UNIX password: </span>
<span class="line"><span class="token comment"># 旧密码输入不正确，直接结束</span></span>
<span class="line">passwd: Authentication token manipulation error</span>
<span class="line"><span class="token punctuation">[</span>mrcode2@study ~<span class="token punctuation">]</span>$ </span>
<span class="line"><span class="token punctuation">[</span>mrcode2@study ~<span class="token punctuation">]</span>$ <span class="token function">passwd</span> </span>
<span class="line">Changing password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">Changing password <span class="token keyword">for</span> mrcode2.</span>
<span class="line"><span class="token punctuation">(</span>current<span class="token punctuation">)</span> UNIX password: </span>
<span class="line">New password: </span>
<span class="line">Retype new password: </span>
<span class="line"><span class="token comment"># 终于修改成功了，需要符合条件的密码，还不能是简单的重复的密码</span></span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>密码规范校验非常严格，新的 distribution 大多使用 PAM 模块来进行密码的校验，包括太短、密码与账户相同、密码为字典常见字符串等，都会被拒绝。</p>
<p>root 账户修改密码，不用输入旧密码，而一般用户则需要先输入旧密码。</p>
<p>PAM 模块的管理机制写在 <code v-pre>/etc/pam.d/passwd</code> 中，而该文件与密码有关的测试模块使用 <code v-pre>pam_cracklib.so</code>，该模块会校验密码相关的信息，并且取代 <code v-pre>/etc/login.defs</code>内的 <code v-pre>PASS_MIN_LEN</code> 的设置，对于 PAM 后续会再介绍。理论上你的密码最好符合以下要求：</p>
<ul>
<li>密码不能与账户相同</li>
<li>密码不要选用字典里面会出现的字符串</li>
<li>密码长度需要超过 8 个字符</li>
<li>密码不要使用个人信息，如身份证、手机号码、其他电话号码等</li>
<li>密码不要使用简单的关系，如 1+1=2 等</li>
<li>密码尽量使用大小写字符、数字、特殊字符组合等</li>
</ul>
<p>为了方便系统管理，新版 passwd 还加入了很多创意选项，个人认为最好用的大概是 <code v-pre>--stdin</code>了，如下面这样修改密码</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：使用 standard input 建立用户的密码</span></span>
<span class="line"><span class="token comment"># 这里使用 root 身份吧 mrcode2 的密码设置成了 abc543CC</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "abc543CC" | passwd --stdin mrcode2</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面指令会直接更新用户密码，好处是方便处理，缺点是这个密码会保留在指令中，若被攻击，人家可以在 <code v-pre>/root/.bash_history</code> 中找到该密码，所以该操作一般仅用在 shell script 的大量账户创建中。</p>
<p>注意：该选项并不存在所有的 distribution 版本中，请使用 <code v-pre>man passwd</code> 确认是否有该选项</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">范例 <span class="token number">4</span>：管理 mrcode2 的密码具有 <span class="token number">60</span> 天变更、密码过期 <span class="token number">10</span> 天后账户失效的设置</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -S mrcode2</span></span>
<span class="line">mrcode2 PS <span class="token number">2020</span>-02-24 <span class="token number">0</span> <span class="token number">99999</span> <span class="token number">7</span> <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>Password set, SHA512 crypt.<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 用户最近修改密码 2020-02-24 , 0 最小天数、99999 变更天数、7 警告天数，密码不会失效</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -x 60 -i 10 mrcode2</span></span>
<span class="line">Adjusting aging data <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">passwd: Success</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -S mrcode2</span></span>
<span class="line">mrcode2 PS <span class="token number">2020</span>-02-24 <span class="token number">0</span> <span class="token number">60</span> <span class="token number">7</span> <span class="token number">10</span> <span class="token punctuation">(</span>Password set, SHA512 crypt.<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么怎么让某个账户暂时无法登录主机呢？比如 mrcode2 这个账户老乱来，最简单的办法就是让他无法登录主机，可以让他的密码变成不合法的 （shadow 第 2 字段长度变更）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 5：让 mrocde2 的账户失效</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -l mrcode2 </span></span>
<span class="line">Locking password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">passwd: Success</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -S mrcode2</span></span>
<span class="line">mrcode2 LK <span class="token number">2020</span>-02-24 <span class="token number">0</span> <span class="token number">60</span> <span class="token number">7</span> <span class="token number">10</span> <span class="token punctuation">(</span>Password locked.<span class="token punctuation">)</span>		<span class="token comment"># 被锁住了</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep 'mrcode2' /etc/shadow</span></span>
<span class="line"><span class="token comment"># 查看第2字段，密码前面增加了 !!</span></span>
<span class="line">mrcode2:<span class="token operator">!</span><span class="token operator">!</span><span class="token variable">$6</span><span class="token variable">$UhalDiXq</span><span class="token variable">$q7lGzX</span>.sMx55zXJwmWKNghBrHjEAvuutRcUcqrhxWbjoWy0Z3R7tIoeIio2tuptBenG62JjjVIdfaRFIQwJKw.:18316:0:60:7:10::</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解锁账户，发现 !! 被去掉了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -u mrcode2</span></span>
<span class="line">Unlocking password <span class="token keyword">for</span> user mrcode2.</span>
<span class="line">passwd: Success</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep 'mrcode2' /etc/shadow</span></span>
<span class="line">mrcode2:<span class="token variable">$6</span><span class="token variable">$UhalDiXq</span><span class="token variable">$q7lGzX</span>.sMx55zXJwmWKNghBrHjEAvuutRcUcqrhxWbjoWy0Z3R7tIoeIio2tuptBenG62JjjVIdfaRFIQwJKw.:18316:0:60:7:10::</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="chage" tabindex="-1"><a class="header-anchor" href="#chage"><span>chage</span></a></h3>
<p>除了使用 <code v-pre>passwd -S</code> 之外，chage 可以使密码参数显示更详细</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">chage <span class="token punctuation">[</span>-ldEImMW<span class="token punctuation">]</span> 账户名</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-l: 列出该账户的详细密码参数</span>
<span class="line">	-d：后面接日期，修改 shadow 第 <span class="token number">3</span> 字段，最近一次修改密码的日期，格式为 YYYY-MM-DD</span>
<span class="line">	-E：后面接日期，修改 shadow 第 <span class="token number">8</span> 字段，账户失效日，格式 YYYY-MM-DD</span>
<span class="line">	-I：后面接天数，修改 shadow 第 <span class="token number">7</span> 字段，密码失效日期</span>
<span class="line">	-m：后面接天数，修改 shadow 第 <span class="token number">4</span> 字段，密码最短保留天数</span>
<span class="line">	-M：后面接天数，修改 shadow 第 <span class="token number">5</span> 字段，密码多久需要修改</span>
<span class="line">	-W：后面接天数，修改 shadow 第 <span class="token number">6</span> 字段，密码过期前警告天数</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：列出 mrcode2 的详细密码参数</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chage -l mrcode2 </span></span>
<span class="line">Last password change					<span class="token builtin class-name">:</span> Feb <span class="token number">24</span>, <span class="token number">2020</span></span>
<span class="line">Password expires					<span class="token builtin class-name">:</span> Apr <span class="token number">24</span>, <span class="token number">2020</span></span>
<span class="line">Password inactive					<span class="token builtin class-name">:</span> May 04, <span class="token number">2020</span></span>
<span class="line">Account expires						<span class="token builtin class-name">:</span> never</span>
<span class="line">Minimum number of days between password change		<span class="token builtin class-name">:</span> <span class="token number">0</span></span>
<span class="line">Maximum number of days between password change		<span class="token builtin class-name">:</span> <span class="token number">60</span></span>
<span class="line">Number of days of warning before password expires	<span class="token builtin class-name">:</span> <span class="token number">7</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用  passwd 看不到这么详细的配置，使用 chage 就可以了，更详细的使用方式可以  <code v-pre>man chage</code></p>
<p>chage 还可以实现让：使用者在第一次登陆时，强制他们一定要修改密码后才能够使用，可以使用如下方式来处理</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：创建一个名为 agetest 账户，该账户第一次登陆使用默认密码，但必须要修改密码后，使用新的密码才能够登陆系统使用 bash 环境</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd agetest</span></span>
<span class="line"><span class="token comment"># 修改账户和密码为同一个</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "agetest" | passwd --stdin agetest</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user agetest.</span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"><span class="token comment"># 修改最近修改密码时间为 0 ，这里</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chage -d 0 agetest</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chage -l agetest | head -n 3</span></span>
<span class="line">Last password change					<span class="token builtin class-name">:</span> password must be changed</span>
<span class="line">Password expires					<span class="token builtin class-name">:</span> password must be changed</span>
<span class="line">Password inactive					<span class="token builtin class-name">:</span> password must be changed</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep 'agetest' /etc/shadow</span></span>
<span class="line">agetest:<span class="token variable">$6</span><span class="token variable">$9MX2dbGl</span><span class="token variable">$hyI3sKNt5fgSmi1n8xE</span>/PXK6uiC9G7BeUMbluMil7Z9KVWKHO2aIdbCApLCWsLBPgqmiQAeUy48oPoq96Z/5z.:0:0:99999:7:::</span>
<span class="line"></span>
<span class="line"><span class="token comment"># </span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -S agetest </span></span>
<span class="line">agetest PS <span class="token number">1970</span>-01-01 <span class="token number">0</span> <span class="token number">99999</span> <span class="token number">7</span> <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>Password set, SHA512 crypt.<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 可以看到最近修改密码设置为 0 的话，通过 passwd 会看到是 1970-01-01 ，所以会有问题</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：尝试以 agetest 登陆</span></span>
<span class="line">WARNING<span class="token operator">!</span> The remote SSH server rejected X11 forwarding request.</span>
<span class="line">You are required to change your password immediately <span class="token punctuation">(</span>root enforced<span class="token punctuation">)</span></span>
<span class="line">Last login: Mon Feb <span class="token number">24</span> <span class="token number">11</span>:30:57 <span class="token number">2020</span></span>
<span class="line">WARNING: Your password has expired.</span>
<span class="line">You must change your password now and login again<span class="token operator">!</span></span>
<span class="line">更改用户 agetest 的密码 。</span>
<span class="line">为 agetest 更改 STRESS 密码。</span>
<span class="line">（当前）UNIX 密码：			<span class="token comment"># 第一次登陆需要强制修改密码</span></span>
<span class="line">新的 密码：</span>
<span class="line">重新输入新的 密码：</span>
<span class="line">passwd：所有的身份验证令牌已经成功更新。</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改完成之后，再看密码参数信息，就发现正常了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chage -l agetest</span></span>
<span class="line">Last password change					<span class="token builtin class-name">:</span> Feb <span class="token number">24</span>, <span class="token number">2020</span></span>
<span class="line">Password expires					<span class="token builtin class-name">:</span> never</span>
<span class="line">Password inactive					<span class="token builtin class-name">:</span> never</span>
<span class="line">Account expires						<span class="token builtin class-name">:</span> never</span>
<span class="line">Minimum number of days between password change		<span class="token builtin class-name">:</span> <span class="token number">0</span></span>
<span class="line">Maximum number of days between password change		<span class="token builtin class-name">:</span> <span class="token number">99999</span></span>
<span class="line">Number of days of warning before password expires	<span class="token builtin class-name">:</span> <span class="token number">7</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># passwd -S agetest </span></span>
<span class="line">agetest PS <span class="token number">2020</span>-02-24 <span class="token number">0</span> <span class="token number">99999</span> <span class="token number">7</span> <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>Password set, SHA512 crypt.<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="usermod" tabindex="-1"><a class="header-anchor" href="#usermod"><span>usermod</span></a></h3>
<p>账户创建好之后，还可以修改选项的，可以直接修改 <code v-pre>/etc/passwd 或 /etc/shadow</code> 文件，也可以使用该指令来修改</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">usermod</span> <span class="token punctuation">[</span>-cdefgGlsuLU<span class="token punctuation">]</span> username</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li><code v-pre>-c</code>：后面接账户说明， passwd 第 5 字段，账户说明</li>
<li><code v-pre>-d</code>： 后面接账户的家的目录，passwd 第 6 字段</li>
<li><code v-pre>-e</code>：后面接日期，格式为 YYYY-MM-DD，passwd 第 8 字段，失效日期</li>
<li><code v-pre>-f</code>：后面接天数，shadow 第 7 字段</li>
<li><code v-pre>-g</code>：后面接初始群组，passwd 第 4 字段，GID 字段</li>
<li><code v-pre>-G</code>：后面接次要群组，修改的是 /etc/group 内容</li>
<li><code v-pre>-a</code>：与 -G 合用，可 增加次要群组的支持，而非设置</li>
<li><code v-pre>-l</code>：后面接账户名称，也就是修改账户名，passwd 第 1 字段</li>
<li><code v-pre>-s</code>：后面接 Shell 的实际文件，例如 /bin/bash 或 /bin/csh 等</li>
<li><code v-pre>-u</code>：后面就 UID 数字，passwd 第 3 字段</li>
<li><code v-pre>-L</code>：暂时将用户的密码冻结，shadow 密码字段</li>
<li><code v-pre>-U</code>：解冻用户密码</li>
</ul>
<p>仔细对比，会发现 usermod 选项与 useradd 很类似，他们都是用来微调选项参数的。对于 usermod 的 <code v-pre>-L 和</code> -U` 参数也不是所有的 distribution 中都有的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：修改 mrcode2 的说明栏</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># usermod -c "mrcode test" mrcode2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep mrcode2 /etc/passwd</span></span>
<span class="line">mrcode2:x:1500:100:mrcode test:/home/mrcode2:/bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：修改 mrcode2 在 2020/02/25 失效</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># usermod -e "2020-02-25" mrcode2</span></span>
<span class="line"><span class="token comment"># 可以看到有过期日期，如果直接查看文件内容的话，之前说过了，文件里面存储的是天数，不容易直观看出来是哪一天</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chage -l mrcode2 | grep 'Account expires'</span></span>
<span class="line">Account expires						<span class="token builtin class-name">:</span> Feb <span class="token number">25</span>, <span class="token number">2020</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：当时创建 mrcode3 系统账户时，没有给家的目录，给它创建家的目录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep mrcode3 /etc/passwd</span></span>
<span class="line">mrcode3:x:988:982::/home/mrcode3:/bin/bash</span>
<span class="line"><span class="token comment"># 虽然有目录指向，但是该目录并不存在</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># ll -d /home/mrcode3</span></span>
<span class="line">ls: cannot access /home/mrcode3: No such <span class="token function">file</span> or directory</span>
<span class="line"></span>
<span class="line"><span class="token comment"># copy 参考目录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># cp -a /etc/skel/ /home/mrcode3</span></span>
<span class="line"><span class="token comment"># -R 连该目录下的所有文件都一起修改所属用户/群组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chown -R mrcode3:mrcode3 /home/mrcode3</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># ll -d /home/mrcode3/</span></span>
<span class="line">drwxr-xr-x. <span class="token number">3</span> mrcode3 mrcode3 <span class="token number">78</span> Jan <span class="token number">17</span> <span class="token number">14</span>:32 /home/mrcode3/</span>
<span class="line"><span class="token comment"># 这里不使用 -R，因为只要修改目录的权限</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chmod 700 /home/mrcode3</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># ll -a ~mrcode3</span></span>
<span class="line">total <span class="token number">12</span></span>
<span class="line">drwx------. <span class="token number">3</span> mrcode3 mrcode3  <span class="token number">78</span> Jan <span class="token number">17</span> <span class="token number">14</span>:32 <span class="token builtin class-name">.</span></span>
<span class="line">drwxr-xr-x. <span class="token number">7</span> root    root     <span class="token number">80</span> Feb <span class="token number">24</span> <span class="token number">13</span>:10 <span class="token punctuation">..</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode3 mrcode3  <span class="token number">18</span> Aug  <span class="token number">8</span>  <span class="token number">2019</span> .bash_logout</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode3 mrcode3 <span class="token number">193</span> Aug  <span class="token number">8</span>  <span class="token number">2019</span> .bash_profile</span>
<span class="line">-rw-r--r--. <span class="token number">1</span> mrcode3 mrcode3 <span class="token number">231</span> Aug  <span class="token number">8</span>  <span class="token number">2019</span> .bashrc</span>
<span class="line">drwxr-xr-x. <span class="token number">4</span> mrcode3 mrcode3  <span class="token number">39</span> Jan <span class="token number">17</span> <span class="token number">14</span>:30 .mozilla</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="userdel" tabindex="-1"><a class="header-anchor" href="#userdel"><span>userdel</span></a></h3>
<p>删除用户的相关数据，使用起来很简单了，用户数据有：</p>
<ul>
<li>用户账户、密码相关参数：<code v-pre>/etc/passwd 、/etc/shadow</code></li>
<li>使用者群组相关参数：<code v-pre>/etc/group、/etc/gshadow</code></li>
<li>用户个人文件数据：<code v-pre>/home/username、/var/spool/mail/username ...</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">userdel</span> <span class="token punctuation">[</span>-r<span class="token punctuation">]</span> username  </span>
<span class="line"></span>
<span class="line">-r：连同用户的家目录也一起删除</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 删除 mrcode2 用户，连家目录也一起删掉</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># userdel -r mrcode2</span></span>
<span class="line">userdel: user mrcode2 is currently used by process <span class="token number">4472</span>		</span>
<span class="line"><span class="token comment"># 上面提示有进程在使用该账户，所以没有删除成功</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep mrcode /etc/passwd</span></span>
<span class="line">mrcode:x:1000:1000:mrcode:/home/mrcode:/bin/bash</span>
<span class="line">mrcode1:x:1001:1001::/home/mrcode1:/bin/bash</span>
<span class="line">mrcode2:x:1500:100:mrcode test:/home/mrcode2:/bin/bash</span>
<span class="line">mrcode3:x:988:982::/home/mrcode3:/bin/bash</span>
<span class="line"><span class="token comment"># 退出登录 mrcode2 的中断，再次尝试删除成功。passwd 中也没有了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># userdel -r mrcode2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep mrcode /etc/passwd</span></span>
<span class="line">mrcode:x:1000:1000:mrcode:/home/mrcode:/bin/bash</span>
<span class="line">mrcode1:x:1001:1001::/home/mrcode1:/bin/bash</span>
<span class="line">mrcode3:x:988:982::/home/mrcode3:/bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是需要注意的是：如果想要删除该用户相关的所有文件等数据，在该指令下达之前，使用 <code v-pre>find / -user username</code> 找出整个系统内属于 username 的文件，再加以删除。这是因为当一个用户使用过一段时间之后，有他自己产生的数据等文件，比如他的邮件信箱或者是例行工作排程（crontab 后续第十五章讲解）</p>
<h2 id="用户功能" tabindex="-1"><a class="header-anchor" href="#用户功能"><span>用户功能</span></a></h2>
<p>useradd、usermod、userdel 指令都是系统管理员所能够使用的指令，一般用户除了 passwd 更改密码之外，还有以下几个常用的账户数据变更与查询的指令</p>
<h3 id="id" tabindex="-1"><a class="header-anchor" href="#id"><span>id</span></a></h3>
<p>该指令可以查询某人或自己的相关 UID、GID 等信息，参数很多，但是不需要额外记忆，全部列出来就行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 查询 root 自己的相关 ID 信息</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># id</span></span>
<span class="line"><span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token assign-left variable">groups</span><span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token assign-left variable">context</span><span class="token operator">=</span>unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023</span>
<span class="line"><span class="token comment"># context是 SELinux 的内容，暂时不要理会</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2： 查询 mrcode 1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># id mrcode1</span></span>
<span class="line"><span class="token assign-left variable">uid</span><span class="token operator">=</span><span class="token number">1001</span><span class="token punctuation">(</span>mrcode1<span class="token punctuation">)</span> <span class="token assign-left variable">gid</span><span class="token operator">=</span><span class="token number">1001</span><span class="token punctuation">(</span>mrcode1<span class="token punctuation">)</span> <span class="token assign-left variable">groups</span><span class="token operator">=</span><span class="token number">1001</span><span class="token punctuation">(</span>mrcode1<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 输入一个不存在的账户，得到 no such user 的信息，也可以用来判定该系统上是否有某个账户</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># id mrcode00</span></span>
<span class="line">id: mrcode00: no such user</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="finger" tabindex="-1"><a class="header-anchor" href="#finger"><span>finger</span></a></h3>
<p>中文字面意思是：手指或者指纹的意思，它可以查询很多用户相关的信息，其实大部分都在 /etc/passwd 文件里面的信息。由于该指令有点危险，所以新版本中默认不安装该软件；</p>
<p>由于无网络，这里还是使用 <RouteLink to="/tutorial-basis/07/03.html#%E6%8C%82%E8%BD%BD-cd-%E6%88%96-dvd-%E5%85%89%E7%9B%98">挂载光盘方式</RouteLink> 来安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 先确定是否有挂载光驱到 /mnt 目录下</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># df -hT /mnt/</span></span>
<span class="line">Filesystem                    Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/centos_study-root xfs    35G  <span class="token number">4</span>.4G   31G  <span class="token number">13</span>% /				<span class="token comment"># 这里为空，标识没有</span></span>
<span class="line"><span class="token comment"># 找到你的光驱所在位置，这里 Centos 7 在 /dev/sr0</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># blkid</span></span>
<span class="line">/dev/sr0: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"2019-09-11-18-50-31-00"</span> <span class="token assign-left variable">LABEL</span><span class="token operator">=</span><span class="token string">"CentOS 7 x86_64"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"iso9660"</span> <span class="token assign-left variable">PTTYPE</span><span class="token operator">=</span><span class="token string">"dos"</span> </span>
<span class="line">/dev/sda1: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"e9d54afb-2afe-42de-87fe-9f55d747fcd9"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> </span>
<span class="line">/dev/sda2: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"CNUXwS-J3Lh-0nDA-TssW-l1vT-90us-MHYnT1"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"LVM2_member"</span> </span>
<span class="line">/dev/mapper/centos_study-root: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"d7e09bb4-2f04-4ed4-b377-91a22fe85ce7"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> </span>
<span class="line">/dev/mapper/centos_study-swap: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"684eebc0-3f70-4fc1-9a5d-d683f6a07cd0"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"swap"</span> </span>
<span class="line"><span class="token comment"># 挂载光盘到 /mnt</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># mount /dev/sr0 /mnt/</span></span>
<span class="line">mount: /dev/sr0 is write-protected, mounting read-only</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># df -hT /mnt/</span></span>
<span class="line">Filesystem     Type     Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/sr0       iso9660  <span class="token number">4</span>.4G  <span class="token number">4</span>.4G     <span class="token number">0</span> <span class="token number">100</span>% /mnt		<span class="token comment"># 现在有了</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># rpm -ivh /mnt/Packages/fin</span></span>
<span class="line">findutils-4.5.11-6.el7.x86_64.rpm     finger-0.17-52.el7.x86_64.rpm         finger-server-0.17-52.el7.x86_64.rpm  </span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># rpm -ivh /mnt/Packages/finger-[0-9]*</span></span>
<span class="line">warning: /mnt/Packages/finger-0.17-52.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY</span>
<span class="line">Preparing<span class="token punctuation">..</span>.                          <span class="token comment">################################# [100%]</span></span>
<span class="line">Updating / installing<span class="token punctuation">..</span>.</span>
<span class="line">   <span class="token number">1</span>:finger-0.17-52.el7               <span class="token comment">################################# [100%]</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># ll /mnt/Packages/finger-[0-9]*</span></span>
<span class="line">-rw-rw-r--. <span class="token number">1</span> root root <span class="token number">26100</span> Aug <span class="token number">29</span>  <span class="token number">2014</span> /mnt/Packages/finger-0.17-52.el7.x86_64.rpm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装好之后，进行使用</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">finger <span class="token punctuation">[</span>-s<span class="token punctuation">]</span> username</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-s：仅列出用户的账户、全名、终端机代号与登录时间</span>
<span class="line">	-m：列出与后面接的账户相同者，而不是利用部分比对（包括全名部分）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：观察 mrcode1 的用户相关账户属性</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># finger mrcode1</span></span>
<span class="line">Login: mrcode1        			Name: </span>
<span class="line">Directory: /home/mrcode1            	Shell: /bin/bash</span>
<span class="line">Never logged in.</span>
<span class="line">No mail.</span>
<span class="line">No Plan.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于 finger 类似指纹功能，会将用户先关属性列出来，其实他列出的几乎都是 /etc/passwd 文件里面的信息。列出的信息如下含义：</p>
<ul>
<li>Login：使用者账户。 /etc/passwd 第 1 字段</li>
<li>Name：全名，/etc/passwd 第 5 字段，或称为批注信息</li>
<li>Directory：家目录</li>
<li>Shell： shell 文件</li>
<li>Never logged in.：figner 还会调查用户登录主机情况</li>
<li>No mail：调查 /var/spool/mail 中的信箱资料</li>
<li>No Plan：调查 <code v-pre>/~mrcode1/.plan</code> 文件，并将该文件取出来说明</li>
</ul>
<p>不过否能查询到 Mail 与 Plan 则与全新有关了，因为 Mail/Plan 都是与使用者自己的权限设置有关系。比如 root 能够查询到这些信息，但是不见得 mrcode3 能查询到 mrcode1 的这些信息。</p>
<p>此外，我们可以建立自己想要执行的预定计划，当然，最多是给自己看的，可以这样做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：利用 mrcode1 建立自己的计划文件</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ <span class="token builtin class-name">echo</span> <span class="token string">"I will study Linux during this year."</span> <span class="token operator">></span> ~/.plan</span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ finger mrcode1</span>
<span class="line">Login: mrcode1        			Name: </span>
<span class="line">Directory: /home/mrcode1            	Shell: /bin/bash</span>
<span class="line">On since 一 <span class="token number">2</span>月 <span class="token number">24</span> <span class="token number">13</span>:48 <span class="token punctuation">(</span>CST<span class="token punctuation">)</span> on pts/2 from <span class="token number">192.168</span>.4.170</span>
<span class="line">   <span class="token number">2</span> seconds idle</span>
<span class="line">No mail.</span>
<span class="line">Plan:</span>
<span class="line">I will study Linux during this year.			<span class="token comment"># 可以看到计划了</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 3：找出目前在系统上面登录的用户与登录时间</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ finger </span>
<span class="line">Login     Name       Tty      Idle  Login Time   Office     Office Phone   Host</span>
<span class="line">mrcode    mrcode     pts/0    <span class="token number">2</span>:24  Feb <span class="token number">21</span> <span class="token number">14</span>:51                           <span class="token punctuation">(</span><span class="token number">192.168</span>.4.170<span class="token punctuation">)</span></span>
<span class="line">mrcode    mrcode     pts/1       <span class="token number">2</span>  Feb <span class="token number">21</span> <span class="token number">16</span>:21                           <span class="token punctuation">(</span><span class="token number">192.168</span>.4.170<span class="token punctuation">)</span></span>
<span class="line">mrcode1              pts/2          Feb <span class="token number">24</span> <span class="token number">13</span>:48                           <span class="token punctuation">(</span><span class="token number">192.168</span>.4.170<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到 mrcode 登录了两个 tty 终端。还列出了其他的 Office     Office Phone，那么这两个可以通过 chfn 指令来配置</p>
<h3 id="chfn" tabindex="-1"><a class="header-anchor" href="#chfn"><span>chfn</span></a></h3>
<p>chfn 类似 change finger 的意思，方法如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">chfn <span class="token punctuation">[</span>-foph<span class="token punctuation">]</span> <span class="token punctuation">[</span>账户名<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-f：后面接完整的大名</span>
<span class="line">	-o：您办公室的房间号码</span>
<span class="line">	-p：办公室的电话号码</span>
<span class="line">	-h：家里的电话号码</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：mrcode 自己更改自己的相关信息</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ chfn</span>
<span class="line">Changing finger information <span class="token keyword">for</span> mrcode1.</span>
<span class="line">名称 <span class="token punctuation">[</span><span class="token punctuation">]</span>: Mrcode1 <span class="token builtin class-name">test</span></span>
<span class="line">办公 <span class="token punctuation">[</span><span class="token punctuation">]</span>: DIV^H <span class="token keyword">in</span> kSU	 <span class="token comment"># 这里输入了退格键，导致无效，下面重新输入的</span></span>
<span class="line">chfn: control characters are not allowed</span>
<span class="line">办公 <span class="token punctuation">[</span><span class="token punctuation">]</span>: 06-123456</span>
<span class="line">办公电话 <span class="token punctuation">[</span><span class="token punctuation">]</span>: 06-456789</span>
<span class="line">住宅电话 <span class="token punctuation">[</span><span class="token punctuation">]</span>: 06-789000</span>
<span class="line"></span>
<span class="line">密码：				<span class="token comment"># 这里需要输入自己的密码，用来确认身份</span></span>
<span class="line">Finger information changed.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 上面忘记修改终端机语言了，下面重来下</span></span>
<span class="line"><span class="token comment"># 会发现已经配置过的会有提示</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ chfn</span>
<span class="line">Changing finger information <span class="token keyword">for</span> mrcode1.</span>
<span class="line">Name <span class="token punctuation">[</span>Mrcode1 test<span class="token punctuation">]</span>: Mrcode1 <span class="token builtin class-name">test</span></span>
<span class="line">Office <span class="token punctuation">[</span>06-123456<span class="token punctuation">]</span>: 06-123456</span>
<span class="line">Office Phone <span class="token punctuation">[</span>06-456789<span class="token punctuation">]</span>: 06-456789</span>
<span class="line">Home Phone <span class="token punctuation">[</span>06-789000<span class="token punctuation">]</span>: 06-789000</span>
<span class="line"></span>
<span class="line">Password: </span>
<span class="line">Finger information changed.</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 最后查看信息，发现一家有了</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ finger mrcode1</span>
<span class="line">Login: mrcode1        			Name: Mrcode1 <span class="token builtin class-name">test</span></span>
<span class="line">Directory: /home/mrcode1            	Shell: /bin/bash</span>
<span class="line">Office: 06-123456, 06-456789		Home Phone: 06-789000</span>
<span class="line">On since Mon Feb <span class="token number">24</span> <span class="token number">13</span>:48 <span class="token punctuation">(</span>CST<span class="token punctuation">)</span> on pts/2 from <span class="token number">192.168</span>.4.170</span>
<span class="line">   <span class="token number">5</span> seconds idle</span>
<span class="line">No mail.</span>
<span class="line">Plan:</span>
<span class="line">I will study Linux during this year.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这些信息其实是存在 第 5 个字段中的，用逗号隔开了</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ <span class="token function">grep</span> mrcode1 /etc/passwd</span>
<span class="line">mrcode1:x:1001:1001:Mrcode1 test,06-123456,06-456789,06-789000:/home/mrcode1:/bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该指令一般来说不使用的，除非你有很多用户。他类似论坛里面个人资料属性维护一样的意思</p>
<h3 id="chsh" tabindex="-1"><a class="header-anchor" href="#chsh"><span>chsh</span></a></h3>
<p>change shell 的简写</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">chsh <span class="token punctuation">[</span>-ls<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-l：列出目前系统上可用的 shell。其实就是 /etc/shells 中的内容</span>
<span class="line">	-s：设置修改自己的 shell</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：用 mrcode1 身份列出系统上所有合法的 shell，并且制定 chs 为自己的 shell</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ chsh <span class="token parameter variable">-l</span></span>
<span class="line">/bin/sh</span>
<span class="line">/bin/bash</span>
<span class="line">/usr/bin/sh</span>
<span class="line">/usr/bin/bash</span>
<span class="line">/bin/tcsh</span>
<span class="line">/bin/csh</span>
<span class="line"><span class="token comment"># 我这里和书上对比少了/sbin/nologin /usr/sbin/nologin ，就是那个合法不可登录的 shell</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ chsh <span class="token parameter variable">-s</span> /bin/csh<span class="token punctuation">;</span> <span class="token function">grep</span> mrcode1 /etc/passwd</span>
<span class="line">Changing shell <span class="token keyword">for</span> mrcode1.</span>
<span class="line">Password: </span>
<span class="line">Shell changed.</span>
<span class="line">mrcode1:x:1001:1001:Mrcode1 test,06-123456,06-456789,06-789000:/home/mrcode1:/bin/csh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可用看到已经修改成 csh 了，记得再修改回来</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ chsh <span class="token parameter variable">-s</span> /bin/bash </span>
<span class="line">Changing shell <span class="token keyword">for</span> mrcode1.</span>
<span class="line">Password: </span>
<span class="line">Shell changed.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不论是 chfn 与 chsh 都是能够让一般用户修改 /etc/passwd 这个系统文件的，所以这两个指令文件的权限是什么？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ ll <span class="token variable"><span class="token variable">$(</span><span class="token function">which</span> chsh<span class="token variable">)</span></span></span>
<span class="line">-rws--x--x. <span class="token number">1</span> root root <span class="token number">23880</span> Aug  <span class="token number">9</span>  <span class="token number">2019</span> /usr/bin/chsh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>之前讲到过的 <RouteLink to="/tutorial-basis/06/04.html#%E6%96%87%E4%BB%B6%E7%89%B9%E6%AE%8A%E6%9D%83%E9%99%90-suid%E3%80%81sgid%E3%80%81sbit">SUID 权限</RouteLink>，S 出现在了文件拥有者的权限位置上。</p>
<h2 id="新增与移除群组" tabindex="-1"><a class="header-anchor" href="#新增与移除群组"><span>新增与移除群组</span></a></h2>
<p>基本能够群组的内容都与这两个文件有关：<code v-pre>/etc/group</code>、<code v-pre>/etc/gshadow</code> ，比较简单，对上面两个文件的新增、修改与移除，如果还加上有效群组的概念，那么 newgrp 与 gpasswd 则需要了解</p>
<h3 id="groupadd" tabindex="-1"><a class="header-anchor" href="#groupadd"><span>groupadd</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">group <span class="token function">add</span> <span class="token punctuation">[</span>-g gid<span class="token punctuation">]</span> <span class="token punctuation">[</span>-r<span class="token punctuation">]</span> 组名</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-g：后面接某个特定的GID，用来指定 GID</span>
<span class="line">	-r：建立系统群组。与 /etc/login.defs 内的 GID_MIN 有关</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：新建一个群组，名称为 group1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupadd group1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep group1 /etc/group  /etc/gshadow</span></span>
<span class="line">/etc/group:group1:x:1502:</span>
<span class="line">/etc/gshadow:group1:<span class="token operator">!</span>::</span>
<span class="line"><span class="token comment"># 一般组的 GID 默认是从 1000 以上的，这里出现了 1502，是 /etc/group 中最大 GID+1 决定的</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="groupmod" tabindex="-1"><a class="header-anchor" href="#groupmod"><span>groupmod</span></a></h3>
<p>与 groupadd 类似，修改 group 相关参数</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">groupmod</span> <span class="token punctuation">[</span>-g gid<span class="token punctuation">]</span> <span class="token punctuation">[</span>-n group_name<span class="token punctuation">]</span> 群组名</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-g：修改现有的 GID 数字</span>
<span class="line">	-n：修改现有的组名</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：将上个范例创建的 group1 名称修改为 mygroup s,GID 为 201</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupmod -g 201 -n mygroup group1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep group1 /etc/group  /etc/gshadow; grep mygroup /etc/group /etc/gshadow</span></span>
<span class="line">/etc/group:mygroup:x:201:</span>
<span class="line">/etc/gshadow:mygroup:<span class="token operator">!</span>::</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>温馨提示：不要随意修改 GID，容易造成系统资源的错乱</p>
<h3 id="groupdel" tabindex="-1"><a class="header-anchor" href="#groupdel"><span>groupdel</span></a></h3>
<p>删除群组</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">groupdel</span> <span class="token punctuation">[</span>groupname<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 将刚刚的 mygroup 删除</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupdel mygroup </span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：删除 mrcode1 这个群组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupdel mrcode1</span></span>
<span class="line">groupdel: cannot remove the primary group of user <span class="token string">'mrcode1'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会发现，mrcode1 群组无法删除，原因就是有用户在使用该群组</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep mrcode1 /etc/group</span></span>
<span class="line">mrcode1:x:1001:</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep 1001 /etc/passwd</span></span>
<span class="line">mrcode1:x:1001:1001:Mrcode1 test,06-123456,06-456789,06-789000:/home/mrcode1:/bin/bash</span>
<span class="line"><span class="token comment"># 可以看到 mrcode1 在的初始群组就是该群组，因此无法删除，否则会导致 mrcode1 登录系统会找不到 GID,造成困扰</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么如果非要删除呢？只能群人该组没有人使用的时候才可以删除，你可以这样做</p>
<ul>
<li>修改 mrcode1 的 GID</li>
<li>删除 mrcode1 的使用者</li>
</ul>
<p>上述方法实际上还是在删除规则中的方法。没有强制删除一说，同样会导致引用该组的文件，查询不到相关组的情况</p>
<h3 id="gpasswd-群组管理员功能" tabindex="-1"><a class="header-anchor" href="#gpasswd-群组管理员功能"><span>gpasswd 群组管理员功能</span></a></h3>
<p>如果系统管理员太忙了，就可以创建群组管理员来管理哪些账户可以加入/移除该群组</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 关于系统管理员 root 做的操作</span></span>
<span class="line">gpasswd groupname</span>
<span class="line">gpasswd <span class="token punctuation">[</span>-A user1,<span class="token punctuation">..</span>.<span class="token punctuation">]</span><span class="token punctuation">[</span>-M user3,<span class="token punctuation">..</span>.<span class="token punctuation">]</span> groupname</span>
<span class="line">gpasswd <span class="token punctuation">[</span>-rR<span class="token punctuation">]</span> groupname</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	若没有任何参数时，标识给予 groupname 一个密码 （/etc/gshadow）</span>
<span class="line">	-A：将 groupname 的主控制权交由后面的使用者管理，也就是该组的管理员</span>
<span class="line">	-M：将某些账户加入这个群组中</span>
<span class="line">	-r：将 groupname 的密码移除</span>
<span class="line">	-R：让 groupname 的密码栏失效</span>
<span class="line">	</span>
<span class="line"><span class="token comment"># 关于群组管理员 Group administrator 做的操作</span></span>
<span class="line">gpasswd <span class="token punctuation">[</span>-ad<span class="token punctuation">]</span> user groupname</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-a：将某位使用者加入到该组</span>
<span class="line">	-d：将某位使用者移除该组</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：建立一个新群组，名称为 testgroup 且群组交由 mrcode1 管理</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupadd testgroup		# 创建群组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># gpasswd testgroup		# 设置一个密码</span></span>
<span class="line">Changing the password <span class="token keyword">for</span> group testgroup</span>
<span class="line">New Password: </span>
<span class="line">Re-enter new password: </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加 mrcode1 为管理员</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># gpasswd -A mrcode1 testgroup</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep testgroup /etc/group /etc/gshadow</span></span>
<span class="line">/etc/group:testgroup:x:1502:</span>
<span class="line">/etc/gshadow:testgroup:<span class="token variable">$6</span><span class="token variable">$7mtnL</span>/qNA97Cyxx<span class="token variable">$xGkPMKtlRucwCBFpsfYGoBM4BLQvYmoTYOvwvBzOMpJyFz1YTBTV7nZvGDvOyG8jhtQ0WGDdl1xhgq959xJ4s</span>/:mrcode1:</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 2：以 mrcode1 登录系统，并且让他加入 mrcode1 mrcode3 称为 testgroup 的成员</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ gpasswd <span class="token parameter variable">-a</span> mrcode1  testgroup</span>
<span class="line">Adding user mrcode1 to group testgroup</span>
<span class="line"><span class="token punctuation">[</span>mrcode1@study ~<span class="token punctuation">]</span>$ gpasswd <span class="token parameter variable">-a</span> mrcode3  testgroup</span>
<span class="line">Adding user mrcode3 to group testgroup</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># grep testgroup /etc/group /etc/gshadow</span></span>
<span class="line">/etc/group:testgroup:x:1502:mrcode1,mrcode3</span>
<span class="line">/etc/gshadow:testgroup:<span class="token variable">$6</span><span class="token variable">$7mtnL</span>/qNA97Cyxx<span class="token variable">$xGkPMKtlRucwCBFpsfYGoBM4BLQvYmoTYOvwvBzOMpJyFz1YTBTV7nZvGDvOyG8jhtQ0WGDdl1xhgq959xJ4s</span>/:mrcode1:mrcode1,mrcode3</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="账户管理实例" tabindex="-1"><a class="header-anchor" href="#账户管理实例"><span>账户管理实例</span></a></h2>
<p>账户管理需要考虑使用场景，比如让一台主机上的多个账户协同工作：学校的专题生需要分组，同一组的同学间必须能够互相修改对方的数据文件，同时这些同学又需要保留自己的私密数据，因此直接公开家目录是不合适的。</p>
<p>下面提供几个例子来思考与学习</p>
<p><strong>任务 1</strong>：单纯的完成任务，假设需要的账户数据如下，该如何操作？</p>
<table>
<thead>
<tr>
<th style="text-align:left">账户名称</th>
<th>账户全名</th>
<th>次要群组</th>
<th>是否可登陆主机</th>
<th>密码</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">myuser1</td>
<td>1st user</td>
<td>mygroup1</td>
<td>可以</td>
<td>password</td>
</tr>
<tr>
<td style="text-align:left">myuser2</td>
<td>2st user</td>
<td>mygroup2</td>
<td>可以</td>
<td>password</td>
</tr>
<tr>
<td style="text-align:left">myuser3</td>
<td>3st user</td>
<td>无</td>
<td>不可以</td>
<td>password</td>
</tr>
</tbody>
</table>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 先处理账户相关属性</span></span>
<span class="line"><span class="token comment"># 由于账户由次要群组，不见得存在，所以要手动创建</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupadd mygroup1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd -G mygroup1 -c "1st user" myuser1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd -G mygroup1 -c "2st user" myuser2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd -c "3st user" -s /sbin/nologin  myuser3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 处理密码</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "password" | passwd --stdin myuser1</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user myuser1.</span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "password" | passwd --stdin myuser2</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user myuser2.</span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "password" | passwd --stdin myuser3</span></span>
<span class="line">Changing password <span class="token keyword">for</span> user myuser3.</span>
<span class="line">passwd: all authentication tokens updated successfully.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>任务 2</strong>：使用者 pro1、pro2、pro3 是同一个项目计划的开发人员，想要这三个用户在同一个目录下工作，但这三个用户还是拥有自己的家目录与基本的私有群组。假设该项目计划在 /srv/projecta 目录下开发，如何进行</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1.创建这三个用户</span></span>
<span class="line"><span class="token comment"># 2.把他们的次要群组添加到 projecta 群组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># groupadd projecta</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd -G projecta -c "projecta user"  pro1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd -G projecta -c "projecta user"  pro2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># useradd -G projecta -c "projecta user"  pro3</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "password" | passwd --stdin pro1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "password" | passwd --stdin pro2</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># echo "password" | passwd --stdin pro3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建 /srv/projecta 目录，并且属于 projecta 群组</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># mkdir /srv/projecta</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># ll -d /srv/projecta; chgrp projecta /srv/projecta/; ll -d /srv/projecta</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root <span class="token number">6</span> Feb <span class="token number">24</span> <span class="token number">15</span>:04 /srv/projecta</span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root projecta <span class="token number">6</span> Feb <span class="token number">24</span> <span class="token number">15</span>:04 /srv/projecta		<span class="token comment"># 已经更改为 projecta 群组了</span></span>
<span class="line"><span class="token comment"># 由于只给这 3 个人使用，所以该目录权限需要设置 SGID （这里不清楚的到第 6 章看 SGID 是含义）</span></span>
<span class="line"><span class="token comment"># 2 SGID，770 其他人不可访问，拥有者和群组可访问修改和执行</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># chmod 2770 /srv/projecta/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study mrcode<span class="token punctuation">]</span><span class="token comment"># ll -d /srv/projecta</span></span>
<span class="line">drwxrws---. <span class="token number">2</span> root projecta <span class="token number">6</span> Feb <span class="token number">24</span> <span class="token number">15</span>:04 /srv/projecta</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是接下来有一个困扰的问题发生了，假如 任务1 的 myuser1 是 projecta 项目的助理，他需要这个项目的内容，但是 <em>他不可以修改</em> 该目录类的任何数据</p>
<ul>
<li>方案 1：将他加入 projecta 群组，此时他拥有所有权限，不符合要求</li>
<li>方案 2：将文件目录权限修改为 2775；非群组人员拥有读和执行的权限，这个也不符合要求</li>
</ul>
<p>此时发现，无能为力了，但是可由借助外部身份认证系统，针对某个人设置专属的权限</p>
<h2 id="使用外部身份认证系统" tabindex="-1"><a class="header-anchor" href="#使用外部身份认证系统"><span>使用外部身份认证系统</span></a></h2>
<p>在谈 ACL 之前，先来谈一个概念性的操作，因为目前没有服务器可供练习</p>
<p>有时候，除了本机的账户之外，可能还会使用到其他外部的身份验证服务器所提供的验证身份的功能，如 windows 下有个 Active Directory （AD）的身份验证系统，还有 Linux 为了提供不同主机使用同一组账户密码，也会使用到 LDAP、NIS 等服务器提供的身份验证等</p>
<p>如果 Linux 主机要使用到上面提供的这些外部身份验证系统时，可能要额外设置，为了简化用户的操作流程，CentOS 提供了一个 authconfig-tui 的指令给我们参考，该指令的执行结果如下：</p>
<p><img src="@source/tutorial-basis/13/assets/image-20200224152159050.png" alt="image-20200224152159050"></p>
<p>在画面中使用 tab 按钮切换选项（因为这里没有适用的服务器可以测试，后续谈到服务器章节时可以使用这种方式），不过上图大概支持 MD5 这个早期的密码格式了。此外，不要随便将已经启用的项目（也就是被 * 号标识的项目）取消掉，可能会导致某些账户失效</p>
</div></template>


