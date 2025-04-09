---
title: "Kotlin/Native 二进制文件的许可文件"
---
像许多其他开源项目一样，Kotlin 依赖于第三方代码，这意味着 Kotlin 项目包含一些并非由 JetBrains 或 Kotlin 编程语言贡献者开发的代码。
有时它是衍生作品，例如从 C++ 重写为 Kotlin 的代码。

:::note
您可以在我们的 GitHub 存储库中找到 Kotlin 中使用的第三方作品的许可证：

* [Kotlin 编译器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
* [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)

:::

特别是，Kotlin/Native 编译器生成的可执行文件可能包含第三方代码、数据或衍生作品。
这意味着 Kotlin/Native 编译的可执行文件受第三方许可证的条款和条件的约束。

在实践中，如果您分发 Kotlin/Native 编译的 [final binary](multiplatform-build-native-binaries)（最终二进制文件），您应始终在二进制分发包中包含必要的许可证文件。这些文件应以可读的形式供您的分发包的用户访问。

始终包含以下相应项目的许可证文件：
<table>
<tr>
      <th>项目</th>
      <th>要包含的文件</th>
</tr>
<tr>
<td>
<a href="https://kotlinlang.org/">Kotlin</a>
</td>
<td rowspan="4">
<list>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 版权声明</a></li>
</list>
</td>
</tr>
<tr>
<td>
<a href="https://harmony.apache.org/">Apache Harmony</a>
</td>
</tr>
<tr>
<td>
<a href="https://www.gwtproject.org/">GWT</a>
</td>
</tr>
<tr>
<td>
<a href="https://guava.dev">Guava</a>
</td>
</tr>
<tr>
<td>
<a href="https://github.com/ianlancetaylor/libbacktrace">libbacktrace</a>
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">带有版权声明的 3-clause BSD license</a>
</td>
</tr>
<tr>
<td>
<a href="https://github.com/microsoft/mimalloc">mimalloc</a>
</td>
<td>

<p>
   <a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT license</a>
</p>
<p>
   如果您使用 mimalloc 内存分配器而不是默认分配器（设置了 `-Xallocator=mimalloc` 编译器选项），则包含此文件。
</p>
</td>
</tr>
<tr>
<td>
<a href="https://www.unicode.org/">Unicode character database（Unicode 字符数据库）</a>
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode license</a>
</td>
</tr>
<tr>
<td>
Multi-producer/multi-consumer bounded queue（多生产者/多消费者有界队列）
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版权声明</a>
</td>
</tr>
</table>

`mingwX64` 目标需要额外的许可证文件：

| 项目                                                               | 要包含的文件                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 headers and runtime libraries](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 runtime license</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads license</a></li></list> |
:::note
这些库都不要求将分发的 Kotlin/Native 二进制文件开源。

:::