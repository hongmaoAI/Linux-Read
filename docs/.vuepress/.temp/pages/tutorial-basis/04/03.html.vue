<template><div><h1 id="超简单文字编辑器-nano" tabindex="-1"><a class="header-anchor" href="#超简单文字编辑器-nano"><span>超简单文字编辑器 nano</span></a></h1>
<p>linux 系统中有很多文字编辑器的存在，最重要的就是后续会谈到的 vim，而 nano 也是一款文字编辑器，
比较简单，先来玩一玩</p>
<p><img src="@source/tutorial-basis/04/assets/markdown-img-paste-20191006223529852.png" alt=""></p>
<p>text.txt 可以不存在，如果不存在则新建，存在则打开。</p>
<p>下方有一个醒目的 <code v-pre>[New File]</code> 这个就是文件状态了，现在是新建的一个文件，
而下面的各种组合键 <code v-pre>^</code> 代表 ctrl 键。</p>
<ul>
<li>g：缺德联机帮助（help)</li>
<li>x：离开 naon 软件，若有修改过文件则会提示需要存储</li>
<li>o：存储文件，当然得有权限</li>
<li>r：从其他文件读入资料，可以将某个文件的内容贴在本文件中</li>
<li>w：搜索字符串</li>
<li>c：显示光标所在处的行数与列数等信息</li>
<li><code v-pre>_</code>：可以直接输入行号，让光标移动到这行</li>
<li>y：校正语法功能开启或关闭（单机开、再单机关闭）</li>
<li>m：可以支持鼠标来移动光标的功能</li>
</ul>
<p>完整说明使用 ctrl + g，或则  F1 键就出来帮助文档了</p>
</div></template>


