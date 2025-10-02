<template><div><h1 id="文件系统的特殊观察与操作" tabindex="-1"><a class="header-anchor" href="#文件系统的特殊观察与操作"><span>文件系统的特殊观察与操作</span></a></h1>
<p>文件系统是在是非常有趣的东西，鸟哥学了好几年很多东西都不懂，这里有一些经验以供参考</p>
<h2 id="磁盘空间之浪费问题" tabindex="-1"><a class="header-anchor" href="#磁盘空间之浪费问题"><span>磁盘空间之浪费问题</span></a></h2>
<p>前面 ext2 data block 中谈到一个 block 只能放置一个文件，因此太多小文件会浪费很多的磁盘容量。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -sh</span></span>
<span class="line">总用量 16K</span>
<span class="line"><span class="token number">4</span>.0K -rw-------. <span class="token number">1</span> root   root   <span class="token number">2</span>.2K <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:32 anaconda-ks.cfg</span>
<span class="line"><span class="token number">4</span>.0K -rw-r--r--. <span class="token number">2</span> root   root    <span class="token number">451</span> <span class="token number">6</span>月  <span class="token number">10</span> <span class="token number">2014</span> <span class="token function">crontab</span></span>
<span class="line">   <span class="token number">0</span> lrwxrwxrwx. <span class="token number">1</span> root   root     <span class="token number">12</span> <span class="token number">10</span>月 <span class="token number">22</span> 00:00 crontab2 -<span class="token operator">></span> /etc/crontab</span>
<span class="line"><span class="token number">4</span>.0K -rw-r--r--. <span class="token number">1</span> root   root   <span class="token number">2</span>.2K <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:42 initial-setup-ks.cfg</span>
<span class="line"><span class="token number">4</span>.0K -rwxr-xrwx. <span class="token number">1</span> mrcode mrcode <span class="token number">2</span>.2K <span class="token number">10</span>月  <span class="token number">7</span> <span class="token number">23</span>:30 initial-setup-ks-mrcode.cfg</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述的总用量是每个文件所使掉 blcok 的容量的汇总，但是 哪个 crontab 文件实际只有用 451bytes，但是他却占用了整个 block （每个 block 为 4k）。所以总共占用了 16k 的容量，但是实际这里的文件总容量不到 7k</p>
<p>当讨论磁盘空间浪费问题的时候，需要考虑到文件容量的损耗</p>
<h2 id="利用-gnu-的-parted-进行分区行为-optional" tabindex="-1"><a class="header-anchor" href="#利用-gnu-的-parted-进行分区行为-optional"><span>利用 GNU 的 parted 进行分区行为（Optional）</span></a></h2>
<p>parted 同时支持 gdisk 和 fdisk 分区</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">parted</span> <span class="token punctuation">[</span>装置<span class="token punctuation">]</span><span class="token punctuation">[</span>指令<span class="token punctuation">]</span><span class="token punctuation">[</span>参数<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">选项与参数，指令功能：</span>
<span class="line">	新增分区：mkpart <span class="token punctuation">[</span>primary<span class="token operator">|</span>logical<span class="token operator">|</span>extended<span class="token punctuation">]</span><span class="token punctuation">[</span>ext4<span class="token operator">|</span>vfat<span class="token operator">|</span>xfs<span class="token punctuation">]</span> 开始 结束</span>
<span class="line">	显示分区：print</span>
<span class="line">	删除分区：rm <span class="token punctuation">[</span>partition<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 列出目前本机的分区表资料</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sda print</span></span>
<span class="line">Model: ATA VBOX HARDDISK <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span>				<span class="token comment"># 磁盘接口与型号</span></span>
<span class="line">Disk /dev/sda: <span class="token number">43</span>.8GB									<span class="token comment"># 磁盘文件名与容量</span></span>
<span class="line">Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B		<span class="token comment">#每个扇区大小</span></span>
<span class="line">Partition Table: gpt		<span class="token comment"># 分区表 gpt</span></span>
<span class="line">Disk Flags: pmbr_boot</span>
<span class="line"></span>
<span class="line">Number  Start   End     Size    File system     Name                  标志</span>
<span class="line"> <span class="token number">1</span>      1049kB  3146kB  2097kB                                        bios_grub</span>
<span class="line"> <span class="token number">2</span>      3146kB  1077MB  1074MB  xfs</span>
<span class="line"> <span class="token number">3</span>      1077MB  <span class="token number">33</span>.3GB  <span class="token number">32</span>.2GB                                        lvm</span>
<span class="line"> <span class="token number">4</span>      <span class="token number">33</span>.3GB  <span class="token number">34</span>.4GB  1074MB  xfs             Linux filesystem</span>
<span class="line"> <span class="token number">5</span>      <span class="token number">34</span>.4GB  <span class="token number">35</span>.4GB  1074MB  ext4            Microsoft basic data</span>
<span class="line"> <span class="token number">6</span>      <span class="token number">35</span>.4GB  <span class="token number">36</span>.0GB  537MB   linux-swap<span class="token punctuation">(</span>v1<span class="token punctuation">)</span>  Linux swap</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面是最简单的 parted 指令功能简介，可以使用 man parted 或则 <code v-pre>parted /dev/sda help mkpart</code>查询更详细的数据。下面解释下每个字段是啥意思</p>
<ul>
<li>Number：分区槽号码，比如 1 表示 /dev/sda1</li>
<li>Start：分区的其实位置在这颗磁盘的多少 MB 处？这里以容量作为单位</li>
<li>End：此分区的结束位置在这颗磁盘的多少 MB 处？</li>
<li>Size：由上述数据分析，得到这个分区槽有多少容量</li>
<li>File system：分析可能的文件系统类型</li>
<li>Name：如同 gdisk 的 System ID 的意思</li>
</ul>
<p>不过这里你发现没有，start 与 end 的单位都不一样，看起来很费劲，可以通过以下指令固定</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sda unit mb print</span></span>
<span class="line">Model: ATA VBOX HARDDISK <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span></span>
<span class="line">Disk /dev/sda: 43772MB</span>
<span class="line">Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B</span>
<span class="line">Partition Table: gpt</span>
<span class="line">Disk Flags: pmbr_boot</span>
<span class="line"></span>
<span class="line">Number  Start    End      Size     File system     Name                  标志</span>
<span class="line"> <span class="token number">1</span>      <span class="token number">1</span>.05MB   <span class="token number">3</span>.15MB   <span class="token number">2</span>.10MB                                         bios_grub</span>
<span class="line"> <span class="token number">2</span>      <span class="token number">3</span>.15MB   1077MB   1074MB   xfs</span>
<span class="line"> <span class="token number">3</span>      1077MB   33293MB  32216MB                                        lvm</span>
<span class="line"> <span class="token number">4</span>      33293MB  34367MB  1074MB   xfs             Linux filesystem</span>
<span class="line"> <span class="token number">5</span>      34367MB  35441MB  1074MB   ext4            Microsoft basic data</span>
<span class="line"> <span class="token number">6</span>      35441MB  35978MB  537MB    linux-swap<span class="token punctuation">(</span>v1<span class="token punctuation">)</span>  Linux swap</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果想将原本的 MBR 和 GPT 分区表互相换，也可以使用 parted，不过不要用本次的 sda 来测试，因为分区表格式不能转换，该磁盘上的系统会损坏的。</p>
<p>下面测试，笔者就没有条件测试了，直接记录笔记</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将 /dev/sda 原本是 MBR 分区变成 GPT 分区表</span></span>
<span class="line"><span class="token function">parted</span> /dev/sda print</span>
<span class="line"><span class="token punctuation">..</span>.</span>
<span class="line">Partition Table: msdos  <span class="token comment"># MBR 就是现实 msdos 格式</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 改变成 gpt 分区</span></span>
<span class="line"><span class="token function">parted</span> /dev/sda mklabel gpt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>新的示例：建立一个全新的分区槽，格式化为 vfat 格式，且挂载到 /data/win 目录</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看分区表情况</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sda print</span></span>
<span class="line">Model: ATA VBOX HARDDISK <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span></span>
<span class="line">Disk /dev/sda: <span class="token number">43</span>.8GB</span>
<span class="line">Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B</span>
<span class="line">Partition Table: gpt</span>
<span class="line">Disk Flags: pmbr_boot</span>
<span class="line"></span>
<span class="line">Number  Start   End     Size    File system     Name                  标志</span>
<span class="line"> <span class="token number">1</span>      1049kB  3146kB  2097kB                                        bios_grub</span>
<span class="line"> <span class="token number">2</span>      3146kB  1077MB  1074MB  xfs</span>
<span class="line"> <span class="token number">3</span>      1077MB  <span class="token number">33</span>.3GB  <span class="token number">32</span>.2GB                                        lvm</span>
<span class="line"> <span class="token number">4</span>      <span class="token number">33</span>.3GB  <span class="token number">34</span>.4GB  1074MB  xfs             Linux filesystem</span>
<span class="line"> <span class="token number">5</span>      <span class="token number">34</span>.4GB  <span class="token number">35</span>.4GB  1074MB  ext4            Microsoft basic data</span>
<span class="line"> <span class="token number">6</span>      <span class="token number">35</span>.4GB  <span class="token number">36</span>.0GB  537MB   linux-swap<span class="token punctuation">(</span>v1<span class="token punctuation">)</span>  Linux swap</span>
<span class="line"><span class="token comment"># 找到最后一个分区的 end 位置，作为下一个分区的起始位置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sda mkpart primary fat32 36.0GB 36.5GB</span></span>
<span class="line">信息: You may need to update /etc/fstab.</span>
<span class="line"><span class="token comment"># 再次查看，就看到第 7 个了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sda print</span></span>
<span class="line"> <span class="token number">7</span>      <span class="token number">36</span>.0GB  <span class="token number">36</span>.5GB  522MB                   primary</span>
<span class="line"> </span>
<span class="line"> <span class="token comment"># 确认真的存在</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># partprobe </span></span>
<span class="line">Warning: 无法以读写方式打开 /dev/sr0 <span class="token punctuation">(</span>只读文件系统<span class="token punctuation">)</span>。/dev/sr0 已按照只读方式打开。</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lsblk /dev/sda7</span></span>
<span class="line">NAME MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT</span>
<span class="line">sda7   <span class="token number">8</span>:7    <span class="token number">0</span>  498M  <span class="token number">0</span> part </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 格式化分区为 vfat 格式</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs -t vfat /dev/sda7</span></span>
<span class="line">mkfs.fat <span class="token number">3.0</span>.20 <span class="token punctuation">(</span><span class="token number">12</span> Jun <span class="token number">2013</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># blkid /dev/sda7</span></span>
<span class="line">/dev/sda7: <span class="token assign-left variable">SEC_TYPE</span><span class="token operator">=</span><span class="token string">"msdos"</span> <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"72BE-0556"</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">"vfat"</span> <span class="token assign-left variable">PARTLABEL</span><span class="token operator">=</span><span class="token string">"primary"</span> <span class="token assign-left variable">PARTUUID</span><span class="token operator">=</span><span class="token string">"3a31eca1-2f5d-4960-8d61-739c4461b30f"</span> </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加到自动挂载</span></span>
<span class="line"><span class="token function">nano</span> /etc/fstab</span>
<span class="line"><span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">"72BE-0556"</span> /data/win vfat defaults <span class="token number">0</span> <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /data/win</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount -a</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df /data/win/</span></span>
<span class="line">文件系统        1K-块  已用   可用 已用% 挂载点</span>
<span class="line">/dev/sda7      <span class="token number">509672</span>     <span class="token number">0</span> <span class="token number">509672</span>    <span class="token number">0</span>% /data/win</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>事实上，你应该使用 gdisk 来处理 GPT 分区，不过 parted 非常适合通过脚本来一口气将分区全部建立，因为 parted 可以不用与用户交互</p>
</div></template>


