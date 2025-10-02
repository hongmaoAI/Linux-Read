<template><div><h1 id="本章练习" tabindex="-1"><a class="header-anchor" href="#本章练习"><span>本章练习</span></a></h1>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>本章开始，将会跟着做练习题了，因为笔者学习 linux 的主要目的就是工作中和能更加属性的在 mac 上安装开发软件环境等。</p>
<p>本章开始，一个差不多都是需要大量练习的知识点，且是平时经常用到的知识</p>
</div>
<ol>
<li>
<p>在 <RouteLink to="/tutorial-basis/07/04.html#%E6%8C%82%E8%BD%BD">第七章</RouteLink> 中使用 nano 便利编辑 /etc/fastab 的练习，使用 vim 去编辑</p>
<ul>
<li>
<p>将新增的那一列的 defautuls 改成 default，会出现什么状态？</p>
</li>
<li>
<p>离开前请务必要恢复成原本正确的信息，另外如果在该列最前面添加 <code v-pre>#</code> 批注信息，将看到有颜色的变化</p>
</li>
</ul>
</li>
<li>
<p>尝试在你的系统中，你经常使用的账户的家的目录下，将本章介绍的 vimrc 内容进行一些常用设置，包括：</p>
<ul>
<li>搜索高亮度反白</li>
<li>语法检验开启</li>
<li>默认显示行号</li>
<li>设置两行状态栏：一行状态 + 一行指令列；<code v-pre>:set lastatus=2</code></li>
</ul>
</li>
</ol>
<h2 id="简答题" tabindex="-1"><a class="header-anchor" href="#简答题"><span>简答题</span></a></h2>
<ol>
<li>
<p>我用 vi 开启某个文件后，要在 第 34 行向右移动 15 个字符，应该在一般指令模式中下达什么指令？</p>
<ol>
<li>先「34G」</li>
<li>再「15 + 向右键」或 15l</li>
</ol>
</li>
<li>
<p>在 vi 开启的文件中，如何去该文件的头部和尾部？</p>
<ol>
<li>「gg」到头部，或「1G」</li>
<li>「G」到尾部</li>
</ol>
</li>
<li>
<p>在 vi 开启的文件中，如何在光标所在行中，移动到行头及行尾？</p>
<ol>
<li>「0」移动行头</li>
<li>「$」移动行尾</li>
</ol>
</li>
<li>
<p>vi 的一般指令模式下，按下 「r」有什么功能？</p>
<p>替换光标所在的哪个字符</p>
</li>
<li>
<p>在 vi 的环境中，如何将目前正在编辑的文件另存为 newfilename？</p>
<p><code v-pre>:w newfilename</code></p>
</li>
<li>
<p>在 linux 下最常用的文本编辑器为 vi，请问如何进入编辑模式</p>
<ul>
<li>在一般指令模式下输入：i、I、a、A 为在本行中输入新字符；出现 --Insert--</li>
<li>在一般指令模式下输入：o、O 为在新的一行输入新字符</li>
<li>在一般指令模式下输入：r、R 为替换字符。左下角出现 --Replace--</li>
</ul>
</li>
<li>
<p>在 vi 软件中，如何由编辑模式跳回一般指令模式</p>
<p>按下 「Ese」键</p>
</li>
<li>
<p>在 vi 环境中，若上下左右键无法使用时，在一般指令模式中如何移动光标？</p>
<p>可以用 i、j、k、l 分别代替上下左右</p>
</li>
<li>
<p>在 vi 的一般指令模式中，如何删除一行、n 行；如何删除一个字符？</p>
<ul>
<li>dd：删除一行</li>
<li>ndd：删除 n 行</li>
<li>x 或 X：删除一个字符</li>
<li>dG ：删除到首</li>
<li>d1G：删除到页尾</li>
</ul>
</li>
<li>
<p>在 vi 的一般指令模式中，如何复制一行、n 行并加以贴上？</p>
<ul>
<li>yy：复制一行</li>
<li>nyy：复制 n 行</li>
<li>p 或 P：贴上</li>
</ul>
</li>
<li>
<p>在vi 的一般指令模式中如何搜索 string 这个字符串？</p>
<p>使用 <code v-pre>/string</code> 往后搜索，<code v-pre>?string</code>往前搜索</p>
</li>
<li>
<p>在 vi 的一般指令模式中，如何替换 word1 为 word 2，而若需要使用者确认机制，又该如何？</p>
<ul>
<li><code v-pre>1,$s/word1/word2/g</code></li>
<li><code v-pre>1,$s/word1/word2/gc</code>：尾部加 c 使用者确认</li>
</ul>
</li>
<li>
<p>在 vi 目前的编辑文件中，在一般指令模式下，如何读取一个文件 filename 进来当前这个文件？</p>
<p><code v-pre>:r filename</code></p>
</li>
<li>
<p>在 vi 的一般指令模式中，如何存盘、离开、存档后离开、强制存档离开？</p>
<ul>
<li><code v-pre>:w</code>：保存</li>
<li><code v-pre>:q</code>：离开</li>
<li><code v-pre>:wq</code> ：保存后离开</li>
<li><code v-pre>:wq!</code>：强制保存后离开</li>
</ul>
</li>
<li>
<p>在 vi 下作了很多的编辑动作之后，却还想还原原来的文件内容，该怎么进行？</p>
<p>可按下<code v-pre>:e!</code> 即可恢复为文件原始状态</p>
</li>
<li>
<p>在 vi 中，不想离开 vi，但是想指令 ls /home 这个指令，vi 有什么额外的功能可以达到这个目的？</p>
<p>可以使用，<code v-pre>:! ls /home</code>，不过，在学过后面的章节后，会发现可以使用 ctrl + z 暂时退出 vi 让你在指令列模式中执行指令</p>
</li>
</ol>
</div></template>


