<template><div><h1 id="核心与核心模块" tabindex="-1"><a class="header-anchor" href="#核心与核心模块"><span>核心与核心模块</span></a></h1>
<p>整个开机流程讲完，在整个开机过程中，是否能够成功的驱动我们主机的硬件设备，是核心的工作，而核心一般都是压缩文件，因此需要先解压后才能加载主存储器中</p>
<p>目前的核心都是具有可读取模块化驱动程序的功能，即模块化（modules），该模块可能由硬件开发厂商提供，也有可能核心本来就支持，较新的硬件，通常都需要硬件开发商提供驱动程序的模块</p>
<p>核心与核心模块位置：</p>
<ul>
<li>核心：<code v-pre>/boot/vmlinuz</code> 或 <code v-pre>/boot/vminuz-version</code></li>
<li>核心解压缩需 RAM disk：<code v-pre>/boot/initramfs(/boot/initramfs-version)</code></li>
<li>核心模块：<code v-pre>/lib/modules/version/kernel</code> 或 <code v-pre>/lib/modules/$(uname-r)</code>/kernel</li>
<li>核心原始码：<code v-pre>/usr/src/linux</code> 或 <code v-pre>/usr/src/kernels/</code> (默认不安装，安装才会有)</li>
</ul>
<p>如果该核心被顺利加载到系统中了，那么就会有如下信息记录下来</p>
<ul>
<li>核心版本：<code v-pre>/proc/version</code></li>
<li>系统核心功能：<code v-pre>/proc/sys/kernel</code></li>
</ul>
<p>问题来了：如果有个新的硬件，我的操作系统不支持怎么办？</p>
<ul>
<li>重新编译核心，并加入最新的硬件驱动程序原始码</li>
<li>将该硬件的驱动程序编译成为模块，在开机时加载该模块</li>
</ul>
<p>关于怎么编译可以参考后续的第 21 章。</p>
<h2 id="核心模块与相依性" tabindex="-1"><a class="header-anchor" href="#核心模块与相依性"><span>核心模块与相依性</span></a></h2>
<p>基本上核心模块在 <code v-pre>/lib/modules/$(uname -r)/kernel</code> 中，主要分成几个目录</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">arch：与硬件平台有关项目，例如 CPU 的等级等</span>
<span class="line">crypto：核心所支持的加密技术，例如 md5 或则是 des 等</span>
<span class="line">drivers：一些硬件的驱动程序，例如显卡、网卡、PCI 相关硬件</span>
<span class="line">fs：核心所支持的 filesystems，例如 vfat、reiserfs、nfs 等</span>
<span class="line">lib：一些函数库</span>
<span class="line">net：与网络有关的各项协议数据，还有防火墙模块（net、ipv4、netfilter） 等</span>
<span class="line">sound：与音效有关</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有一个文件记录了核心支持的模块的各项相依性：<code v-pre>/lib/modules/$(uname -r)/modules.dep</code>, 可以使用 depmod 指令来管理</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">depmod <span class="token punctuation">[</span>-Ane<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-A：不加任何参数时，depmod 会主动分析目前核心的模块，并且重新写入该文件中。若加入 <span class="token parameter variable">-A</span> 参数时，则会去搜索比 modules.dep 内还要新的模块，如果找到新模块，才会更新</span>
<span class="line">	-n：不写入 modules.dep ,而是将结果输出到屏幕上</span>
<span class="line">	-e：显示出目前已加载的不可执行的模块名称</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例：若我做好一个网卡驱动程序，文件名为 a.ko  ，如何更新核心想依性？</span></span>
<span class="line"><span class="token function">cp</span> a.ko /lib/modules/<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token parameter variable">-r</span><span class="token variable">)</span></span>/kernel/drivers/net</span>
<span class="line">depmod</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>核心模块扩展名一定是 <code v-pre>.ko</code> 结尾，当使用 depmod 后，该程序会在 <code v-pre> /lib/modules/$(uname -r)/kernel/</code> 目录内，根据相关目录的定义将全部的模块拿来分析，最终才会将分析的结果写入 modules.dep 文件中</p>
<p>该文件很重要，会影响到本章后续会介绍的 modprobe 指令的应用</p>
<h2 id="核心模块的观察" tabindex="-1"><a class="header-anchor" href="#核心模块的观察"><span>核心模块的观察</span></a></h2>
<p>可以通过  lsmod 知道目前核心加载了多少模块</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsmod </span></span>
<span class="line"><span class="token comment"># 模块名									大小		模块是否被其他模块所使用</span></span>
<span class="line">Module                  Size  Used by</span>
<span class="line">xt_CHECKSUM            <span class="token number">12549</span>  <span class="token number">1</span> </span>
<span class="line">ipt_MASQUERADE         <span class="token number">12678</span>  <span class="token number">3</span> </span>
<span class="line">nf_nat_masquerade_ipv4    <span class="token number">13430</span>  <span class="token number">1</span> ipt_MASQUERADE</span>
<span class="line">tun                    <span class="token number">32026</span>  <span class="token number">1</span> </span>
<span class="line">bridge                <span class="token number">151336</span>  <span class="token number">0</span> </span>
<span class="line">stp                    <span class="token number">12976</span>  <span class="token number">1</span> bridge</span>
<span class="line">llc                    <span class="token number">14552</span>  <span class="token number">2</span> stp,bridge</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">drm										 <span class="token number">311588</span> <span class="token number">4</span> qx1,ttm,drm_kms_helper</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模块是有相依性的，比如上面 nf_nat_masquerade_ipv4 先加载，ipt_MASQUERADE 模块才能够进一步加载到系统中，这两者是有相依性的</p>
<p>想要了解某个块，可以使用 modinfo</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">modinfo <span class="token punctuation">[</span>-adln<span class="token punctuation">]</span> <span class="token punctuation">[</span>module_name<span class="token operator">|</span>filename<span class="token punctuation">]</span></span>
<span class="line">选项与参数：</span>
<span class="line">	-a：仅列出作者名称</span>
<span class="line">	-d：仅列出该 modules 的说明（description）</span>
<span class="line">	-l：仅列出授权 license</span>
<span class="line">	-n：仅列出该模块的详细路径</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例：列出 drm 模块的相关信息</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># modinfo drm</span></span>
<span class="line"><span class="token comment"># 该模块的来源</span></span>
<span class="line">filename:       /lib/modules/3.10.0-1062.el7.x86_64/kernel/drivers/gpu/drm/drm.ko.xz</span>
<span class="line">license:        GPL and additional rights</span>
<span class="line"><span class="token comment"># 该模块的简介</span></span>
<span class="line">description:    DRM shared core routines</span>
<span class="line">author:         Gareth Hughes, Leif Delgass, José Fonseca, Jon Smirl</span>
<span class="line">license:        GPL and additional rights</span>
<span class="line">description:    DRM bridge infrastructure</span>
<span class="line">author:         Ajay Kumar <span class="token operator">&lt;</span>ajaykumar.rs@samsung.com<span class="token operator">></span></span>
<span class="line">retpoline:      Y</span>
<span class="line">rhelversion:    <span class="token number">7.7</span></span>
<span class="line">srcversion:     0B7C5A6948CEE2DF7C405B0</span>
<span class="line">depends:        drm_panel_orientation_quirks</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">sig_hashalgo:   sha256</span>
<span class="line">parm:           edid_firmware:Do not probe monitor, use specified EDID blob from built-in data or /lib/firmware instead.  <span class="token punctuation">(</span>string<span class="token punctuation">)</span></span>
<span class="line">parm:           vblankoffdelay:Delay <span class="token keyword">until</span> vblank irq auto-disable <span class="token punctuation">[</span>msecs<span class="token punctuation">]</span> <span class="token punctuation">(</span><span class="token number">0</span>: never disable, <span class="token operator">&lt;</span><span class="token number">0</span>: disable immediately<span class="token punctuation">)</span> <span class="token punctuation">(</span>int<span class="token punctuation">)</span></span>
<span class="line">parm:           timestamp_precision_usec:Max. error on timestamps <span class="token punctuation">[</span>usecs<span class="token punctuation">]</span> <span class="token punctuation">(</span>int<span class="token punctuation">)</span></span>
<span class="line">parm:           edid_fixup:Minimum number of valid EDID header bytes <span class="token punctuation">(</span><span class="token number">0</span>-8, default <span class="token number">6</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>int<span class="token punctuation">)</span></span>
<span class="line">parm:           debug:Enable debug output, where each bit enables a debug category.</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该指令处理可以查询在核心内的模块，还可以检查某个模块文件。</p>
<h2 id="核心模块的加载与移除" tabindex="-1"><a class="header-anchor" href="#核心模块的加载与移除"><span>核心模块的加载与移除</span></a></h2>
<p>如想手动加载模块？有很多方法，这里推荐最简单的方式，就是使用 modprobe 指令来加载模块，因为它会主动搜索 modules.dep 的内容，先克服了模块的相依性后，才决定需要加载的模块有哪些</p>
<p>而 insmod 则完全由使用者加载一个完整文件名的模块，并不会主动分析模块的相依性</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">insmod <span class="token punctuation">[</span>/full/path/module_name<span class="token punctuation">]</span> <span class="token punctuation">[</span>parameters<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：尝试载入 cifs.ko 文件系统模块</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># insmod /lib/modules/$(uname -r)/kernel/fs/fat/fat.ko.xz</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsmod | grep fat</span></span>
<span class="line">fat                    <span class="token number">65950</span>  <span class="token number">0</span> </span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>like就被加载了，但是需要完整的路径</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">rmmod <span class="token punctuation">[</span>-fw<span class="token punctuation">]</span> module_name</span>
<span class="line"></span>
<span class="line">-f：强制移除该模块，无论是否正在使用</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1：将刚刚加载的模块移除</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rmmod fat</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsmod | grep fat</span></span>
<span class="line"><span class="token comment"># 就被移除掉了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 范例 2：加载 vfat 这个文件系统模块</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># insmod /lib/modules/$(uname -r)/kernel/fs/fat/vfat.ko.xz</span></span>
<span class="line">insmod: ERROR: could not insert module /lib/modules/3.10.0-1062.el7.x86_64/kernel/fs/fat/vfat.ko.xz: Unknown symbol <span class="token keyword">in</span> module</span>
<span class="line"><span class="token comment"># 无法加载</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面就由于有模块相依性，无法直接被加载，就可以使用 modprobe 来处理</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">modprobe <span class="token punctuation">[</span>-cfr<span class="token punctuation">]</span> module_name</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-c：列出目前系统所有的模块（更详细的代号对应表）</span>
<span class="line">	-f：强制加载该模块</span>
<span class="line">	-r：类似 rmmod</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 范例 1： 加载 vfat 模块</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># modprobe vfat</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsmod | grep vfat</span></span>
<span class="line">vfat                   <span class="token number">17461</span>  <span class="token number">0</span> </span>
<span class="line">fat                    <span class="token number">65950</span>  <span class="token number">1</span> vfat</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以看到，自己就帮我们解决了模块的相依性问题，而且只需要知道模块名</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心模块的额外参数设置-etc-modprobe-d-conf" tabindex="-1"><a class="header-anchor" href="#核心模块的额外参数设置-etc-modprobe-d-conf"><span>核心模块的额外参数设置：<code v-pre>/etc/modprobe.d/*.conf</code></span></a></h2>
<p>如果有某些特殊的需求导致你必须要让核心模块加上某些参数时，这个时候可以回到上一章的最后一小节 <strong>开机过程会用到的主要配置文件</strong> 中去了解，重点就是要自己建议 <code v-pre>.conf</code> 的文件，通过 options 来带入核心模块参数</p>
</div></template>


