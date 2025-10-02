<template><div><h1 id="使用者与群组" tabindex="-1"><a class="header-anchor" href="#使用者与群组"><span>使用者与群组</span></a></h1>
<h2 id="文件拥有者" tabindex="-1"><a class="header-anchor" href="#文件拥有者"><span>文件拥有者</span></a></h2>
<p>多人任务的场景下，如果没有权限，那么将是很恐怖的事情，
文件拥有者很简单的，只有你才有权利访问与修改。</p>
<h2 id="群组概念" tabindex="-1"><a class="header-anchor" href="#群组概念"><span>群组概念</span></a></h2>
<p>群组的最有用功能之一：就是在多人协作方面，只要有该组的权限，使用者就能行驶群组的权限</p>
<h2 id="其他人的概念" tabindex="-1"><a class="header-anchor" href="#其他人的概念"><span>其他人的概念</span></a></h2>
<p>可以想象成 if else 中的 else，</p>
<p><img src="@source/tutorial-basis/05/assets/markdown-img-paste-20191007214951801.png" alt=""></p>
<p>天神：指 root ，不是拥有者</p>
<h2 id="用户身份与群组记录的文件" tabindex="-1"><a class="header-anchor" href="#用户身份与群组记录的文件"><span>用户身份与群组记录的文件</span></a></h2>
<p>在 linux 系统当中，默认情况下，相关信息是存储在下面的目录下的</p>
<ul>
<li><code v-pre>/etc/passwd</code>：账户信息（目前笔者还不知道里面有具体信息，看不太懂）</li>
<li><code v-pre>/etc/shadow</code>：账户密码，不过是加密了的</li>
<li><code v-pre>/etc/group</code>：所有组名</li>
</ul>
<p>这三个目录可以说是 Linux 系统里面账户、密码、群组信息的集中地，不要随便删除</p>
</div></template>


