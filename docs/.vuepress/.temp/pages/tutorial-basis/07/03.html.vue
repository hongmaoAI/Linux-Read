<template><div><h1 id="磁盘的分区、格式化、检验与挂载" tabindex="-1"><a class="header-anchor" href="#磁盘的分区、格式化、检验与挂载"><span>磁盘的分区、格式化、检验与挂载</span></a></h1>
<p>对于系统管理者（root）而言，磁盘管理是非常重要的一环，尤其是近来磁盘已经渐渐被当成是消耗品了。</p>
<p>想要在系统里面新增一颗磁盘时，应该做的有：</p>
<ol>
<li>对磁盘进行分区，建立可用的 partition</li>
<li>对该 partition 进行格式化（format），建立系统可用的 filesystem</li>
<li>可选：对刚刚建立好的 filesystem 进行检查</li>
<li>在 linux 系统上，建立挂载点（目录），并将它挂载上来</li>
</ol>
<p>当然在上述步骤中有很多细致的需要考虑，比如磁盘分区槽（partition）需要多大？是否需要加入 jounal 的功能？inode 与 block 的数量应该如何划分等。</p>
<p>但是这些问题的决定，都需要与你的主机用途来考虑的，因此在本节，讲解几个入门操作，其他的自己去实战了解</p>
<h2 id="观察磁盘分区状态" tabindex="-1"><a class="header-anchor" href="#观察磁盘分区状态"><span>观察磁盘分区状态</span></a></h2>
<p>磁盘分区主要有 MBR 和 GPT 两种格式，支持的工具不一样（后续讲解的 parted 都支持），
习惯使用的是 fdisk 、gdisk 来处理分区。</p>
<h3 id="lsblk-列出系统上所有磁盘列表" tabindex="-1"><a class="header-anchor" href="#lsblk-列出系统上所有磁盘列表"><span>lsblk 列出系统上所有磁盘列表</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">lsblk <span class="token punctuation">[</span>-dfipt<span class="token punctuation">]</span> <span class="token punctuation">[</span>device<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>d：仅列出磁盘本身，并不会列出该磁盘的分区数据</li>
<li>f：同时列出该磁盘内的文件系统名称</li>
<li>i：使用 ASCII 的线段输出，不要使用复杂的编码（在某些环境下很有用）</li>
<li>m：同时输出该装置在 /dev 下的权限数据（rwx）</li>
<li>p：列出该装置的完整文件名，而不是仅列出最后的名字</li>
<li>t：列出该磁盘装置的详细数据，包括磁盘队列机制、预读写的数据量大小等</li>
</ul>
<p>实践练习</p>
<p>列出本系统下的所有磁盘与磁盘内的分区信息</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ lsblk</span>
<span class="line">NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span>
<span class="line">sda               <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">40</span>.8G  <span class="token number">0</span> disk 				<span class="token comment"># 这是一整颗磁盘</span></span>
<span class="line">├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>    2M  <span class="token number">0</span> part</span>
<span class="line">├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span>    1G  <span class="token number">0</span> part /boot</span>
<span class="line">└─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>   30G  <span class="token number">0</span> part 				<span class="token comment"># 在 sda3 内的其他的文件系统</span></span>
<span class="line">  ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>   10G  <span class="token number">0</span> lvm  /</span>
<span class="line">  ├─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    1G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">  └─centos-home <span class="token number">253</span>:2    <span class="token number">0</span>    5G  <span class="token number">0</span> lvm  /home</span>
<span class="line">sdb               <span class="token number">8</span>:16   <span class="token number">0</span>    2G  <span class="token number">0</span> disk</span>
<span class="line">sr0              <span class="token number">11</span>:0    <span class="token number">1</span> <span class="token number">73</span>.6M  <span class="token number">0</span> rom</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从输出来看，主要有 sda 、sdb、sr0 装置，而 sda 下面又分了 3 个分区，其中 sda3 还有 LVM 产生的文件系统</p>
<ul>
<li>NAME：装置文件名，会省略 /dev 等前导目录</li>
<li>MAJ:MIN：其实核心认识的装置都是通过这两个代码来熟悉的，分别是：<code v-pre>主要:次要</code> 装置</li>
<li>RM：是否为颗拆卸装置（removable device）。如光盘、USB 磁盘等</li>
<li>SIZE：容量</li>
<li>RO：是否为只读</li>
<li>TYPE：磁盘 disk、分区槽 partition、只读存储器 rom</li>
<li>MOUTPOINT：挂载点</li>
</ul>
<p>列出 /dev/sda (前面已经说过了，使用虚拟机不同，磁盘里面没有 vda 的，我的是 sda 哦) 装置内的所有数据的完整文件名</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsblk -ip /dev/sda</span></span>
<span class="line">NAME                        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span>
<span class="line">/dev/sda                      <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">40</span>.8G  <span class="token number">0</span> disk</span>
<span class="line"><span class="token operator">|</span>-/dev/sda1                   <span class="token number">8</span>:1    <span class="token number">0</span>    2M  <span class="token number">0</span> part</span>
<span class="line"><span class="token operator">|</span>-/dev/sda2                   <span class="token number">8</span>:2    <span class="token number">0</span>    1G  <span class="token number">0</span> part /boot</span>
<span class="line"><span class="token variable"><span class="token variable">`</span>-/dev/sda3                   <span class="token number">8</span>:3    <span class="token number">0</span>   30G  <span class="token number">0</span> part</span>
<span class="line">  <span class="token operator">|</span>-/dev/mapper/centos-root <span class="token number">253</span>:0    <span class="token number">0</span>   10G  <span class="token number">0</span> lvm  /</span>
<span class="line">  <span class="token operator">|</span>-/dev/mapper/centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    1G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">  <span class="token variable">`</span></span>-/dev/mapper/centos-home <span class="token number">253</span>:2    <span class="token number">0</span>    5G  <span class="token number">0</span> lvm  /home</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="列出装置的-uuid-等参数" tabindex="-1"><a class="header-anchor" href="#列出装置的-uuid-等参数"><span>列出装置的 UUID 等参数</span></a></h3>
<p>使用 <code v-pre>lsblk -f</code> 可以列出来 UUID 的数据，不过习惯使用 blkid 来找出装置的 UUID，可以用来作为挂载或则是使用这个装置/文件系统用</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsblk -f</span></span>
<span class="line">NAME            FSTYPE    LABEL           UUID                                   MOUNTPOINT</span>
<span class="line">sda                                                                              </span>
<span class="line">├─sda1                                                                           </span>
<span class="line">├─sda2          xfs                       13d0663f-4cbd-412d-aa9f-975eb18da590   /boot</span>
<span class="line">└─sda3          LVM2_memb                 cksKYp-dPYj-CCPQ-Qxpq-m6rE-bhcL-84NkM3</span>
<span class="line">  ├─centos-root xfs                       7b220a88-4e13-4869-9aa9-87031303f3e1   /</span>
<span class="line">  ├─centos-swap swap                      0576b616-9606-434b-91c6-b99cbba5597d   <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">  └─centos-home xfs                       d475b892-bcde-4c97-99da-497f3ff7163c   /home</span>
<span class="line">sdb                                                                              </span>
<span class="line">sr0             iso9660   VBox_GAs_6.0.10 <span class="token number">2019</span>-07-12-09-13-14-35   </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示格式不一样，还多了分区的 UUID，感觉上面的少了一个 dsa1 的呢？</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid</span></span>
<span class="line">/dev/sda1: <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"bf674a46-65e1-43b1-a348-ac2c06c25293"</span></span>
<span class="line">/dev/sda2: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"13d0663f-4cbd-412d-aa9f-975eb18da590"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"783703d8-96cb-48fa-bfdb-853e7a0b1581"</span></span>
<span class="line">/dev/sda3: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"cksKYp-dPYj-CCPQ-Qxpq-m6rE-bhcL-84NkM3"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"LVM2_member"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"cb3c0557-b7a5-493c-bab0-250a62a11099"</span></span>
<span class="line">/dev/sr0: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"2019-07-12-09-13-14-35"</span> <span class="token assign-left variable">LABEL</span><span class="token operator">=</span><span class="token string">"VBox_GAs_6.0.10"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"iso9660"</span></span>
<span class="line">/dev/mapper/centos-root: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"7b220a88-4e13-4869-9aa9-87031303f3e1"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span></span>
<span class="line">/dev/mapper/centos-swap: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"0576b616-9606-434b-91c6-b99cbba5597d"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"swap"</span></span>
<span class="line">/dev/mapper/centos-home: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"d475b892-bcde-4c97-99da-497f3ff7163c"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="parted-列出磁盘的分区表类型与分区信息" tabindex="-1"><a class="header-anchor" href="#parted-列出磁盘的分区表类型与分区信息"><span>parted 列出磁盘的分区表类型与分区信息</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 语法：parted device_name print</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sda print</span></span>
<span class="line">Model: ATA VBOX HARDDISK <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span>										<span class="token comment"># 磁盘模块名称（厂商）</span></span>
<span class="line">Disk /dev/sda: <span class="token number">43</span>.8GB															<span class="token comment"># 磁盘的总容量</span></span>
<span class="line">Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B					<span class="token comment"># 磁盘的每个逻辑/物理扇区容量</span></span>
<span class="line">Partition Table: gpt						<span class="token comment"># 分区格式</span></span>
<span class="line">Disk Flags: pmbr_boot</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下面是分区信息</span></span>
<span class="line">Number  Start   End     Size    File system  Name  标志</span>
<span class="line"> <span class="token number">1</span>      1049kB  3146kB  2097kB                     bios_grub</span>
<span class="line"> <span class="token number">2</span>      3146kB  1077MB  1074MB  xfs</span>
<span class="line"> <span class="token number">3</span>      1077MB  <span class="token number">33</span>.3GB  <span class="token number">32</span>.2GB                     lvm</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="磁盘分区-gdisk、fdisk" tabindex="-1"><a class="header-anchor" href="#磁盘分区-gdisk、fdisk"><span>磁盘分区：gdisk、fdisk</span></a></h2>
<ul>
<li>MBR：使用 fdisk 分区</li>
<li>GPT：使用 gdisk 分区</li>
</ul>
<p>两个工具使用相似，通过内部的说明来操作，不需要死记硬背。刚刚通过 parted 指令输出的结果得知 sda 这个磁盘是 GPT 分区，所以下面的使用 gdisk 来操作</p>
<h3 id="gdisk" tabindex="-1"><a class="header-anchor" href="#gdisk"><span>gdisk</span></a></h3>
<p>语法很简单</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">gdisk 装置名称</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>例：观察 /dev/sda 磁盘的分区与相关数据</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gdisk /dev/sda</span></span>
<span class="line">GPT <span class="token function">fdisk</span> <span class="token punctuation">(</span>gdisk<span class="token punctuation">)</span> version <span class="token number">0.8</span>.10</span>
<span class="line"></span>
<span class="line">Partition table scan:</span>
<span class="line">  MBR: protective</span>
<span class="line">  BSD: not present</span>
<span class="line">  APM: not present</span>
<span class="line">  GPT: present</span>
<span class="line"><span class="token comment"># 找到了 GPT 的分区表</span></span>
<span class="line">Found valid GPT with protective MBR<span class="token punctuation">;</span> using GPT.</span>
<span class="line"></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: ?  <span class="token comment"># 等待你输入指令，可以输入问号显示说明</span></span>
<span class="line">b       back up GPT data to a <span class="token function">file</span></span>
<span class="line">c       change a partition<span class="token string">'s name</span>
<span class="line">d       delete a partition		# 删除分区</span>
<span class="line">i       show detailed information on a partition</span>
<span class="line">l       list known partition types</span>
<span class="line">n       add a new partition		# 增加分区</span>
<span class="line">o       create a new empty GUID partition table (GPT)</span>
<span class="line">p       print the partition table # 打印分区表（常用）</span>
<span class="line">q       quit without saving changes # 不存储分区就直接离开 gdisk</span>
<span class="line">r       recovery and transformation options (experts only)</span>
<span class="line">s       sort partitions</span>
<span class="line">t       change a partition'</span>s <span class="token builtin class-name">type</span> code</span>
<span class="line"><span class="token function">v</span>       verify disk</span>
<span class="line">w       <span class="token function">write</span> table to disk and <span class="token builtin class-name">exit</span>	<span class="token comment"># 存储分区操作后离开 gdisk</span></span>
<span class="line">x       extra functionality <span class="token punctuation">(</span>experts only<span class="token punctuation">)</span></span>
<span class="line">?       print this menu</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再来回顾下步骤：</p>
<ol>
<li>使用 lsblk 或 blkid 找到磁盘</li>
<li>使用 parted /dev/xxx print 来找出内部的分表表类型</li>
<li>使用 gdisk 或 fdisk 来操作</li>
</ol>
<p>通过上面的帮助，有两个重要信息：指令 q 和 w，在 gdisk 里面执行的操作，<strong>只有使用这两个指令后才会生效</strong>，
使用 q 退出不生效，使用 w 生效并离开。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p		<span class="token comment"># 输出目前磁盘的状态</span></span>
<span class="line">Disk /dev/sda: <span class="token number">85491712</span> sectors, <span class="token number">40.8</span> GiB				<span class="token comment"># 磁盘文件名、扇区数量、总容量</span></span>
<span class="line">Logical sector size: <span class="token number">512</span> bytes									<span class="token comment"># 单一扇区大小为 512 bytes</span></span>
<span class="line">Disk identifier <span class="token punctuation">(</span>GUID<span class="token punctuation">)</span>: 67038DBF-B66A-4D0F-92B2-BFBF0744CD1D	<span class="token comment"># 磁盘的 GPT标识符</span></span>
<span class="line">Partition table holds up to <span class="token number">128</span> entries</span>
<span class="line">First usable sector is <span class="token number">34</span>, last usable sector is <span class="token number">85491678</span></span>
<span class="line">Partitions will be aligned on <span class="token number">2048</span>-sector boundaries</span>
<span class="line">Total <span class="token function">free</span> space is <span class="token number">20467645</span> sectors <span class="token punctuation">(</span><span class="token number">9.8</span> GiB<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下面是分区信息</span></span>
<span class="line"><span class="token comment"># 分区编号 开始扇区号码			 结束扇区号码    容量大小</span></span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00</span>
<span class="line"><span class="token comment"># 这里的 Code linux 为 8300，swap 为 8200，不过只是一个提示，不见得真的代表此分区槽内的文件系统</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上表可以发现几件事情：</p>
<ul>
<li>
<p>整颗磁盘还可以进行额外的分区</p>
<p>最大扇区为 85491712 个，下面三个分区表（第三个）结束扇区为 65026047，
在上面信息中也提示了空闲的扇区 <code v-pre>20467645 sectors (9.8 GiB)</code></p>
</li>
<li>
<p>分区槽的设计中，新分区通常选用上一个分区的结束扇区号码数加 1 作为起始扇区号码</p>
</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">注意</p>
<p>注意不要在 MBR 分区上使用 gdisk，如果指令按错，恐怕分区记录会挂掉，
另外在 gdisk 中操作，离开的时候记得按 q ，不要按 w 就不会生效</p>
</div>
<h3 id="用-gdisk-新增分区槽" tabindex="-1"><a class="header-anchor" href="#用-gdisk-新增分区槽"><span>用 gdisk 新增分区槽</span></a></h3>
<p>最开始安装的时候就预留了一块容量来做练习，在上面也看到了还剩余 9.8 G 的空余容量，假设有如下的分区需求：</p>
<ul>
<li>1 GB 的 xfs 文件系统（linux）</li>
<li>1 GB 的 vfat 文件系统（windows）</li>
<li>0.5 GB 的 swap （linux swap）</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># gdisk /dev/sda</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p</span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00</span>
<span class="line"><span class="token comment"># 打印分区信息，主要目的是为了找到最后一个 sector 的号码，这里是 65026047</span></span>
<span class="line"><span class="token comment"># 使用指令 n 增加物理分区</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: n</span>
<span class="line">Partition number <span class="token punctuation">(</span><span class="token number">4</span>-128, default <span class="token number">4</span><span class="token punctuation">)</span>: <span class="token number">4</span>  <span class="token comment"># 分区号码，这里默认就是 4，所以可以直接按回车</span></span>
<span class="line">First sector <span class="token punctuation">(</span><span class="token number">34</span>-85491678, default <span class="token operator">=</span> <span class="token number">65026048</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>: <span class="token comment"># 第一个扇区号码，同样有默认的</span></span>
<span class="line">Last sector <span class="token punctuation">(</span><span class="token number">65026048</span>-85491678, default <span class="token operator">=</span> <span class="token number">85491678</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>: +1G  <span class="token comment"># 结束扇区号码</span></span>
<span class="line"><span class="token comment"># 上面有默认的值，不需要我们自己计算扇区数量，使用 +- KMGTP 等单位容量方式来容量</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 选择未来该分区槽预计使用的文件系统，预设的都是 linux 文件系统的 8300</span></span>
<span class="line">Current <span class="token builtin class-name">type</span> is <span class="token string">'Linux filesystem'</span></span>
<span class="line">Hex code or GUID <span class="token punctuation">(</span>L to show codes, Enter <span class="token operator">=</span> <span class="token number">8300</span><span class="token punctuation">)</span>:</span>
<span class="line">Changed <span class="token builtin class-name">type</span> of partition to <span class="token string">'Linux filesystem'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再次打印，就发现多了刚刚分出来的分区信息</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p</span>
<span class="line">Disk /dev/sda: <span class="token number">85491712</span> sectors, <span class="token number">40.8</span> GiB</span>
<span class="line">Logical sector size: <span class="token number">512</span> bytes</span>
<span class="line">Disk identifier <span class="token punctuation">(</span>GUID<span class="token punctuation">)</span>: 67038DBF-B66A-4D0F-92B2-BFBF0744CD1D</span>
<span class="line">Partition table holds up to <span class="token number">128</span> entries</span>
<span class="line">First usable sector is <span class="token number">34</span>, last usable sector is <span class="token number">85491678</span></span>
<span class="line">Partitions will be aligned on <span class="token number">2048</span>-sector boundaries</span>
<span class="line">Total <span class="token function">free</span> space is <span class="token number">18370493</span> sectors <span class="token punctuation">(</span><span class="token number">8.8</span> GiB<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  <span class="token number">8300</span>  Linux filesystem</span>
<span class="line"></span>
<span class="line">那么后面两个区的分区继续，记得每次分区完就打印下信息，查看是否正确</span>
<span class="line"></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: n</span>
<span class="line">Partition number <span class="token punctuation">(</span><span class="token number">5</span>-128, default <span class="token number">5</span><span class="token punctuation">)</span>:</span>
<span class="line">First sector <span class="token punctuation">(</span><span class="token number">34</span>-85491678, default <span class="token operator">=</span> <span class="token number">67123200</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>:</span>
<span class="line">Last sector <span class="token punctuation">(</span><span class="token number">67123200</span>-85491678, default <span class="token operator">=</span> <span class="token number">85491678</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>: +1G</span>
<span class="line">Current <span class="token builtin class-name">type</span> is <span class="token string">'Linux filesystem'</span></span>
<span class="line">Hex code or GUID <span class="token punctuation">(</span>L to show codes, Enter <span class="token operator">=</span> <span class="token number">8300</span><span class="token punctuation">)</span>: 0700  <span class="token comment"># 0700 为 windows 文件系统</span></span>
<span class="line">Changed <span class="token builtin class-name">type</span> of partition to <span class="token string">'Microsoft basic data'</span></span>
<span class="line"></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: n</span>
<span class="line">Partition number <span class="token punctuation">(</span><span class="token number">6</span>-128, default <span class="token number">6</span><span class="token punctuation">)</span>:</span>
<span class="line">First sector <span class="token punctuation">(</span><span class="token number">34</span>-85491678, default <span class="token operator">=</span> <span class="token number">69220352</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>:</span>
<span class="line">Last sector <span class="token punctuation">(</span><span class="token number">69220352</span>-85491678, default <span class="token operator">=</span> <span class="token number">85491678</span><span class="token punctuation">)</span> or <span class="token punctuation">{</span>+-<span class="token punctuation">}</span>size<span class="token punctuation">{</span>KMGTP<span class="token punctuation">}</span>: +500M</span>
<span class="line">Current <span class="token builtin class-name">type</span> is <span class="token string">'Linux filesystem'</span></span>
<span class="line">Hex code or GUID <span class="token punctuation">(</span>L to show codes, Enter <span class="token operator">=</span> <span class="token number">8300</span><span class="token punctuation">)</span>: <span class="token number">8200</span>  <span class="token comment"># linux swap</span></span>
<span class="line">Changed <span class="token builtin class-name">type</span> of partition to <span class="token string">'Linux swap'</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 最后分区完成后的分区信息如下</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: n</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  <span class="token number">8300</span>  Linux filesystem</span>
<span class="line">   <span class="token number">5</span>        <span class="token number">67123200</span>        <span class="token number">69220351</span>   <span class="token number">1024.0</span> MiB  0700  Microsoft basic data</span>
<span class="line">   <span class="token number">6</span>        <span class="token number">69220352</span>        <span class="token number">70244351</span>   <span class="token number">500.0</span> MiB   <span class="token number">8200</span>  Linux swap</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分区的时候需要使用到 code，上面有对应的 code 数值了</span></span>
<span class="line"><span class="token comment"># 如果忘记或则不知道，可以使用 l 命令来显示所有的 code 值</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: l</span>
<span class="line">0700 Microsoft basic data  0c01 Microsoft reserved    <span class="token number">2700</span> Windows RE          </span>
<span class="line"><span class="token number">3000</span> ONIE boot             <span class="token number">3001</span> ONIE config           <span class="token number">4100</span> PowerPC PReP boot  </span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 最后使用 w 命令写入磁盘分区表</span></span>
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
<span class="line"><span class="token comment"># 等你输入 y 确认之后，开始执行，上面的警告信息翻译如下</span></span>
<span class="line">警告：内核仍在使用旧的分区表。</span>
<span class="line">新表将在下次重新启动时使用。</span>
<span class="line">操作已成功完成。</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看信息，发现分区中还没有出现 sda4、5、6 ，这是因为核心还没有更新</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /proc/partitions</span></span>
<span class="line">major minor  <span class="token comment">#blocks  name</span></span>
<span class="line"></span>
<span class="line">   <span class="token number">8</span>        <span class="token number">0</span>   <span class="token number">42745856</span> sda</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">1</span>       <span class="token number">2048</span> sda1</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">2</span>    <span class="token number">1048576</span> sda2</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">3</span>   <span class="token number">31461376</span> sda3</span>
<span class="line">   <span class="token number">8</span>       <span class="token number">16</span>    <span class="token number">2097152</span> sdb</span>
<span class="line">  <span class="token number">11</span>        <span class="token number">0</span>      <span class="token number">75354</span> sr0</span>
<span class="line"> <span class="token number">253</span>        <span class="token number">0</span>   <span class="token number">10485760</span> dm-0</span>
<span class="line"> <span class="token number">253</span>        <span class="token number">1</span>    <span class="token number">1048576</span> dm-1</span>
<span class="line"> <span class="token number">253</span>        <span class="token number">2</span>    <span class="token number">5242880</span> dm-2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于警告内核未生效，我们有两种方式来处理，第一种就是重新启动，另一种就是通过 partprobe 指令来处理</p>
<h3 id="partprobe-更新-linux-核心的分区表信息" tabindex="-1"><a class="header-anchor" href="#partprobe-更新-linux-核心的分区表信息"><span>partprobe 更新 Linux 核心的分区表信息</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># -s 输出信息，不加则不会输出任何信息</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># partprobe -s</span></span>
<span class="line">/dev/sda: gpt partitions <span class="token number">1</span> <span class="token number">2</span> <span class="token number">3</span> <span class="token number">4</span> <span class="token number">5</span> <span class="token number">6</span></span>
<span class="line">Warning: 无法以读写方式打开 /dev/sr0 <span class="token punctuation">(</span>只读文件系统<span class="token punctuation">)</span>。/dev/sr0 已按照只读方式打开。</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看磁盘状态，发现出现了 4、5、6 分区</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsblk /dev/sda</span></span>
<span class="line">NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span>
<span class="line">sda               <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">40</span>.8G  <span class="token number">0</span> disk </span>
<span class="line">├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>    2M  <span class="token number">0</span> part </span>
<span class="line">├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span>    1G  <span class="token number">0</span> part /boot</span>
<span class="line">├─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>   30G  <span class="token number">0</span> part </span>
<span class="line">│ ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>   10G  <span class="token number">0</span> lvm  /</span>
<span class="line">│ ├─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    1G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">│ └─centos-home <span class="token number">253</span>:2    <span class="token number">0</span>    5G  <span class="token number">0</span> lvm  /home</span>
<span class="line">├─sda4            <span class="token number">8</span>:4    <span class="token number">0</span>    1G  <span class="token number">0</span> part </span>
<span class="line">├─sda5            <span class="token number">8</span>:5    <span class="token number">0</span>    1G  <span class="token number">0</span> part </span>
<span class="line">└─sda6            <span class="token number">8</span>:6    <span class="token number">0</span>  500M  <span class="token number">0</span> part </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看分区记录，也出现了 4、5、6</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># cat /proc/partitions </span></span>
<span class="line">major minor  <span class="token comment">#blocks  name</span></span>
<span class="line"></span>
<span class="line">   <span class="token number">8</span>        <span class="token number">0</span>   <span class="token number">42745856</span> sda</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">1</span>       <span class="token number">2048</span> sda1</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">2</span>    <span class="token number">1048576</span> sda2</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">3</span>   <span class="token number">31461376</span> sda3</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">4</span>    <span class="token number">1048576</span> sda4</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">5</span>    <span class="token number">1048576</span> sda5</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">6</span>     <span class="token number">512000</span> sda6</span>
<span class="line">   <span class="token number">8</span>       <span class="token number">16</span>    <span class="token number">2097152</span> sdb</span>
<span class="line">  <span class="token number">11</span>        <span class="token number">0</span>      <span class="token number">75354</span> sr0</span>
<span class="line"> <span class="token number">253</span>        <span class="token number">0</span>   <span class="token number">10485760</span> dm-0</span>
<span class="line"> <span class="token number">253</span>        <span class="token number">1</span>    <span class="token number">1048576</span> dm-1</span>
<span class="line"> <span class="token number">253</span>        <span class="token number">2</span>    <span class="token number">5242880</span> dm-2</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="用-gdisk-删除一个分区槽" tabindex="-1"><a class="header-anchor" href="#用-gdisk-删除一个分区槽"><span>用 gdisk 删除一个分区槽</span></a></h3>
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
<span class="line"><span class="token comment"># 查看分区信息</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p</span>
<span class="line">Disk /dev/sda: <span class="token number">85491712</span> sectors, <span class="token number">40.8</span> GiB</span>
<span class="line">Logical sector size: <span class="token number">512</span> bytes</span>
<span class="line">Disk identifier <span class="token punctuation">(</span>GUID<span class="token punctuation">)</span>: 67038DBF-B66A-4D0F-92B2-BFBF0744CD1D</span>
<span class="line">Partition table holds up to <span class="token number">128</span> entries</span>
<span class="line">First usable sector is <span class="token number">34</span>, last usable sector is <span class="token number">85491678</span></span>
<span class="line">Partitions will be aligned on <span class="token number">2048</span>-sector boundaries</span>
<span class="line">Total <span class="token function">free</span> space is <span class="token number">15249341</span> sectors <span class="token punctuation">(</span><span class="token number">7.3</span> GiB<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  <span class="token number">8300</span>  Linux filesystem</span>
<span class="line">   <span class="token number">5</span>        <span class="token number">67123200</span>        <span class="token number">69220351</span>   <span class="token number">1024.0</span> MiB  0700  Microsoft basic data</span>
<span class="line">   <span class="token number">6</span>        <span class="token number">69220352</span>        <span class="token number">70244351</span>   <span class="token number">500.0</span> MiB   <span class="token number">8200</span>  Linux swap</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除第 6 个分区</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: d</span>
<span class="line">Partition number <span class="token punctuation">(</span><span class="token number">1</span>-6<span class="token punctuation">)</span>: <span class="token number">6</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 再次查看，发现 6 不在了</span></span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p</span>
<span class="line">Disk /dev/sda: <span class="token number">85491712</span> sectors, <span class="token number">40.8</span> GiB</span>
<span class="line">Logical sector size: <span class="token number">512</span> bytes</span>
<span class="line">Disk identifier <span class="token punctuation">(</span>GUID<span class="token punctuation">)</span>: 67038DBF-B66A-4D0F-92B2-BFBF0744CD1D</span>
<span class="line">Partition table holds up to <span class="token number">128</span> entries</span>
<span class="line">First usable sector is <span class="token number">34</span>, last usable sector is <span class="token number">85491678</span></span>
<span class="line">Partitions will be aligned on <span class="token number">2048</span>-sector boundaries</span>
<span class="line">Total <span class="token function">free</span> space is <span class="token number">16273341</span> sectors <span class="token punctuation">(</span><span class="token number">7.8</span> GiB<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  <span class="token number">8300</span>  Linux filesystem</span>
<span class="line">   <span class="token number">5</span>        <span class="token number">67123200</span>        <span class="token number">69220351</span>   <span class="token number">1024.0</span> MiB  0700  Microsoft basic data</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 写入并离开</span></span>
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
<span class="line"><span class="token comment"># 查看磁盘状态，发现 sda6 还存在，只是因为没有更新核心分区表导致的</span></span>
<span class="line"><span class="token comment"># 使用命令 partprobe -s 更新下再查看就没有了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsblk</span></span>
<span class="line">NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span>
<span class="line">sda               <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">40</span>.8G  <span class="token number">0</span> disk </span>
<span class="line">├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>    2M  <span class="token number">0</span> part </span>
<span class="line">├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span>    1G  <span class="token number">0</span> part /boot</span>
<span class="line">├─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>   30G  <span class="token number">0</span> part </span>
<span class="line">│ ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>   10G  <span class="token number">0</span> lvm  /</span>
<span class="line">│ ├─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    1G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">│ └─centos-home <span class="token number">253</span>:2    <span class="token number">0</span>    5G  <span class="token number">0</span> lvm  /home</span>
<span class="line">├─sda4            <span class="token number">8</span>:4    <span class="token number">0</span>    1G  <span class="token number">0</span> part </span>
<span class="line">├─sda5            <span class="token number">8</span>:5    <span class="token number">0</span>    1G  <span class="token number">0</span> part </span>
<span class="line">└─sda6            <span class="token number">8</span>:6    <span class="token number">0</span>  500M  <span class="token number">0</span> part </span>
<span class="line">sdb               <span class="token number">8</span>:16   <span class="token number">0</span>    2G  <span class="token number">0</span> disk </span>
<span class="line">sr0              <span class="token number">11</span>:0    <span class="token number">1</span> <span class="token number">73</span>.6M  <span class="token number">0</span> rom  </span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是：不要去处理一个 <strong>正在使用中的分区槽</strong> 。例如：现在已经使用了 /dev/sda5，
必须先将 /dev/sda5 先 <strong>卸载</strong> ，否则直接删除该分区的话，虽然磁盘会写入正确的分区信息，
但是核心会无法更新分区表的信息。</p>
<p>总之：千万不要处理正在活动的文件系统，先卸载后再处理</p>
<h3 id="fdisk" tabindex="-1"><a class="header-anchor" href="#fdisk"><span>fdisk</span></a></h3>
<p>虽然 MBR 在未来可能会慢慢淘汰，但是如果恰巧你遇到了呢，使用方式与 gdisk 类似，下面列出指令帮助文档</p>
<p><img src="@source/tutorial-basis/07/assets/image-20191027131011438.png" alt="image-20191027131011438"></p>
<h2 id="磁盘格式化-建立文件系统" tabindex="-1"><a class="header-anchor" href="#磁盘格式化-建立文件系统"><span>磁盘格式化（建立文件系统）</span></a></h2>
<p>分区完成之后需要进行格式化才能使用磁盘，可以使用指令「make filesystem，mkfs」，该指令是一个综合指令，回去调用正确的系统格式化工具软件。因为 CentOS 7 使用 xfs 作为预设文件系统，下面先介绍 mkfs.xfs ，再介绍新一代的 mkfs.ext4，最后再聊 mkfs 这个综合指令</p>
<h3 id="xfs-文件系统-mkfs-xfs" tabindex="-1"><a class="header-anchor" href="#xfs-文件系统-mkfs-xfs"><span>XFS 文件系统 mkfs.xfs</span></a></h3>
<p>常听到的格式化其实应该称为「建立文件系统（make filesystem）」。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">mkfs.xfs <span class="token punctuation">[</span>-b bsize<span class="token punctuation">]</span><span class="token punctuation">[</span>-d parms<span class="token punctuation">]</span><span class="token punctuation">[</span>-i parms<span class="token punctuation">]</span><span class="token punctuation">[</span>-l parms<span class="token punctuation">]</span><span class="token punctuation">[</span>-L parms<span class="token punctuation">]</span><span class="token punctuation">[</span>-f<span class="token punctuation">]</span><span class="token punctuation">[</span>-r parms<span class="token punctuation">]</span> 设备名称</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：下面描述关于单位的说明，没有加单位则为 bytes，可以用 k、m、g、t、p 等来解释，特殊的为 s 单位，指的是 sector 的个数</p>
<ul>
<li>
<p>b：后面接 block 容量，可由 512 到 64k，不过最大容量限制为 Linux 的 4k</p>
</li>
<li>
<p>d：后面接 data section 的相关参数，主要的值有：</p>
<ul>
<li>
<p>agcount=数值：设置需要几个存储群组（AG），通常与 CPU 有关</p>
</li>
<li>
<p>agsize=数值：每个 AG 设置为多少容量，通常 agcount/agsize 只选一个设置即可</p>
</li>
<li>
<p>file：格式的的装置是个文件而不是个装置（例如虚拟磁盘）</p>
</li>
<li>
<p>size=数值：data section 的数量，你可不将全部的容量用完的意思</p>
</li>
<li>
<p>su=数值：当有 RAID 时，哪个 stripe 数值，与下面的 sw 搭配使用</p>
</li>
<li>
<p>sw=数值：当有 RAID 时，用于存储的磁盘数量（需扣除备份碟与备用碟）</p>
</li>
<li>
<p>sunit-数值：与 su 类型，不过单位使用的是「几个 sector（512bytes大小）」</p>
</li>
<li>
<p>swidth=数值：su<em>sw 的值，但是以「几个 sector</em>（512bytes 大小）」来设置</p>
</li>
</ul>
</li>
<li>
<p>f：如果装置内已经有文件系统，则需要使用该参数来强制格式化</p>
</li>
<li>
<p>i：与 inode 有较相关的设置，主要的设置值有：</p>
<ul>
<li>size=数值：最小是 256bytes，最大是 2k，一般保留 256 足够使用了</li>
<li>internal=[0|1]：log 装置是否为内建？预设为 1 内建，如果需要使用外置的，配置下面的参数</li>
<li>logdev=device：指定 log 装置在哪个装置上</li>
<li>size=数值：指定这块登录区的容量，通常最小需要  512 个 block，大约 2M 以上</li>
</ul>
</li>
<li>
<p>L：指定该文件系统的表头名称 Label name</p>
</li>
<li>
<p>r：指定 realtime section 的相关设置，常见的有</p>
<ul>
<li>extsize=数值：就是那个重要的 extent 数值，一般不需要设置，担忧 RAID 时，最好设置与 swidth 相同的数值，最小为 4k ，最大为 1G</li>
</ul>
</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将前面分区出来的 /dev/sda4 格式化为 xfs 文件系统</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.xfs /dev/sda4</span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/sda4              <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">4</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">65536</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">sparse</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">262144</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal log           <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># 很快就格式化完成了，不加任何参数使用的是默认值，较重要的是 inode 与 block 的数值</span></span>
<span class="line"><span class="token comment"># isize 就是 inode的大小，bsize 就是 block 的大小</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看信息，确定为 xfs 了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid /dev/sda4</span></span>
<span class="line">/dev/sda4: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"4079b244-7ef8-47eb-85d0-1d634c8c703f"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> <span class="token assign-left variable">PARTLABEL</span><span class="token operator">=</span><span class="token string">"Linux filesystem"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"3819b115-2ab8-4fb6-8425-bb2ff8e797b7"</span> </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般使用默认的 xfs 文件系统参数来格式化即可，如果有其他额外的定制则需要添加对应的参数来设置。比如：因为 xfs 可以使用多个数据流来读写系统，增加速度，因此哪个 agcount 可以跟 CPU 的核心数量来做搭配。比如服务器有一颗 4 核心 8 线程的 CPU，其实就相当于是 8 核心了，可以设置为 8</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 找出系统的 CPU 数量，并设置 agcount 数量</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># grep 'processor' /proc/cpuinfo</span></span>
<span class="line">processor       <span class="token builtin class-name">:</span> <span class="token number">0</span></span>
<span class="line"><span class="token comment"># 这里只有一个 processor，则表示只有一颗 CPU</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 -f （前面已经格式化有文件系统了，强制）-d 指定 agcount 数值</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.xfs -f -d agcount=1 /dev/sda4</span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/sda4              <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">1</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">262144</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">sparse</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">262144</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal log           <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># 不过：笔者发现，默认的 agcount=4 而不是按照 cpu 数量来的</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="xfs-文件系统-for-raid-效能优化-optional" tabindex="-1"><a class="header-anchor" href="#xfs-文件系统-for-raid-效能优化-optional"><span>XFS 文件系统 for RAID 效能优化（Optional）</span></a></h3>
<p>在后续会谈到「进阶文件系统的设置」，其中就有磁盘阵列，是多颗磁盘组成一颗大磁盘的意思，利用同步写入到这些磁盘的技术，不但可以加快读写速度，还可以让某一颗磁盘坏掉时，整个文件系统还是开源持续运作的状态，这就是所谓的容错</p>
<p>基本上，磁盘阵列 RAID 就是通过将文件先细分为数个小型的分区区块（stripe）后，将他们分别放到磁盘阵列里面的所有磁盘，所以一个文件是被同时写入到多个磁盘中去的（这也是为什么磁盘阵列高效读取的原因之一）。为了文件数据的安全，在这些磁盘中还会规划处一部分作为备份磁盘（parity disk），以及可能会保留一个以上的备用磁盘（spare disk），这些区块基本上会占用掉磁盘阵列的总容量，但是对于数据来说比较有保障</p>
<p>分区区块 stripe 的数值大多介于 4k 到 1m 之间，这与你的磁盘阵列卡支持的项目有关。stripe 与你的文件数据容量以及效能相关性较高。当用于大型文件时，一般建议 stripe 可以设置大一点，这样磁盘阵列读写频率会降低，效能会提升。如果是用于系统，那么小文件比较多的情况下，stripe 建议大约在 64K 左右可能会更好。不过，这些参数最好经过测试之后看是否能达到预期效果再调整。更详细的信息在后续再讲解</p>
<p>「磁盘阵列章节」在后续学完，再回过头来看该章节。</p>
<p>文件系统的读写要能够有优化，最好能够搭配磁盘阵列的参数来设计；提前先在文件系统就将 stripe 规划好，哪交给 RAID 去存取时，它就无需重复进行文件的 stripe 过程，效能会更好，在格式化时，优化效能与哪些有关系呢？下面模拟一个环境：</p>
<ul>
<li>CPU 2 核心，所以设置 agcount 为 2</li>
<li>当初设置 RAID 的 stripe 指定为 256k ，因此 su 最好设置为 256k</li>
<li>设置的磁盘阵列有 8 颗，因为是 RAID5 的设置，所以有一个 parity（备份碟）因此指定 sw 为 7</li>
<li>由上述数据可以发现数据宽度 swidth 应该为 256k * 7 = 1792k，可以设置 extsize 为 1792k</li>
</ul>
<p>这里仅快速的使用 mkfs.xfs 的参数来处理格式化动作（相关磁盘阵列要求的数量等，请自行百度）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.xfs -f -d agcount=2,su=256k,sw=7 -r extsize=1792k /dev/sda4</span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/sda4              <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">131072</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">sparse</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">262144</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">64</span>     <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">448</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal log           <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">64</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">1835008</span> <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># 关注 agcount、sunit、swidth、extsz 的值</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从输出结果来看，agcount 没有问题</p>
<ul>
<li>agcount：没有问题</li>
<li>sunit：64 个 block，64 * 4096（单个block 容量）=256K（也就是 su 的数值）</li>
<li>swidth：448 * 4k = 1792k（extsize 的数值）</li>
</ul>
<p>如果 sunit 与 swidth 直接套用在 mkfs.xfs 中的话，就需要注意了，因为指令中的这两个参数用的是「几个 512bytes 的 sector 数量</p>
<ul>
<li>sunit：256k/(512byte*1024)=512 个 sector</li>
<li>Swidth：7 个磁盘 * sunit = 7 * 512 = 3584 个 sector</li>
</ul>
<p>所以指令就需要变成下面这样了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">mkfs.xfs <span class="token parameter variable">-f</span> <span class="token parameter variable">-d</span> <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">2</span>,sunit<span class="token operator">=</span><span class="token number">512</span>,swidth<span class="token operator">=</span><span class="token number">3584</span> <span class="token parameter variable">-r</span> <span class="token assign-left variable">extsize</span><span class="token operator">=</span>1792k /dev/sda4</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="ext4-文件系统-mkfs-ext4" tabindex="-1"><a class="header-anchor" href="#ext4-文件系统-mkfs-ext4"><span>EXT4 文件系统 mkfs.ext4</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">mkfs.ext4 <span class="token punctuation">[</span>-b size<span class="token punctuation">]</span><span class="token punctuation">[</span>-L label<span class="token punctuation">]</span> 装置名称</span>
<span class="line"></span>
<span class="line">- b：设置 block 的大小，有 1k、2k、4k 的容量</span>
<span class="line">- L：装置表头名称</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将 /dev/sda5 格式化为 ext4 文件系统</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.ext4 /dev/sda5</span></span>
<span class="line"><span class="token function">mke2fs</span> <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">文件系统标签<span class="token operator">=</span></span>
<span class="line">OS type: Linux</span>
<span class="line">块大小<span class="token operator">=</span><span class="token number">4096</span> <span class="token punctuation">(</span>log<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span>		<span class="token comment"># 每一个 block 大小</span></span>
<span class="line">分块大小<span class="token operator">=</span><span class="token number">4096</span> <span class="token punctuation">(</span>log<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token assign-left variable">Stride</span><span class="token operator">=</span><span class="token number">0</span> blocks, Stripe <span class="token assign-left variable">width</span><span class="token operator">=</span><span class="token number">0</span> blocks	<span class="token comment"># 与 RAID 相关性较高</span></span>
<span class="line"><span class="token number">65536</span> inodes, <span class="token number">262144</span> blocks		<span class="token comment"># 总计 inode、block 数量</span></span>
<span class="line"><span class="token number">13107</span> blocks <span class="token punctuation">(</span><span class="token number">5.00</span>%<span class="token punctuation">)</span> reserved <span class="token keyword">for</span> the super user</span>
<span class="line">第一个数据块<span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">Maximum filesystem <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">268435456</span></span>
<span class="line"><span class="token number">8</span> block <span class="token function">groups</span>		<span class="token comment"># 共有 8 个 block groups</span></span>
<span class="line"><span class="token number">32768</span> blocks per group, <span class="token number">32768</span> fragments per group</span>
<span class="line"><span class="token number">8192</span> inodes per group</span>
<span class="line">Superblock backups stored on blocks: </span>
<span class="line">        <span class="token number">32768</span>, <span class="token number">98304</span>, <span class="token number">163840</span>, <span class="token number">229376</span></span>
<span class="line"></span>
<span class="line">Allocating group tables: 完成                            </span>
<span class="line">正在写入inode表: 完成                            </span>
<span class="line">Creating journal <span class="token punctuation">(</span><span class="token number">8192</span> blocks<span class="token punctuation">)</span>: 完成</span>
<span class="line">Writing superblocks and filesystem accounting information: 完成</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dumpe2fs -h /dev/sda5</span></span>
<span class="line">dumpe2fs <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">Filesystem volume name:   <span class="token operator">&lt;</span>none<span class="token operator">></span></span>
<span class="line">Last mounted on:          <span class="token operator">&lt;</span>not available<span class="token operator">></span></span>
<span class="line">Filesystem UUID:          939ac781-62e4-48a9-a4c5-d804e0f0ee52</span>
<span class="line">Filesystem magic number:  0xEF53</span>
<span class="line">Filesystem revision <span class="token comment">#:    1 (dynamic)</span></span>
<span class="line">Filesystem features:      has_journal ext_attr resize_inode dir_index filetype extent 64bit flex_bg sparse_super large_file huge_file uninit_bg dir_nlink extra_isize</span>
<span class="line">Filesystem flags:         signed_directory_hash </span>
<span class="line">Default <span class="token function">mount</span> options:    user_xattr acl</span>
<span class="line">Filesystem state:         clean</span>
<span class="line">Errors behavior:          Continue</span>
<span class="line">Filesystem OS type:       Linux</span>
<span class="line">Inode count:              <span class="token number">65536</span></span>
<span class="line">Block count:              <span class="token number">262144</span></span>
<span class="line">Reserved block count:     <span class="token number">13107</span></span>
<span class="line">Free blocks:              <span class="token number">249189</span></span>
<span class="line">Free blocks:              <span class="token number">249189</span></span>
<span class="line">Free inodes:              <span class="token number">65525</span></span>
<span class="line">First block:              <span class="token number">0</span></span>
<span class="line">Block size:               <span class="token number">4096</span></span>
<span class="line">Fragment size:            <span class="token number">4096</span></span>
<span class="line">Group descriptor size:    <span class="token number">64</span></span>
<span class="line">Reserved GDT blocks:      <span class="token number">127</span></span>
<span class="line">Blocks per group:         <span class="token number">32768</span></span>
<span class="line">Fragments per group:      <span class="token number">32768</span></span>
<span class="line">Inodes per group:         <span class="token number">8192</span></span>
<span class="line">Inode blocks per group:   <span class="token number">512</span></span>
<span class="line">Flex block group size:    <span class="token number">16</span></span>
<span class="line">Filesystem created:       Tue Oct <span class="token number">22</span> 08:51:57 <span class="token number">2019</span></span>
<span class="line">Last <span class="token function">mount</span> time:          n/a</span>
<span class="line">Last <span class="token function">write</span> time:          Tue Oct <span class="token number">22</span> 08:51:57 <span class="token number">2019</span></span>
<span class="line">Mount count:              <span class="token number">0</span></span>
<span class="line">Maximum <span class="token function">mount</span> count:      <span class="token parameter variable">-1</span></span>
<span class="line">Last checked:             Tue Oct <span class="token number">22</span> 08:51:57 <span class="token number">2019</span></span>
<span class="line">Check interval:           <span class="token number">0</span> <span class="token punctuation">(</span><span class="token operator">&lt;</span>none<span class="token operator">></span><span class="token punctuation">)</span></span>
<span class="line">Lifetime writes:          <span class="token number">33</span> MB</span>
<span class="line">Reserved blocks uid:      <span class="token number">0</span> <span class="token punctuation">(</span>user root<span class="token punctuation">)</span></span>
<span class="line">Reserved blocks gid:      <span class="token number">0</span> <span class="token punctuation">(</span>group root<span class="token punctuation">)</span></span>
<span class="line">First inode:              <span class="token number">11</span></span>
<span class="line">Inode size:               <span class="token number">256</span></span>
<span class="line">Required extra isize:     <span class="token number">28</span></span>
<span class="line">Desired extra isize:      <span class="token number">28</span></span>
<span class="line">Journal inode:            <span class="token number">8</span></span>
<span class="line">Default directory hash:   half_md4</span>
<span class="line">Directory Hash Seed:      9f6434c1-738d-47e2-ae2c-bc766c2198cd</span>
<span class="line">Journal backup:           inode blocks</span>
<span class="line">Journal features:         <span class="token punctuation">(</span>none<span class="token punctuation">)</span></span>
<span class="line">日志大小:             32M</span>
<span class="line">Journal length:           <span class="token number">8192</span></span>
<span class="line">Journal sequence:         0x00000001</span>
<span class="line">Journal start:            <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里之后了之前讲解过的 <RouteLink to="/tutorial-basis/07/01.html#dumpe2fs-%E6%9F%A5%E8%AF%A2-ext-%E5%AE%B6%E6%97%8F-superblock-%E4%BF%A1%E6%81%AF%E7%9A%84%E6%8C%87%E4%BB%A4">dumpe2fs</RouteLink> 命令，这里就能再回过头去练习了</p>
<h3 id="其他文件系统-mkfs" tabindex="-1"><a class="header-anchor" href="#其他文件系统-mkfs"><span>其他文件系统 mkfs</span></a></h3>
<p>mkfs 是一个综合指令，当使用 <code v-pre>mkfs -t xfs</code> 指令时，其实会去找 mkfs.xfs 相关参数给我们使用。如果还想知道该命令支持哪些文件系统格式，可以使用 tab 的补全来显示</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs [tab*2]</span></span>
<span class="line"><span class="token function">mkfs</span>         mkfs.cramfs  mkfs.ext3    mkfs.fat     mkfs.msdos   mkfs.xfs</span>
<span class="line">mkfs.btrfs   mkfs.ext2    mkfs.ext4    mkfs.minix   mkfs.vfat </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这里看到这么多的支持格式，如果将刚才的 /dev/sda5 格式化为 vfat 可以这样做</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs -t vfat /dev/sda5 </span></span>
<span class="line">mkfs.fat <span class="token number">3.0</span>.20 <span class="token punctuation">(</span><span class="token number">12</span> Jun <span class="token number">2013</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid /dev/sda5</span></span>
<span class="line">/dev/sda5: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"4DA6-A982"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"vfat"</span> <span class="token assign-left variable">PARTLABEL</span><span class="token operator">=</span><span class="token string">"Microsoft basic data"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"9cffc784-99a3-40f6-8e5f-0c71b3bb7f05"</span> </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="文件系统检验" tabindex="-1"><a class="header-anchor" href="#文件系统检验"><span>文件系统检验</span></a></h2>
<p>当文件系统出现问题是，如硬件、软件、硬件等问题等宕机时。现在我们知道文件系统运作时会有磁盘与内存数据异步的状况发生，因此在宕机时可能导致文件系统的错乱。</p>
<p>不同的文件系统救援的指令不太一样，这里主要针对 xfs、ext4 两个主流的来讲解</p>
<h3 id="xfs-repair-处理-xfs-文件系统" tabindex="-1"><a class="header-anchor" href="#xfs-repair-处理-xfs-文件系统"><span>xfs_repair 处理 XFS 文件系统</span></a></h3>
<p>当有 xfs 文件系统错乱才需要使用该命令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">xfs_repair <span class="token punctuation">[</span>-fnd<span class="token punctuation">]</span> 装置名</span>
<span class="line"></span>
<span class="line">- f：后面的装置是个文件（如虚拟硬盘）而不是实体状态</span>
<span class="line">- n：单纯检查并不修改文件系统的任何数据</span>
<span class="line">- d：通常用在单人维护模式下，针对根目录进行检查与修复的动作，很危险！不要随便使用</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">检查 /dev/sda4 的文件系统</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_repair /dev/sda4</span></span>
<span class="line">Phase <span class="token number">1</span> - <span class="token function">find</span> and verify superblock<span class="token punctuation">..</span>.</span>
<span class="line">Phase <span class="token number">2</span> - using internal log</span>
<span class="line">        - zero log<span class="token punctuation">..</span>.</span>
<span class="line">        - scan filesystem freespace and inode maps<span class="token punctuation">..</span>.</span>
<span class="line">        - found root inode chunk</span>
<span class="line">Phase <span class="token number">3</span> - <span class="token keyword">for</span> each AG<span class="token punctuation">..</span>.</span>
<span class="line">        - scan and <span class="token function">clear</span> agi unlinked lists<span class="token punctuation">..</span>.</span>
<span class="line">        - process known inodes and perform inode discovery<span class="token punctuation">..</span>.</span>
<span class="line">        - agno <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">        - agno <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line">        - process newly discovered inodes<span class="token punctuation">..</span>.</span>
<span class="line">Phase <span class="token number">4</span> - check <span class="token keyword">for</span> duplicate blocks<span class="token punctuation">..</span>.</span>
<span class="line">        - setting up duplicate extent list<span class="token punctuation">..</span>.</span>
<span class="line">        - check <span class="token keyword">for</span> inodes claiming duplicate blocks<span class="token punctuation">..</span>.</span>
<span class="line">        - agno <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">        - agno <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line">Phase <span class="token number">5</span> - rebuild AG headers and trees<span class="token punctuation">..</span>.</span>
<span class="line">        - reset superblock<span class="token punctuation">..</span>.</span>
<span class="line">Phase <span class="token number">6</span> - check inode connectivity<span class="token punctuation">..</span>.</span>
<span class="line">        - resetting contents of realtime bitmap and summary inodes</span>
<span class="line">        - traversing filesystem <span class="token punctuation">..</span>.</span>
<span class="line">        - traversal finished <span class="token punctuation">..</span>.</span>
<span class="line">        - moving disconnected inodes to lost+found <span class="token punctuation">..</span>.</span>
<span class="line">Phase <span class="token number">7</span> - verify and correct <span class="token function">link</span> counts<span class="token punctuation">..</span>.</span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"><span class="token comment"># 共有 7 个重要的检查流程，详细的流程介绍可以 man xfs_repair 查看</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查下系统原本就有的 /dev/centos/home 文件系统</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_repair /dev/centos/home </span></span>
<span class="line">xfs_repair: /dev/centos/home contains a mounted filesystem</span>
<span class="line">xfs_repair: /dev/centos/home contains a mounted and writable filesystem</span>
<span class="line"></span>
<span class="line">fatal error -- couldn't initialize XFS library</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>xfs_repair 可以检查或修复文件系统，因为修复工作是个很庞大的任务，不允许已挂载的文件系统，所以上面会提示 <code v-pre>xfs_repair /dev/centos/home</code> 是一个已挂载的文件系统（需要卸载后再处理）。</p>
<p>Linux 系统还有个根目录装置无法被卸载，要对根目录救援怎么办？这个就是单人救援模式来处理了，使用参数 <code v-pre>-d</code> 进入。记得很危险这个指令！</p>
<h3 id="fsck-ext4-处理-ext4-文件系统" tabindex="-1"><a class="header-anchor" href="#fsck-ext4-处理-ext4-文件系统"><span>fsck.ext4 处理 ext4 文件系统</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">fsck.ext4 <span class="token punctuation">[</span>-pf<span class="token punctuation">]</span><span class="token punctuation">[</span>-b superblock<span class="token punctuation">]</span> 装置名称</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>p：当文件系统在修复时，若有需要回复 y 的动作时，自动回复 y 来继续进行修复动作</li>
<li>f：强制检查。一般来说，如果 fsck 没有发现任何 unclean 的旗标，不会主动进入细部检查的，可以通过 -f 参数强制检查</li>
<li>D：针对该文件系统下的目录进行优化配置</li>
<li>b：后面接 superblock 的位置。一般来说该选项用不到，但是如果 superblock 因故损坏时，通过该参数即可利用文件系统内备份的 superblock 来尝试救援。一般来说 superblock 备份在： 1k block 放在 8193、2k block 放在16384、4k block 放在 32786</li>
</ul>
<p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 找出刚刚建立的 /dev/sda5 的另一块 superblock，并检查它</span></span>
<span class="line"><span class="token comment"># 发现报错了，这个是前面练习格式化成非 ext 系统了，这里需要格式化回来</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dumpe2fs -h /dev/sda5 | grep 'Blocks per group'</span></span>
<span class="line">dumpe2fs <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">dumpe2fs: Bad magic number <span class="token keyword">in</span> super-block 当尝试打开 /dev/sda5 时</span>
<span class="line"><span class="token comment"># 格式回 ext4</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.ext4 /dev/sda5</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dumpe2fs -h /dev/sda5 | grep 'Blocks per group'</span></span>
<span class="line">dumpe2fs <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">Blocks per group:         <span class="token number">32768</span></span>
<span class="line"><span class="token comment"># 看起来每个 block 群组会有 32768 个 block，因此第二个 superblock 应该就在 32768 上</span></span>
<span class="line"><span class="token comment"># 因为 block 号码为 0 号开始</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fsck.ext4 -b 32768 /dev/sda5</span></span>
<span class="line">e2fsck <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">/dev/sda5 was not cleanly unmounted, 强制检查.</span>
<span class="line">第一步: 检查inode,块,和大小</span>
<span class="line">删除 inode <span class="token number">1577</span> has zero dtime.  处理<span class="token operator">&lt;</span>y<span class="token operator">></span>? 是</span>
<span class="line">第二步: 检查目录结构</span>
<span class="line">第3步: 检查目录连接性</span>
<span class="line">Pass <span class="token number">4</span>: Checking reference counts</span>
<span class="line">第5步: 检查簇概要信息</span>
<span class="line"></span>
<span class="line">/dev/sda5: ***** 文件系统已修改 *****  <span class="token comment"># 文件系统被修改过，所以出现了警告</span></span>
<span class="line">/dev/sda5: <span class="token number">11</span>/65536 files <span class="token punctuation">(</span><span class="token number">0.0</span>% non-contiguous<span class="token punctuation">)</span>, <span class="token number">12955</span>/262144 blocks</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如果没有检查到问题，则不会强制检查</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fsck.ext4 /dev/sda5</span></span>
<span class="line">e2fsck <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">/dev/sda5: clean, <span class="token number">11</span>/65536 files, <span class="token number">12955</span>/262144 blocks</span>
<span class="line"><span class="token comment"># -f 参数强制检查</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># fsck.ext4 -f /dev/sda5</span></span>
<span class="line">e2fsck <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">第一步: 检查inode,块,和大小</span>
<span class="line">第二步: 检查目录结构</span>
<span class="line">第3步: 检查目录连接性</span>
<span class="line">Pass <span class="token number">4</span>: Checking reference counts</span>
<span class="line">第5步: 检查簇概要信息</span>
<span class="line">/dev/sda5: <span class="token number">11</span>/65536 files <span class="token punctuation">(</span><span class="token number">0.0</span>% non-contiguous<span class="token punctuation">)</span>, <span class="token number">12955</span>/262144 blocks</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>xfs_repair s或 fsck.ext4 都是用来检查与修正文件系统错误的指令。注意：通常只有身为 root 且你的文件系统有问题的时候才使用该指令，正常情况下不要使用，可能会造成对系统的危害。通常使用的时候，都是系统出现了极大的问题，导致在 linux 开机的时候得进入单人单机模式下进行维护的行为时，才必须使用此指令</p>
<p>另外，如果怀疑刚格式化的磁盘有问题，也可以使用这些指令来检查，此外这些指令在扫描磁盘时，可能会造成部分 filesystem 的修订，所以：执行 xfs_repair、fsck.ext4 时，被检查的 partition 不能挂载到系统上，需要先卸载</p>
<h2 id="文件系统挂载与卸载" tabindex="-1"><a class="header-anchor" href="#文件系统挂载与卸载"><span>文件系统挂载与卸载</span></a></h2>
<p>前面提到过挂载点是目录，目录是进入磁盘分区槽（其实是文件系统）的入口。在挂载前需要确定几件事情：</p>
<ul>
<li>
<p>单一文件系统不应该被重复挂载在不同的挂载点（目录）中</p>
</li>
<li>
<p>单一目录不应该重复挂载多个文件系统</p>
</li>
<li>
<p>要作为挂载点的目录，理论上都是空目录才是</p>
<p>如果不是空目录，挂载之后，原来目录下的内容会暂时消失，等待分区被卸载之后才会显示出来</p>
</li>
</ul>
<p>在 linux 系统上需要使用 mount 指令，该指令很难，这里简单学一点</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">mount</span> <span class="token parameter variable">-a</span></span>
<span class="line"><span class="token function">mount</span> <span class="token punctuation">[</span>-l<span class="token punctuation">]</span></span>
<span class="line"><span class="token function">mount</span> <span class="token punctuation">[</span>-t 文件系统<span class="token punctuation">]</span> <span class="token assign-left variable">LABEL</span><span class="token operator">=</span><span class="token string">''</span> 挂载点</span>
<span class="line"><span class="token function">mount</span> <span class="token punctuation">[</span>-t 文件系统<span class="token punctuation">]</span> <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">''</span> 挂载点</span>
<span class="line"><span class="token function">mount</span> <span class="token punctuation">[</span>-t 文件系统<span class="token punctuation">]</span> 装置文件名<span class="token operator">=</span><span class="token string">''</span> 挂载点</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>a：按照配置文件 /etc/fstab 的数据将所有未挂载的磁盘都挂载上来</li>
<li>l：单纯的输入 mount 会显示目前挂载的信息。加上 -l 可增列 Label 名称</li>
<li>t：可以加上文件系统种类来指定欲挂载的类型。常见的 Linux 支持类型有
<ul>
<li>xfs</li>
<li>ext3</li>
<li>ext4</li>
<li>reiserfs</li>
<li>vfat</li>
<li>Iso9660（光盘格式）</li>
<li>nfs（网络文件系统类型）</li>
<li>cifs（网络文件系统类型）</li>
<li>smbfs（网络文件系统类型）</li>
</ul>
</li>
<li>o：后面可以接一些挂载时额外加上的参数，例如账户、密码、读写权限等
<ul>
<li>async、sync：此文件系统是否使用同步写入（sync）或异步（async）的内存机制，请参考文件系统运作方式。预设为 async</li>
<li>atime、noatime：是否修订文件的读取时间（atime），为了效能，某些时刻刻使用 noatime</li>
<li>ro、rw：挂载文件系统位只读（ro）或可擦写（rw）</li>
<li>auto、noauto：允许此 filesystem 被 以 mount -a 自动挂载（auto）</li>
<li>dev、nodev：是否允许此 filesystem 上，可建立装置文件？dev 为允许</li>
<li>suid、nosuid：是否允许此 filesystem 含有 suid、sgid 的文件格式</li>
<li>exec、noexec：是否允许此 filesystem 上拥有可执行 binary 文件</li>
<li>user、nouser：是否允许此 filesystem 让任何使用者执行 mount ？一般来说 mount 仅有 root 可以进行，但下达 user 参数则可以让一般 user 也能够对此 partition 进行 mount</li>
<li>defaults：默认值为 rw、suid、dev、exec、auto、nouser、async</li>
<li>remount：重新挂载，这在系统除错或重新更新参数时，很有用</li>
</ul>
</li>
</ul>
<p>基本上 CentOS 7 不需要加上 -t 这个选项，系统会自动分析使用的是什么文件系统格式，这也是使用 blkid 就能够显示正确的文件系统的缘故。</p>
<p>那么 centos 是怎么找出文件系统类型的呢？由于文件系统几乎都有 superblock ，可以通过分析 superblock 搭配 linux 自己的驱动程序去测试挂载，如果成功了，就like自动的使用该类型的文件系统挂载起来。那么可以主要在以下两个文件中找到有哪些 filesystem 支持上述的挂载测试</p>
<ul>
<li>/etc/filesystems：系统指定的测试挂载文件系统类型的优先级</li>
<li>/proc/filesystems：linux 系统已经加载的文件系统类型</li>
</ul>
<p>可以在 <code v-pre>/lib/modules/$(uname -r)/kernel/fs/</code> 目录中找到相关文件系统类型的驱动程序，比如 ext4 的驱动在 <code v-pre>/lib/modules/$(uname -r)/kernel/fs/ext4/</code> 目录下</p>
<p>注：<code v-pre>$(uname -r)</code>括号中的指令可以执行的，使用这种占位来引用指令输出的结果</p>
<p>另外，过去都习惯使用装置文件名然后直接用该文件名来挂载，不过这里推荐使用 UUID 来识别文件系统，因为是独一无二的，很可靠</p>
<h3 id="挂载-xfs-ext4-vfat-等文件系统" tabindex="-1"><a class="header-anchor" href="#挂载-xfs-ext4-vfat-等文件系统"><span>挂载 xfs/ext4/vfat 等文件系统</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 先找出 uuid，使用 uuid 来挂载文件系统到 /data/xfs 内</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># blkid /dev/sda4</span></span>
<span class="line">/dev/sda4: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"819c0c18-8d4a-4c3f-9a98-0ab039e769f5"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"xfs"</span> <span class="token assign-left variable">PARTLABEL</span><span class="token operator">=</span><span class="token string">"Linux filesystem"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"3819b115-2ab8-4fb6-8425-bb2ff8e797b7"</span> </span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># mount UUID="819c0c18-8d4a-4c3f-9a98-0ab039e769f5" /data/xfs</span></span>
<span class="line">mount: 挂载点 /data/xfs 不存在</span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># mkdir -p /data/xfs</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># mount UUID="819c0c18-8d4a-4c3f-9a98-0ab039e769f5" /data/xfs</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># df /data/xfs</span></span>
<span class="line">文件系统         1K-块  已用    可用 	  已用% 挂载点</span>
<span class="line">/dev/sda4      <span class="token number">1038336</span> <span class="token number">32896</span> <span class="token number">1005440</span>    <span class="token number">4</span>% /data/xfs</span>
<span class="line"><span class="token comment"># 这里顺利挂载了，且容量约为 1g 左右</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># df -h /data/xfs</span></span>
<span class="line">文件系统        容量  已用  可用 已用% 挂载点</span>
<span class="line">/dev/sda4      1014M   33M  982M    <span class="token number">4</span>% /data/xfs</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用相同的方式，将 /dev/sda5 挂载到 /dev/ext4 目录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># mkdir /data/ext4</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># blkid /dev/sda5</span></span>
<span class="line">/dev/sda5: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"b0923041-024a-47cf-a4b8-d59b573855d7"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"ext4"</span> <span class="token assign-left variable">PARTLABEL</span><span class="token operator">=</span><span class="token string">"Microsoft basic data"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"9cffc784-99a3-40f6-8e5f-0c71b3bb7f05"</span> </span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># mount UUID="b0923041-024a-47cf-a4b8-d59b573855d7" /data/ext4</span></span>
<span class="line"><span class="token punctuation">[</span>root@study fs<span class="token punctuation">]</span><span class="token comment"># df /data/ext4</span></span>
<span class="line">文件系统        1K-块  已用   可用 已用% 挂载点</span>
<span class="line">/dev/sda5      <span class="token number">999320</span>  <span class="token number">2564</span> <span class="token number">927944</span>    <span class="token number">1</span>% /data/ext4</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="挂载-cd-或-dvd-光盘" tabindex="-1"><a class="header-anchor" href="#挂载-cd-或-dvd-光盘"><span>挂载 CD 或 DVD 光盘</span></a></h3>
<p>这里拿出装系统的时候那个 iso 的文件，加载到虚拟机中</p>
<p><img src="@source/tutorial-basis/07/assets/image-20191027165331804.png" alt="image-20191027165331804"></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid</span></span>
<span class="line">/dev/sr0: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"2019-07-12-09-13-14-35"</span> <span class="token assign-left variable">LABEL</span><span class="token operator">=</span><span class="token string">"VBox_GAs_6.0.10"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"iso9660"</span> </span>
<span class="line"><span class="token comment"># 找到上图的光驱</span></span>
<span class="line">/dev/sr1: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"2019-09-11-18-50-31-00"</span> <span class="token assign-left variable">LABEL</span><span class="token operator">=</span><span class="token string">"CentOS 7 x86_64"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"iso9660"</span> <span class="token assign-left variable">PTTYPE</span><span class="token operator">=</span><span class="token string">"dos"</span> </span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 挂载到 /data/cdrom 目录下</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /data/cdrom</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount /dev/sr1 /data/cdrom/</span></span>
<span class="line">mount: /dev/sr1 写保护，将以只读方式挂载</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df /data/cdrom/</span></span>
<span class="line">文件系统         1K-块    已用  可用 已用% 挂载点</span>
<span class="line">/dev/sr1       <span class="token number">4554702</span> <span class="token number">4554702</span>     <span class="token number">0</span>  <span class="token number">100</span>% /data/cdrom</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>光驱挂载之后就无法退出盘片了，除非卸载才能够退出。在图形界面，系统会自动帮你挂载这个光盘到 /media/ 里面去，也可以不卸除就直接退出，但是文字界面就没有这个福利了</p>
<h3 id="挂载-vfat-usb-磁盘" tabindex="-1"><a class="header-anchor" href="#挂载-vfat-usb-磁盘"><span>挂载 vfat （USB 磁盘）</span></a></h3>
<p>USB 不能是 NTFS 的文件系统</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">由于笔者没有 USB 磁盘，这里就不做练习了，直接复制命令</span>
<span class="line">blkid</span>
<span class="line">/dev/sda1:UUID<span class="token operator">=</span><span class="token string">"xxxx22"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"vfat"</span></span>
<span class="line"><span class="token function">mkdir</span> /data/usb</span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">codepage</span><span class="token operator">=</span><span class="token number">950</span>,iocharset<span class="token operator">=</span>utf8 <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"xxxx22"</span> /data/usb</span>
<span class="line"><span class="token function">df</span> /data/usb</span>
<span class="line">文件系统         1K-块    已用    可用 已用% 挂载点</span>
<span class="line">/dev/sda1    <span class="token number">4554702</span> <span class="token number">4554702</span>     <span class="token number">0</span>  <span class="token number">100</span>% /data/usb</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果带有中文文件名的数据，那么可以在挂载时指定下挂载文件系统所使用的语系数据，在 man mount 找到 vfat 文件格式当中可用使用 codepage 来处理，中文语系代码为 950</p>
<p>如果你使用的 usb 磁盘是 NTFS 时，因为预设的 CentOS 7 不支持 NTFS 文件系统格式，所以需要安装 NTFS 文件系统的驱动程序后，才可以（该部分后续讲解 yum 服务器时会继续）</p>
<h3 id="重新挂载根目录与挂载不特定目录" tabindex="-1"><a class="header-anchor" href="#重新挂载根目录与挂载不特定目录"><span>重新挂载根目录与挂载不特定目录</span></a></h3>
<p>根目录不能被卸载的，如果想要改变挂载参数或则根目录出现「只读」状态时，如何重新挂载呢？最可能的处理方式就是重新启动系统，但是可以用下面的指令来做</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将 / 重新挂载，并加入参数为 rw 与 auto</span></span>
<span class="line"><span class="token function">mount</span> <span class="token parameter variable">-o</span> remount,rw,auto /</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>另外，可以利用 mount 来将某个目录挂载到另外一个木去，这并不是挂载文件系统，而是额外故障某个目录的方法，虽然下面的演示也可以使用 symbolic link 来连结，不过在某些不支持符号链接的程序运行中，就可以通过这种方式来处理</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /data/var</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount --bind /var /data/var</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ls -lid /var /data/var</span></span>
<span class="line"><span class="token number">69</span> drwxr-xr-x. <span class="token number">20</span> root root <span class="token number">282</span> <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:38 /data/var</span>
<span class="line"><span class="token number">69</span> drwxr-xr-x. <span class="token number">20</span> root root <span class="token number">282</span> <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:38 /var</span>
<span class="line"><span class="token comment"># 可以看到两个目录一模一样</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 通过 mount 指令查找 var 内容，看到下面的 /data/var 的挂载属性</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount | grep var</span></span>
<span class="line">sunrpc on /var/lib/nfs/rpc_pipefs <span class="token builtin class-name">type</span> rpc_pipefs <span class="token punctuation">(</span>rw,relatime<span class="token punctuation">)</span></span>
<span class="line">/dev/mapper/centos-root on /data/var <span class="token builtin class-name">type</span> xfs <span class="token punctuation">(</span>rw,relatime,seclabel,attr2,inode64,noquota<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 从此进入 /data/var 就是进入 /var 的效果了</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="umount-将装置文件卸除" tabindex="-1"><a class="header-anchor" href="#umount-将装置文件卸除"><span>umount 将装置文件卸除</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">umount</span> <span class="token punctuation">[</span>-fn<span class="token punctuation">]</span> 装置文件名或挂载点</span>
<span class="line"></span>
<span class="line">-f：强制卸除，可用在类似网络文件系统无法读取到的情况下</span>
<span class="line">-l：like卸除文件系统，比 <span class="token parameter variable">-f</span> 还强</span>
<span class="line">-n：不更新 /etc/mtab 情况下卸除</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将本章讲解的示例挂载全部卸除</span></span>
<span class="line">/dev/sr1 on /data/cdrom <span class="token builtin class-name">type</span> iso9660 <span class="token punctuation">(</span>ro,relatime<span class="token punctuation">)</span></span>
<span class="line">/dev/mapper/centos-root on /data/var <span class="token builtin class-name">type</span> xfs <span class="token punctuation">(</span>rw,relatime,seclabel,attr2,inode64,noquota<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 笔者这里刚才虚拟机重启了，找不到 /data/xfs 和 /data/ext4 的挂载点信息了</span></span>
<span class="line"><span class="token comment"># 查看了下目录信息，发现变成最后一个 一样的了，都是 /dev/mapper/centos-root</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 卸载后面可以使用以下方式</span></span>
<span class="line"><span class="token comment"># umount /dev/sr1  # 用装置文件名</span></span>
<span class="line"><span class="token function">umount</span> /data/cdrom <span class="token comment"># 用挂载点来卸载</span></span>
<span class="line"><span class="token function">umount</span> /data/var <span class="token comment"># 说是这个装置有被其他方式挂载，这里一定要用挂载点</span></span>
<span class="line"><span class="token comment"># 这里笔者就懵逼了，完全看不出来怎么算是被其他挂载点挂载的？</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="磁盘-文件系统参数修订" tabindex="-1"><a class="header-anchor" href="#磁盘-文件系统参数修订"><span>磁盘/文件系统参数修订</span></a></h2>
<p>某些时候，可能希望修改一下目前文件系统的一些相关信息，比如需要修改 Label name，或则是 journal 的参数，或则是其他磁盘、文件系统运作时的相关参数（DMA 启动与否）。这个时候就需要下面的相关指令了</p>
<h3 id="mknod" tabindex="-1"><a class="header-anchor" href="#mknod"><span>mknod</span></a></h3>
<p>在 Linux 下所有的装置都以文件来代表的，但是那个文件如何代表该装置呢？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>mrcode@study ~<span class="token punctuation">]</span>$ ll /dev/sda*</span>
<span class="line"><span class="token comment"># 注意这里的 8,0 这一列</span></span>
<span class="line">brw-rw----. <span class="token number">1</span> root disk <span class="token number">8</span>, <span class="token number">0</span> Oct <span class="token number">27</span> <span class="token number">17</span>:36 /dev/sda</span>
<span class="line">brw-rw----. <span class="token number">1</span> root disk <span class="token number">8</span>, <span class="token number">1</span> Oct <span class="token number">27</span> <span class="token number">17</span>:36 /dev/sda1</span>
<span class="line">brw-rw----. <span class="token number">1</span> root disk <span class="token number">8</span>, <span class="token number">2</span> Oct <span class="token number">27</span> <span class="token number">17</span>:36 /dev/sda2</span>
<span class="line">brw-rw----. <span class="token number">1</span> root disk <span class="token number">8</span>, <span class="token number">3</span> Oct <span class="token number">27</span> <span class="token number">17</span>:36 /dev/sda3</span>
<span class="line">brw-rw----. <span class="token number">1</span> root disk <span class="token number">8</span>, <span class="token number">4</span> Oct <span class="token number">27</span> <span class="token number">17</span>:36 /dev/sda4</span>
<span class="line">brw-rw----. <span class="token number">1</span> root disk <span class="token number">8</span>, <span class="token number">5</span> Oct <span class="token number">27</span> <span class="token number">17</span>:36 /dev/sda5</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面信息中的 8 为主要装置代码（Major），而 0~5 则为次要装置代码（Minor），linux 核心就是通过这两个数值来决定的。举例来说，常见的磁盘文件名 /dev/sda 与 /dev/loop0 装置代码如下所示</p>
<table>
<thead>
<tr>
<th style="text-align:center">磁盘文件名</th>
<th style="text-align:center">Major</th>
<th style="text-align:center">Minor</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">/dev/sda</td>
<td style="text-align:center">8</td>
<td style="text-align:center">0-15</td>
</tr>
<tr>
<td style="text-align:center">/dev/sdb</td>
<td style="text-align:center">8</td>
<td style="text-align:center">16-31</td>
</tr>
<tr>
<td style="text-align:center">/dev/loop0</td>
<td style="text-align:center">7</td>
<td style="text-align:center">0</td>
</tr>
<tr>
<td style="text-align:center">/dev/loop1</td>
<td style="text-align:center">7</td>
<td style="text-align:center">1</td>
</tr>
</tbody>
</table>
<p>可以通过核心官网连结了解更多核心支撑的硬件装置代码。基本上 linux 核心 2.6 以后，硬件文件名已经都可以被系统自动的实时产生了，不需要手动创建装置文件。不够某些情况下需要东涌处理装置文件，例如在某些服务被关到特定目录下时（chroot）就需要这样做了，此时 mknod 指令可以实现</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">mknod</span> 装置文件名 <span class="token punctuation">[</span>bcp<span class="token punctuation">]</span><span class="token punctuation">[</span>Major<span class="token punctuation">]</span><span class="token punctuation">[</span>Minor<span class="token punctuation">]</span></span>
<span class="line">选项与参数</span>
<span class="line">装置种类：</span>
<span class="line"> b：设置装置名称成为一个周边存储设备文件，例如磁盘等</span>
<span class="line"> c：设置装置名称成为一个周边输入设备文件，例如鼠标、键盘灯</span>
<span class="line"> p：设置装置名称成为一个 FIFO 文件</span>
<span class="line">Major：主要装置代码</span>
<span class="line">Minor：次要装置代码</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 上述介绍知道  /dev/sda10 的装置代码为 8，10 ，请建立并查阅此装置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mknod /dev/sda10 b 8 10</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /dev/sda10</span></span>
<span class="line">brw-r--r--. <span class="token number">1</span> root root <span class="token number">8</span>, <span class="token number">10</span> <span class="token number">10</span>月 <span class="token number">27</span> <span class="token number">17</span>:52 /dev/sda10</span>
<span class="line"><span class="token comment"># 注意前面的 b 和 8，10 这个是有意义的不要随意设定</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 建立一个 FIFO 文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mknod /tmp/testpipe p</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /tmp/testpipe </span></span>
<span class="line">prw-r--r--. <span class="token number">1</span> root root <span class="token number">0</span> <span class="token number">10</span>月 <span class="token number">27</span> <span class="token number">17</span>:53 /tmp/testpipe</span>
<span class="line"><span class="token comment"># 该文件不是一般文件，不可以随便放这里，测试完成后删除掉该文件</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># rm /dev/sda10 /tmp/testpipe </span></span>
<span class="line">rm：是否删除块特殊文件 <span class="token string">"/dev/sda10"</span>？y</span>
<span class="line">rm：是否删除先进先出 <span class="token string">"/tmp/testpipe"</span>？y</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="xfs-admin-修改-xfs-文件系统的-uuid-与-lable-name" tabindex="-1"><a class="header-anchor" href="#xfs-admin-修改-xfs-文件系统的-uuid-与-lable-name"><span>xfs_admin 修改 XFS 文件系统的 UUID 与 Lable name</span></a></h3>
<p>如果当初格式化的手忘记加上 lable name，后来想要重新加上，不需要重新格式化</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">xfs_admin <span class="token punctuation">[</span>-lu<span class="token punctuation">]</span> <span class="token punctuation">[</span>-L labe<span class="token punctuation">]</span><span class="token punctuation">[</span>-U uuid<span class="token punctuation">]</span> 装置文件名</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>l：列出这个装置的 lable</li>
<li>u：列出这个装置的 uuid</li>
<li>L：设置这个装置的 label name</li>
<li>U：设置这个装置的 uuid</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 开始查看，没有 label</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_admin -l /dev/sda4</span></span>
<span class="line">label <span class="token operator">=</span> <span class="token string">""</span></span>
<span class="line"><span class="token comment"># 设置后，发现后了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_admin -L mrcode_xfs /dev/sda4</span></span>
<span class="line">writing all SBs</span>
<span class="line">new label <span class="token operator">=</span> <span class="token string">"mrcode_xfs"</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_admin -l /dev/sda4</span></span>
<span class="line">label <span class="token operator">=</span> <span class="token string">"mrcode_xfs"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 利用 uuidgen 产生新 UUID 来设置 /dev/sda4 ，并测试挂载</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># umount /dev/sda4</span></span>
<span class="line">umount: /dev/sda4：未挂载  <span class="token comment"># 前面练习中我说咋没有发现他了，原来挂载失效了？</span></span>
<span class="line"><span class="token comment"># 生成 uuid</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># uuidgen</span></span>
<span class="line">edfa7161-5847-4935-80e1-6e081be9ab77</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_admin -u /dev/sda4</span></span>
<span class="line">UUID <span class="token operator">=</span> 819c0c18-8d4a-4c3f-9a98-0ab039e769f5</span>
<span class="line"><span class="token comment"># 修改为新生成的 uuid</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_admin -U edfa7161-5847-4935-80e1-6e081be9ab77 /dev/sda4</span></span>
<span class="line">Clearing log and setting UUID</span>
<span class="line">writing all SBs</span>
<span class="line">new UUID <span class="token operator">=</span> edfa7161-5847-4935-80e1-6e081be9ab77</span>
<span class="line"><span class="token comment"># 用新的 uuid 挂载</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount UUID=edfa7161-5847-4935-80e1-6e081be9ab77 /data/xfs</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="tune2fs-修改-ext4-的-label-name-与-uuid" tabindex="-1"><a class="header-anchor" href="#tune2fs-修改-ext4-的-label-name-与-uuid"><span>tune2fs 修改 ext4 的 label name 与 UUID</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">tune2fs <span class="token punctuation">[</span>-l<span class="token punctuation">]</span><span class="token punctuation">[</span>-L label<span class="token punctuation">]</span><span class="token punctuation">[</span>-U uuid<span class="token punctuation">]</span> 装置名</span>
<span class="line"></span>
<span class="line">-l：类似 dumpe2fs <span class="token parameter variable">-h</span> 的功能，将 superblock 内的数据读出来</span>
<span class="line">-L：修改 label name</span>
<span class="line">-U：修改 UUID</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dumpe2fs -h /dev/sda5 | grep name</span></span>
<span class="line">dumpe2fs <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">Filesystem volume name:   <span class="token operator">&lt;</span>none<span class="token operator">></span>		<span class="token comment"># 无名称</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># tune2fs -L mrcode_ext4 /dev/sda5</span></span>
<span class="line">tune2fs <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount LABEL=mrcode_ext4 /data/ext4</span></span>
<span class="line"><span class="token comment"># 再次查看就有了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dumpe2fs -h /dev/sda5 | grep name</span></span>
<span class="line">dumpe2fs <span class="token number">1.42</span>.9 <span class="token punctuation">(</span><span class="token number">28</span>-Dec-2013<span class="token punctuation">)</span></span>
<span class="line">Filesystem volume name:   mrcode_ext4</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


