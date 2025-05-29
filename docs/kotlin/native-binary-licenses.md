[//]: # (title: Kotlin/Native 二进制文件的许可证文件)

与许多其他开源项目一样，Kotlin 依赖第三方代码，这意味着 Kotlin 项目包含一些非 JetBrains 或 Kotlin 编程语言贡献者开发的代码。有时，它是派生作品，例如从 C++ 重写为 Kotlin 的代码。

> 你可以在我们的 GitHub 仓库中找到 Kotlin 中使用的第三方作品的许可证：
>
> * [Kotlin 编译器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

特别是，Kotlin/Native 编译器生成的二进制文件可能包含第三方代码、数据或派生作品。这意味着经 Kotlin/Native 编译的二进制文件受第三方许可证的条款和条件的约束。

实际上，如果你分发经 Kotlin/Native 编译的[最终二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)，则应始终在你的二进制分发中包含必要的许可证文件。这些文件应以可读形式供你的分发用户访问。

始终包含以下项目的相应许可证文件：

<table>
   <tr>
      <th>项目</th>
      <th>要包含的文件</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache 许可证 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 版权声明</a></li>
         </list>
        </td>
   </tr>
   <tr>
        <td><a href="https://harmony.apache.org/">Apache Harmony</a></td>
   </tr>
   <tr>
        <td><a href="https://www.gwtproject.org/">GWT</a></td>
   </tr>
   <tr>
        <td><a href="https://guava.dev">Guava</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/ianlancetaylor/libbacktrace">libbacktrace</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">带有版权声明的 3 条款 BSD 许可证</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT 许可证</a></p>
          <p>如果你使用 mimalloc 内存分配器而非默认分配器（即设置了 <code>-Xallocator=mimalloc</code> 编译器选项），则应包含此文件。</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode 字符数据库</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode 许可证</a></td>
   </tr>
   <tr>
        <td>多生产者/多消费者有界队列</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版权声明</a></td>
   </tr>
</table>

`mingwX64` 目标需要额外的许可证文件：

| 项目                                                               | 要包含的文件                                                                                                                                                                                                                                                                                                              |
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 头文件和运行时库](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 运行时许可证</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads 许可证</a></li></list> |

> 这些库均不要求已分发的 Kotlin/Native 二进制文件开源。
>
{style="note"}