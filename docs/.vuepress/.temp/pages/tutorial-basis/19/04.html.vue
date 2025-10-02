<template><div><h1 id="开机过程的问题解决" tabindex="-1"><a class="header-anchor" href="#开机过程的问题解决"><span>开机过程的问题解决</span></a></h1>
<p>很多时候，可能要我做了某些设置，或不正常关机，而导致系统的 filesystem 错乱，因此 Linux 可能无法顺利开机，可以先尝试进入 rescue 模式去处理，下面讲解几个常见的问题</p>
<h2 id="忘记-root-密码" tabindex="-1"><a class="header-anchor" href="#忘记-root-密码"><span>忘记 root 密码</span></a></h2>
<p>原理是：只要能挂载到原来的根目录，就可以重新设置下 root 密码</p>
<p>在新版的 systemd 的管理机制中，默认的 rescue 模式无法直接取得 root 权限，还是需要使用 root 密码才能进入 rescure 环境，可以通过 <code v-pre>rd.break</code> 的核心参数来处理</p>
<p><code v-pre>rd.break</code> 是在 Ram Disk 里的操作系统状态，因此不能直接取得原本的 Linux 系统操作环境，所以还是需要 chroot 的支持，至于 SELinux 的问题，可能还要加上某些特殊的流程才能顺利的搞定 root 密码的救援</p>
<p>开机进入选单编辑模式，如下图</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200401114254117.png" alt="image-20200401114254117"></p>
<p>按 ctrl + x 重启后，开机画面会出现如下类似的画面，这应该是在 RAM Disk 的环境，并不是原本的环境，因此根目录下的数据与你原本的系统无关，而且你的系统应该会被挂载到 <code v-pre>/sysroot</code> 目录下，需要这样操作</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">Generating <span class="token string">"/run/initramfs/rdsosreport.txt"</span></span>
<span class="line"></span>
<span class="line">Enter emergency mode. Exit the shell to continue.</span>
<span class="line">Type <span class="token string">"journalctl"</span> to view system logs.</span>
<span class="line">You might want to save <span class="token string">"/run/initramfs/rdsosreport.txt"</span> to a USB stick or /boot</span>
<span class="line">after mounting them and attach it to a bug report.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 无需输入密码就取得了 root 权限</span></span>
<span class="line">switch_root:/<span class="token comment"># </span></span>
<span class="line"><span class="token comment"># 检查挂载点</span></span>
<span class="line">switch_root:/<span class="token comment"># mount</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">/dev/mapper/centos-root on /sysroot <span class="token builtin class-name">type</span> xfs <span class="token punctuation">(</span>ro,relatime,attr,inode64,noquo</span>
<span class="line"><span class="token comment"># 这里的权限是 ro? 不能写入，只可以读，重新挂载成可读写的</span></span>
<span class="line">switch_root:/<span class="token comment"># mount -o remount,rw /sysroot</span></span>
<span class="line"><span class="token comment"># 切回原本的系统环境</span></span>
<span class="line">switch_root:/<span class="token comment"># chroot /sysroot</span></span>
<span class="line"></span>
<span class="line">sh-4.2<span class="token comment"># echo "你的新密码" | passwd --stdin root</span></span>
<span class="line">sh-4.2<span class="token comment"># touch /.autorelabel		# 很重要，变回 SELinux 的安全本文</span></span>
<span class="line">sh-4.2<span class="token comment"># exit</span></span>
<span class="line"></span>
<span class="line">switch_root:/<span class="token comment"># reboot</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面进行疑问解释：</p>
<ul>
<li>
<p><code v-pre>chroot 目录</code>：</p>
<p>表示将你的根目录「暂时」切换到 指定的目录。上面的 <code v-pre>sysroot</code> 目录我们知道是原本的系统根目录，所以就可以处理了</p>
</li>
<li>
<p>为何需要 <code v-pre>.autorelabel</code></p>
<p>在 <code v-pre>rd.break</code> 的 RAM Disk 环境下，系统是没有 SELinux 的，而刚刚更改了 <code v-pre>/etc/shadow</code> （更改密码导致），所以这个文件的 SELinux 安全本文的特性将会被取消，如果没有让系统再开机时自动恢复 SELinux 的安全本文，将产生无法登陆的问题（在SELinux 为 Enforcing 的模式下）。使用 <code v-pre>/.autorelabel</code>  表示让系统再开机时自动使用预设的 SELinux type 重新写入 SELinux 安全本文到每个文件上去</p>
</li>
</ul>
<p>由于 <code v-pre>/.autorelabel</code> 开机恢复需要不少时间，还可以使用如下方式</p>
<ul>
<li>在 rd.break 模式下，修改完 root 密码后， 将 <code v-pre>/etc/selinux/config</code>  内的 SELinux 类型改为 permissive</li>
<li>重新启动后，使用 root 身份下达 <code v-pre>restorecon -Rv /etc</code> 仅修改 /etc 下的文件</li>
<li>重新修改 <code v-pre>/etc/selinux/config</code> 内的 SELinux 类型为 enforcing，然后执行 <code v-pre>setenfore</code> 即可</li>
</ul>
<h2 id="开机直接以-root-执行-bash-的方法" tabindex="-1"><a class="header-anchor" href="#开机直接以-root-执行-bash-的方法"><span>开机直接以 root 执行 bash 的方法</span></a></h2>
<p>还可以直接开机取得系统根目录后，让系统直接给我们一个 bash。</p>
<p>配置方法同样是在 linux 哪一行添加参数，不用  rd.break，而是使用 <code v-pre>init=/bin/bash</code>，同样不需要 root 密码就可以获取到 root 权限</p>
<p>该 bash 无法完整的操作系统，这个原理是将 PID=1 的第一个程序改为了 bash，所以最多还是用在救援方面。同样需要 remount 根目录才可以</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 直接就在根目录，所以只需要改成写模式就可以了，后续流程和上面的一样</span></span>
<span class="line">switch_root:/<span class="token comment"># mount -o remount,rw /</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="因文件系统错误而无法开机" tabindex="-1"><a class="header-anchor" href="#因文件系统错误而无法开机"><span>因文件系统错误而无法开机</span></a></h2>
<p>如果因为设置错误导致无法开机时，就更简单了，通常设置错误导致无法开机的文件是 <code v-pre>/etc/fstab</code> 文件，修改完成后，又没有通过  <code v-pre>mount -a</code>  来测试就重启系统了，那么就无法开机成功了，这种情况的问题大多数为下图所示</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200401131409238.png" alt="image-20200401131409238"></p>
<p>提示输入 root 密码进入救援，之后重新挂载写模式 <code v-pre>mount -o remount,rw /</code>，就可以编辑错误的设置了</p>
<p>如果是因为不正常关机后，导致文件系统不一致（Inconsistend）的情况，也可能出现相同的问题，如果是扇区错乱的情况，请看上图第 2 行，fsck 告知是 <code v-pre>/dev/md0</code> 错误，此时你应该利用 fsck.ext3 去检测 <code v-pre>/dev/md0</code> 才是，等到系统发现错误，并且出现 <code v-pre>clear[Y/N]</code> 时，输入 Y 尝试恢复</p>
<p>如果是 XFS 文件系统的话，可能需要使用  xfs_repair 指令来处理，<code v-pre>fsck/xfs_repair</code> 的处理过程可能会很长，如果你的 partition 上的 filesystem 有过多的数据顺坏时即使 <code v-pre>fsck/xfs_repair</code> 完成后，可能因为损坏了系统槽，导致某些关键系统文件数据的损坏，那么依旧是无法进入 Linux 的。此时就只能将系统中重要的数据复制出来，然后重新安装，并且检验下是否是实体硬盘有损坏的现象</p>
</div></template>


