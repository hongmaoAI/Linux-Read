<template><div><h1 id="本章练习" tabindex="-1"><a class="header-anchor" href="#本章练习"><span>本章练习</span></a></h1>
<h2 id="情景模拟题-1" tabindex="-1"><a class="header-anchor" href="#情景模拟题-1"><span>情景模拟题 1</span></a></h2>
<p>将本服务的账户分开管理，</p>
<ul>
<li>分为单纯邮件使用者：将该账户加入名为 mail 的初始群组，且此账户不可使用 bash 等 shell 登陆系统。</li>
<li>可登陆系统账户：将该账户加入 youcan 的次要群组</li>
</ul>
<p>练习期望：</p>
<ul>
<li>目标：了解 <code v-pre>/sib/nologin</code> 的用途</li>
<li>前提：可自行观察使用者是否已经建立等问题</li>
<li>需求：需了解 useradd、groupadd 等指令的用法</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 检查两个群组是否存在，不存在则建立</span></span>
<span class="line"><span class="token function">grep</span> mail /etc/group</span>
<span class="line"><span class="token function">grep</span> youcan /etc/group</span>
<span class="line"><span class="token function">groupadd</span> youcan</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建邮件账户，可以准备脚本来处理</span></span>
<span class="line"><span class="token function">vim</span> popuser.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">username</span> <span class="token keyword">in</span> pop1 pop2 pop3</span>
<span class="line"><span class="token keyword">do</span></span>
<span class="line">	<span class="token comment"># -g 初始群组； -s 指定 bash； -M 不要创建家目录</span></span>
<span class="line">	<span class="token function">useradd</span> <span class="token parameter variable">-g</span> mail <span class="token parameter variable">-s</span> /sbin/nologin <span class="token parameter variable">-M</span> <span class="token variable">$username</span></span>
<span class="line">	<span class="token builtin class-name">echo</span> <span class="token variable">$username</span> <span class="token operator">|</span> <span class="token function">passwd</span> <span class="token parameter variable">--stdin</span> <span class="token variable">$username</span>		<span class="token comment"># 将密码设置为账户相同</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token function">sh</span> popuser.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 建立一般账户，同样适用脚本创建</span></span>
<span class="line"><span class="token function">vim</span> loginuser.sh</span>
<span class="line"><span class="token comment">#!/bin/bash</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">username</span> <span class="token keyword">in</span> pop1 pop2 pop3</span>
<span class="line"><span class="token keyword">do</span></span>
<span class="line">	<span class="token comment"># -g 初始群组； -s 指定 bash； -M 不要创建家目录</span></span>
<span class="line">	<span class="token function">useradd</span> <span class="token parameter variable">-G</span> youcan <span class="token parameter variable">-s</span> /bin/login <span class="token variable">$username</span></span>
<span class="line">	<span class="token builtin class-name">echo</span> <span class="token variable">$username</span> <span class="token operator">|</span> <span class="token function">passwd</span> <span class="token parameter variable">--stdin</span> <span class="token variable">$username</span>		<span class="token comment"># 将密码设置为账户相同</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token function">sh</span> loginuser.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="简答题部分" tabindex="-1"><a class="header-anchor" href="#简答题部分"><span>简答题部分</span></a></h2>
<ul>
<li>
<p>root 的 UID 与 GID 是多少？基于这个理由，让 test 这个账户具有 root 权限，怎么做？</p>
<p>都为 0，可以直接修改 <code v-pre>/etc/passwd</code> 中 test 账户的 UID 和 GID 字段变成 0</p>
</li>
<li>
<p>如何将一个账户暂时停掉？让该账户无法登录？</p>
<p>由于是暂时失效，不能使用 userdel 来删除，有以下几种方式</p>
<ul>
<li>将 <code v-pre>/etc/passwd</code> 的 shell 字段修改为 <code v-pre>/sbin/nologin</code></li>
<li>将 <code v-pre>/ec/shadow</code> 的密码字段，内容前增加一个 !，让密码失效</li>
<li>将 <code v-pre>/etc/shadow</code> 第 8 字段关于账户失效日期，设置为小于目前的日期数字</li>
</ul>
</li>
<li>
<p>使用 useradd 时，新增账户里面的 UID、GID 还有其他相关的密码控制是哪几个文件配置的?</p>
<p><code v-pre>/etc/login.defs</code> <code v-pre>/etc/default/useradd</code></p>
</li>
<li>
<p>在使用 useradd 时，预设情况中，他们家目录就含有一个名称为 www 的子目录，该怎么操作？</p>
<p>会以 <code v-pre>/etc/skel</code> 作为参考目录，可以在该目录下创建一个  www 的目录</p>
</li>
<li>
<p>简单说明系统账户与一般账户的差别？</p>
<p>一般而言，为了让系统能够顺利以较小的权限运行，系统会有很多账户，例如 mail、bin、adm 等。为了确保这些账户能够在系统上面具有独一无二的的权限，一般来说 Linux 会保留一些 UID 给系统使用，在 CentOS 5.x 上，小于 500 以下的 UID 即是所谓的系统账户</p>
</li>
<li>
<p>简单说明，为何 CentOS 建立使用者时，会主动创建一个与账户同名的群组，而不是使用 <code v-pre>/etc/default/useradd</code> 的设置？</p>
<p>不同的 distribution 对于使用者 group 的建立机制不同，主要机制分为两种：</p>
<ul>
<li>public group schemes：给予一个公用的群组，一般来说是 users；以 SUSe server9 为代表</li>
<li>private group schemes：创建一个与账户同名的群组，以 CentOS 7.x 为例</li>
</ul>
</li>
<li>
<p>如何创建一个使用者 alex，所属群组为 alexgroup，预计使用 csh，他的全名为 “Alex Tsai”，还需要加入 users 群组中</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">groupadd</span> alexgroup</span>
<span class="line"><span class="token comment"># -g 初始组， -G 次要组，-m 建立家目录</span></span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-c</span> <span class="token string">"Alex Tsai"</span> <span class="token parameter variable">-g</span> alexgroup <span class="token parameter variable">-G</span> <span class="token function">users</span> <span class="token parameter variable">-m</span> alex</span>
<span class="line"><span class="token comment"># 务必先建立群组，才能够建立账户</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>由于种种因素，导致你的用户家目录以后都需要放置到 <code v-pre>/account</code> 目录下，该如何配置，让 useradd 时，默认的家目录指向 <code v-pre>/account</code>？</p>
<p>最简单的办法是编辑 <code v-pre>/etc/default/useradd</code>，将 <code v-pre>HOME=/home 改为 /account</code></p>
</li>
<li>
<p>要让 dmtsai 使用者，加入 mrcode1、mrcode2、mrcode3 三个群组，且不影响 dmtsai 原本已经支持的次要群组时，需要怎么操作？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># -a 增加，-G 次要群组，合用就是增加次要群组</span></span>
<span class="line"><span class="token function">usermod</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-G</span> mrcode1,mrcode2,mrcode3</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


