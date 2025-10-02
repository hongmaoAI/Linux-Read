<template><div><h1 id="光盘写入工具" tabindex="-1"><a class="header-anchor" href="#光盘写入工具"><span>光盘写入工具</span></a></h1>
<p>企业喜欢使用磁带来进行备份，容量高、存储时限常、耐摔等等，至于以前的 DVD/CD 等，因为存储速度慢、容量没有大幅度提升，很少使用了</p>
<p>虽然现在很少使用了，不过在特别的情况下，没有这东西又不行，因此这里介绍在文本模式的刻录行为是怎么处理的，通常做法是这样的：</p>
<ol>
<li>现将所需要备份的数据建立成为一个映像文档（iso)，利用 mkisofs 指令来处理</li>
<li>将该映像文件刻录到光盘或则 DVD 中，利用 cdrecord 指令来处理</li>
</ol>
<h2 id="mkisofs-建立映像文档" tabindex="-1"><a class="header-anchor" href="#mkisofs-建立映像文档"><span>mkisofs 建立映像文档</span></a></h2>
<p>刻录可开机与不可开机的光盘，使用方法不太一样</p>
<h3 id="制作一般数据光盘映像文件" tabindex="-1"><a class="header-anchor" href="#制作一般数据光盘映像文件"><span>制作一般数据光盘映像文件</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">mkisofs</span> <span class="token punctuation">[</span>-o 映像文档<span class="token punctuation">]</span><span class="token punctuation">[</span>-Jrv<span class="token punctuation">]</span><span class="token punctuation">[</span>-V vol<span class="token punctuation">]</span><span class="token punctuation">[</span>-m file<span class="token punctuation">]</span> 待备份文件 -graft-point <span class="token assign-left variable">isodir</span><span class="token operator">=</span>systemdir <span class="token punctuation">..</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>o：接想要产生的映像文档名</li>
<li>J：产生较兼容于 windows 机器的文件名结构，可增加文件名长度 64 个 unicode 字符</li>
<li>r：通过 Rock Ridge 产生支持 Unix/Linux 的文件数据，可记录较多的信息（如 UID/GID) 等</li>
<li>v：显示建立 ISO 文件的过程</li>
<li>V vol：建立 Volume ，有点像 windows 在文件总管内看到的 CD title 的东西</li>
<li>m file：-m 为排除文件（exclude），后面的文件不备份到该映像文档中，也可以使用 * 通配符</li>
<li>-graft-point：graft 有转嫁或移植的意思，相关资料在下面说明</li>
</ul>
<p>mkisofs 有非常多好用的选项，只想制作数据光盘时，上述的选项就够用了。光盘格式一般称为 iso9660，这种格式一般仅支持旧版的 DOS 文件名（文件只能以 8.3 即 文件名 8 个字符，扩展名 3 个字符的方式存在）。如果加上 -r 选项后，文件信息能够被记录得比较完整</p>
<p>此外，一般预设的情况下，所有要被加到映像中的文件都会被放置到映像文件的根目录，如此一来可能会造成刻录后的文件分类不易的情况，可以使用 -graft-point 选项</p>
<ul>
<li>映像文件中的目录所在 等于 实际 Linux 文件系统的目录所在</li>
<li>/movies=/srv/movies（在 Linux 的 /srv/movies 内的文件，加到映像文件中的 /movies/ 目录）</li>
<li>/linux/etc=/etc（将 Linux 中的 /etc/ 内的所有数据备份到映像文件中的 /liux/etc 目录中</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 假如想要讲 /root、/home、/etc 等目录内的数据通过刻录起来的话，先要处理下映像</span></span>
<span class="line"><span class="token comment"># 先不使用 -graft-point 的选项处理</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkisofs -v -o /tmp/system.img /root /home/ /etc/</span></span>
<span class="line">I: -input-charset not specified, using utf-8 <span class="token punctuation">(</span>detected <span class="token keyword">in</span> locale settings<span class="token punctuation">)</span></span>
<span class="line">genisoimage <span class="token number">1.1</span>.11 <span class="token punctuation">(</span>Linux<span class="token punctuation">)</span></span>
<span class="line">Scanning /root</span>
<span class="line"><span class="token punctuation">..</span>. 很多的文件记录输出</span>
<span class="line">Writing:   The File<span class="token punctuation">(</span>s<span class="token punctuation">)</span>                             Start Block <span class="token number">955</span></span>
<span class="line">  <span class="token number">9.23</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">18.47</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">27.72</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">36.94</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">46.19</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">55.39</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">64.62</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">73.85</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:51 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">83.08</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:52 <span class="token number">2019</span></span>
<span class="line"> <span class="token number">92.33</span>% done, estimate finish Tue Oct <span class="token number">29</span> 03:55:52 <span class="token number">2019</span></span>
<span class="line">Total translation table size: <span class="token number">0</span></span>
<span class="line">Total rockridge attributes bytes: <span class="token number">0</span></span>
<span class="line">Total directory bytes: <span class="token number">1869824</span></span>
<span class="line">Path table size<span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>: <span class="token number">13350</span></span>
<span class="line">Done with: The File<span class="token punctuation">(</span>s<span class="token punctuation">)</span>                             Block<span class="token punctuation">(</span>s<span class="token punctuation">)</span>    <span class="token number">53057</span></span>
<span class="line">Writing:   Ending Padblock                         Start Block <span class="token number">54012</span></span>
<span class="line">Done with: Ending Padblock                         Block<span class="token punctuation">(</span>s<span class="token punctuation">)</span>    <span class="token number">150</span></span>
<span class="line">Max brk space used <span class="token number">378000</span></span>
<span class="line"><span class="token number">54162</span> extents written <span class="token punctuation">(</span><span class="token number">105</span> MB<span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 笔者这个直接成功了，在树上因为 /etc/crontab 和 /root/crontab 中有相同的文件</span></span>
<span class="line"><span class="token comment"># 他们没有被归档的时候，都会出现在映像文档中的根目录，所以报错</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -h /tmp/system.img </span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root 106M <span class="token number">10</span>月 <span class="token number">29</span> 03:55 /tmp/system.img</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看该映像中的内容</span></span>
<span class="line"><span class="token comment"># 可以挂载到某个目录下，再查看</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount -o loop /tmp/system.img /mnt/</span></span>
<span class="line">mount: /dev/loop0 写保护，将以只读方式挂载</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># df -h /mnt/</span></span>
<span class="line">文件系统        容量  已用  可用 已用% 挂载点</span>
<span class="line">/dev/loop0      106M  106M     <span class="token number">0</span>  <span class="token number">100</span>% /mnt</span>
<span class="line"><span class="token comment"># 使用 ll /mnt 指令查看，只发现里面全是没有路径的文件</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现所有的数据都放在了映像文件中的根目录，下面使用归档再看看</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 卸载掉</span></span>
<span class="line"><span class="token function">umount</span> /mnt</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mkisofs -r -V 'linux_file' -o /tmp/system.img -m /roo/etc --graft-point /root=/root /home/=/home /etc=/etc</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll -h /tmp/system.img </span></span>
<span class="line">-rw-r--r--. <span class="token number">1</span> root root 107M <span class="token number">10</span>月 <span class="token number">29</span> 04:05 /tmp/system.img</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># mount -o loop /tmp/system.img /mnt/</span></span>
<span class="line">mount: /dev/loop0 写保护，将以只读方式挂载</span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /mnt/</span></span>
<span class="line">总用量 <span class="token number">46</span></span>
<span class="line">dr-xr-xr-x. <span class="token number">143</span> root root <span class="token number">38912</span> <span class="token number">10</span>月  <span class="token number">4</span> <span class="token number">18</span>:38 etc</span>
<span class="line">dr-xr-xr-x.   <span class="token number">4</span> root root  <span class="token number">2048</span> <span class="token number">10</span>月  <span class="token number">8</span> <span class="token number">23</span>:01 home</span>
<span class="line">dr-xr-xr-x.   <span class="token number">7</span> root root  <span class="token number">4096</span> <span class="token number">10</span>月 <span class="token number">29</span> 00:57 root</span>
<span class="line">dr-xr-xr-x.   <span class="token number">9</span> root root  <span class="token number">2048</span> <span class="token number">10</span>月 <span class="token number">29</span> 04:05 rr_moved</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="制作-修改可开机光盘映像文档" tabindex="-1"><a class="header-anchor" href="#制作-修改可开机光盘映像文档"><span>制作/修改可开机光盘映像文档</span></a></h2>
<p>要制作一键安装系统的光盘，需要修改原版光盘映像文件，改成可以自动加载某些程序的流程；刻录成光盘后，放入光驱，只要开机利用光盘来开机，就直接安装系统，不再需要询问管理员一些问题，等于是自动化处理，当然这些流程很麻烦，需要了解 kickstart 等相关技术，这里先不谈。本章让你知道如何让光盘内容被修改之后，还可以刻录成可开机的映像文档</p>
<p>笔者刚开始使用 mac，传入虚拟机文档不知道怎么弄，特别慢。就不跟着练习了，直接截图了</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 查看 iso 的信息</span></span>
<span class="line">isoinfo <span class="token parameter variable">-d</span> <span class="token parameter variable">-i</span> /home/CentOS-7.iso </span>
<span class="line"><span class="token comment"># 挂载该 iso 到 /mnt</span></span>
<span class="line"><span class="token function">mount</span> /home/CentOS-7.iso /mnt</span>
<span class="line"><span class="token function">mkdir</span> /srv/newcd</span>
<span class="line"><span class="token comment"># rsync 可以完整复制所有的权限属性等数据，也可以进行镜像处理</span></span>
<span class="line"><span class="token comment"># 现在 newcd 总已经是完整映像文档的内容了</span></span>
<span class="line"><span class="token function">rsync</span> <span class="token parameter variable">-a</span> /mnt /srv/newcd</span>
<span class="line">ll /srv/newcd/</span>
<span class="line"><span class="token comment"># 这里就可以修改 newcd 里面的内容了，假设已经处理完</span></span>
<span class="line">ll /srv/newcd/isolinux</span>
<span class="line"><span class="token builtin class-name">cd</span> /srv/newcd</span>
<span class="line"><span class="token function">mkisofs</span> <span class="token parameter variable">-o</span> /custom.iso <span class="token parameter variable">-b</span> isolinux/isolinux.bin <span class="token parameter variable">-c</span> isolinux/boot.cat <span class="token punctuation">\</span></span>
<span class="line"><span class="token operator">></span> -no-emul-boot <span class="token parameter variable">-V</span> <span class="token string">'CentOS 7 x86_64'</span> -boot-load-size <span class="token number">4</span> -boot-info-table <span class="token parameter variable">-R</span> <span class="token parameter variable">-J</span> <span class="token parameter variable">-v</span> <span class="token parameter variable">-T</span></span>
<span class="line"><span class="token comment"># 运行之后，就会存在一个 /custom.img 的文件存在,可以将该文件刻录到光盘上</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/tutorial-basis/08/assets/image-20191101234333791.png" alt="image-20191101234333791"></p>
<p><img src="@source/tutorial-basis/08/assets/image-20191101234746782.png" alt="image-20191101234746782"></p>
<h2 id="cdrecord-光盘刻录工具" tabindex="-1"><a class="header-anchor" href="#cdrecord-光盘刻录工具"><span>cdrecord 光盘刻录工具</span></a></h2>
<p>新版的 CentOS 7 使用的是 wodim 指令来进行刻录行为（旧版是 cdrecord，为了兼容 wodim 也链接了旧版的）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 常见的指令入戏</span></span>
<span class="line">wodim <span class="token parameter variable">--devices</span> dev/det/sr0			<span class="token comment"># 查询刻录机的 BUS 位置</span></span>
<span class="line">wodim <span class="token parameter variable">-v</span> <span class="token assign-left variable">dev</span><span class="token operator">=</span>/dev/sr0 <span class="token assign-left variable">blank</span><span class="token operator">=</span><span class="token punctuation">[</span>fast<span class="token operator">|</span>all<span class="token punctuation">]</span>	<span class="token comment"># 抹除重复读写片</span></span>
<span class="line">wodim <span class="token parameter variable">-v</span> <span class="token assign-left variable">dev</span><span class="token operator">=</span>/dev/sr0 <span class="token parameter variable">-format</span>		<span class="token comment"># 格式化 DVD + RW</span></span>
<span class="line">wodim <span class="token parameter variable">-v</span> <span class="token assign-left variable">dev</span><span class="token operator">=</span>/dev/sr0 <span class="token punctuation">[</span>可用选项功能<span class="token punctuation">]</span> file.iso</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>选项与参数：</p>
<ul>
<li>devices：用在扫描磁盘总线并找出可用的刻录机，后续的装置为 ATA 接口</li>
<li>v：在 cdrecord 运作的过程中，显示过程</li>
<li>dev=/dev/sr0：可以找出此光驱的 bus 地址，非常重要</li>
<li>`blank[fast|all]：blank 为抹除可重复写的 Cd/DVD-RW ，使用 fast 较快，all 较完成</li>
<li>format：对光盘进行格式化，但是仅针对 DVD+RW 这种格式的 DVD</li>
<li>可用选项与功能：
<ul>
<li><code v-pre>-data</code>：指定后面的文件以数据格式写入，不是以 CD 音轨（-audio）方式写入</li>
<li>speed=x：指定刻录速度，例如 CD 可用 speed=40 为 40 倍数，DVD 则可用 speed=4 之类</li>
<li><code v-pre>-eject</code>：指定刻录完毕后自动退出光盘</li>
<li>fs=Ym：指定多少缓存存储器，可用在将映像档先暂存至缓冲存储器。预设为 4m，一般建议可增加到 8m，不过还是得视你的刻录机而定</li>
</ul>
</li>
<li>针对 DVD 的选项功能：
<ul>
<li>driveropts=burnfree：打开 Buffer Underrun Free 模式的写入功能</li>
<li><code v-pre>-sao</code>：支持 DVD-RW 的格式</li>
</ul>
</li>
</ul>
<h3 id="侦测你的刻录机所在位置" tabindex="-1"><a class="header-anchor" href="#侦测你的刻录机所在位置"><span>侦测你的刻录机所在位置</span></a></h3>
<p>文不能模式的刻录确实比较麻烦，需要先找到刻录机才行。早期刻录机都是使用 SCSI 接口，因此配合 SCSI 接口认定来查询</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># ll /dev/sr0 </span></span>
<span class="line">brw-rw----+ <span class="token number">1</span> root cdrom <span class="token number">11</span>, <span class="token number">0</span> <span class="token number">10</span>月 <span class="token number">28</span> <span class="token number">21</span>:38 /dev/sr0	 <span class="token comment"># 一般 Linux 光驱文件名</span></span>
<span class="line"><span class="token punctuation">[</span>root@study ~<span class="token punctuation">]</span><span class="token comment"># wodim --devices dev=/dev/sr0</span></span>
<span class="line">wodim: Warning: controller returns zero sized CD capabilities page.</span>
<span class="line">wodim: Warning: controller returns wrong size <span class="token keyword">for</span> CD capabilities page.</span>
<span class="line">wodim: Warning: controller returns wrong page <span class="token number">0</span> <span class="token keyword">for</span> CD capabilities page <span class="token punctuation">(</span>2A<span class="token punctuation">)</span>.</span>
<span class="line">wodim: Overview of accessible drives <span class="token punctuation">(</span><span class="token number">1</span> found<span class="token punctuation">)</span> <span class="token builtin class-name">:</span></span>
<span class="line">-------------------------------------------------------------------------</span>
<span class="line"> <span class="token number">0</span>  <span class="token assign-left variable">dev</span><span class="token operator">=</span><span class="token string">'/dev/sr0'</span>      rwrw-- <span class="token builtin class-name">:</span> <span class="token string">'VBOX'</span> <span class="token string">'CD-ROM'</span></span>
<span class="line">-------------------------------------------------------------------------</span>
<span class="line"></span>
<span class="line"><span class="token comment">#笔者这个是虚拟机的，因此无法真正的使用，那么下面的指令直接记录书上的步骤</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="进入-cd-dvd-的刻录动作" tabindex="-1"><a class="header-anchor" href="#进入-cd-dvd-的刻录动作"><span>进入 CD/DVD 的刻录动作</span></a></h3>
<p>如何将 /tmp/system.img 刻录到 cd/dvd 里面？</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 0. 先抹除光盘的原始内容：（非可重复读写则可略过此步骤）</span></span>
<span class="line">wodim <span class="token parameter variable">-v</span> <span class="token assign-left variable">dev</span><span class="token operator">=</span>/dev/sr0 <span class="token assign-left variable">blank</span><span class="token operator">=</span>fast</span>
<span class="line"><span class="token comment"># 中间会抛出一堆信息告诉你抹除的进度，而且会有 10 秒的时间等待你取消</span></span>
<span class="line"><span class="token comment"># 1. 开始刻录; eject 刻录完成之后，DVD 会被退出光驱，记得推回去</span></span>
<span class="line">wodim <span class="token parameter variable">-v</span> <span class="token assign-left variable">dev</span><span class="token operator">=</span>/dev/sr0 <span class="token assign-left variable">speed</span><span class="token operator">=</span><span class="token number">4</span> <span class="token parameter variable">-dummy</span> <span class="token parameter variable">-eject</span> /tmp/system.img</span>
<span class="line"><span class="token comment"># 2. 刻录完成后，测试挂载一下，检验内容</span></span>
<span class="line"><span class="token function">mount</span> /dev/sr0/mnt</span>
<span class="line">dh <span class="token parameter variable">-h</span> /mnt</span>
<span class="line">ll /mnt</span>
<span class="line"><span class="token function">umount</span> /mnt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简单刻录上面的语法就够了，但是还是建议在图形化界面中来刻录</p>
</div></template>


