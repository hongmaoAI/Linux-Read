<template><div><h1 id="boot-loader-grub2" tabindex="-1"><a class="header-anchor" href="#boot-loader-grub2"><span>Boot Loader：Grub2</span></a></h1>
<p>前面知识点来看，boot loader 是载入核心的重要工具，来讲下 Linux 中最流行的 grub2 这个 boot loader</p>
<h2 id="boot-loader-的两个-stage" tabindex="-1"><a class="header-anchor" href="#boot-loader-的两个-stage"><span>boot loader 的两个 stage</span></a></h2>
<p>曾经讲到，在 BIOS 读完信息后，接下来会到第一个开机设备的 MBR 去读取 boot loader 。该 boot loader 可以具有选单功能、字节加载核心文件以及控制权移交功能等，系统必须要有 loader 才能够加载该操作系统的核心。</p>
<p>但是 MBR 是整个硬盘的第一个 sector 内的一个区块，整个大小才 446 bytes 。即使 GPT 也没有很大的扇区来存储 loader 数据，那么功能强悍的 loader 是怎么放进去的？</p>
<p>为了解决这个问题，Linux 将 boot loader 的程序代码执行与设置值加载分成两个阶段（stage）执行</p>
<ul>
<li>
<p>Stage 1：执行 boot loader 主程序</p>
<p>第一阶段执行 boot loader 的主程序，该主程序必须被安装在开机区，即 MBR 或则是 boot sector，但是因为 MBR 是在太小了，所以通常仅安装 boot loader 的最小主程序，并没有安装 loader 的相关配置文件</p>
</li>
<li>
<p>Stage 2：主程序加载配置文件</p>
<p>第二阶段通过 boot loader 加载所有配置文件与相关的环境参数文件，包括文件系统定义与主要配置文件 grub.cfg，一般来说，配置文件都在 /boot 下</p>
</li>
</ul>
<p>与 grub2 相关的都放在 <code v-pre>/boot/grub2</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ls -l /boot/grub2</span></span>
<span class="line">total <span class="token number">32</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root   <span class="token number">84</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:31 device.map			<span class="token comment"># grub2 的设备对于文件</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root   <span class="token number">25</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:31 fonts						<span class="token comment"># 开机过程中的画面会使用到的字体数据</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">4309</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:32 grub.cfg				<span class="token comment"># grub2 的主配置文件，非常重要</span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root <span class="token number">1024</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:32 grubenv					<span class="token comment"># 一些环境区块的符号</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root <span class="token number">8192</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:31 i386-pc					<span class="token comment"># 针对一般 x86 PC 所需要的 grub2 的相关模块</span></span>
<span class="line">drwxr-xr-x. <span class="token number">2</span> root root <span class="token number">4096</span> Oct  <span class="token number">4</span> <span class="token number">18</span>:31 locale					<span class="token comment"># 语系相关数据</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ls -l /boot/grub2/i386-pc/</span></span>
<span class="line">acpi.mod				<span class="token comment"># 电源管理有关的模块</span></span>
<span class="line">ata.mod					<span class="token comment"># 磁盘有关的模块</span></span>
<span class="line">chain.mod·			<span class="token comment"># 进行 loader 控制全移交的相关模块</span></span>
<span class="line">command.lst 		<span class="token comment"># 一些指令相关性的列表</span></span>
<span class="line">efiemu32.o			<span class="token comment"># 与 uefi BIOS 先关的模块</span></span>
<span class="line">efiemu64.o</span>
<span class="line">efiemu.mod</span>
<span class="line">ext2.mod				<span class="token comment"># EXT w文件系统家族相关模块</span></span>
<span class="line">fat.mod					<span class="token comment"># FAT 文件系统模块</span></span>
<span class="line">gcry_sha256.mod	<span class="token comment"># 常见的加密模块</span></span>
<span class="line">iso9660.mod			<span class="token comment"># 光盘文件系统模块</span></span>
<span class="line">lvm.mod 				<span class="token comment"># LVM 文件系统模块</span></span>
<span class="line">mdraid09.mod		<span class="token comment"># 软件磁盘阵列模块</span></span>
<span class="line">minix.mod				<span class="token comment"># MINIX 相关文件系统模块</span></span>
<span class="line">msdospart.mod		<span class="token comment"># 一般 MBR 分区表</span></span>
<span class="line">part_gpt.mod    <span class="token comment"># GPT 分区表</span></span>
<span class="line">part_msdos.mod	<span class="token comment"># MBR 分区表</span></span>
<span class="line">scsi.mod				<span class="token comment"># SCSI 相关模块</span></span>
<span class="line">usb_keyboard.mod	<span class="token comment"># usb 模相关模块</span></span>
<span class="line">usb.mod</span>
<span class="line">vga.mod					<span class="token comment"># VGA 显卡相关模块</span></span>
<span class="line">xfs.mod					<span class="token comment"># XFS 文件系统模块</span></span>
<span class="line">。。。。 等等很多模块</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>/boot/grub2</code> 目录下最重要的是 grub2.cfg 配置文件，以及各种文件系统的定义。所以 loader 读取了这种文件系统定义数据后，就能够认识文件系统并读取在该文件系统内的核心文件了</p>
<p>从上面的文件来看， grub2 认识的文件系统与磁盘分区格式真的非常多，正因为如此，grub2 才会取代 Lio/grub 这个老婆的 boot loader</p>
<h2 id="grub2-的配置文件-boot-grub2-grub-cfg-初探" tabindex="-1"><a class="header-anchor" href="#grub2-的配置文件-boot-grub2-grub-cfg-初探"><span>grub2 的配置文件 <code v-pre>/boot/grub2/grub.cfg</code> 初探</span></a></h2>
<p>Grub2 的有点挺多，包括：</p>
<ul>
<li>
<p>认识与支持较多的文件系统，并且可以使用 grub2 的主程序直接在文件系统中搜索核心文件</p>
</li>
<li>
<p>开机时，可以自行编辑与修改改机设置项目，类似 bash 的指令模式</p>
</li>
<li>
<p>可以动态搜索配置文件，而不需要再修改配置文件后重新安装 grub2。</p>
<p>即修改完配置文件后，下次开机就生效了</p>
</li>
</ul>
<p>上面三个优点，也是 Stage 1、Stage 2 分别安装在 MBR（主程序）与文件系统中（配置文件与定义文件）的原因</p>
<h3 id="磁盘与分区槽在-grub2-中的代号" tabindex="-1"><a class="header-anchor" href="#磁盘与分区槽在-grub2-中的代号"><span>磁盘与分区槽在 grub2 中的代号</span></a></h3>
<p>安装在 MBR 的 grub2 的主程序，中重要任务之一是从磁盘中加载核心文件，让核心能顺利驱动整个系统的硬件</p>
<p>grub2 对硬盘的代号设置与传统的 LInux 磁盘代号完全不同，如下所示</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">(</span>hd0,1<span class="token punctuation">)</span>				<span class="token comment"># 一般的默认语法，由 grub2 自动判断分区格式</span></span>
<span class="line"><span class="token punctuation">(</span>hd0,msdos1<span class="token punctuation">)</span>	<span class="token comment"># 此磁盘的分区为传统的 MBR 模式</span></span>
<span class="line"><span class="token punctuation">(</span>hd0,gpt1<span class="token punctuation">)</span>		<span class="token comment"># 此磁盘的分区为 GPT 模式</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面看，与 <code v-pre>/dev/sda1</code> 不相关，只要注意下面几个知识点：</p>
<ul>
<li>硬盘代号以小括号 <code v-pre>()</code> 包起来</li>
<li>硬盘以 hd 表示，后面会接一组数字</li>
<li>以搜索顺序作为硬盘的编号（这个很重要）</li>
<li>第一个搜索到的硬盘为 0，一次类推</li>
<li>每块磁盘的第一个 partition 代号为 1，依序类推</li>
</ul>
<p>如行 <code v-pre>(hd0,1)</code> 表示第一块硬盘，第一个分区槽；始终记得，硬盘号最小为 0，分区槽最小为 1</p>
<p>所以整个硬盘代号为：</p>
<table>
<thead>
<tr>
<th>硬盘搜索顺序</th>
<th>grub2 的代号</th>
</tr>
</thead>
<tbody>
<tr>
<td>第一块磁盘 MBR</td>
<td>(hd0)、(hd0,msdos1)(hd0,msdos2)...</td>
</tr>
<tr>
<td>第二块 GPT</td>
<td>(hd1)、(hd1,gpt1)...</td>
</tr>
<tr>
<td>第三块</td>
<td>(hd2)、(hd2,1)...</td>
</tr>
</tbody>
</table>
<p>例题：你的系统有一块 SATA 硬盘，请说明该硬盘的第一个逻辑分区槽在 Linux 与 grub2 中的文件名与代号</p>
<p>答：STAT 磁盘，使用逻辑分区槽，因此是 <code v-pre>/dev/sda5</code> （1-4 保留给 primary 与 extended 使用）。在 grub2 中则是，由于只有一块磁盘，那么 <code v-pre>(hd0,msdos5)</code>，简易写法 <code v-pre>(hd0,5)</code></p>
<h3 id="boot-grub2-grub-cfg-配置文件-重点了解-不要随意修改" tabindex="-1"><a class="header-anchor" href="#boot-grub2-grub-cfg-配置文件-重点了解-不要随意修改"><span><code v-pre>/boot/grub2/grub.cfg</code> 配置文件（重点了解，不要随意修改）！</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /boot/grub2/grub.cfg </span></span>
<span class="line"><span class="token comment"># 开始是 00_header 这个脚本执行的结果展示，主要与基础设置与关机有关</span></span>
<span class="line"><span class="token comment">### BEGIN /etc/grub.d/00_header ###</span></span>
<span class="line"><span class="token builtin class-name">set</span> <span class="token assign-left variable">pager</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-s</span> <span class="token variable">$prefix</span>/grubenv <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  load_env</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> x<span class="token variable">$feature_timeout_style</span> <span class="token operator">=</span> xy <span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token builtin class-name">set</span> <span class="token assign-left variable">timeout_style</span><span class="token operator">=</span>menu</span>
<span class="line">  <span class="token builtin class-name">set</span> <span class="token assign-left variable">timeout</span><span class="token operator">=</span><span class="token number">5</span>			<span class="token comment"># 菜单显示时间</span></span>
<span class="line"><span class="token comment"># Fallback normal timeout code in case the timeout_style feature is</span></span>
<span class="line"><span class="token comment"># unavailable.</span></span>
<span class="line"><span class="token keyword">else</span></span>
<span class="line">  <span class="token builtin class-name">set</span> <span class="token assign-left variable">timeout</span><span class="token operator">=</span><span class="token number">5</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"><span class="token comment">### END /etc/grub.d/00_header ###</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 开始执行 10_linux ，主要针对实际的 Linux 核心文件的开机环境</span></span>
<span class="line"><span class="token comment"># menuentry：表示选单内容，这里有两个，也就是说开机的时候，出现两个选单</span></span>
<span class="line"><span class="token comment">### BEGIN /etc/grub.d/10_linux ###</span></span>
<span class="line">menuentry <span class="token string">'CentOS Linux (3.10.0-1062.el7.x86_64) 7 (Core)'</span> <span class="token parameter variable">--class</span> centos <span class="token parameter variable">--class</span> gnu-linux <span class="token parameter variable">--class</span> gnu <span class="token parameter variable">--class</span> os <span class="token parameter variable">--unrestricted</span> <span class="token variable">$menuentry_id_option</span> <span class="token string">'gnulinux-3.10.0-1062.el7.x86_64-advanced-7b220a88-4e13-4869-9aa9-87031303f3e1'</span> <span class="token punctuation">{</span></span>
<span class="line">        load_video</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">gfxpayload</span><span class="token operator">=</span>keep</span>
<span class="line">        insmod gzio</span>
<span class="line">        insmod part_gpt</span>
<span class="line">        insmod xfs</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token string">'hd0,gpt2'</span>		</span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">[</span> x<span class="token variable">$feature_platform_search_hint</span> <span class="token operator">=</span> xy <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root --hint-bios<span class="token operator">=</span>hd1,gpt2 --hint-efi<span class="token operator">=</span>hd1,gpt2 --hint-baremetal<span class="token operator">=</span>ahci1,gpt2 <span class="token parameter variable">--hint</span><span class="token operator">=</span><span class="token string">'hd0,gpt2'</span>  13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root 13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">fi</span></span>
<span class="line">        linux16 /vmlinuz-3.10.0-1062.el7.x86_64 <span class="token assign-left variable">root</span><span class="token operator">=</span>/dev/mapper/centos-root ro <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto <span class="token assign-left variable">spectre_v2</span><span class="token operator">=</span>retpoline <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/root <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/swap rhgb quiet <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>zh_CN.UTF-8</span>
<span class="line">        initrd16 /initramfs-3.10.0-1062.el7.x86_64.img</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">menuentry <span class="token string">'CentOS Linux (0-rescue-f228ab37c368416c84c6b27971ba45a9) 7 (Core)'</span> <span class="token parameter variable">--class</span> centos <span class="token parameter variable">--class</span> gnu-linux <span class="token parameter variable">--class</span> gnu <span class="token parameter variable">--class</span> os <span class="token parameter variable">--unrestricted</span> <span class="token variable">$menuentry_id_option</span> <span class="token string">'gnulinux-0-rescue-f228ab37c368416c84c6b27971ba45a9-advanced-7b220a88-4e13-4869-9aa9-87031303f3e1'</span> <span class="token punctuation">{</span></span>
<span class="line">        load_video</span>
<span class="line">        insmod gzio</span>
<span class="line">        insmod part_gpt</span>
<span class="line">        insmod xfs</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token string">'hd0,gpt2'</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">[</span> x<span class="token variable">$feature_platform_search_hint</span> <span class="token operator">=</span> xy <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root --hint-bios<span class="token operator">=</span>hd1,gpt2 --hint-efi<span class="token operator">=</span>hd1,gpt2 --hint-baremetal<span class="token operator">=</span>ahci1,gpt2 <span class="token parameter variable">--hint</span><span class="token operator">=</span><span class="token string">'hd0,gpt2'</span>  13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root 13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">fi</span></span>
<span class="line">        linux16 /vmlinuz-0-rescue-f228ab37c368416c84c6b27971ba45a9 <span class="token assign-left variable">root</span><span class="token operator">=</span>/dev/mapper/centos-root ro <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto <span class="token assign-left variable">spectre_v2</span><span class="token operator">=</span>retpoline <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/root <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/swap rhgb quiet</span>
<span class="line">        initrd16 /initramfs-0-rescue-f228ab37c368416c84c6b27971ba45a9.img</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">### END /etc/grub.d/10_linux ###</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">### BEGIN /etc/grub.d/20_linux_xen ###</span></span>
<span class="line"><span class="token comment">### END /etc/grub.d/20_linux_xen ###</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">### BEGIN /etc/grub.d/20_ppc_terminfo ###</span></span>
<span class="line"><span class="token comment">### END /etc/grub.d/20_ppc_terminfo ###</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">### BEGIN /etc/grub.d/30_os-prober ###</span></span>
<span class="line"><span class="token comment">### END /etc/grub.d/30_os-prober ###</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">### BEGIN /etc/grub.d/40_custom ###</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基本上，grub2 不希望你自己修改 grub.cfg 这个配置文件，取代他们的是修改几个特定的配置文件，由  grub2-mkconfig 指令来产生新的 grub.cfg 文件，这里需要了解下 grub2.cfg 的大致内容</p>
<ul>
<li>
<p><code v-pre> set root='hd0,gpt2'</code></p>
<p>root  指定 grub2 的配置文件所在的设备。测试机来说，当初安装的时候分区出 <code v-pre>/</code> 与 <code v-pre>/boot</code> 两个设备，而 grub2 是在 <code v-pre>/boot/grup2</code> 位置，该位置的磁盘文件名为 <code v-pre>/dev/sda2</code> 因此就是 <code v-pre>(hd0,2)</code>，又因为是 gpt 分区，所以是 <code v-pre>(hd0,gpt2)</code></p>
</li>
<li>
<p><code v-pre>linux16 /vmlinuz-3.10.0-1062.el7.x86_64 root=/dev/mapper/centos-root </code></p>
<p>Linux 核心文件以及核心执行时下达的参数。我们的核心文件应该是 <code v-pre>/boot/vmlinuz-xx</code>，这里怎么会在根目录呢？这与上面的 root 有关：</p>
<ul>
<li>
<p>如果没有 /boot 分区，仅有 / 分区：所以文件名是：</p>
<p><code v-pre>/boot/vmlinuz-xxx  ---&gt; (/)/boot/vmlinuz-xxx --&gt; (hd0,msdos1)/boot/vmlinuz-xx</code></p>
</li>
<li>
<p>如果 /boot 是独立分区，则·</p>
<p><code v-pre>/boot/vmlinuz-xxx --&gt; (/boot)/boot/vmlinuz-xx --&gt; (hd0,msdos1)/vmlinuz-xxx</code></p>
</li>
</ul>
<p>因此 linux16 后面接的文件名与上面的 root 搭配在一起，才是完整的绝对路径，至于文件名后面的 root=/dev/xx，中的 root 指 linux 文件系统中根目录是在哪个涉笔上的意思</p>
</li>
<li>
<p><code v-pre>initrd16/initramfs-3.10..</code></p>
<p>就是 initramfs 所在的文件名，与 linux16 哪个 vmlinuz-xxx 相同，也需要搭配 root，才是正确的位置</p>
</li>
</ul>
<h2 id="grub2-的配置文件维护-etc-default-grub-与-etc-grub-d" tabindex="-1"><a class="header-anchor" href="#grub2-的配置文件维护-etc-default-grub-与-etc-grub-d"><span>grub2 的配置文件维护 <code v-pre>/etc/default/grub 与 /etc/grub.d</code></span></a></h2>
<h3 id="etc-default-grub-主要配置文件" tabindex="-1"><a class="header-anchor" href="#etc-default-grub-主要配置文件"><span><code v-pre>/etc/default/grub</code> 主要配置文件</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/default/grub </span></span>
<span class="line"><span class="token assign-left variable">GRUB_TIMEOUT</span><span class="token operator">=</span><span class="token number">5</span>								<span class="token comment"># 指定预设倒数读秒数，也就是只给出 n 秒让你操作</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DISTRIBUTOR</span><span class="token operator">=</span><span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">sed</span> <span class="token string">'s, release .*$,,g'</span> /etc/system-release<span class="token variable">)</span></span>"</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DEFAULT</span><span class="token operator">=</span>saved						<span class="token comment"># 指定默认由哪一个选单来开机</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DISABLE_SUBMENU</span><span class="token operator">=</span>true			<span class="token comment"># 是否隐藏次选单，通常是隐藏起来的</span></span>
<span class="line"><span class="token assign-left variable">GRUB_TERMINAL_OUTPUT</span><span class="token operator">=</span><span class="token string">"console"</span>	<span class="token comment"># 数据输出的终端机格式，默认是通过文字终端机</span></span>
<span class="line"><span class="token comment"># 在 menuentry 括号内的 linux16 项目后续的核心参数</span></span>
<span class="line"><span class="token assign-left variable">GRUB_CMDLINE_LINUX</span><span class="token operator">=</span><span class="token string">"crashkernel=auto spectre_v2=retpoline rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet"</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DISABLE_RECOVERY</span><span class="token operator">=</span><span class="token string">"true"</span>		<span class="token comment"># 取消救援选单的制作</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面讲解几个重要的设置（详情通过 info grub 6.1 章节阅读）</p>
<ul>
<li>
<p>倒数时间参数：GRUB_TIMEOUT</p>
<p>不想等待操作则输入 0，如果一定要求手动选择，则输入 -1，输入大于 0 秒的数值，则表示等待操作时间</p>
</li>
<li>
<p>是否隐藏选单：GRUB_TIMEOUT_STYLE</p>
<p>可设置的值有：</p>
<ul>
<li>menu：显示选单（默认）</li>
<li>countdown：不显示选单，但是还显示读秒</li>
<li>hidden ：不显示选单，且不显示读秒</li>
</ul>
<p>等</p>
</li>
<li>
<p>信息输出终端机模式：GRUB_TERMINAL_OUTPUT</p>
<p>​	输出的画面应该使用哪一个终端机来显示</p>
<ul>
<li>console</li>
<li>serial</li>
<li>gfxterm</li>
<li>vag_text</li>
</ul>
<p>等</p>
</li>
<li>
<p>默认开机选单：GRUB_DEFAULT</p>
<p>默认使用哪一个选单（menuentry）来作为开机项目。能使用的设置值为</p>
<ul>
<li>saved</li>
<li>数值</li>
<li>title</li>
<li>ID</li>
</ul>
<p>等，假设你有三个 menuentry</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">menuentry  <span class="token string">'1st linux system'</span> <span class="token parameter variable">--id</span> 1lst-linux-system <span class="token punctuation">{</span><span class="token punctuation">..</span>.<span class="token punctuation">}</span></span>
<span class="line">menuentry  <span class="token string">'2nd linux system'</span> <span class="token parameter variable">--id</span> 2nd-linux-system <span class="token punctuation">{</span><span class="token punctuation">..</span>.<span class="token punctuation">}</span></span>
<span class="line">menuentry  <span class="token string">'3rd linux system'</span> <span class="token parameter variable">--id</span> 3rd-linux-system <span class="token punctuation">{</span><span class="token punctuation">..</span>.<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">几个常见的设置如下含义：</span>
<span class="line"><span class="token comment"># 表示使用第 2 个 menuentry 开机，数值编号以 0 开始</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DEFAULT</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 表示使用第 3 个</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DEFAULT</span><span class="token operator">=</span>3rd linux system</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 表示使用 grub2-set-default 来设置哪一个 menuentry。通常预设为 0</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DEFAULT</span><span class="token operator">=</span>saved</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>核心的外加参数功能：GRUB_CMDLINE_LINUX</p>
<p>可以在核心启动时加入额外的参数，在这里加入。比如，除了预设的核心参数外，还需要让你的磁盘读写机制为 deadline 时，可以这样处理</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">GRUB_CMDLINE_LINUX</span><span class="token operator">=</span><span class="token string">"... crashkernel=atuo rhgb quiet elevator=deadline"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<p>这个主要环节配置文件配置完成后，必须使用 grub2-mkconfig 来重建 grub.cfg 才可以。因为主配置文件是 grub.cfg，我们是通过许多脚本来协助完成 grub.cfg 的自动建立。另外，额外自己设置的项目，写入 <code v-pre>/etc/default/grub</code> 文件内</p>
<p>下面进行联系</p>
<p>问题：达成以下要求</p>
<ol>
<li>开机选单等待 40 秒</li>
<li>预设使用第一个选单开机</li>
<li>选单请显示出来，不要隐藏</li>
<li>核心外带参数 <code v-pre>elevator=deadline</code></li>
</ol>
<p>直接编辑主要环节配置文件后，再以 grub2-mkconfg 来重建 grub.cfg</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 编辑主要环节配置文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/default/grub </span></span>
<span class="line"><span class="token assign-left variable">GRUB_TIMEOUT</span><span class="token operator">=</span><span class="token number">40</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DISTRIBUTOR</span><span class="token operator">=</span><span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">sed</span> <span class="token string">'s, release .*$,,g'</span> /etc/system-release<span class="token variable">)</span></span>"</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DEFAULT</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DISABLE_SUBMENU</span><span class="token operator">=</span>true</span>
<span class="line"><span class="token assign-left variable">GRUB_TERMINAL_STYLE</span><span class="token operator">=</span>menu</span>
<span class="line"><span class="token assign-left variable">GRUB_TERMINAL_OUTPUT</span><span class="token operator">=</span><span class="token string">"console"</span></span>
<span class="line"><span class="token assign-left variable">GRUB_CMDLINE_LINUX</span><span class="token operator">=</span><span class="token string">"crashkernel=auto spectre_v2=retpoline rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet elevator=deadline"</span></span>
<span class="line"><span class="token assign-left variable">GRUB_DISABLE_RECOVERY</span><span class="token operator">=</span><span class="token string">"true"</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 重建 grub.cfg</span></span>
<span class="line"><span class="token punctuation">[</span>root@study default<span class="token punctuation">]</span><span class="token comment"># grub2-mkconfig -o /boot/grub2/grub.cfg</span></span>
<span class="line">Generating grub configuration <span class="token function">file</span> <span class="token punctuation">..</span>.</span>
<span class="line">Found linux image: /boot/vmlinuz-3.10.0-1062.el7.x86_64</span>
<span class="line">Found initrd image: /boot/initramfs-3.10.0-1062.el7.x86_64.img</span>
<span class="line">Found linux image: /boot/vmlinuz-0-rescue-f228ab37c368416c84c6b27971ba45a9</span>
<span class="line">Found initrd image: /boot/initramfs-0-rescue-f228ab37c368416c84c6b27971ba45a9.img</span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 检查是否生效</span></span>
<span class="line"><span class="token punctuation">[</span>root@study default<span class="token punctuation">]</span><span class="token comment"># grep timeout /boot/grub2/grub.cfg </span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> x<span class="token variable">$feature_timeout_style</span> <span class="token operator">=</span> xy <span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token builtin class-name">set</span> <span class="token assign-left variable">timeout_style</span><span class="token operator">=</span>menu</span>
<span class="line">  <span class="token builtin class-name">set</span> <span class="token assign-left variable">timeout</span><span class="token operator">=</span><span class="token number">40</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># from /etc/grub.d and settings from /etc/default/grub</span></span>
<span class="line">   <span class="token builtin class-name">set</span> <span class="token assign-left variable">default</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${next_entry}</span>"</span></span>
<span class="line">   <span class="token builtin class-name">set</span> <span class="token assign-left variable">default</span><span class="token operator">=</span><span class="token string">"0"</span></span>
<span class="line">   </span>
<span class="line"><span class="token punctuation">[</span>root@study default<span class="token punctuation">]</span><span class="token comment"># grep linux16 /boot/grub2/grub.cfg </span></span>
<span class="line">        linux16 /vmlinuz-3.10.0-1062.el7.x86_64 <span class="token assign-left variable">root</span><span class="token operator">=</span>/dev/mapper/centos-root ro <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto <span class="token assign-left variable">spectre_v2</span><span class="token operator">=</span>retpoline <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/root <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/swap rhgb quiet <span class="token assign-left variable">elevator</span><span class="token operator">=</span>deadline </span>
<span class="line">        linux16 /vmlinuz-0-rescue-f228ab37c368416c84c6b27971ba45a9 <span class="token assign-left variable">root</span><span class="token operator">=</span>/dev/mapper/centos-root ro <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto <span class="token assign-left variable">spectre_v2</span><span class="token operator">=</span>retpoline <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/root <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/swap rhgb quiet <span class="token assign-left variable">elevator</span><span class="token operator">=</span>deadline </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过以上测试，可以知道给我们一个配置文件，然后通过指令去刷新主配置文件，这能降低我们手动操作主配置文件的难度</p>
<h3 id="选单建立的脚本-etc-grub-d" tabindex="-1"><a class="header-anchor" href="#选单建立的脚本-etc-grub-d"><span>选单建立的脚本 <code v-pre>/etc/grub.d/*</code></span></a></h3>
<p>执行 <code v-pre>grub2-mkconfig -o /boot/grub2/grub.cfg</code> 后，显示信息去抓取了 linux 核心等信息，这是因为 grub2-mkconfig 去分析 <code v-pre>/etc/grub.d/*</code> 中的文件，然后执行该文件来建立 grub.cfg 文件。该目录下一般或存储以下文件</p>
<ul>
<li>
<p><code v-pre>00_header:</code></p>
<p>主要在建立初始的显示项目，包括需要加载的模块分析、屏幕终端机的格式、倒数描述、选单是否需要隐藏等，大部分在 <code v-pre>/etc/default/grub</code> 里所设置的变量，大概都会在该脚本中被利用来写入 grub.cfg 中</p>
</li>
<li>
<p><code v-pre>10_linux</code></p>
<p>根据分析 <code v-pre>/boot</code> 下的文件，尝试找到正确的 Linux 核心与读取该核心需要的文件系统模块与参数等信息，都在该脚本运行后找到并设置到 grub.cfg 中。</p>
<p>因为该脚本会将所有在 <code v-pre>/boot</code> 下的每一个核心文件都对应到一个选单上，因此核心文件数量越多，你的开机选单项目就越多</p>
<p>如果不需要旧的核心出现在选单上，可以通过移除旧核心来处理</p>
</li>
<li>
<p><code v-pre>30_os-prober</code></p>
<p>默认会到系统上找其他的 partition 里面可能含有的操作系统，然后将该操作系统做成选单来处理。</p>
<p>如果不想要让其他操作系统被检测到并制作开机选单，可以在 <code v-pre>/etc/default/grub</code> 中加上 <code v-pre>GRUB_DISABLE_OS_PROBER=true</code> 来取消该文件的运行</p>
</li>
<li>
<p><code v-pre>40_custom</code></p>
<p>如果还有其他自定义加上的选单项目，或则其他需求，可以在这里进行补充</p>
</li>
</ul>
<p>一般来说，我们会修改 40_custom 文件。现在我们知道 menuentry 是一个选单，它的功能有如下：</p>
<ul>
<li>
<p>直接指定核心开机</p>
<p>基本上如果是 Linux 的核心要直接被用来开机，直接通过 grub2-mkconfg 去抓取 <code v-pre>10_linux</code> 脚本来制作即可，但是如果你有额外比较特别的参数需要进行，可以这样做</p>
<ol>
<li>先到 grub.cfg 取得你要制作的核心选单项目，让后将它复制到 40_custom 中</li>
<li>再到 40_custom 中根据你的需求修改即可</li>
</ol>
<p>问题：如果你想要使用第一个原有的 menuentry 取出来后，增加一个选单，该选单可以强制 systemd 使用 graphical.target 来启动 linux 系统，让选单一定可以使用图形界面而不用理会 default.target 的连结。如何做？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">在核心外带参数中，有个选项 <span class="token assign-left variable">systemd.unit</span><span class="token operator">=</span>???，可以做到。因此先到 grub.cfg 中，复制一个 menuentry</span>
<span class="line"><span class="token punctuation">[</span>root@study default<span class="token punctuation">]</span><span class="token comment"># vim /etc/grub.d/40_custom</span></span>
<span class="line"><span class="token comment">#在这里修改我们的选单名称</span></span>
<span class="line">menuentry <span class="token string">'My graphical CentOS'</span> <span class="token parameter variable">--class</span> centos <span class="token parameter variable">--class</span> gnu-linux <span class="token parameter variable">--class</span> gnu <span class="token parameter variable">--class</span> os <span class="token parameter variable">--unrestricted</span> <span class="token parameter variable">--id</span> <span class="token string">'mygraphical'</span> <span class="token punctuation">{</span>   <span class="token comment"># 这里再设置一个 --id</span></span>
<span class="line">        load_video</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">gfxpayload</span><span class="token operator">=</span>keep</span>
<span class="line">        insmod gzio</span>
<span class="line">        insmod part_gpt</span>
<span class="line">        insmod xfs</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token string">'hd0,gpt2'</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">[</span> x<span class="token variable">$feature_platform_search_hint</span> <span class="token operator">=</span> xy <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root --hint-bios<span class="token operator">=</span>hd0,gpt2 --hint-efi<span class="token operator">=</span>hd0,gpt2 --hint-baremetal<span class="token operator">=</span>ahci0,gpt2  13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root 13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">fi</span></span>
<span class="line">        linux16 /vmlinuz-3.10.0-1062.el7.x86_64 <span class="token assign-left variable">root</span><span class="token operator">=</span>/dev/mapper/centos-root ro <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto <span class="token assign-left variable">spectre_v2</span><span class="token operator">=</span>retpoline <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/root <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/swap rhgb quiet <span class="token assign-left variable">elevator</span><span class="token operator">=</span>deadline <span class="token assign-left variable">systemd.unit</span><span class="token operator">=</span>graphical.target  <span class="token comment"># 这里再增加 systemd.unit=graphical.target 配置</span></span>
<span class="line">        initrd16 /initramfs-3.10.0-1062.el7.x86_64.img</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 然后重建下</span></span>
<span class="line"><span class="token punctuation">[</span>root@study default<span class="token punctuation">]</span><span class="token comment"># grep linux16 /boot/grub2/grub.cfg </span></span>
<span class="line"><span class="token comment"># 下次重新开机的时候就会出现该选单给你选择了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通过-chainloader-的方式移交-loader-控制权" tabindex="-1"><a class="header-anchor" href="#通过-chainloader-的方式移交-loader-控制权"><span>通过 chainloader 的方式移交 loader 控制权</span></a></h3>
<p>chain loader ：开机管理程序的连结，仅是在将控制权交给下一个 boot loader。所以 grub2 并不需要认识与找出 kernel 的文件，只是将 boot 的控制权交给下一个 boot sector 或 MBR 内的 boot loader 而已，所以通常它也不需要去检查下一个 boot loader 的文件系统</p>
<p>一般来说，chain loader 的设置值要两个就够了：</p>
<ol>
<li>预计要前往的 boot sector 所在的分区槽代号</li>
<li>设置 chainloader 在那个分区槽的 boot sector （第一个扇区）上</li>
</ol>
<p>假设 windows 分区槽在 <code v-pre>/dev/sda1</code> ,但是我只有一块硬盘，那么要 grub 将控制权交给 windows loader 需要这样做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">menuentry <span class="token string">"Windows"</span> <span class="token punctuation">{</span></span>
<span class="line">	insmod chain		<span class="token comment"># 加载 chainloader 的模块</span></span>
<span class="line">	insmod ntfs			<span class="token comment"># 建议加入 windows 所在的文件系统模块较好</span></span>
<span class="line">	<span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token punctuation">(</span>hd0,1<span class="token punctuation">)</span>	<span class="token comment"># 是在哪一个分区槽？</span></span>
<span class="line">	chainloader +1 		<span class="token comment"># 去 boot sector 将 loader 软件读取出来的意思</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment"># 通过以上配置，就可以让 grub2 叫出控制权了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>问题：假设你的测试系统上使用 MBR 分区槽，并且出现如下数据</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fdisk -l /dev/sda </span></span>
<span class="line">Device Boot         Start           End    	Blocks  		Id    System</span>
<span class="line">/dev/sda1 					   <span class="token number">2048</span>         <span class="token number">6143</span>     <span class="token number">44444</span>			<span class="token number">83</span>		Linux</span>
<span class="line">/dev/sda2 *					   <span class="token number">6144</span>      <span class="token number">2103295</span>     <span class="token number">999999</span>			<span class="token number">7</span>		  HPFS/NTFS/exFAT</span>
<span class="line">/dev/sda3 					<span class="token number">2103296</span>     <span class="token number">65026047</span>     <span class="token number">222222</span>			<span class="token number">84</span>		Linux</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 其中 /dev/sda2 是 windows 7 操作系统，现在需要增加两个开机选项</span></span>
<span class="line"><span class="token comment"># 1. 获取 windows7 的开机选单</span></span>
<span class="line"><span class="token comment"># 2. 回到 MBR 的预设环境</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">win7 在 /dev/sda2，因此是 hd0,msdos2，而 MBR 则是 hd0 即可，因此设置如下</span>
<span class="line"></span>
<span class="line"><span class="token function">vim</span> /etc/grub.d/40_custom</span>
<span class="line">menuentry <span class="token string">'Go to Windows 7'</span> <span class="token parameter variable">--id</span> <span class="token string">'win7'</span>  <span class="token punctuation">{</span></span>
<span class="line">	insmod chain		</span>
<span class="line">	insmod ntfs			</span>
<span class="line">	<span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token punctuation">(</span>hd0,2<span class="token punctuation">)</span>	</span>
<span class="line">	chainloader +1 		</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">menuentry <span class="token string">'go to MBR'</span> <span class="token parameter variable">--id</span> <span class="token string">'mbr'</span> <span class="token punctuation">{</span></span>
<span class="line">	insmod chain			</span>
<span class="line">	<span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token punctuation">(</span>hd0<span class="token punctuation">)</span></span>
<span class="line">	chainloader +1</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如果每次都想要 windows 变成默认的开机选项，</span></span>
<span class="line"><span class="token comment"># 那么在 /etc/default/grub 中设置 GRUB_DEFAULT=win7</span></span>
<span class="line"><span class="token comment"># 再使用 grub2-mkconfig 即可，通过 --id 来处理，不需要去计算  menuentry 的顺序</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="initramfs-的重要性与监理新-initramfs-文件" tabindex="-1"><a class="header-anchor" href="#initramfs-的重要性与监理新-initramfs-文件"><span>initramfs 的重要性与监理新 initramfs 文件</span></a></h2>
<p>在前面提到过 initramfs，它的目的是在于提供开机过程中所需要的最重要核心模块，让系统开机过程可以顺利完成。</p>
<p>一般来说，需要 initramfs 的时刻有：</p>
<ul>
<li>根目录所在磁盘为 STAT、USB 或 SCSI 等连接接口</li>
<li>根目录所在文件系统为 LVM、RAID 等特殊格式</li>
<li>根目录所在文件系统为非传统 LInux 认识的文件系统时</li>
<li>其他必须要在核心加载时提供的模块</li>
</ul>
<p>一般来说，各 distribution 提供的核心都会附上 initramfs 文件，但是如果你有特殊需要想重新制作 initramfs 文件的话，可以使用 <code v-pre>dracut\mkinitrd </code> 来处理</p>
<p>在 CentOS 7 下应该使用 dracut，这里也主要介绍它</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">dracut <span class="token punctuation">[</span>-fv<span class="token punctuation">]</span> <span class="token punctuation">[</span>--add-drivers 列表<span class="token punctuation">]</span> initramfs 文件名 核心版本</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line"></span>
<span class="line">	-f：强迫编译出 initramfs，如果 initramfs 文件已经存在，则覆盖旧文件</span>
<span class="line">	-v：显示 dracut 的运行过程</span>
<span class="line">	--add-drivers 列表：在原本的默认核心模块中，增加某些你想要的模块，模块维护核心所在目录 <span class="token variable"><span class="token variable">`</span>/lib/modules/<span class="token punctuation">$(</span>uname -r<span class="token punctuation">)</span>/kernel/*<span class="token variable">`</span></span></span>
<span class="line">	initramfs 文件名：你需要的文件名，开头最好以 initramfs，后面接版本与功能</span>
<span class="line">	核心版本：默认是目前运行中的核心版本，也可以手动输入其他不同版本</span>
<span class="line">	</span>
<span class="line">	dracut 还有很多功能。例如下面的几个参数：</span>
<span class="line">	--modules：将 dracut 所提供的开机锁需模块（核心模块）加载，可用模块在 /usr/lib/dracut/modules.d/ 目录</span>
<span class="line">	--gzip<span class="token operator">|</span>--bzip2<span class="token operator">|</span>--xz：尝试使用哪一种压缩方式来进行 initramfs 压缩，默认使用 <span class="token function">gzip</span></span>
<span class="line">	--filesystem：加入某些额外的文件系支持 </span>
<span class="line">	</span>
<span class="line"><span class="token comment"># 范例 1：以 dracut 的默认功能建立一个 initramfs 虚拟盘文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dracut -v initramfs-test.img $(uname -r)</span></span>
<span class="line">Executing: /sbin/dracut <span class="token parameter variable">-v</span> initramfs-test.img <span class="token number">3.10</span>.0-1062.el7.x86_64</span>
<span class="line">dracut module <span class="token string">'busybox'</span> will not be installed, because <span class="token builtin class-name">command</span> <span class="token string">'busybox'</span> could not be found<span class="token operator">!</span></span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">dracut module <span class="token string">'cifs'</span> will not be installed, because <span class="token builtin class-name">command</span> <span class="token string">'mount.cifs'</span> could not be found<span class="token operator">!</span></span>
<span class="line">*** Including module: <span class="token function">bash</span> ***</span>
<span class="line">*** Including module: nss-softokn ***</span>
<span class="line">*** Including module: i18n ***</span>
<span class="line">*** Including module: network ***</span>
<span class="line">*** Including module: ifcfg ***</span>
<span class="line">*** Including module: drm ***</span>
<span class="line">*** Including module: plymouth ***</span>
<span class="line">*** Including module: dm ***</span>
<span class="line">Skipping udev rule: <span class="token number">64</span>-device-mapper.rules</span>
<span class="line"><span class="token punctuation">..</span><span class="token punctuation">..</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：额外加入 e100e 网卡驱动与 ext4/nfs 文件系统在新的 initramfs 内</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dracut -v --add-drivers "e10001" --filesystems "ext4 nfs" initramfs-new.img $(uname -r)</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsinitrd initramfs-new.img | grep -E '(e1000|ext4|nfs)'</span></span>
<span class="line">Arguments: <span class="token parameter variable">-v</span> --add-drivers <span class="token string">'e10001'</span> <span class="token parameter variable">--filesystems</span> <span class="token string">'ext4 nfs'</span></span>
<span class="line">nfs</span>
<span class="line">-rw-r--r--   <span class="token number">1</span> root     root           <span class="token number">15</span> Mar <span class="token number">29</span> <span class="token number">21</span>:52 etc/modprobe.d/nfs.conf</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>建立完成之后，同时核心也处理完成后，就可以使用 grub2 来建立选单了。下面继续</p>
</li>
</ul>
<h2 id="测试与安装-grub2" tabindex="-1"><a class="header-anchor" href="#测试与安装-grub2"><span>测试与安装 grub2</span></a></h2>
<p>如果你的 Linux 主机本来就使用 grub2 作为 loader 的话，就不需要重新安装了，如果并非使用 grub2，那么需要安装</p>
<p>首先：必须使用 grub-install 将一些必要的文件复制到 /boot/grub2 中，应该这样做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">grub2-install <span class="token punctuation">[</span>-boot-directory<span class="token operator">=</span>DIR<span class="token punctuation">]</span> INSTALL_DEVIVCE</span>
<span class="line"></span>
<span class="line">--boot-directory<span class="token operator">=</span>DIR：DIR 是实际的目录，使用 grub2-install 默认会将 grub2 所有的文件都复制到 <span class="token variable"><span class="token variable">`</span>/boot/grub2/*<span class="token variable">`</span></span> ，如果想复制到其他目录与设备，需要使用该参数</span>
<span class="line">INSTALL_DEVIVCE：安装设置代号</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 将 grub2 安装在目录系统的 MBR 下，我的系统为 /dev/sda</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-install /dev/sda</span></span>
<span class="line"><span class="token comment"># 如果原来就是 grub2，所以可能不会有什么特别的信息</span></span>
<span class="line"><span class="token comment"># 但是去查看相关文件更新日期会发现被更新过了，因为是重装</span></span>
<span class="line"><span class="token comment"># 但是我们并没有配置文件，需要自己创建</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基本上，grub2-install 大概仅安装 grub2 主程序与相关软件到 <code v-pre>/boot/grub2</code> 目录，如果后面的设备是整个系统 (/dev/sda、/dev/vds ...)，那 loader 的程序才会写入到 MBR 中去。</p>
<p>如果 XFS 文件系统的 /dev/sda2 设备（个别 partition），那么 grub2-install 就会告诉你，该文件系统并不支持 grub2 的安装。</p>
<p>下面强迫写入试试</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 尝试看看你的系统中是否有 xfs 文件系统，且为传统的 parition 类型</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -T | grep -i xfs</span></span>
<span class="line">/dev/mapper/centos-root xfs       <span class="token number">10475520</span> <span class="token number">5475932</span>   <span class="token number">4999588</span>  <span class="token number">53</span>% /</span>
<span class="line">/dev/sda2               xfs        <span class="token number">1038336</span>  <span class="token number">184348</span>    <span class="token number">853988</span>  <span class="token number">18</span>% /boot</span>
<span class="line">/dev/mapper/centos-home xfs        <span class="token number">5232640</span>  <span class="token number">949064</span>   <span class="token number">4283576</span>  <span class="token number">19</span>% /home</span>
<span class="line"><span class="token comment"># 笔者这里没有其他的分区。直接把书上的分区列出来</span></span>
<span class="line">/dev/vda4							  xfs        <span class="token number">5232640</span>  <span class="token number">949064</span>   <span class="token number">4283576</span>  <span class="token number">19</span>% /srv/myproject</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 那么下面使用 /dev/vda4 来安装</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-install /dev/vda4</span></span>
<span class="line">grub2-install: error: hostdisk/dev/vda appears to con<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span> <span class="token punctuation">(</span>--skip-fs-probe <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 报错了，恐怕不支持你的 boot sector ，这应该是误判，使用强制安装</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-install --skip-fs-probe /dev/vda4</span></span>
<span class="line">Installing <span class="token keyword">for</span> i386-pc platform.</span>
<span class="line">grub2-install:warning: FIle system <span class="token string">'xfs'</span> doesn‘t support embedding</span>
<span class="line"><span class="token punctuation">..</span><span class="token punctuation">..</span></span>
<span class="line">grub2-install:error: will not proceed with blocklists</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还是失败，因为还是担心 xfs 被搞死，使用如下参数再测一次</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-install --force --recheck --skip-fs-probe /dev/vda4</span></span>
<span class="line">Installing <span class="token keyword">for</span> i386-pc platform.</span>
<span class="line">grub2-install:warning: FIle system <span class="token string">'xfs'</span> doesn‘t support embedding</span>
<span class="line"><span class="token punctuation">..</span><span class="token punctuation">..</span></span>
<span class="line">Installation finished.NO error reporled</span>
<span class="line"><span class="token comment"># 安装好了，只出现了警告信息，但是错误没有了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这样将 grub2 的主程序安装到 /dev/vda4 以及重新安装到 MBR 里面去了。</p>
<p>思考下：grub2 主程序会找 grub.cfg 文件，大多是在 /boot/grub2/grub.cfg 里。那么我们的 MBR 与 /dev/vda4 都是到 /boot/grub2/grub.cfg 去抓设置吗？如果是多重操作系统怎么办？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 问：假设你的测试系统上使用 MBR 分区槽，并且出现如下数据</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fdisk -l /dev/sda </span></span>
<span class="line">Device Boot         Start           End    	Blocks  		Id    System</span>
<span class="line">/dev/sda1 					   <span class="token number">2048</span>         <span class="token number">6143</span>     <span class="token number">44444</span>			<span class="token number">83</span>		Linux</span>
<span class="line">/dev/sda2 *					   <span class="token number">6144</span>      <span class="token number">2103295</span>     <span class="token number">999999</span>			<span class="token number">7</span>		  HPFS/NTFS/exFAT</span>
<span class="line">/dev/sda3 					<span class="token number">2103296</span>     <span class="token number">65026047</span>     <span class="token number">222222</span>			<span class="token number">84</span>		Linux</span>
<span class="line"></span>
<span class="line">sda1 与 sda3 是两个 CentOS <span class="token number">7</span> 系统。</span>
<span class="line">sda2 是一个 windows7 系统</span>
<span class="line">安装流程是 sda1、sda2、sda3 ，因此安装好而且重启后，系统其实是默认进入 sda3 这个 CentOS <span class="token number">7</span> 系统的。此时 MBR 会去读取的配置文件在 <span class="token punctuation">(</span>/dev/sda3<span class="token punctuation">)</span>/boot/grub2/grub.cfg</span>
<span class="line"></span>
<span class="line">因为 sda1 应该是用来管理开机选单的，而 sda2 以及 sda3 在规划中就是用来让学生操作的，因此默认情况下  sda1 内的 CentOS 系统应该只会在开机的使用用到，或则是出问题时才会用到。</span>
<span class="line">而 sd2 与 sd3 则可能因为学生无用，因此未来可能会升级或删除或重装等，</span>
<span class="line">那如何让系统永远都是使用 /dev/sda1 开机？</span>
<span class="line"></span>
<span class="line">答：因为 MBR 的 boot loader 应该去 <span class="token punctuation">(</span>/dev/sda1<span class="token punctuation">)</span>/boot/grub2/grub.cfg 读取相关设置才是正常的，所以可以使用集中基本的方式来处理：</span>
<span class="line"></span>
<span class="line"><span class="token number">1</span>. 因为 CentOS <span class="token number">7</span> 会主动找其他操作系统，因此可以在 sda3 的开机选单中找到 sda1 的开机选项，使用该选项进入系统，就可以进入 sda1 了</span>
<span class="line"><span class="token number">2</span>. 假设没能抓到 sda1，那可以在 sda3 下使用 <span class="token function">chroot</span> 来进入 sda1</span>
<span class="line"><span class="token number">3</span>、 使用救援光盘去抓到正确的 sda1.然后去的 sda1 的系统</span>
<span class="line"></span>
<span class="line">等进入到系统之后，修改 /etc/default/grub 以及 /etc/grub.d/40_custom 后，使用 grub2-mkconfig <span class="token parameter variable">-o</span> / boot/grb2/grub.cfg. 然后重新  grub2-install/dev/sda 就能够让你的 MBR 去获取 /dev/sda1 内的配置文件了</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 问：前面的练习，测试机目前为 40 秒倒数，且有一个强制进入图形界面 My graphical CentOS 7 的选单</span></span>
<span class="line"><span class="token comment"># 现在需要多加两个选单，一个是回到 MBR 的 chainloader </span></span>
<span class="line"><span class="token comment"># 一个使用 sda4 的 chainloadder 该如何处理？</span></span>
<span class="line"></span>
<span class="line"><span class="token function">vim</span> /etc/grub.d/40_custom</span>
<span class="line"><span class="token function">vim</span> /etc/grub.d/40_custom</span>
<span class="line">menuentry <span class="token string">'Goto MBR'</span><span class="token punctuation">{</span></span>
<span class="line">	insmod chain		</span>
<span class="line">	insmod part_gpt			</span>
<span class="line">	<span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token punctuation">(</span>hd0<span class="token punctuation">)</span>	</span>
<span class="line">	chainloader +1 		</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">menuentry <span class="token string">'Goto /dev/sda4'</span><span class="token punctuation">{</span></span>
<span class="line">	insmod chain			</span>
<span class="line">	insmod part_gpt			</span>
<span class="line">	<span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token punctuation">(</span>hd0.gpt4<span class="token punctuation">)</span></span>
<span class="line">	chainloader +1</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">grub2-mkconfig <span class="token parameter variable">-o</span> /boot/grub2/grub.cfg</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后总结：</p>
<ol>
<li>
<p>如何是从其他 boot loader 转成 grub2 时，需要先使用 grub2-install 安装 grub2 配置文件</p>
<p>如果安装到 partition 时，可能需要加上额外的许多参数才能够顺利安装</p>
</li>
<li>
<p>开始编辑 <code v-pre>/etc/default/grub 以及 /etc/grub.d/*</code> 重要的配置文件</p>
</li>
<li>
<p>使用 <code v-pre>grub2-mkconfig -o /boot/grub2/grub.cfg</code> 来建立开机的配置文件</p>
</li>
</ol>
<h2 id="开机前的额外功能修改" tabindex="-1"><a class="header-anchor" href="#开机前的额外功能修改"><span>开机前的额外功能修改</span></a></h2>
<p>前面部分由于没有额外的分区，没有跟着做，导致这里无法显示没有做的那一部分选单，该章节直接使用书上的截图</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200331214428334.png" alt="image-20200331214428334"></p>
<p>上面的 ‘e’ ，表示按 e 键可以进入编辑模式，直接对该选项进行编辑</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200331214650243.png" alt="image-20200331214650243"></p>
<p>上面就是我们在 grub.cfg 里的配置的内容，这里可以直接修改。下半部分则是一些说明，可以使用 ctrl + x 重启，ctrl + c 或 esc 可返回上个画面</p>
<p>问题：在线编辑，让系统进入救援模式 （rescue），而不像要进入系统后使用 systemctl rescue 时，怎么做？</p>
<p>答：可使用在线编辑模式，找到下图的 linux16 的项，然后添加服务参数</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200331215159375.png" alt="image-20200331215159375"></p>
<p>修改之后，再重启就可以直接进入救援模式了</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200331215301052.png" alt="image-20200331215301052"></p>
<p>进入 runlevel 需要输入密码？后续会讲解如何处理（不输入密码）</p>
<h2 id="关于开机画面与终端机画面的图形显示方式" tabindex="-1"><a class="header-anchor" href="#关于开机画面与终端机画面的图形显示方式"><span>关于开机画面与终端机画面的图形显示方式</span></a></h2>
<p>如果想用开机画面使用图形显示方式，如使用中文来显示开机画面。我们预设的 locale 的语系是 <code v-pre>zh_CN.UTF-8</code>，所以理论上会显示中文才对，可以修改 grub.cfg 来达成</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/default/grub</span></span>
<span class="line"><span class="token punctuation">..</span><span class="token punctuation">..</span>.</span>
<span class="line"><span class="token assign-left variable">GRUB_TERMINAL</span><span class="token operator">=</span>gfxterm					<span class="token comment"># 设置主要的终端机显示为图形界面</span></span>
<span class="line"><span class="token assign-left variable">GRUB_GFXMODE</span><span class="token operator">=</span>1024x768x24			<span class="token comment"># 图形界面的 x、y、彩度信息</span></span>
<span class="line"><span class="token assign-left variable">GRUB_GFPAYLOAD_LINUX</span><span class="token operator">=</span>keep			<span class="token comment"># 保留图形界面，不要使用 text</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新建立配置文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-mkconfig -o /boot/grub2/grub.cfg </span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启时，就能看到如下的画面了</p>
<p><img src="@source/tutorial-basis/19/assets/image-20200331220333935.png" alt="image-20200331220333935"></p>
<p>后面这个开机选单中的中文是修改 menuentry 出来的，不是自动出来的哈</p>
<h2 id="为个别选单加上密码" tabindex="-1"><a class="header-anchor" href="#为个别选单加上密码"><span>为个别选单加上密码</span></a></h2>
<p>前面在讲解可以在开机时进入 grub2 的指令画面进入修改选单参数等，如果是在公共教室情况下，想要加密某个选单还是有必要的</p>
<p>grub2 的控制有：</p>
<ol>
<li>
<p>grub2 的选单指令列修改</p>
</li>
<li>
<p>进入选择的选单开机流程</p>
</li>
</ol>
<p>要使用密码的话，就涉及到 grub2 的账户机制了</p>
<h3 id="grub2-的账户、密码与选单设置" tabindex="-1"><a class="header-anchor" href="#grub2-的账户、密码与选单设置"><span>grub2 的账户、密码与选单设置</span></a></h3>
<p>在 grub2 的选单管理中，针对两种身份进行密码设置：</p>
<ul>
<li>
<p>superusers：</p>
<p>设置系统管理员与相关参数还有密码等，使用这个密码的用户，将可再 grub2 内具有所有修改的权限。但一旦设置了这个参数，则所有的指令修改将会受到限制</p>
</li>
<li>
<p>users</p>
<p>设置一般账户的相关参数与密码，可以设置多个账户，使用该密码的用户可以选择要进入某些选单项目。不过，选单项目也需要搭配相对应的账户才可以</p>
<p>一般来说，使用这种密码的账户并不能修改选单的内容，仅能选择进入选单去开机</p>
</li>
</ul>
<p>下面的例子，不能用在测试机上面，笔者也直接抄下来了</p>
<p>假设系统有三个操作系统，分别安装在 <code v-pre>(hd0,1)、(hd0,2)、(hd0,3)</code></p>
<ul>
<li><code v-pre>(hd0,1)</code>：所有人都可以进入</li>
<li><code v-pre>(hd0,2)</code>：只有系统管理员可进入的系统</li>
<li><code v-pre>(hd0,3)</code>：另一个一般用户与管理员可以进入的系统</li>
</ul>
<p>系统管理员账户密码设置为 <code v-pre>mrcode/123456</code>，一般账户为 <code v-pre>mrcode2/456789</code></p>
<p>如上的需求，没有用到 Linux 的 linux16 与 initrd16 的项目，只需要 chainloader 的项目，因此，整个 grub.cfg 类似如下内容</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先设置好管理员与一般账户的名称与密码</span></span>
<span class="line"><span class="token builtin class-name">set</span> <span class="token assign-left variable">superusers</span><span class="token operator">=</span><span class="token string">'mrcode'</span>		<span class="token comment"># 管理员账户名</span></span>
<span class="line">password mrcode <span class="token number">123456</span>		<span class="token comment"># 设置账户名和密码</span></span>
<span class="line">password mrcode2 <span class="token number">456789</span>		<span class="token comment"># 一般账户名密码</span></span>
<span class="line"></span>
<span class="line">menuentry <span class="token string">"大家都可以选择开机"</span> --unrestricted<span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">set</span> root<span class="token punctuation">(</span>hd0,1<span class="token punctuation">)</span></span>
<span class="line">	chainloader +1</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">menuentry <span class="token string">"只有管理员的密码才有办法使用"</span> <span class="token parameter variable">--users</span> <span class="token string">""</span><span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">set</span> root<span class="token punctuation">(</span>hd0,1<span class="token punctuation">)</span></span>
<span class="line">	chainloader +1</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以看到这里使用 --users 声明了 mrcode2 账户</span></span>
<span class="line">menuentry <span class="token string">"只有管理员与  mrcode2 才可以使用"</span> <span class="token parameter variable">--users</span> mrcode2 <span class="token punctuation">{</span></span>
<span class="line">	<span class="token builtin class-name">set</span> root<span class="token punctuation">(</span>hd0,3<span class="token punctuation">)</span></span>
<span class="line">	chainloader +1</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上所示：使用 superusers 声明管理员账户，使用 password 来设置账户密码，密码有以下两种</p>
<ul>
<li>password_pbkdf2 账户 「使用 grub2-mkpasswd-pbkdf2 所产生的密码」</li>
<li>password 账号「 没有加密的明文密码」</li>
</ul>
<p>上面的内容不要手动去修改 grub.cfg 文件，而是放到相关环境配置文件下，下面开始讲解</p>
<h3 id="grub2-密码设置的文件位置与加密密码" tabindex="-1"><a class="header-anchor" href="#grub2-密码设置的文件位置与加密密码"><span>grub2 密码设置的文件位置与加密密码</span></a></h3>
<p>前几小节讲到主要的环境设置在 <code v-pre>/etc/grub.d/*</code> 里面有一个 <code v-pre>00_header</code> 文件，但是不建议修改它，所以可以自己建立一个 <code v-pre>01_user</code> 的文件，要注意是两个数字开头的前缀才可以，表示优先级被读取的顺序</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 先获取两个账户的加密密码</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-mkpasswd-pbkdf2 </span></span>
<span class="line">Enter password: </span>
<span class="line">Reenter password: </span>
<span class="line">PBKDF2 <span class="token builtin class-name">hash</span> of your password is grub.pbkdf2.sha512.10000.DB145873C4E3C7ACD4A549416F8F15751EBC79D6C91F78356239AB277D0A0D89790F7CF98EA8C435ACD51C019D36AF945FCE41228AD8B0C43055ADCE4A61D7E4.37ABF2CA07512796ED302DF38C9C0CC7E407B16E5B656E49770F89E65CC590EC2F30E9160237FEE6F520D1EBACA97A7160D576B33F58AFEFE50857A849DFA8E6</span>
<span class="line"><span class="token comment"># 这个加密密码可真长</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 将密码与账户写入到 01_users 文件内</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/grub.d/01_users</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span> <span class="token string">eof</span>
<span class="line">set superusers='mrcode'		</span>
<span class="line">password_pbkdf2 mrcode grub.pbkdf2.sha512.10000.DB145873C4E3C7ACD4A5...</span>
<span class="line">password_pbkdf2 mrcode2 grub.pbkdf2.sha512.10000.DB145873C4E3C7ACD4A5x...		</span>
<span class="line">eof</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 特别注意，因为 /etc/grub.d/ 下的文件应该是执行文件</span></span>
<span class="line"><span class="token comment"># 所以不能直接写账户密码，而是通过 cat 或 echo 等指令方式将密码数据显示出来</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 因为是执行文件，给执行权限</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># chmod a+x  /etc/grub.d/01_users</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="为个别的选单设置账户密码的使用模式" tabindex="-1"><a class="header-anchor" href="#为个别的选单设置账户密码的使用模式"><span>为个别的选单设置账户密码的使用模式</span></a></h3>
<p>回写之前的设置，目前测试机器的 Linux 系统选单应该有 5 个：</p>
<ul>
<li>来自 <code v-pre>/etc/grub.d/10_linux</code>  文件主动检测到的两个 menuentry</li>
<li>来自 <code v-pre>/etc/grub.d/40_custom</code> 文件我们自己主动设置的三个 menuentry</li>
</ul>
<p>由于上述在 <code v-pre>/etc/grub.d/01_users</code> 设置了管理员，那么只有知道管理员密码的情况下，才可以修改每个选单内的参数等信息了</p>
<p>设置 10_linux 制作出来的 menuentry 的选单，正常开机，所以不要使用密码，设置如下</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/grub.d/10_linux </span></span>
<span class="line"><span class="token assign-left variable">CLASS</span><span class="token operator">=</span><span class="token string">"--class gnu-linux --class gnu --class os --unrestricted"</span></span>
<span class="line"><span class="token comment"># 上述配置是该文件默认就有的配置</span></span>
<span class="line"><span class="token comment"># --unrestricted 不受限制，如果要受限制可将 --unrestricted 修改为 --users "账户名称"</span></span>
<span class="line"><span class="token comment"># 默认选单的我们建议不修改</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在假设需要在 <code v-pre>40_custom</code> 里，添加一个可以进入救援模式 rescue 的环境，并且放到最后一个选单中，同时只有知道 mrcode2 的密码才可以使用，应该这样做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vim /etc/grub.d/40_custom</span></span>
<span class="line"><span class="token punctuation">..</span><span class="token punctuation">..</span></span>
<span class="line">menuentry <span class="token string">'Rescue CentOS7,with Linux 3.xx'</span> <span class="token parameter variable">--users</span> mrcode2 <span class="token punctuation">{</span></span>
<span class="line">        load_video</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">gfxpayload</span><span class="token operator">=</span>keep</span>
<span class="line">        insmod gzio</span>
<span class="line">        insmod part_gpt</span>
<span class="line">        insmod xfs</span>
<span class="line">        <span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token string">'hd0,gpt2'</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">[</span> x<span class="token variable">$feature_platform_search_hint</span> <span class="token operator">=</span> xy <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root --hint-bios<span class="token operator">=</span>hd0,gpt2 --hint-efi<span class="token operator">=</span>hd0,gpt2 --hint-baremetal<span class="token operator">=</span>ahci0,gpt2  13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">          search --no-floppy --fs-uuid <span class="token parameter variable">--set</span><span class="token operator">=</span>root 13d0663f-4cbd-412d-aa9f-975eb18da590</span>
<span class="line">        <span class="token keyword">fi</span></span>
<span class="line">        linux16 /vmlinuz-3.10.0-1062.el7.x86_64 <span class="token assign-left variable">root</span><span class="token operator">=</span>/dev/mapper/centos-root ro <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto <span class="token assign-left variable">spectre_v2</span><span class="token operator">=</span>retpoline <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/root <span class="token assign-left variable">rd.lvm.lv</span><span class="token operator">=</span>centos/swap rhgb quiet <span class="token assign-left variable">elevator</span><span class="token operator">=</span>deadline <span class="token assign-left variable">systemd.unit</span><span class="token operator">=</span>rescue.target  <span class="token comment"># 这里配置救援环境</span></span>
<span class="line">        initrd16 /initramfs-3.10.0-1062.el7.x86_64.img</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grub2-mkconfig -o /boot/grub2/grub.cfg</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面由于太多笔者没有跟着敲，导致这里设置开机选单也有不生效，感觉这一章是全军覆没了</p>
<h3 id="设置fallback模式" tabindex="-1"><a class="header-anchor" href="#设置fallback模式"><span>设置fallback模式</span></a></h3>
<p>GRUB支持一种备用机制，如果默认的启动项失败，它可以引导一个或多个其他项。如果需要的话，您可以指定多个备用项。</p>
<p>假设您有三个系统，A'、B'和C'。A'是您默认希望引导的系统。B'是一个备份系统，应该可以安全引导。C'是另一个备份系统，在`B'无法正常引导时使用。</p>
<p>那么您可能希望GRUB引导A'、B'和`C'中可引导的第一个系统。可以按以下方式编写配置文件：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">     default saved        # This is important!!!</span>
<span class="line">     timeout 10</span>
<span class="line">     fallback 1 2         # This is important!!!</span>
<span class="line">     </span>
<span class="line">     title A</span>
<span class="line">     root (hd0,0)</span>
<span class="line">     kernel /kernel</span>
<span class="line">     savedefault fallback # This is important!!!</span>
<span class="line">     </span>
<span class="line">     title B</span>
<span class="line">     root (hd1,0)</span>
<span class="line">     kernel /kernel</span>
<span class="line">     savedefault fallback # This is important!!!</span>
<span class="line">     </span>
<span class="line">     title C</span>
<span class="line">     root (hd2,0)</span>
<span class="line">     kernel /kernel</span>
<span class="line">     savedefault</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>请注意，配置文件中使用了default saved',fallback 1 2'和`savedefault fallback'。在这个配置中，GRUB默认引导一个已保存的项，并将一个备用项保存为下一个引导项。</p>
<p>当GRUB尝试引导A'时，GRUB将1'保存为下一个引导项，因为fallback命令指定1'是第一个备用项。而1'对应的是B'，所以GRUB将在下一次引导时尝试引导B'。</p>
<p>同样地，当GRUB尝试引导B'时，GRUB将2'保存为下一个引导项，因为fallback指定2'作为下一个备用项。这确保在引导B'后，GRUB将引导`C'。</p>
<p>值得注意的是，无论是在GRUB本身引导项失败还是在A'或B'启动您的系统失败时，GRUB都会使用备用项。因此，这个解决方案确保即使GRUB找不到您的内核或内核发生崩溃，您的系统也能够启动。</p>
<p>然而，当A'正确启动或您修复A'后，您需要运行grub-set-default，因为GRUB始终将下一个引导项设置为备用项。您可以在启动脚本（如rc.local）中运行这个命令来将`A'设置为默认引导项：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">     # grub-set-default 0</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这里的0'是系统A'的引导项号码。</p>
<p>如果您想查看当前的默认引导项，可以查看文件/boot/grub/default（或某些系统中的/grub/default）。由于该文件是纯文本文件，您可以直接使用cat命令查看。但强烈建议不要直接修改该文件，因为如果您以意外的方式更改该文件，GRUB可能无法保存默认引导项在该文件中。因此，当您需要更改默认引导项时，请使用grub-set-default命令。</p>
</div></template>


