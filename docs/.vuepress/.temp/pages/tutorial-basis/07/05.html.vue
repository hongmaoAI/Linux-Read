<template><div><h1 id="内存交换空间-swap-之建置" tabindex="-1"><a class="header-anchor" href="#内存交换空间-swap-之建置"><span>内存交换空间（swap）之建置</span></a></h1>
<p>早期年代因为内存不足，因此可以暂时将内存的程序拿到硬盘中暂放的内存置换空间（swap）就显得非常重要，所以之前老见到说安装 linux 一定需要两个 partition，一个是根目录，另一个就是 swap 了</p>
<p>一般来说，如果硬件资源配置足够的话，swap 应该不会被系统使用到。会被用到的时候，通常就是物理内存不足的情况了。在用到 swap 时，你的主机磁盘灯就会开始闪个不停</p>
<p>但是你不能预估不会存在物理内存不够用的情况，所以预留 swap 是有必要的，特别是在服务器上，不知道什么时候会有大量的网络请求。</p>
<p>假如现在有这样一种情况：系统已经建立起来了，但是却发现没有建立 swap，那么可以通过如下的方式来做</p>
<ul>
<li>设置一个 swap partition</li>
<li>建立一个虚拟内存的文件</li>
</ul>
<h2 id="使用实体分区槽建立-swap" tabindex="-1"><a class="header-anchor" href="#使用实体分区槽建立-swap"><span>使用实体分区槽建立 swap</span></a></h2>
<p>步骤如下</p>
<ol>
<li>分区：使用 gdisk 在磁盘中分区出一个分区槽给系统作为 swap。</li>
<li>格式化：利用建立 swap 格式的 「mkswap 装置文件名」就能够格式化该分区槽成为 swap 格式</li>
<li>使用：最后将该 swap 装置启动，方法为「swapon 装置文件名」</li>
<li>观察：通过 free 与 swapon -s 指令来观察内存的用量</li>
</ol>
<h3 id="_1-分区" tabindex="-1"><a class="header-anchor" href="#_1-分区"><span>1. 分区</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gdisk /dev/sda</span></span>
<span class="line">GPT <span class="token function">fdisk</span> <span class="token punctuation">(</span>gdisk<span class="token punctuation">)</span> version <span class="token number">0.8</span>.10</span>
<span class="line"></span>
<span class="line">Partition table scan:</span>
<span class="line">  MBR: protective</span>
<span class="line">  BSD: not present</span>
<span class="line">  APM: not present</span>
<span class="line">  GPT: present</span>
<span class="line"></span>
<span class="line">Found valid GPT with protective MBR<span class="token punctuation">;</span> using GPT.</span>
<span class="line"></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: n</span>
<span class="line">Partition number <span class="token punctuation">(</span><span class="token number">6</span>-128, default <span class="token number">6</span><span class="token punctuation">)</span>: </span>
<span class="line">First sector <span class="token punctuation">(</span><span class="token number">34</span>-85491678, default <span class="token operator">=</span> <span class="token number">69220352</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>: </span>
<span class="line">Last sector <span class="token punctuation">(</span><span class="token number">69220352</span>-85491678, default <span class="token operator">=</span> <span class="token number">85491678</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>: +512M</span>
<span class="line">Current <span class="token builtin class-name">type</span> is <span class="token string">'Linux filesystem'</span></span>
<span class="line">Hex code or GUID <span class="token punctuation">(</span>L to show codes, Enter <span class="token operator">=</span> <span class="token number">8300</span><span class="token punctuation">)</span>: <span class="token number">8200</span></span>
<span class="line"></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p</span>
<span class="line">Disk /dev/sda: <span class="token number">85491712</span> sectors, <span class="token number">40.8</span> GiB</span>
<span class="line">Logical sector size: <span class="token number">512</span> bytes</span>
<span class="line">Disk identifier <span class="token punctuation">(</span>GUID<span class="token punctuation">)</span>: 67038DBF-B66A-4D0F-92B2-BFBF0744CD1D</span>
<span class="line">Partition table holds up to <span class="token number">128</span> entries</span>
<span class="line">First usable sector is <span class="token number">34</span>, last usable sector is <span class="token number">85491678</span></span>
<span class="line">Partitions will be aligned on <span class="token number">2048</span>-sector boundaries</span>
<span class="line">Total <span class="token function">free</span> space is <span class="token number">15224765</span> sectors <span class="token punctuation">(</span><span class="token number">7.3</span> GiB<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  <span class="token number">8300</span>  Linux filesystem</span>
<span class="line">   <span class="token number">5</span>        <span class="token number">67123200</span>        <span class="token number">69220351</span>   <span class="token number">1024.0</span> MiB  0700  Microsoft basic data</span>
<span class="line">   <span class="token number">6</span>        <span class="token number">69220352</span>        <span class="token number">70268927</span>   <span class="token number">512.0</span> MiB   <span class="token number">8200</span>  Linux swap</span>
<span class="line"></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: w</span>
<span class="line"></span>
<span class="line">Final checks complete. About to <span class="token function">write</span> GPT data. THIS WILL OVERWRITE EXISTING</span>
<span class="line">PARTITIONS<span class="token operator">!</span><span class="token operator">!</span></span>
<span class="line"></span>
<span class="line">Do you want to proceed? <span class="token punctuation">(</span>Y/N<span class="token punctuation">)</span>: y</span>
<span class="line">OK<span class="token punctuation">;</span> writing new GUID partition table <span class="token punctuation">(</span>GPT<span class="token punctuation">)</span> to /dev/sda.</span>
<span class="line">Warning: The kernel is still using the old partition table.</span>
<span class="line">The new table will be used at the next reboot.</span>
<span class="line">The operation has completed successfully.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 刷新分区</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsblk</span></span>
<span class="line">NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span>
<span class="line">sda               <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">40</span>.8G  <span class="token number">0</span> disk </span>
<span class="line">├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>    2M  <span class="token number">0</span> part </span>
<span class="line">├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span>    1G  <span class="token number">0</span> part /boot</span>
<span class="line">├─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>   30G  <span class="token number">0</span> part </span>
<span class="line">│ ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>   10G  <span class="token number">0</span> lvm  /</span>
<span class="line">│ ├─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    1G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">│ └─centos-home <span class="token number">253</span>:2    <span class="token number">0</span>    5G  <span class="token number">0</span> lvm  /home</span>
<span class="line">├─sda4            <span class="token number">8</span>:4    <span class="token number">0</span>    1G  <span class="token number">0</span> part /data/xfs</span>
<span class="line">├─sda5            <span class="token number">8</span>:5    <span class="token number">0</span>    1G  <span class="token number">0</span> part </span>
<span class="line">└─sda6            <span class="token number">8</span>:6    <span class="token number">0</span>  512M  <span class="token number">0</span> part   	<span class="token comment"># 出现了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-建立-swap-格式" tabindex="-1"><a class="header-anchor" href="#_2-建立-swap-格式"><span>2. 建立 swap 格式</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkswap /dev/sda6</span></span>
<span class="line">正在设置交换空间版本 <span class="token number">1</span>，大小 <span class="token operator">=</span> <span class="token number">524284</span> KiB</span>
<span class="line">无标签，UUID<span class="token operator">=</span>89727d5b-a222-4878-be50-19bbb61cabb0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 确实可以抓到该装置了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid /dev/sda6</span></span>
<span class="line">/dev/sda6: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"89727d5b-a222-4878-be50-19bbb61cabb0"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"swap"</span> <span class="token assign-left variable">PARTLABEL</span><span class="token operator">=</span><span class="token string">"Linux swap"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"5fff6d01-b73a-45c2-be69-8fc4a67e0788"</span> </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-开始观察看看" tabindex="-1"><a class="header-anchor" href="#_3-开始观察看看"><span>3. 开始观察看看</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># free</span></span>
<span class="line">              total        used        <span class="token function">free</span>      shared  buff/cache   available</span>
<span class="line">Mem:        <span class="token number">1190952</span>      <span class="token number">389504</span>       <span class="token number">83364</span>       <span class="token number">10916</span>      <span class="token number">718084</span>      <span class="token number">640164</span></span>
<span class="line">Swap:       <span class="token number">1048572</span>           <span class="token number">0</span>     <span class="token number">1048572</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># free -h</span></span>
<span class="line">              total        used        <span class="token function">free</span>      shared  buff/cache   available</span>
<span class="line">Mem:           <span class="token number">1</span>.1G        380M         81M         10M        701M        625M</span>
<span class="line">Swap:          <span class="token number">1</span>.0G          0B        <span class="token number">1</span>.0G</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出目前使用的 swap 装置有哪些</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon -s</span></span>
<span class="line">文件名                          类型            大小    已用    权限</span>
<span class="line">/dev/dm-1                               partition       <span class="token number">1048572</span> <span class="token number">0</span>       <span class="token parameter variable">-2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 swapon 指令挂载 swap 分区槽</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon /dev/sda6</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># free</span></span>
<span class="line">              total        used        <span class="token function">free</span>      shared  buff/cache   available</span>
<span class="line">Mem:        <span class="token number">1190952</span>      <span class="token number">389848</span>       <span class="token number">82492</span>       <span class="token number">10916</span>      <span class="token number">718612</span>      <span class="token number">639820</span></span>
<span class="line">Swap:       <span class="token number">1572856</span>           <span class="token number">0</span>     <span class="token number">1572856</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon -s</span></span>
<span class="line">文件名                          类型            大小    已用    权限</span>
<span class="line">/dev/dm-1                               partition       <span class="token number">1048572</span> <span class="token number">0</span>       <span class="token parameter variable">-2</span></span>
<span class="line">/dev/sda6                               partition       <span class="token number">524284</span>  <span class="token number">0</span>       <span class="token parameter variable">-3</span></span>
<span class="line"><span class="token comment"># 可以看到这里 sda6 被用上了</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 建立永久挂载</span></span>
<span class="line"><span class="token function">nano</span> /etc/fstab</span>
<span class="line"><span class="token comment"># 这里是文件系统，所以没有挂载点，第二个字段写 swap</span></span>
<span class="line"><span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"89727d5b-a222-4878-be50-19bbb61cabb0"</span> swap swap defaults <span class="token number">0</span> <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用文件建立-swap" tabindex="-1"><a class="header-anchor" href="#使用文件建立-swap"><span>使用文件建立 swap</span></a></h2>
<p>如果是在四题分区槽无法支持的环境下，可以使用上一小节中提到的 loop 装置来建立</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dd if=/dev/zero of=/tmp/swap bs=1M count=128</span></span>
<span class="line">记录了128+0 的读入</span>
<span class="line">记录了128+0 的写出</span>
<span class="line"><span class="token number">134217728</span>字节<span class="token punctuation">(</span><span class="token number">134</span> MB<span class="token punctuation">)</span>已复制，0.0852543 秒，1.6 GB/秒</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -h /tmp/swap </span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root 128M <span class="token number">10</span>月 <span class="token number">27</span> <span class="token number">21</span>:22 /tmp/swap</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 格式化的时候一定要特别注意，路径不要错，否则有可能搞垮你的文件系统</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkswap /tmp/swap </span></span>
<span class="line">正在设置交换空间版本 <span class="token number">1</span>，大小 <span class="token operator">=</span> <span class="token number">131068</span> KiB</span>
<span class="line">无标签，UUID<span class="token operator">=</span>977e598a-ff20-4be9-bc28-7792c19bfe32</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon /tmp/swap</span></span>
<span class="line">swapon: /tmp/swap：不安全的权限 0644，建议使用 0600。</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon -s</span></span>
<span class="line">文件名                          类型            大小    已用    权限</span>
<span class="line">/dev/dm-1                               partition       <span class="token number">1048572</span> <span class="token number">0</span>       <span class="token parameter variable">-2</span></span>
<span class="line">/dev/sda6                               partition       <span class="token number">524284</span>  <span class="token number">0</span>       <span class="token parameter variable">-3</span></span>
<span class="line">/tmp/swap                               <span class="token function">file</span>    <span class="token number">131068</span>  <span class="token number">0</span>       <span class="token parameter variable">-4</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 swapoff 指令关掉刚才手动挂载的两个挂载点，并配置自动挂载</span></span>
<span class="line"><span class="token comment"># 建立永久挂载</span></span>
<span class="line"><span class="token function">nano</span> /etc/fstab</span>
<span class="line"><span class="token comment"># 增加配置</span></span>
<span class="line">/tmp/swap swap swap defaults <span class="token number">0</span> <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 关闭手动挂载的挂载点</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapoff /dev/sda6 /tmp/swap</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon -s</span></span>
<span class="line">文件名                          类型            大小    已用    权限</span>
<span class="line">/dev/dm-1                               partition       <span class="token number">1048572</span> <span class="token number">0</span>       <span class="token parameter variable">-2</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 手动挂载所有，再查看下，配置正确</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon -a</span></span>
<span class="line">swapon: /tmp/swap：不安全的权限 0644，建议使用 0600。</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># swapon -s</span></span>
<span class="line">文件名                          类型            大小    已用    权限</span>
<span class="line">/dev/dm-1                               partition       <span class="token number">1048572</span> <span class="token number">0</span>       <span class="token parameter variable">-2</span></span>
<span class="line">/dev/sda6                               partition       <span class="token number">524284</span>  <span class="token number">0</span>       <span class="token parameter variable">-3</span></span>
<span class="line">/tmp/swap                               <span class="token function">file</span>    <span class="token number">131068</span>  <span class="token number">0</span>       <span class="token parameter variable">-4</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>swap 主要功能是当物理内存不够时，则某些在内存中所占的程序会暂时被移动到 swap 中，让物理内存可以被需要的程序来使用。另外，如果主机支持电源管理模式，也就是说使用「休眠」功能的话，运行中的程序状态则会被记录到 swap 中去，以作为「唤醒」主机的状态依据。另外某些程序会利用 swap 的特性来存放一些数据，所以 swap 需要建立，只是不需要太大</p>
</div></template>


