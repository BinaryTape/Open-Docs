[//]: # (title: Kotlin/Native 二进制文件的许可文件)

与许多其他开源项目一样，Kotlin 依赖于第三方代码，这意味着 Kotlin 项目包含一些非 JetBrains 或 Kotlin 编程语言贡献者开发的代码。有时它是派生作品，例如从 C++ 重写为 Kotlin 的代码。

> 您可以在我们的 GitHub 版本库中找到 Kotlin 中使用的第三方作品的许可：
>
> * [Kotlin 编译器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

特别是，Kotlin/Native 编译器生成的二进制文件可以包含第三方代码、数据或派生作品。这意味着 Kotlin/Native 编译的二进制文件受第三方许可的条款和条件约束。

实际上，如果您分发 Kotlin/Native 编译的[最终二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)，则应始终在您的二进制分发中包含必要的许可文件。这些文件应以可读形式供您的分发版的用户访问。

请始终为相应的项目包含以下许可文件：

<table>
   <tr>
      <th>项目</th>
      <th>要包含的文件</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache 许可 2.0</a></li>
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
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">3 条款 BSD 许可及版权声明</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT 许可</a></p>
          <p>在您使用 mimalloc 内存分配器而非默认分配器时（设置了 <code>-Xallocator=mimalloc</code> 编译器选项），请包含此文件。</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode 字符数据库</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode 许可</a></td>
   </tr>
   <tr>
        <td>多生产者/多消费者有界队列</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版权声明</a></td>
   </tr>
</table>

`mingwX64` 目标平台需要额外的许可文件：

| 项目                                                               | 要包含的文件                                                                                                                                                                                                                                                                                                              | 
|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 头文件和运行时库](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 运行时许可</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads 许可</a></li></list> |

> 这些库均不要求分发的 Kotlin/Native 二进制文件是开源的。
>
{style="note"}