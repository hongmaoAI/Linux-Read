<template><div><h1 id="逻辑滚动条管理员-logical-volume-manager" tabindex="-1"><a class="header-anchor" href="#逻辑滚动条管理员-logical-volume-manager"><span>逻辑滚动条管理员（Logical Volume Manager）</span></a></h1>
<p>有一个场景：当初规划主机的时候，只给了 <code v-pre>/home</code> 目录 50G，后续不够用了，要怎么办？</p>
<p>很多人会这样做：加一块新硬盘，重新分区、格式化，将 <code v-pre>/home</code> 的数据完整复制过去，将原本的 partition 卸载重新挂载新的 partition。</p>
<p>万一第二次又分多了，导致容量浪费了，又要减掉一部分容量？是不是还需要重来一次？</p>
<p>有更简单的方法来解决这个问题，就是使用 LVM，它的重点在于「可以弹性的调整 filesystem 的容量，并非在于效能与数据保全上面。</p>
<p>LVM 可以整合多个实体 partition 在一起，让这些 partitions 看起来像是一个磁盘一样，而且可以在未来新增或移除其他的实体 partition 到这个 LVM 管理的磁盘中。</p>
<h2 id="上面是-lvm-pv、pe、vg、lv-的意义" tabindex="-1"><a class="header-anchor" href="#上面是-lvm-pv、pe、vg、lv-的意义"><span>上面是 LVM：PV、PE、VG、LV 的意义</span></a></h2>
<p>Logical Volume Manager 翻译为逻辑滚动条管理员，简称 LVM。LVM 将几个实体的 partitions（或 disk）通过软件组合成一块看起来是独立的大磁盘（<strong>VG</strong>）,然后将这块大磁盘再经过分区成为可使用分区槽（<strong>LV</strong>），最终就能挂载使用了。</p>
<p>但是为什么这样的系统可以进行 filesystem 的扩充或缩小呢？它与一个称为 <strong>PE</strong> 的项目有关</p>
<h3 id="physical-volume-pv-实体滚动条" tabindex="-1"><a class="header-anchor" href="#physical-volume-pv-实体滚动条"><span>Physical Volume PV 实体滚动条</span></a></h3>
<p>实际的 partition（或 DISK）需要调整系统标识符（system ID）成为 8e（LVM 的标识符），再经过 pvcreate 的指令将他转成 LVM 最底层的实体滚动条（LV），之后才可以将这些 PV 加以利用，调整 system ID 的方式是通过 gdisk</p>
<h3 id="volume-group-vg-滚动条组" tabindex="-1"><a class="header-anchor" href="#volume-group-vg-滚动条组"><span>Volume Group VG 滚动条组</span></a></h3>
<p>LVM 大磁盘是将许多 PV 整合成这个 VG ，所以 VG 是 LVM 组合起来的打磁盘。在预设情况下，使用 32 位的 Linux 系统时，基本上 LV 最大仅能支持到 65534 个 PE ，若使用预设的 PE 为 4MB 的情况下，最大容量可以达到约 256Gb，而在 64 位的 Linux 上，LV 几乎没有什么容量限制了</p>
<h3 id="physical-extent-pe-实体范围区块" tabindex="-1"><a class="header-anchor" href="#physical-extent-pe-实体范围区块"><span>Physical Extent PE 实体范围区块</span></a></h3>
<p>LVM 预设使用 4MB 的 PE 区块，LV 在 32 位系统上最多有 65534 个 PE（lvml 的格式），因此预设的 LVM 的 LV 有 4M*65534/1024M=256G.</p>
<p>PE 是整个 LVM 最小的存储块，我们写入的数据都是写入 PE 的，简单说，PE 类似系统里面的 block。</p>
<p>所以调整 PE 会影响到 LVM 的最大容量，不过在 CentOS 6.x 以后，直接使用 lvm2 的各项格式功能，以及系统变成了 64 位，因此整个限制以及不存在了</p>
<h3 id="logical-volume-lv-逻辑滚动条" tabindex="-1"><a class="header-anchor" href="#logical-volume-lv-逻辑滚动条"><span>Logical Volume LV 逻辑滚动条</span></a></h3>
<p>最终的 VG 还会被被切成 LV，LV 是最后可以被格式化使用的类似分区槽的东西，由于 PE 是整个 LVM 的最小存储单位，那么 LV 的大小就与 LV 内的 PE 总数有关。为了方便用户利用 LVM 来管理其系统，因此 LV 的装置文件名通常指定为 <code v-pre>/dev/vgname/lvname</code>的样式</p>
<p>LVM 可弹性的变更 filesystem 的容量是通过「交换 PE」来进行数据转换，将原本 LV 内的 PE 转移到其他装置中以降低 LV 容量，或将其他装置的 PE 加到此 LV 中以加大容量。VG、LV 与 PE 的关系类似下图：</p>
<p><img src="@source/tutorial-basis/14/assets/image-20200301205307039.png" alt="image-20200301205307039"></p>
<p>如上图，VG 内的 PE 会分给虚线部分的 LV，如果未来这个 VG 要扩充的话，加上其他的 PV 即可。而最重要的 LV 如果要扩充的话，也是通过加入 VG 内没有使用到的 PE 来扩充的</p>
<h3 id="实操流程" tabindex="-1"><a class="header-anchor" href="#实操流程"><span>实操流程</span></a></h3>
<p>通过 PV、VG、LV 的规划之后，再利用 mkfs 将 LV 格式化为可以利用的文件系统，而这个文件系统的容量在未来还可以扩充或减少，而且里面的数据还不会被影响，整个流程由基础到最终的结果可以这样看：</p>
<p><img src="@source/tutorial-basis/14/assets/image-20200301205826020.png" alt="image-20200301205826020"></p>
<p>当数据写入 LV 时，有两种机制写入到硬盘中：</p>
<ul>
<li>
<p>线性模式（linear）</p>
<p>假如将 <code v-pre>/dev/vda1、/dev/vdb1</code> 这两个 parition 假如到 VG 中，并且整个 VG 只有一个 LV 时，那么线性模式就是：当 <code v-pre>/dev/vda1</code> 的容量用完之后，<code v-pre>/dev/vdb1</code>的硬盘才会被使用到，这也是我们建议的模式</p>
</li>
<li>
<p>交错模式（triped）</p>
<p>就好理解了，一份数据分割在多个硬盘上，理论上读写效率会好点</p>
</li>
</ul>
<p>基本上，<strong>LVM 最主要的用途是实现一个可以弹性调整容量的文件系统上</strong>，而不是建立一个有效率为主的磁盘；因为数据分割在多个硬盘上，只要坏掉一块硬盘，那么基本上会损失掉很多数据。不适合 LVM</p>
<h2 id="lvm-实验流程" tabindex="-1"><a class="header-anchor" href="#lvm-实验流程"><span>LVM 实验流程</span></a></h2>
<p>LVM 必须核心有支持且需要安装 lvm2 软件，较新的 distribution 已经预设 LVM 相关软件安装了。</p>
<p>上一节实验 RAID 有 5 个分区，这里还是建议修改下 systemID 比较好，将 RAID 的 fd 改为 LVM 的 8e，实验流程如下：</p>
<ul>
<li>使用 4 个 partition，每个 partition 容量为 1GB，且 system ID 需要为 8e</li>
<li>全部的 partition 整合为一个 VG，VG 名称设置为 vmrcode；且 PE 的大小为 16MB</li>
<li>建立一个名为 vmrcode 的 LV，容量大约 2G</li>
<li>最终这个 LV 格式化 xfs 的文件系统且挂载 <code v-pre>/srv/lvm</code> 中</li>
</ul>
<ol start="0">
<li>disk 阶段，实际的磁盘</li>
</ol>
<p>这里需要准备把之前的 5 个分区删掉，重新格式化出来；有关分区相关操作请参考<RouteLink to="/tutorial-basis/07/03/">第 7 章的硬盘分区、格式化章节</RouteLink></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 最终分区出来的信息如下</span></span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">5</span>        <span class="token number">67123200</span>        <span class="token number">69220351</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">6</span>        <span class="token number">69220352</span>        <span class="token number">71317503</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line"> <span class="token number">7</span>        <span class="token number">71317504</span>        <span class="token number">73414655</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">73414656</span>        <span class="token number">75511807</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 前面说的 8e 就是这里的 Code 字段，是在建立分区的时候指定的 8E00,也就是 LVM 格式</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol>
<li>
<p>PV 阶段</p>
<p>下面是与 PV 有关的指令</p>
<ul>
<li>pvcreate：将实体 partition 建立成为 PV</li>
<li>pvscan：搜索目前系统里面任何具有 PV 的磁盘</li>
<li>pvdisplay：显示目前系统上 PV 状态</li>
<li>pvremove：将 PV 属性移除，让该 partition 不具有 PV 属性</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查有无 PV 在系统上</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pvscan </span></span>
<span class="line">  PV /dev/sda3   VG centos          lvm2 <span class="token punctuation">[</span><span class="token number">30.00</span> GiB / <span class="token number">14.00</span> GiB free<span class="token punctuation">]</span></span>
<span class="line">  Total: <span class="token number">1</span> <span class="token punctuation">[</span><span class="token number">30.00</span> GiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> use: <span class="token number">1</span> <span class="token punctuation">[</span><span class="token number">30.00</span> GiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> no VG: <span class="token number">0</span> <span class="token punctuation">[</span><span class="token number">0</span>   <span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># 在安装的时候就使用了 LVM 了， /dev/sda3 就是</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将 /dev/sda{4-7} 建立成为 pv 格式</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pvcreate /dev/sda{4,5,6,7}</span></span>
<span class="line">  Physical volume <span class="token string">"/dev/sda4"</span> successfully created.</span>
<span class="line">  Physical volume <span class="token string">"/dev/sda5"</span> successfully created.</span>
<span class="line">  Physical volume <span class="token string">"/dev/sda6"</span> successfully created.</span>
<span class="line">  Physical volume <span class="token string">"/dev/sda7"</span> successfully created.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pvscan </span></span>
<span class="line">  PV /dev/sda3   VG centos          lvm2 <span class="token punctuation">[</span><span class="token number">30.00</span> GiB / <span class="token number">14.00</span> GiB free<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda6                      lvm2 <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda4                      lvm2 <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda5                      lvm2 <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda7                      lvm2 <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line">  Total: <span class="token number">5</span> <span class="token punctuation">[</span><span class="token number">34.00</span> GiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> use: <span class="token number">1</span> <span class="token punctuation">[</span><span class="token number">30.00</span> GiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> no VG: <span class="token number">4</span> <span class="token punctuation">[</span><span class="token number">4.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line"> <span class="token comment"># 最后一行显示整体 PV 的量 / 已经被使用到的 VG 的 PV 量 / 剩余 PV 量</span></span>
<span class="line">  </span>
<span class="line"> <span class="token comment"># 更详细的列出系统上每个 PV 的个别信息</span></span>
<span class="line"> <span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pvdisplay /dev/sda4</span></span>
<span class="line">  <span class="token string">"/dev/sda4"</span> is a new physical volume of <span class="token string">"1.00 GiB"</span></span>
<span class="line">  --- NEW Physical volume ---</span>
<span class="line">  PV Name               /dev/sda4		<span class="token comment"># 实际的 partition 装置名称</span></span>
<span class="line">  VG Name               				  <span class="token comment"># 因为尚未分配出去，所以空白的</span></span>
<span class="line">  PV Size               <span class="token number">1.00</span> GiB		<span class="token comment"># 容量</span></span>
<span class="line">  Allocatable           NO				<span class="token comment"># 是否已被分配</span></span>
<span class="line">  PE Size               <span class="token number">0</span>   			 <span class="token comment"># 此 PV 内 PE 的大小</span></span>
<span class="line">  Total PE              <span class="token number">0</span>				  <span class="token comment"># 共分区出几个 PE</span></span>
<span class="line">  Free PE               <span class="token number">0</span>				  <span class="token comment"># 没被 LV 用掉的 PE</span></span>
<span class="line">  Allocated PE          <span class="token number">0</span>				  <span class="token comment"># 可以被分配出去的 PE 数量	</span></span>
<span class="line">  PV UUID               ecfFVZ-Qesj-6xhF-3p0w-9GCO-ULGG-q9Kpg9</span>
<span class="line">  <span class="token comment"># 由于 PE 是建立 VG 时才给予的参数，所以这里看到的 PE 都会是 0</span></span>
<span class="line">  <span class="token comment"># 而且也没有多余的 PE 可共分配（allocatable）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>VG 阶段</p>
<p>与 VG 相关指令有：</p>
<ul>
<li>vgcreate：主要建立 VG 的指令，参数较多</li>
<li>vgscan：搜索系统上的 VG</li>
<li>vgdisplay：显示 VG 状态</li>
<li>vgextend：在 VG 内增加额外的 PV</li>
<li>vgreduce：在 VG 内移除 PV</li>
<li>vgchange：设置 VG 是否启动（active）</li>
<li>vgremove：删除一个 VG</li>
</ul>
<p>PV 的名称其实就是 partition 的装置文件名，而 VG 的名称是自定义的。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">vgcreate <span class="token punctuation">[</span>-s N<span class="token punctuation">[</span>mgt<span class="token punctuation">]</span><span class="token punctuation">]</span> VG名称 PV名称</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-s：后面接 PE 的大小 site，单位可以是 m、g、t 大小写均可</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将 /dev/sda4-6 建立为一个 VG，且指定 PE 为 16MB</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgcreate -s 16M vmcrcodevg /dev/sda{4,5,6}</span></span>
<span class="line">  Volume group <span class="token string">"vmcrcodevg"</span> successfully created</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># pvscan </span></span>
<span class="line">  PV /dev/sda4   VG vmcrcodevg      lvm2 <span class="token punctuation">[</span><span class="token number">1008.00</span> MiB / <span class="token number">1008.00</span> MiB free<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda5   VG vmcrcodevg      lvm2 <span class="token punctuation">[</span><span class="token number">1008.00</span> MiB / <span class="token number">1008.00</span> MiB free<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda6   VG vmcrcodevg      lvm2 <span class="token punctuation">[</span><span class="token number">1008.00</span> MiB / <span class="token number">1008.00</span> MiB free<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda3   VG centos          lvm2 <span class="token punctuation">[</span><span class="token number">30.00</span> GiB / <span class="token number">14.00</span> GiB free<span class="token punctuation">]</span></span>
<span class="line">  PV /dev/sda7                      lvm2 <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line">  Total: <span class="token number">5</span> <span class="token punctuation">[</span><span class="token number">33.95</span> GiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> use: <span class="token number">4</span> <span class="token punctuation">[</span><span class="token number">32.95</span> GiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> no VG: <span class="token number">1</span> <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># 可以发现有 3 个 PV被分掉了</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgdisplay vmcrcodevg</span></span>
<span class="line">  --- Volume group ---</span>
<span class="line">  VG Name               vmcrcodevg</span>
<span class="line">  System ID             </span>
<span class="line">  Format                lvm2</span>
<span class="line">  Metadata Areas        <span class="token number">3</span></span>
<span class="line">  Metadata Sequence No  <span class="token number">1</span></span>
<span class="line">  VG Access             read/write</span>
<span class="line">  VG Status             resizable</span>
<span class="line">  MAX LV                <span class="token number">0</span></span>
<span class="line">  Cur LV                <span class="token number">0</span></span>
<span class="line">  Open LV               <span class="token number">0</span></span>
<span class="line">  Max PV                <span class="token number">0</span></span>
<span class="line">  Cur PV                <span class="token number">3</span></span>
<span class="line">  Act PV                <span class="token number">3</span></span>
<span class="line">  VG Size               <span class="token number">2.95</span> GiB		<span class="token comment"># 整体 VG 容量大小</span></span>
<span class="line">  PE Size               <span class="token number">16.00</span> MiB		<span class="token comment"># 内部每个 PE 的大小</span></span>
<span class="line">  Total PE              <span class="token number">189</span>				<span class="token comment"># 总共 PE 的数量</span></span>
<span class="line">  Alloc PE / Size       <span class="token number">0</span> / <span class="token number">0</span>   </span>
<span class="line">  Free  PE / Size       <span class="token number">189</span> / <span class="token number">2.95</span> GiB		<span class="token comment"># 可配置给 LV 的 PE 数量/ 总容量</span></span>
<span class="line">  VG UUID               JQP2VZ-ilbN-MBuw-jccl-do84-tHu6-BInUXS</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 剩余的 PV /dev/sda7 分配个 给 vmcrcodevg</span></span>
<span class="line"><span class="token comment"># 在 VG 内增加额外的 PV</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgextend vmcrcodevg /dev/sda7</span></span>
<span class="line">  Volume group <span class="token string">"vmcrcodevg"</span> successfully extended</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgdisplay vmcrcodevg</span></span>
<span class="line">  --- Volume group ---</span>
<span class="line">  VG Name               vmcrcodevg</span>
<span class="line">  System ID             </span>
<span class="line">  Format                lvm2</span>
<span class="line">  Metadata Areas        <span class="token number">4</span></span>
<span class="line">  Metadata Sequence No  <span class="token number">2</span></span>
<span class="line">  VG Access             read/write</span>
<span class="line">  VG Status             resizable</span>
<span class="line">  MAX LV                <span class="token number">0</span></span>
<span class="line">  Cur LV                <span class="token number">0</span></span>
<span class="line">  Open LV               <span class="token number">0</span></span>
<span class="line">  Max PV                <span class="token number">0</span></span>
<span class="line">  Cur PV                <span class="token number">4</span></span>
<span class="line">  Act PV                <span class="token number">4</span></span>
<span class="line">  VG Size               <span class="token operator">&lt;</span><span class="token number">3.94</span> GiB</span>
<span class="line">  PE Size               <span class="token number">16.00</span> MiB</span>
<span class="line">  Total PE              <span class="token number">252</span>				<span class="token comment"># PE 变大了，可用容量也变大了</span></span>
<span class="line">  Alloc PE / Size       <span class="token number">0</span> / <span class="token number">0</span>   </span>
<span class="line">  Free  PE / Size       <span class="token number">252</span> / <span class="token operator">&lt;</span><span class="token number">3.94</span> GiB</span>
<span class="line">  VG UUID               JQP2VZ-ilbN-MBuw-jccl-do84-tHu6-BInUXS</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>LV 阶段</p>
<p>有了 VG 这个大磁盘之后，就可以建立分区了。先了解与 LV 相关的指令：</p>
<ul>
<li>lvcreate：建立 LV</li>
<li>lvscan：查询系统上的 LV</li>
<li>lvdisplay：显示系统上面的 LV 状态</li>
<li>lvextend：在 LV 里面增加容量</li>
<li>lvreduce：在 LV 里面减少容量</li>
<li>lvremove：删除一个 LV</li>
<li>lvresize：对 LV 进行容量大小调整</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">lvcreate <span class="token punctuation">[</span>-L N<span class="token punctuation">[</span>mgt<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">[</span>-n lv名称<span class="token punctuation">]</span> VG名称</span>
<span class="line">lvcreate <span class="token punctuation">[</span>-l n<span class="token punctuation">]</span> <span class="token punctuation">[</span>-n lv名称<span class="token punctuation">]</span> VG名称</span>
<span class="line"></span>
<span class="line">选项与参数：</span>
<span class="line">	-L：后面接容量，要注意：最小单位为 PE，也就是必须的 PE 的倍数，如果不是，系统则自行计算最相近的容量</span>
<span class="line">	-l：后面接 PE 的个数，若要这么做，需要自行计算 PE 数</span>
<span class="line">	-n：后面接 LV 的名称</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 将 vmcrcodevg 分 2GB 给 vmmrcodelv</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvcreate -L 2G -n vmmrcodelv vmcrcodevg</span></span>
<span class="line">  Logical volume <span class="token string">"vmmrcodelv"</span> created.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvscan </span></span>
<span class="line">  ACTIVE            <span class="token string">'/dev/vmcrcodevg/vmmrcodelv'</span> <span class="token punctuation">[</span><span class="token number">2.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line">  ACTIVE            <span class="token string">'/dev/centos/root'</span> <span class="token punctuation">[</span><span class="token number">10.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line">  ACTIVE            <span class="token string">'/dev/centos/home'</span> <span class="token punctuation">[</span><span class="token number">5.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line">  ACTIVE            <span class="token string">'/dev/centos/swap'</span> <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line"><span class="token comment"># 由于本列中每个 PE 为 16M，如果要用 PE 的数量来处理的话，可以用下面的指令</span></span>
<span class="line"><span class="token comment"># lvcreate -l 128 -n vmmrcodelv vmcrcodevg</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvdisplay /dev/vmcrcodevg/vmmrcodelv </span></span>
<span class="line">  --- Logical volume ---</span>
<span class="line">  LV Path                /dev/vmcrcodevg/vmmrcodelv		<span class="token comment"># lv 全名</span></span>
<span class="line">  LV Name                vmmrcodelv</span>
<span class="line">  VG Name                vmcrcodevg</span>
<span class="line">  LV UUID                V0WB3Y-SQr3-4hLb-D5IC-8fN6-6PEY-NPdJxz</span>
<span class="line">  LV Write Access        read/write</span>
<span class="line">  LV Creation host, <span class="token function">time</span> study.centos.mrcode, <span class="token number">2020</span>-03-01 <span class="token number">22</span>:03:40 +0800</span>
<span class="line">  LV Status              available</span>
<span class="line">  <span class="token comment"># open                 0</span></span>
<span class="line">  LV Size                <span class="token number">2.00</span> GiB		<span class="token comment"># 容量</span></span>
<span class="line">  Current LE             <span class="token number">128</span></span>
<span class="line">  Segments               <span class="token number">3</span></span>
<span class="line">  Allocation             inherit</span>
<span class="line">  Read ahead sectors     auto</span>
<span class="line">  - currently <span class="token builtin class-name">set</span> to     <span class="token number">8192</span></span>
<span class="line">  Block device           <span class="token number">253</span>:3</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>文件系统阶段</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.xfs /dev/vmcrcodevg/vmmrcodelv </span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/vmcrcodevg/vmmrcodelv <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">4</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">131072</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">sparse</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">524288</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal log           <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount /dev/vmcrcodevg/vmmrcodelv /srv/lvm/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/lvm/</span></span>
<span class="line">文件系统                          类型  容量  已用  可用 已用% 挂载点</span>
<span class="line">/dev/mapper/vmcrcodevg-vmmrcodelv xfs   <span class="token number">2</span>.0G   33M  <span class="token number">2</span>.0G    <span class="token number">2</span>% /srv/lvm</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就建立好一个 LV 了，可以使用  /srv/lvm 了</p>
</li>
</ol>
<h2 id="放大-lv-容量" tabindex="-1"><a class="header-anchor" href="#放大-lv-容量"><span>放大 LV 容量</span></a></h2>
<p>LVM 最大的特色是弹性调整磁盘容量，前面说到，放大 LV 需要有下面这些流程：</p>
<ol>
<li>
<p>VG 阶段需要有剩余的容量</p>
<p>如果 VG 阶段没有多余的容量，那么就增加硬盘等手段创建 PV，然后增加到 VG 中，可利用 pvcreate 和 vgextedn 来操作</p>
</li>
<li>
<p>LV 阶段产生更多可用容量</p>
<p>有了足够的 VG，那么可以使用 lvresize 指令将剩余容量加入到 LV 中</p>
</li>
<li>
<p>文件系统阶段放大</p>
<p>Linux 实际使用的其实不是 LV，而是 LV 这个装置内的文件系统，所以一切最终还是以文件系统为依归。目前在 Linux 下，作者测试过可以放大的文件系统有 XFS 和 EXT 家族，至于缩小则只有 EXT 家族，目前 XFS 文件系统不支持文件系统的容量缩小</p>
<p>xfs 放大可以通过 xfs_growfs 指令</p>
</li>
</ol>
<p>最后一个步骤最重要，在第  7 章中知道，整个文件系统在最初格式化的时候就建立了 inode、block、superblock 等信息，要改变这些信息很难，不过因为文件系统格式化的时候建立的是多个 block group，因此可以通过在文件系统中增加 block group 的方式来增减文件系统的量，而增加 block group 就是利用 xfs_growfs 指令</p>
<p>另外，严格说起来，放大文件系统并不是没有进行格式化，格式化的位置在于该装置后来新增的部分，装置的前面已经存在的文件系统没有任何变化。新增的格式化过的数据，再反馈回原本的 supberblock 。</p>
<p>这里针对 <code v-pre>/srv/lvm</code> 增加 500MB 容量</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 检查 VG</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgdisplay vmcrcodevg </span></span>
<span class="line">  --- Volume group ---</span>
<span class="line">  VG Name               vmcrcodevg</span>
<span class="line">  System ID             </span>
<span class="line">  Format                lvm2</span>
<span class="line">  Metadata Areas        <span class="token number">4</span></span>
<span class="line">  Metadata Sequence No  <span class="token number">3</span></span>
<span class="line">  VG Access             read/write</span>
<span class="line">  VG Status             resizable</span>
<span class="line">  MAX LV                <span class="token number">0</span></span>
<span class="line">  Cur LV                <span class="token number">1</span></span>
<span class="line">  Open LV               <span class="token number">1</span></span>
<span class="line">  Max PV                <span class="token number">0</span></span>
<span class="line">  Cur PV                <span class="token number">4</span></span>
<span class="line">  Act PV                <span class="token number">4</span></span>
<span class="line">  VG Size               <span class="token operator">&lt;</span><span class="token number">3.94</span> GiB</span>
<span class="line">  PE Size               <span class="token number">16.00</span> MiB</span>
<span class="line">  Total PE              <span class="token number">252</span></span>
<span class="line">  Alloc PE / Size       <span class="token number">128</span> / <span class="token number">2.00</span> GiB</span>
<span class="line">  Free  PE / Size       <span class="token number">124</span> / <span class="token operator">&lt;</span><span class="token number">1.94</span> GiB	<span class="token comment"># 这里还有剩余的 PE 未使用</span></span>
<span class="line">  VG UUID               JQP2VZ-ilbN-MBuw-jccl-do84-tHu6-BInUXS</span>
<span class="line">  </span>
<span class="line"><span class="token comment"># 直接放大 LV</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvresize -L +500 /dev/vmcrcodevg/vmmrcodelv </span></span>
<span class="line">  Rounding size to boundary between physical extents: <span class="token number">512.00</span> MiB.</span>
<span class="line">  Size of logical volume vmcrcodevg/vmmrcodelv changed from <span class="token number">2.00</span> GiB <span class="token punctuation">(</span><span class="token number">128</span> extents<span class="token punctuation">)</span> to <span class="token number">2.50</span> GiB <span class="token punctuation">(</span><span class="token number">160</span> extents<span class="token punctuation">)</span>.</span>
<span class="line">  Logical volume vmcrcodevg/vmmrcodelv successfully resized.</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvscan </span></span>
<span class="line">  ACTIVE            <span class="token string">'/dev/vmcrcodevg/vmmrcodelv'</span> <span class="token punctuation">[</span><span class="token number">2.50</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line">  ACTIVE            <span class="token string">'/dev/centos/root'</span> <span class="token punctuation">[</span><span class="token number">10.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line">  ACTIVE            <span class="token string">'/dev/centos/home'</span> <span class="token punctuation">[</span><span class="token number">5.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line">  ACTIVE            <span class="token string">'/dev/centos/swap'</span> <span class="token punctuation">[</span><span class="token number">1.00</span> GiB<span class="token punctuation">]</span> inherit</span>
<span class="line"><span class="token comment"># 可以看到 lv 变大了</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/lvm/</span></span>
<span class="line">Filesystem                        Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmmrcodelv xfs   <span class="token number">2</span>.0G   33M  <span class="token number">2</span>.0G   <span class="token number">2</span>% /srv/lvm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到 LV 增加到了 2.5G，但是文件系统还未增加。下面继续处理文件系统的扩容</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看原文件系统内的 superblock 记录</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_info /srv/lvm/</span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/mapper/vmcrcodevg-vmmrcodelv <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">4</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">131072</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">spinodes</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">524288</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal               <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># agcount=4，blocks=524288</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 很关键的一步来了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_growfs /srv/lvm/</span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/mapper/vmcrcodevg-vmmrcodelv <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">4</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">131072</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">spinodes</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">524288</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal               <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data blocks changed from <span class="token number">524288</span> to <span class="token number">655360</span></span>
<span class="line"><span class="token comment"># 这里的 blocks 改变到 655360 了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># xfs_info /srv/lvm/</span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/mapper/vmcrcodevg-vmmrcodelv <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">5</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">131072</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">spinodes</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">655360</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal               <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># 现在 agcount=5，blocks=655360 了</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -Th  /srv/lvm/</span></span>
<span class="line">Filesystem                        Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmmrcodelv xfs   <span class="token number">2</span>.5G   33M  <span class="token number">2</span>.5G   <span class="token number">2</span>% /srv/lvm</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如上展示了，在不停机的情况下可以进行扩容，很棒的特性；</p>
<p>最后注意，目前的 XFS 文件系统中，没有缩小文件系统容量的设计。只有 EXT 家族可以</p>
<h2 id="使用-lvm-thin-volume-让-lvm-动态自动调整磁盘使用率" tabindex="-1"><a class="header-anchor" href="#使用-lvm-thin-volume-让-lvm-动态自动调整磁盘使用率"><span>使用 LVM thin Volume 让 LVM 动态自动调整磁盘使用率</span></a></h2>
<p>考虑这样一个场景：有个目录未来会使用到大约 5T 的容量，但是目前你的磁盘只有 3T，但接下来的两个月你的系统都不会超过 3T 的容量，但是你要让用户知道，他最最多有 5T 的空间可以使用，而且在一个月内你确实可以将系统提升到 5T 以上的容量，又不想在提升容量后才放大到 5T，怎么办？</p>
<p>这个时候可以考虑：实际用多少才分配多少容量给 LV 的 LVM Thin Volume 功能</p>
<p>再考虑一个环境：你需要 3 个 10GB 的硬盘进行某些测试，但是你的环境只有 5Gb 的剩余容量，在传统的 LVM 环境下，LV 的容量是一开始就分配好的，因此你没有办法在这样的环境中产生出 3 个 10GB 的装置，而且 10GB 的装置其实每个实际使用率都没有超过 10%，也就是总用量目前只用到 3GB，你实际有 5GB的容量，那么久可以使用 LVM Thin Volume 做出 3 个只用 1GB 的 10GB 装置</p>
<p>LVM thin Volume 的概念是：先建立一个可以实支实付、用多少容量才分配实际写入多少容量的磁盘容量存储池（thin pool），然后再由这个 thin pool 去产生一个「指定要固定容量大小的 LV 装置」，但是这个 LV 在声明上，他的容量可能有 10GB，但实际上，该装置用到多少容量时，才会从 thin pool 去实际取得所需的容量』</p>
<p>thin pool 只有 1GB 的实际容量，但是可以分配一个 10GB 的 LV 装置，该装置实际用到 500M 时，thin pool 也就只有 500M 分配给他，但是由 thin pool 分配出来的 LV 总实际使用量绝对不能超过 thin pool 的最大实际容量</p>
<p>简单可以理解为：实际上你只有 1G 物理容量，但是你分配一个 10G 的 lv，只是这个 10G 的 lv 最大实际容量也就只有 1G</p>
<p>下面使用剩余的容量，来实践练习：</p>
<ol>
<li>由 vmcrcodevg 的剩余容量取出 1GB 来做出一个名为 vmrcodetpool 的 thin pool LV 装置，这就是所谓的磁盘容量存储池 thin pool</li>
<li>由 vmcrcodevg 内的 vmrcodetpool 产生一个名为 vmrcodethin1 的 10GB LV 装置</li>
<li>将此装置实际格式化为 XFS 文件系统，并且挂载到 <code v-pre>/srv/thin</code> 目录内</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 创建 thin pool</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvcreate -L 1G -T vmcrcodevg/vmrcodetpool</span></span>
<span class="line">  Thin pool volume with chunk size <span class="token number">64.00</span> KiB can address at <span class="token function">most</span> <span class="token number">15.81</span> TiB of data.</span>
<span class="line">  Logical volume <span class="token string">"vmrcodetpool"</span> created.</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvdisplay /dev/vmcrcodevg/vmrcodetpool </span></span>
<span class="line">  --- Logical volume ---</span>
<span class="line">  LV Name                vmrcodetpool</span>
<span class="line">  VG Name                vmcrcodevg</span>
<span class="line">  LV UUID                163HRB-1gOB-6SOS-Dion-g29K-uOZr-deGTyl</span>
<span class="line">  LV Write Access        read/write</span>
<span class="line">  LV Creation host, <span class="token function">time</span> study.centos.mrcode, <span class="token number">2020</span>-03-01 <span class="token number">22</span>:40:42 +0800</span>
<span class="line">  LV Pool metadata       vmrcodetpool_tmeta</span>
<span class="line">  LV Pool data           vmrcodetpool_tdata</span>
<span class="line">  LV Status              available</span>
<span class="line">  <span class="token comment"># open                 0</span></span>
<span class="line">  LV Size                <span class="token number">1.00</span> GiB		<span class="token comment"># 总共可分配出去容量</span></span>
<span class="line">  Allocated pool data    <span class="token number">0.00</span>%			<span class="token comment"># 以分配的容量百分比</span></span>
<span class="line">  Allocated metadata     <span class="token number">10.23</span>%			<span class="token comment"># 以分配的数据百分比</span></span>
<span class="line">  Current LE             <span class="token number">64</span></span>
<span class="line">  Segments               <span class="token number">1</span></span>
<span class="line">  Allocation             inherit</span>
<span class="line">  Read ahead sectors     auto</span>
<span class="line">  - currently <span class="token builtin class-name">set</span> to     <span class="token number">8192</span></span>
<span class="line">  Block device           <span class="token number">253</span>:6</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 语法为 lvs VGname</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvs vmcrcodevg</span></span>
<span class="line">  LV           VG         Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert</span>
<span class="line">  vmmrcodelv   vmcrcodevg -wi-ao---- <span class="token number">2</span>.50g                                                    </span>
<span class="line">  vmrcodetpool vmcrcodevg twi-a-tz-- <span class="token number">1</span>.00g             <span class="token number">0.00</span>   <span class="token number">10.23</span> </span>
<span class="line">  </span>
<span class="line"><span class="token comment"># 开始建立 10GB 的装置</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvcreate -V 10G -T vmcrcodevg/vmrcodetpool -n vmrcrodethin1</span></span>
<span class="line">  WARNING: Sum of all thin volume sizes <span class="token punctuation">(</span><span class="token number">10.00</span> GiB<span class="token punctuation">)</span> exceeds the size of thin pool vmcrcodevg/vmrcodetpool and the size of whole volume group <span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token number">3.94</span> GiB<span class="token punctuation">)</span>.</span>
<span class="line">  WARNING: You have not turned on protection against thin pools running out of space.</span>
<span class="line">  WARNING: Set activation/thin_pool_autoextend_threshold below <span class="token number">100</span> to trigger automatic extension of thin pools before they get full.</span>
<span class="line">  Logical volume <span class="token string">"vmrcrodethin1"</span> created.</span>
<span class="line">  </span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvs vmcrcodevg</span></span>
<span class="line">  LV            VG         Attr       LSize  Pool         Origin Data%  Meta%  Move Log Cpy%Sync Convert</span>
<span class="line">  vmmrcodelv    vmcrcodevg -wi-ao----  <span class="token number">2</span>.50g                                                            </span>
<span class="line">  vmrcodetpool  vmcrcodevg twi-aotz--  <span class="token number">1</span>.00g                     <span class="token number">0.00</span>   <span class="token number">10.25</span>                           </span>
<span class="line">  vmrcrodethin1 vmcrcodevg Vwi-a-tz-- <span class="token number">10</span>.00g vmrcodetpool        <span class="token number">0.00</span> </span>
<span class="line"><span class="token comment"># 多了一个 vmrcrodethin1 还使用了 Pool，并且是 10Gb 的</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建文件系统</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkfs.xfs /dev/vmcrcodevg/vmrcrodethin1 </span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/vmcrcodevg/vmrcrodethin1 <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">16</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">163840</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">sparse</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2621440</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">16</span>     <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">16</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal log           <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">16</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkdir /srv/thin</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount /dev/vmcrcodevg/vmrcrodethin1 /srv/thin/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/thin/</span></span>
<span class="line">Filesystem                           Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmrcrodethin1 xfs    10G   33M   10G   <span class="token number">1</span>% /srv/thin</span>
<span class="line"><span class="token comment"># 可以看到文件系统中显示有 10GB 的容量</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试下容量的使用，建立 500MB 的文件</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># dd if=/dev/zero of=/srv/thin/test.img bs=1M count=500</span></span>
<span class="line"><span class="token number">500</span>+0 records <span class="token keyword">in</span></span>
<span class="line"><span class="token number">500</span>+0 records out</span>
<span class="line"><span class="token number">524288000</span> bytes <span class="token punctuation">(</span><span class="token number">524</span> MB<span class="token punctuation">)</span> copied, <span class="token number">2.17685</span> s, <span class="token number">241</span> MB/s</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/thin/</span></span>
<span class="line">Filesystem                           Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmrcrodethin1 xfs    10G  533M  <span class="token number">9</span>.5G   <span class="token number">6</span>% /srv/thin</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvs vmcrcodevg</span></span>
<span class="line">  LV            VG         Attr       LSize  Pool         Origin Data%  Meta%  Move Log Cpy%Sync Convert</span>
<span class="line">  vmmrcodelv    vmcrcodevg -wi-ao----  <span class="token number">2</span>.50g                                                            </span>
<span class="line">  vmrcodetpool  vmcrcodevg twi-aotz--  <span class="token number">1</span>.00g                     <span class="token number">49.92</span>  <span class="token number">11.82</span>                           </span>
<span class="line">  vmrcrodethin1 vmcrcodevg Vwi-aotz-- <span class="token number">10</span>.00g vmrcodetpool        <span class="token number">4.99</span> </span>
<span class="line"><span class="token comment"># 这时已经分配出去 49.92 的容量了，而 vmrcrodethin1 却只看到用掉了 4.99% 而已</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以 thin pool 非常好用，但是在管理上，要特别的留意</p>
<p>基本上 thin pool ，可以用来骗人，一个磁盘可以仿真出很多容量来，实际可用容量只有物理磁盘的容量，如果超过该容量，这个 thin pool 中的资料会损坏</p>
<h2 id="lvm-的-lv-磁盘快照" tabindex="-1"><a class="header-anchor" href="#lvm-的-lv-磁盘快照"><span>LVM 的 LV 磁盘快照</span></a></h2>
<p>LVM 还有一个重要的能力，就是磁盘快照：将当时的系统信息记录下来，就好像照相记录一般，未来若有任何资料变动了，则原始资料会被搬移到快照区，没有被变动的区域则由快照区与文件系统共享。</p>
<p><img src="@source/tutorial-basis/14/assets/image-20200302221604971.png" alt="image-20200302221604971"></p>
<p>上图很形象了，建立 LVM 会预留一个区域（左图的三个 PE 块）作为快照数据的存放。</p>
<p>由于快照区与原本的 LV 共享很多 PE 区块，因此 <strong>快照区与被快照的 LV 必须要在同一个 VG 上</strong></p>
<p>另外，不建议使用 thin pool 来制作快照，限制太多了；</p>
<p>下面针对传统的 LV 磁盘进行快照的配置，大致流程为：</p>
<ul>
<li>预计被拿来备份的原始 LV 为 <code v-pre>/dev/vmcrcodevg/vmmrcodelv</code></li>
<li>使用传统方式快照建立，原始磁盘为 <code v-pre>/dev/vmcrcodevg/vmmrcodelv</code>，快照名称为 vmrcodesnap1，容量为 vmcrcodevg 的所有剩余容量</li>
</ul>
<h3 id="传统快照区的建立" tabindex="-1"><a class="header-anchor" href="#传统快照区的建立"><span>传统快照区的建立</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 观察 VG 剩余容量</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># vgdisplay vmcrcodevg </span></span>
<span class="line">  --- Volume group ---</span>
<span class="line">  VG Name               vmcrcodevg</span>
<span class="line">  System ID             </span>
<span class="line">  Format                lvm2</span>
<span class="line">  Metadata Areas        <span class="token number">4</span></span>
<span class="line">  Metadata Sequence No  <span class="token number">9</span></span>
<span class="line">  VG Access             read/write</span>
<span class="line">  VG Status             resizable</span>
<span class="line">  MAX LV                <span class="token number">0</span></span>
<span class="line">  Cur LV                <span class="token number">3</span></span>
<span class="line">  Open LV               <span class="token number">0</span></span>
<span class="line">  Max PV                <span class="token number">0</span></span>
<span class="line">  Cur PV                <span class="token number">4</span></span>
<span class="line">  Act PV                <span class="token number">4</span></span>
<span class="line">  VG Size               <span class="token operator">&lt;</span><span class="token number">3.94</span> GiB</span>
<span class="line">  PE Size               <span class="token number">16.00</span> MiB</span>
<span class="line">  Total PE              <span class="token number">252</span></span>
<span class="line">  Alloc PE / Size       <span class="token number">226</span> / <span class="token number">3.53</span> GiB</span>
<span class="line">  Free  PE / Size       <span class="token number">26</span> / <span class="token number">416.00</span> MiB			<span class="token comment"># 还有 26 个PE</span></span>
<span class="line">  VG UUID               JQP2VZ-ilbN-MBuw-jccl-do84-tHu6-BInUXS</span>
<span class="line">  </span>
<span class="line">  </span>
<span class="line"> <span class="token comment"># 创建快照区</span></span>
<span class="line"> <span class="token comment"># 注意：-n 后面是给快照区取名，笔者这里看错了，用了 vg 的名称</span></span>
<span class="line"> <span class="token comment"># 本应该与书上的 vmrcodesnap1 作为快照名称的</span></span>
<span class="line"> <span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># lvcreate -s -l 26 -n vmcrcodevg /dev/vmcrcodevg/vmmrcodelv </span></span>
<span class="line">  WARNING: Sum of all thin volume sizes <span class="token punctuation">(</span><span class="token number">10.00</span> GiB<span class="token punctuation">)</span> exceeds the size of thin pools and the size of whole volume group <span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token number">3.94</span> GiB<span class="token punctuation">)</span>.</span>
<span class="line">  WARNING: You have not turned on protection against thin pools running out of space.</span>
<span class="line">  WARNING: Set activation/thin_pool_autoextend_threshold below <span class="token number">100</span> to trigger automatic extension of thin pools before they get full.</span>
<span class="line">  Logical volume <span class="token string">"vmcrcodevg"</span> created.</span>
<span class="line"><span class="token comment"># -s 表示  snapshot 功能， -n 后面则是快照区名称，再后面是在哪个 lv 上创建快照</span></span>
<span class="line"><span class="token comment"># -l 后面则表示使用多少个 PE 来作为整个快照区使用</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 不过还好，使用了 vg</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># lvdisplay /dev/vmcrcodevg/vmcrcodevg </span></span>
<span class="line">  --- Logical volume ---</span>
<span class="line">  LV Path                /dev/vmcrcodevg/vmcrcodevg</span>
<span class="line">  LV Name                vmcrcodevg</span>
<span class="line">  VG Name                vmcrcodevg</span>
<span class="line">  LV UUID                gprMsU-6fXb-mAhu-xehC-jksk-rj4M-0na11O</span>
<span class="line">  LV Write Access        read/write</span>
<span class="line">  LV Creation host, <span class="token function">time</span> study.centos.mrcode, <span class="token number">2020</span>-03-02 <span class="token number">22</span>:26:19 +0800</span>
<span class="line">  LV snapshot status     active destination <span class="token keyword">for</span> vmmrcodelv</span>
<span class="line">  LV Status              available</span>
<span class="line">  <span class="token comment"># open                 0</span></span>
<span class="line">  LV Size                <span class="token number">2.50</span> GiB				<span class="token comment"># 原始碟  lv 的容量</span></span>
<span class="line">  Current LE             <span class="token number">160</span></span>
<span class="line">  COW-table size         <span class="token number">416.00</span> MiB			<span class="token comment"># 这个快照能够记录的最大容量</span></span>
<span class="line">  COW-table LE           <span class="token number">26</span></span>
<span class="line">  Allocated to snapshot  <span class="token number">0.00</span>%					<span class="token comment"># 目前已被使用掉的容量</span></span>
<span class="line">  Snapshot chunk size    <span class="token number">4.00</span> KiB</span>
<span class="line">  Segments               <span class="token number">1</span></span>
<span class="line">  Allocation             inherit</span>
<span class="line">  Read ahead sectors     auto</span>
<span class="line">  - currently <span class="token builtin class-name">set</span> to     <span class="token number">8192</span></span>
<span class="line">  Block device           <span class="token number">253</span>:11</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>快照区被建立起来了，仔细看他的 VG Name 与原本的 LV 所在 VG 相同。</p>
<p>下面来挂载这个快照区，挂载之后，你会发现里面的数据与原来的 LV 的数据是一样的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># mkdir /srv/snapshot1</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># mount -o nouuid /dev/vmcrcodevg/vmcrcodevg /srv/snapshot1/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/lvm/ /srv/snapshot1/</span></span>
<span class="line">Filesystem                        Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmmrcodelv xfs   <span class="token number">2</span>.5G   33M  <span class="token number">2</span>.5G   <span class="token number">2</span>% /srv/lvm</span>
<span class="line">/dev/mapper/vmcrcodevg-vmcrcodevg xfs   <span class="token number">2</span>.5G   33M  <span class="token number">2</span>.5G   <span class="token number">2</span>% /srv/snapshot1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 可以看到数据是一模一样的，我们都没有动过该数据</span></span>
<span class="line"><span class="token comment"># 快照区会主动记录员 lv 的内容</span></span>
<span class="line"><span class="token comment"># nouui 参数：XFS 不允许相同的 UUID 文件系统挂载，所以需要加上让它忽略相同的 UUID 所造成的问题</span></span>
<span class="line"><span class="token comment"># 因为快照出来的文件系统是一模一样的</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="利用快照区复原系统" tabindex="-1"><a class="header-anchor" href="#利用快照区复原系统"><span>利用快照区复原系统</span></a></h3>
<p>需要注意的是：要复原的数据量不能高于快照区所能负载的实际容量。否则快照区肯定装不下，就会失效</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 增加一些内容到 lvm ，查看两个区块的变化</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/lvm/ /srv/snapshot1/</span></span>
<span class="line">Filesystem                        Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmmrcodelv xfs   <span class="token number">2</span>.5G   33M  <span class="token number">2</span>.5G   <span class="token number">2</span>% /srv/lvm</span>
<span class="line">/dev/mapper/vmcrcodevg-vmcrcodevg xfs   <span class="token number">2</span>.5G   33M  <span class="token number">2</span>.5G   <span class="token number">2</span>% /srv/snapshot1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 由于之前我忘记拷贝一些数据到 lvm 下了，看目录下面是空的内容</span></span>
<span class="line"><span class="token comment"># 这里直接 copy 数据到该目录下</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># cp -a /etc/ /srv/lvm/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># df -Th /srv/lvm/ /srv/snapshot1/</span></span>
<span class="line">Filesystem                        Type  Size  Used Avail Use% Mounted on</span>
<span class="line">/dev/mapper/vmcrcodevg-vmmrcodelv xfs   <span class="token number">2</span>.5G   92M  <span class="token number">2</span>.5G   <span class="token number">4</span>% /srv/lvm</span>
<span class="line">/dev/mapper/vmcrcodevg-vmcrcodevg xfs   <span class="token number">2</span>.5G   33M  <span class="token number">2</span>.5G   <span class="token number">2</span>% /srv/snapshot1</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># ll /srv/lvm /srv/snapshot1/</span></span>
<span class="line">/srv/lvm:</span>
<span class="line">total <span class="token number">12</span></span>
<span class="line">drwxr-xr-x. <span class="token number">143</span> root root <span class="token number">8192</span> Mar  <span class="token number">1</span> <span class="token number">17</span>:29 etc</span>
<span class="line"></span>
<span class="line">/srv/snapshot1/:</span>
<span class="line">total <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 现在两个目录不一样了，检测一下快照 LV</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># lvdisplay /dev/vmcrcodevg/vmcrcodevg </span></span>
<span class="line">  --- Logical volume ---</span>
<span class="line">  LV Path                /dev/vmcrcodevg/vmcrcodevg</span>
<span class="line">  LV Name                vmcrcodevg</span>
<span class="line">  VG Name                vmcrcodevg</span>
<span class="line">  LV UUID                gprMsU-6fXb-mAhu-xehC-jksk-rj4M-0na11O</span>
<span class="line">  LV Write Access        read/write</span>
<span class="line">  LV Creation host, <span class="token function">time</span> study.centos.mrcode, <span class="token number">2020</span>-03-02 <span class="token number">22</span>:26:19 +0800</span>
<span class="line">  LV snapshot status     active destination <span class="token keyword">for</span> vmmrcodelv</span>
<span class="line">  LV Status              available</span>
<span class="line">  <span class="token comment"># open                 1</span></span>
<span class="line">  LV Size                <span class="token number">2.50</span> GiB</span>
<span class="line">  Current LE             <span class="token number">160</span></span>
<span class="line">  COW-table size         <span class="token number">416.00</span> MiB</span>
<span class="line">  COW-table LE           <span class="token number">26</span></span>
<span class="line">  Allocated to snapshot  <span class="token number">11.05</span>%		<span class="token comment"># 目前被使用掉的容量</span></span>
<span class="line">  Snapshot chunk size    <span class="token number">4.00</span> KiB</span>
<span class="line">  Segments               <span class="token number">1</span></span>
<span class="line">  Allocation             inherit</span>
<span class="line">  Read ahead sectors     auto</span>
<span class="line">  - currently <span class="token builtin class-name">set</span> to     <span class="token number">8192</span></span>
<span class="line">  Block device           <span class="token number">253</span>:11</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 利用快照区将原本的 filesystem 备份，使用 xfsdump 来处理</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># xfsdump -l 0 -L lvm1 -M lvm1 -f /home/lvm.dump /srv/snapshot1 </span></span>
<span class="line">xfsdump: using <span class="token function">file</span> dump <span class="token punctuation">(</span>drive_simple<span class="token punctuation">)</span> strategy</span>
<span class="line">xfsdump: version <span class="token number">3.1</span>.7 <span class="token punctuation">(</span>dump <span class="token function">format</span> <span class="token number">3.0</span><span class="token punctuation">)</span> - <span class="token builtin class-name">type</span> ^C <span class="token keyword">for</span> status and control</span>
<span class="line">xfsdump: level <span class="token number">0</span> dump of study.centos.mrcode:/srv/snapshot1</span>
<span class="line">xfsdump: dump date: Mon Mar  <span class="token number">2</span> <span class="token number">22</span>:48:52 <span class="token number">2020</span></span>
<span class="line">xfsdump: session id: cf94cc10-3823-4138-b016-cc7e4c3b8964</span>
<span class="line">xfsdump: session label: <span class="token string">"lvm1"</span></span>
<span class="line">xfsdump: ino map phase <span class="token number">1</span>: constructing initial dump list</span>
<span class="line">xfsdump: ino map phase <span class="token number">2</span>: skipping <span class="token punctuation">(</span>no pruning necessary<span class="token punctuation">)</span></span>
<span class="line">xfsdump: ino map phase <span class="token number">3</span>: skipping <span class="token punctuation">(</span>only one dump stream<span class="token punctuation">)</span></span>
<span class="line">xfsdump: ino map construction complete</span>
<span class="line">xfsdump: estimated dump size: <span class="token number">20800</span> bytes</span>
<span class="line">xfsdump: creating dump session media <span class="token function">file</span> <span class="token number">0</span> <span class="token punctuation">(</span>media <span class="token number">0</span>, <span class="token function">file</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">xfsdump: dumping ino map</span>
<span class="line">xfsdump: dumping directories</span>
<span class="line">xfsdump: dumping non-directory files</span>
<span class="line">xfsdump: ending media <span class="token function">file</span></span>
<span class="line">xfsdump: media <span class="token function">file</span> size <span class="token number">21016</span> bytes</span>
<span class="line">xfsdump: dump size <span class="token punctuation">(</span>non-dir files<span class="token punctuation">)</span> <span class="token builtin class-name">:</span> <span class="token number">0</span> bytes</span>
<span class="line">xfsdump: dump complete: <span class="token number">0</span> seconds elapsed</span>
<span class="line">xfsdump: Dump Summary:</span>
<span class="line">xfsdump:   stream <span class="token number">0</span> /home/lvm.dump OK <span class="token punctuation">(</span>success<span class="token punctuation">)</span></span>
<span class="line">xfsdump: Dump Status: SUCCESS</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么要备份？为什么不直接格式化？前面说到过，快照只会存储变化的数据，如果格式化，那么所有数据都会存到快照区的。快照区那么小，一般都不够存储的</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 3. 将 /srv/snapshot1 卸载并移除（因为里面的内容以及备份起来了）</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># umount /srv/snapshot1/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># lvremove /dev/vmcrcodevg/vmcrcodevg </span></span>
<span class="line">Do you really want to remove active logical volume vmcrcodevg/vmcrcodevg? <span class="token punctuation">[</span>y/n<span class="token punctuation">]</span>: y</span>
<span class="line">  Logical volume <span class="token string">"vmcrcodevg"</span> successfully removed</span>
<span class="line"><span class="token comment"># 把快照功能卸除之后，把原始盘格式化</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># mkfs.xfs -f /dev/vmcrcodevg/vmmrcodelv </span></span>
<span class="line">meta-data<span class="token operator">=</span>/dev/vmcrcodevg/vmmrcodelv <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">4</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">163840</span> blks</span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">sparse</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line">data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">655360</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks</span>
<span class="line">naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">log      <span class="token operator">=</span>internal log           <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">2560</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line">         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span></span>
<span class="line">realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token comment"># 重新挂载，相当于已经没有数据了，</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># mount /dev/vmcrcodevg/vmmrcodelv /srv/lvm/</span></span>
<span class="line"><span class="token comment"># 这里从备份的快照里面把数据恢复回去</span></span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># xfsrestore -f /home/lvm.dump -L lvm1 /srv/lvm/</span></span>
<span class="line">xfsrestore: using <span class="token function">file</span> dump <span class="token punctuation">(</span>drive_simple<span class="token punctuation">)</span> strategy</span>
<span class="line">xfsrestore: version <span class="token number">3.1</span>.7 <span class="token punctuation">(</span>dump <span class="token function">format</span> <span class="token number">3.0</span><span class="token punctuation">)</span> - <span class="token builtin class-name">type</span> ^C <span class="token keyword">for</span> status and control</span>
<span class="line">xfsrestore: using online session inventory</span>
<span class="line">xfsrestore: searching media <span class="token keyword">for</span> directory dump</span>
<span class="line">xfsrestore: examining media <span class="token function">file</span> <span class="token number">0</span></span>
<span class="line">xfsrestore: reading directories</span>
<span class="line">xfsrestore: <span class="token number">1</span> directories and <span class="token number">0</span> entries processed</span>
<span class="line">xfsrestore: directory post-processing</span>
<span class="line">xfsrestore: restore complete: <span class="token number">0</span> seconds elapsed</span>
<span class="line">xfsrestore: Restore Summary:</span>
<span class="line">xfsrestore:   stream <span class="token number">0</span> /home/lvm.dump OK <span class="token punctuation">(</span>success<span class="token punctuation">)</span></span>
<span class="line">xfsrestore: Restore Status: SUCCESS</span>
<span class="line"><span class="token punctuation">[</span>root@study vmcrcodevg<span class="token punctuation">]</span><span class="token comment"># ll /srv/lvm</span></span>
<span class="line">total <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 这里变成了 0，从这里我大概明白了这个快照的流程了</span></span>
<span class="line"><span class="token comment"># 1. 创建快照的时候，可能是把当时那一刻的所有数据都放到了快照区，由于实际数据小于快照区，所以可以放下</span></span>
<span class="line"><span class="token comment"># 2. 对原始盘修改的时候，只要不创建快照，数据就不会被同步过去</span></span>
<span class="line"><span class="token comment"># 3. 这里备份快照区，再从快照区恢复创建快照时的数据</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>利用快照区进行各项练习与测试的任务，再以原系统还原快照：大概意思就是说，将原始数据当成备份，快照出来的快照区进行测试（当成真正的目录一样使用），要还原的时候就直接删掉快照区，再创建一个快照即可。</p>
<p>这里的思路和我上面自己理解的貌似类似，但是下面这张图貌似就说不通了</p>
<p><img src="@source/tutorial-basis/14/assets/image-20200302221604971.png" alt="image-20200302221604971"></p>
<p>因为上面我们快照了数据，会发现快照和原始数据是一样的，在修改原始数据后，快照区数据并诶呦变化，然后我们备份了快照区的数据，并删除了快照区；然后再格式化了原始碟，那么这里公用的 PE 是不是貌似就说不通了? 或则换个说法来说，快照区备份实际上是把创建快照那一刻的所有数据都备份了（就是说是所有的原始数据，因为在创建快照哪一个点的所有数据），但其实如果不用备份的话，是没法恢复快照的，因为这里公用了 PE 的问题；快照会区分变化的文件，备份的时候回排除掉变化的文件。</p>
<p>上面的解释貌似可以通了</p>
<h2 id="lvm-相关指令汇总与-lvm-的关闭" tabindex="-1"><a class="header-anchor" href="#lvm-相关指令汇总与-lvm-的关闭"><span>LVM 相关指令汇总与 LVM 的关闭</span></a></h2>
<table>
<thead>
<tr>
<th style="text-align:center">任务</th>
<th style="text-align:center">PV 阶段</th>
<th style="text-align:center">VG 阶段</th>
<th style="text-align:center">LV 阶段</th>
<th style="text-align:center">filesystem-xfs</th>
<th style="text-align:center">filesystem-ext4</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">搜索<code v-pre>scan</code></td>
<td style="text-align:center">pvscan</td>
<td style="text-align:center">vgscan</td>
<td style="text-align:center">lvscan</td>
<td style="text-align:center">lsblk、blkid</td>
<td style="text-align:center">lsblk、blkid</td>
</tr>
<tr>
<td style="text-align:center">创建<code v-pre>create</code></td>
<td style="text-align:center">pvcreate</td>
<td style="text-align:center">vgcreate</td>
<td style="text-align:center">lvcreate</td>
<td style="text-align:center">mkfs.xfs</td>
<td style="text-align:center">mkfs.ext4</td>
</tr>
<tr>
<td style="text-align:center">列出<code v-pre>display</code></td>
<td style="text-align:center">pvdisplay</td>
<td style="text-align:center">vgdisplay</td>
<td style="text-align:center">lvdisplay</td>
<td style="text-align:center">df、mount</td>
<td style="text-align:center">df、mount</td>
</tr>
<tr>
<td style="text-align:center">增加<code v-pre>extend</code></td>
<td style="text-align:center"></td>
<td style="text-align:center">vgextend</td>
<td style="text-align:center">lvextend(lvresize)</td>
<td style="text-align:center">xfs_growfs</td>
<td style="text-align:center">resize2fs</td>
</tr>
<tr>
<td style="text-align:center">减少<code v-pre>reduce</code></td>
<td style="text-align:center"></td>
<td style="text-align:center">vgreduce</td>
<td style="text-align:center">lvreduce(lvresize)</td>
<td style="text-align:center">不支持</td>
<td style="text-align:center">resize2fs</td>
</tr>
<tr>
<td style="text-align:center">删除<code v-pre>remove</code></td>
<td style="text-align:center">pvremove</td>
<td style="text-align:center">vgremove</td>
<td style="text-align:center">lvremove</td>
<td style="text-align:center">umount、重新格式化</td>
<td style="text-align:center">umount、重新格式化</td>
</tr>
<tr>
<td style="text-align:center">改变容量<code v-pre>resize</code></td>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
<td style="text-align:center">lvresize</td>
<td style="text-align:center">xfs_grows</td>
<td style="text-align:center">resize2fs</td>
</tr>
<tr>
<td style="text-align:center">改变属性<code v-pre>attribute</code></td>
<td style="text-align:center">pvchange</td>
<td style="text-align:center">vgchange</td>
<td style="text-align:center">lvchange</td>
<td style="text-align:center">/etc/fstab、remount</td>
<td style="text-align:center">/etc/fstab、remount</td>
</tr>
</tbody>
</table>
<p>文件系统阶段的格式化处理，需要以  xfs_growfs 来修正文件系统实际的大小。</p>
<p>会规划 LVM 还不行，还需要会移除 LVM，流程如下：</p>
<ol>
<li>先卸载系统上面的 LVM 文件系统（包括快照与所有 LV）</li>
<li>使用 lvremove 移除 LV</li>
<li>使用 <code v-pre>vgchange -a n VGname</code> 让 VGname 这个 VG 不具有 Active 标志</li>
<li>使用 vgremove 移除 VG</li>
<li>使用 pvremove 移除 PV</li>
<li>使用 fsidk 修改 ID，改回来</li>
</ol>
<p>下面进行卸载练习</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># umount /srv/lvm/ /srv/thin/ /srv/snapshot1/</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvs vmcrcodevg</span></span>
<span class="line">  LV            VG         Attr       LSize  Pool         Origin Data%  Meta%  Move Log Cpy%Sync Convert</span>
<span class="line">  vmmrcodelv    vmcrcodevg -wi-a-----  <span class="token number">2</span>.50g                                                            </span>
<span class="line">  vmrcodetpool  vmcrcodevg twi-aotz--  <span class="token number">1</span>.00g                     <span class="token number">49.92</span>  <span class="token number">11.82</span>                           </span>
<span class="line">  vmrcrodethin1 vmcrcodevg Vwi-a-tz-- <span class="token number">10</span>.00g vmrcodetpool        <span class="token number">4.99</span> </span>
<span class="line">  </span>
<span class="line"><span class="token comment"># 注意，删除顺序是：vmrcrodethin1 > vmrcrodethin1 > vmmrcodelv</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvremove /dev/vmcrcodevg/vmrcrodethin1  /dev/vmcrcodevg/vmrcodetpool </span></span>
<span class="line">Removing pool <span class="token string">"vmrcodetpool"</span> will remove <span class="token number">1</span> dependent volume<span class="token punctuation">(</span>s<span class="token punctuation">)</span>. Proceed? <span class="token punctuation">[</span>y/n<span class="token punctuation">]</span>: y</span>
<span class="line">Do you really want to remove active logical volume vmcrcodevg/vmrcrodethin1? <span class="token punctuation">[</span>y/n<span class="token punctuation">]</span>: y</span>
<span class="line">  Logical volume <span class="token string">"vmrcrodethin1"</span> successfully removed</span>
<span class="line">Do you really want to remove active logical volume vmcrcodevg/vmrcodetpool? <span class="token punctuation">[</span>y/n<span class="token punctuation">]</span>: y</span>
<span class="line">  Logical volume <span class="token string">"vmrcodetpool"</span> successfully removed</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># lvremove /dev/vmcrcodevg/vmmrcodelv </span></span>
<span class="line">Do you really want to remove active logical volume vmcrcodevg/vmmrcodelv? <span class="token punctuation">[</span>y/n<span class="token punctuation">]</span>: y</span>
<span class="line">  Logical volume <span class="token string">"vmmrcodelv"</span> successfully removed</span>
<span class="line">  </span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgchange -a n vmcrcodevg </span></span>
<span class="line">  <span class="token number">0</span> logical volume<span class="token punctuation">(</span>s<span class="token punctuation">)</span> <span class="token keyword">in</span> volume group <span class="token string">"vmcrcodevg"</span> now active</span>
<span class="line">  </span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># vgremove vmcrcodevg </span></span>
<span class="line">  Volume group <span class="token string">"vmcrcodevg"</span> successfully removed</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后再使用 gdisk 将磁盘的 ID 给改回来 83 就可以了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">gdisk /dev/sda</span>
<span class="line">Command <span class="token punctuation">(</span>? <span class="token keyword">for</span> <span class="token builtin class-name">help</span><span class="token punctuation">)</span>: p</span>
<span class="line">Number  Start <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>    End <span class="token punctuation">(</span>sector<span class="token punctuation">)</span>  Size       Code  Name</span>
<span class="line">   <span class="token number">1</span>            <span class="token number">2048</span>            <span class="token number">6143</span>   <span class="token number">2.0</span> MiB     EF02  </span>
<span class="line">   <span class="token number">2</span>            <span class="token number">6144</span>         <span class="token number">2103295</span>   <span class="token number">1024.0</span> MiB  0700  </span>
<span class="line">   <span class="token number">3</span>         <span class="token number">2103296</span>        <span class="token number">65026047</span>   <span class="token number">30.0</span> GiB    8E00  </span>
<span class="line">   <span class="token number">4</span>        <span class="token number">65026048</span>        <span class="token number">67123199</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">5</span>        <span class="token number">67123200</span>        <span class="token number">69220351</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">6</span>        <span class="token number">69220352</span>        <span class="token number">71317503</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">7</span>        <span class="token number">71317504</span>        <span class="token number">73414655</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line">   <span class="token number">8</span>        <span class="token number">73414656</span>        <span class="token number">75511807</span>   <span class="token number">1024.0</span> MiB  8E00  Linux LVM</span>
<span class="line"><span class="token comment"># 修改 ID 也就是这里的 Code，可以看到这几个分区还是 8E00</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


