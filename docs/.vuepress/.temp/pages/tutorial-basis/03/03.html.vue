<template><div><h1 id="多重引导安装流程与管理-option" tabindex="-1"><a class="header-anchor" href="#多重引导安装流程与管理-option"><span>多重引导安装流程与管理（Option）</span></a></h1>
<p>本节内容可选</p>
<p>笔者就不学习这章节了，记录下有哪些内容，这些内容在 <a href="http://linux.vbird.org/linux_basic/0157installcentos7.php#ps4" target="_blank" rel="noopener noreferrer">鸟哥网站</a> 上有</p>
<ul>
<li>安装 CentOS 7.x + windows 7 的规划</li>
<li>进阶安装 CentOS 7.x 与 windows</li>
</ul>
<h2 id="救援-mbr-内的开机管理程序与设定多重引导" tabindex="-1"><a class="header-anchor" href="#救援-mbr-内的开机管理程序与设定多重引导"><span>救援 MBR 内的开机管理程序与设定多重引导</span></a></h2>
<p>同样，进入入口也是使用 DVD 镜像，前面安装 centos 的时候讲到过的一项菜单 「救援 CentOS 系统（Rcscue a CentOS system）」</p>
<p>进来之后，是进入了一个文字界面，通过以下指令救援 MBR 的开机管理程序</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">chroot</span> /mnt/sysimage</span>
<span class="line">grub2-install /dev/vda</span>
<span class="line"><span class="token comment"># ... 等待安装完成，出现以下类似的文案</span></span>
<span class="line">Installing <span class="token keyword">for</span> i386-pc platform</span>
<span class="line">Installation finished. No error reported.</span>
<span class="line"><span class="token comment"># 退出，并重启</span></span>
<span class="line"><span class="token builtin class-name">exit</span></span>
<span class="line"><span class="token function">reboot</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="修改开机选单任务" tabindex="-1"><a class="header-anchor" href="#修改开机选单任务"><span>修改开机选单任务</span></a></h2>
<p>还需要修改开机选单，否则仅有 Linux 而已，正常登陆 linux 系统，切换身份到 root 后，进行下面的操作</p>
<p><img src="@source/tutorial-basis/03/assets/markdown-img-paste-20191004220015354.png" alt=""></p>
<h2 id="后续维护注意事项" tabindex="-1"><a class="header-anchor" href="#后续维护注意事项"><span>后续维护注意事项</span></a></h2>
<p>多重引导设置完成之后，请特别注意：</p>
<ol>
<li>windows 环境中最好将 linux 的根目录与 swap 取消挂载，</li>
</ol>
<p>否则未来打开文件总管时，会要求你格式化，那么 Linux 系统就毁了
2. 你的 linux 不可以随便删除</p>
<p>因为 grub 会读取 Linux 根目录下的 /boot/ 目录内容，如果 Linux 被移除，那么 windows 也无法开机，
因为整个开机选单都不见了</p>
</div></template>


