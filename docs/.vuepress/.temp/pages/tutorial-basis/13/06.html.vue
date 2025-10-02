<template><div><h1 id="linux-主机上的用户信息传递" tabindex="-1"><a class="header-anchor" href="#linux-主机上的用户信息传递"><span>Linux 主机上的用户信息传递</span></a></h1>
<p>如何针对系统上的用户进行查询？如果在 Linux 上操作时，有其他用户也登录主机，如何与它谈话？想知道某个账户的相关信息，如何查阅？</p>
<h2 id="查询使用者-w、who、last、lastlog" tabindex="-1"><a class="header-anchor" href="#查询使用者-w、who、last、lastlog"><span>查询使用者：w、who、last、lastlog</span></a></h2>
<p>之前提到过的 id、finger 等指令可以查询一个用户的相关信息。而 last 可以知道使用者合适登录的系统，前面第 10 章节 bash 中讲解过的</p>
<p>可以通过 w 或 who 来查询当前已登录系统的用户，也就是相当于在线用户列表</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># w</span></span>
<span class="line"><span class="token comment"># 当前时间、开机(up)多久、几个用户在线</span></span>
<span class="line"> <span class="token number">22</span>:20:50 up  <span class="token number">1</span>:37,  <span class="token number">2</span> users,  load average: <span class="token number">0.18</span>, <span class="token number">0.14</span>, <span class="token number">0.17</span></span>
<span class="line"><span class="token comment"># 一个表格说明，每一行表示一个使用者</span></span>
<span class="line"><span class="token environment constant">USER</span>     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT</span>
<span class="line">mrcode   pts/0    <span class="token number">192.168</span>.0.105    <span class="token number">21</span>:11    <span class="token number">2</span>.00s  <span class="token number">0</span>.19s  <span class="token number">3</span>.27s sshd: mrcode <span class="token punctuation">[</span>priv<span class="token punctuation">]</span></span>
<span class="line">mrcode   pts/1    <span class="token number">192.168</span>.0.105    <span class="token number">21</span>:11    <span class="token number">1</span>:09m  <span class="token number">8</span>.52s  <span class="token number">8</span>.50s <span class="token function">top</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># who</span></span>
<span class="line">mrcode   pts/0        <span class="token number">2020</span>-02-25 <span class="token number">21</span>:11 <span class="token punctuation">(</span><span class="token number">192.168</span>.0.105<span class="token punctuation">)</span></span>
<span class="line">mrcode   pts/1        <span class="token number">2020</span>-02-25 <span class="token number">21</span>:11 <span class="token punctuation">(</span><span class="token number">192.168</span>.0.105<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过 lastlog 获得每个账户的最近登录时间，lastlog 会读取 <code v-pre>/var/log/lastlog</code> 文件</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lastlog</span></span>
<span class="line"><span class="token comment"># 用户名           端口     来自             最后登陆时间</span></span>
<span class="line">Username         Port     From             Latest</span>
<span class="line">root             pts/0                     二 <span class="token number">2</span>月 <span class="token number">25</span> <span class="token number">21</span>:23:43 +0800 <span class="token number">2020</span></span>
<span class="line">bin                                        **从未登录过**</span>
<span class="line">daemon                                     **从未登录过**</span>
<span class="line">adm                                        **从未登录过**</span>
<span class="line">lp                                         **从未登录过**</span>
<span class="line">mrcode           pts/1    <span class="token number">192.168</span>.0.105    二 <span class="token number">2</span>月 <span class="token number">25</span> <span class="token number">21</span>:11:00 +0800 <span class="token number">2020</span></span>
<span class="line">mrcode1          pts/0                     二 <span class="token number">2</span>月 <span class="token number">25</span> <span class="token number">22</span>:05:37 +0800 <span class="token number">2020</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用者谈话-write、mesg、wall" tabindex="-1"><a class="header-anchor" href="#使用者谈话-write、mesg、wall"><span>使用者谈话：write、mesg、wall</span></a></h2>
<h3 id="write-对话" tabindex="-1"><a class="header-anchor" href="#write-对话"><span>write 对话</span></a></h3>
<p>与系统上在线用户进行谈话，通过 write 将信息传给接收者</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">write</span> 使用者账户 <span class="token punctuation">[</span>用户所在终端接口<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># who</span></span>
<span class="line">mrcode   pts/0        <span class="token number">2020</span>-02-25 <span class="token number">22</span>:28 <span class="token punctuation">(</span><span class="token number">192.168</span>.0.105<span class="token punctuation">)</span></span>
<span class="line">mrcode   pts/1        <span class="token number">2020</span>-02-25 <span class="token number">22</span>:28 <span class="token punctuation">(</span><span class="token number">192.168</span>.0.105<span class="token punctuation">)</span></span>
<span class="line">root     pts/4        <span class="token number">2020</span>-02-25 <span class="token number">22</span>:28 <span class="token punctuation">(</span><span class="token number">192.168</span>.0.105<span class="token punctuation">)</span></span>
<span class="line">root     pts/5        <span class="token number">2020</span>-02-25 <span class="token number">22</span>:28 <span class="token punctuation">(</span><span class="token number">192.168</span>.0.105<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 笔者使用的是 ssh 软件链接的。类似 xshell 软件，所以可能显示的不是 tty 接口把</span></span>
<span class="line"><span class="token comment"># 开启了两个链接，并且使用 su 切换的账户，是通过这个 who 看不出来的</span></span>
<span class="line"><span class="token comment"># 只会显示最初登录系统的账户信息</span></span>
<span class="line"><span class="token comment"># 笔者这里开启了两个窗口，一个登录 mrcode 账户，一个登录 root 账户</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># write mrcode pts/0</span></span>
<span class="line">Hello,there:</span>
<span class="line">Please dont<span class="token string">'t do anything wrong...</span>
<span class="line"># 在 root 窗口上，对 mrcode pts/0 的终端接口写信息</span>
<span class="line"># 上面两行是 root 传递的文字信息</span>
<span class="line"># 要结束传递的话，需要通过组合键 ctrl + d 结束</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"># 在 mrcode 这边就会看到传递过来的信息了</span>
<span class="line">[mrcode@study ~]$</span>
<span class="line">Message from root@study.centos.mrcode on pts/2 at 22:33 ...</span>
<span class="line">Hello,there:</span>
<span class="line">Please dont'</span>t <span class="token keyword">do</span> anything wrong<span class="token punctuation">..</span>.</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">这两个交互式这样的，当 root 敲入 <span class="token function">write</span> mrcode pts/0 指令时，mrcode 这边就相当于进入了一个聊天窗口，输入一行按下回车键，信息就会显示到对方那边去。所以他们两个就可以谈话了</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mesg-启用或关闭对话功能" tabindex="-1"><a class="header-anchor" href="#mesg-启用或关闭对话功能"><span>mesg 启用或关闭对话功能</span></a></h3>
<p>因为这种方式是及时聊天，如果 mrcode 此时正在查询资料，那么就会打断他原本的工作，如果 mrode 不想接受任何人的信息，可以下达该指令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ mesg n	<span class="token comment"># 关闭信息</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ mesg</span>
<span class="line">is n</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过该指令对 root 传来的信息是无效的，那么我们关闭 root 的，使用 mrcode 对 root 发送</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 当然要先打开 mesg 的功能，才能对别人发送信息</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ mesg y	<span class="token comment"># 打开</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ <span class="token function">write</span> root pts/2</span>
<span class="line">write: root has messages disabled on pts/2</span>
<span class="line"><span class="token comment"># 发现无法对 root 发送信息</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="wall-广播信息" tabindex="-1"><a class="header-anchor" href="#wall-广播信息"><span>wall 广播信息</span></a></h3>
<p>还可以通过 wall 对所有在线用户广播信息</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ wall <span class="token string">"I will shutdown my linux server..."</span></span>
<span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$</span>
<span class="line">Broadcast message from mrcode@study.centos.mrcode <span class="token punctuation">(</span>pts/0<span class="token punctuation">)</span> <span class="token punctuation">(</span>Tue Feb <span class="token number">25</span> <span class="token number">22</span>:45:41 <span class="token number">2020</span><span class="token punctuation">)</span>:</span>
<span class="line"></span>
<span class="line">I will <span class="token function">shutdown</span> my linux server<span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 所有在线用户都能收到，包括 root，当然前提是对方 mesg y 打开时</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用者信箱-mail" tabindex="-1"><a class="header-anchor" href="#使用者信箱-mail"><span>使用者信箱：mail</span></a></h2>
<p>wall、write 需要用户在线才能够使用交谈，可以使用 mail 寄信给用户，每个用户都具有一个 mailbox，可以寄、收 mailbox 内的信件。一般来说 mailbox 会放置在 <code v-pre>/var/spool/mail</code> 中，一个账号一个 mailbox 文件。比如 mrcode1 就具有 <code v-pre>/var/spool/mail/mrcode1</code> 这个 mailbox</p>
<h3 id="寄信" tabindex="-1"><a class="header-anchor" href="#寄信"><span>寄信</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">mail <span class="token parameter variable">-s</span> <span class="token string">"邮件标题"</span> username@localhost</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># root 用户给 mrcode 寄信</span></span>
<span class="line"><span class="token comment"># 指令下达之后会进入写做模式，不过该模式下无法使用退格键，只能想好再写</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mail -s "nice to meet you" mrcode</span></span>
<span class="line">Hello,D.m tsai</span>
<span class="line">Nice to meet you <span class="token keyword">in</span> the network.</span>
<span class="line">You are so nice. bybye<span class="token operator">!</span></span>
<span class="line"><span class="token builtin class-name">.</span>					<span class="token comment"># 最后一行输入小数点，再次回车会完成寄信操作</span></span>
<span class="line">EOT		</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment">#</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会发现 mail 中的编辑器不好用，所以可以使用流来完成内容的导入</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mail -s "nice to meet you" mrcode  &lt; filename</span></span>
<span class="line"><span class="token comment"># 先把信息写在文件中，然后使用 &lt; 传输</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 ：将你的家目录下的环境变量文件 ~/.bashrc 寄给自己</span></span>
<span class="line">mail <span class="token parameter variable">-s</span> <span class="token string">"bashrc file content"</span> mrcode <span class="token operator">&lt;</span> ~/.bashrc</span>
<span class="line"><span class="token comment"># 范例 ：通过管线命令将 `ls -al ~` 内容传给 root 自己</span></span>
<span class="line"><span class="token function">ls</span> <span class="token parameter variable">-al</span> ~ <span class="token operator">|</span> mail <span class="token parameter variable">-s</span> <span class="token string">"myfile"</span> root</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="收信" tabindex="-1"><a class="header-anchor" href="#收信"><span>收信</span></a></h2>
<p>收信也是使用 mail 指令，如上面寄给了 mrcode</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ mail</span>
<span class="line">Heirloom Mail version <span class="token number">12.5</span> <span class="token number">7</span>/5/10.  Type ? <span class="token keyword">for</span> help.</span>
<span class="line"><span class="token string">"/var/spool/mail/mrcode"</span><span class="token builtin class-name">:</span> <span class="token number">1</span> message <span class="token number">1</span> new</span>
<span class="line"><span class="token operator">></span>N  <span class="token number">1</span> root                  Tue Feb <span class="token number">25</span> <span class="token number">22</span>:52  <span class="token number">19</span>/700   <span class="token string">"nice to meet you"</span></span>
<span class="line"><span class="token operator">&amp;</span> 		<span class="token comment"># 这里可以输入很多指令，可以通过输入 ？ 查询</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># > ：是表示目前处理的信件是哪一封</span></span>
<span class="line"><span class="token comment"># N ：表示该信件还未读过</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 尝试输入 ? 会出现以下的提示</span></span>
<span class="line"><span class="token operator">&amp;</span> ?</span>
<span class="line">               mail commands</span>
<span class="line"><span class="token builtin class-name">type</span> <span class="token operator">&lt;</span>message list<span class="token operator">></span>             <span class="token builtin class-name">type</span> messages</span>
<span class="line">next                            goto and <span class="token builtin class-name">type</span> next message</span>
<span class="line">from <span class="token operator">&lt;</span>message list<span class="token operator">></span>             give <span class="token function">head</span> lines of messages</span>
<span class="line">headers                         print out active message headers</span>
<span class="line">delete <span class="token operator">&lt;</span>message list<span class="token operator">></span>           delete messages</span>
<span class="line">undelete <span class="token operator">&lt;</span>message list<span class="token operator">></span>         undelete messages</span>
<span class="line">save <span class="token operator">&lt;</span>message list<span class="token operator">></span> folder      append messages to folder and mark as saved</span>
<span class="line">copy <span class="token operator">&lt;</span>message list<span class="token operator">></span> folder      append messages to folder without marking them</span>
<span class="line"><span class="token function">write</span> <span class="token operator">&lt;</span>message list<span class="token operator">></span> <span class="token function">file</span>       append message texts to file, save attachments</span>
<span class="line">preserve <span class="token operator">&lt;</span>message list<span class="token operator">></span>         keep incoming messages <span class="token keyword">in</span> mailbox even <span class="token keyword">if</span> saved</span>
<span class="line">Reply <span class="token operator">&lt;</span>message list<span class="token operator">></span>            reply to message senders</span>
<span class="line">reply <span class="token operator">&lt;</span>message list<span class="token operator">></span>            reply to message senders and all recipients</span>
<span class="line">mail addresses                  mail to specific recipients</span>
<span class="line"><span class="token function">file</span> folder                     change to another folder</span>
<span class="line">quit                            quit and apply changes to folder</span>
<span class="line">xit                             quit and discard changes made to folder</span>
<span class="line"><span class="token operator">!</span>                               shell escape</span>
<span class="line"><span class="token builtin class-name">cd</span> <span class="token operator">&lt;</span>directory<span class="token operator">></span>                  chdir to directory or home <span class="token keyword">if</span> none given</span>
<span class="line">list                            list names of all available commands</span>
<span class="line"></span>
<span class="line">A <span class="token operator">&lt;</span>message list<span class="token operator">></span> consists of integers, ranges of same, or other criteria</span>
<span class="line">separated by spaces.  If omitted, mail uses the last message typed.</span>
<span class="line"><span class="token operator">&amp;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面信息中的 「message list」是表示每封邮件左边那个数据序号</p>
<table>
<thead>
<tr>
<th>指令</th>
<th>含义</th>
</tr>
</thead>
<tbody>
<tr>
<td>h</td>
<td>列出信件比奥拓；如查询 40 封左右的信件，则输入 <code v-pre>h 40</code></td>
</tr>
<tr>
<td>d</td>
<td>删除后续接的信件号码，删除单封是 <code v-pre>d10</code>，范围删除是 <code v-pre>d10-20</code>，该动作生效需要配合 q 指令</td>
</tr>
<tr>
<td>s</td>
<td>将信件存储成文件。比如将第 5 封的内容存储到文件 <code v-pre>~/mail.file</code> 可以使用 <code v-pre>s 5 ~/mail.file</code></td>
</tr>
<tr>
<td>x</td>
<td>只离开，不生效；或者输入 exit 也可以；比如刚刚用 h 删除了信件，使用 x 离开，就会撤销删除</td>
</tr>
<tr>
<td>q</td>
<td>生效并离开；尤其是删除</td>
</tr>
</tbody>
</table>
<p>对于 h 操作来说，只有 5 封邮件的时候，使用 h 6 会报错，使用 h 2，同样会显示所有的，不知道是咋回事</p>
</div></template>


