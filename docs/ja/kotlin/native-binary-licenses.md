---
title: Kotlin/Nativeバイナリのライセンスファイル
---
他の多くのオープンソースプロジェクトと同様に、Kotlinはサードパーティのコードに依存しています。つまり、Kotlinプロジェクトには、JetBrainsまたはKotlinプログラミング言語のコントリビューターによって開発されたものではないコードが含まれています。
C++からKotlinに書き換えられたコードなど、派生的な著作物である場合もあります。

:::note
Kotlinで使用されているサードパーティの著作物に関するライセンスは、GitHubリポジトリで確認できます。

* [Kotlinコンパイラー](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
* [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)

:::

特に、Kotlin/Nativeコンパイラーは、サードパーティのコード、データ、または派生物を含むバイナリを生成できます。
これは、Kotlin/Nativeでコンパイルされたバイナリが、サードパーティのライセンスの条項および条件に従う必要があることを意味します。

実際には、Kotlin/Nativeでコンパイルされた[最終バイナリ](multiplatform-build-native-binaries)を配布する場合、
バイナリ配布に必要なライセンスファイルを必ず含める必要があります。これらのファイルは、
配布物のユーザーが判読できる形式でアクセスできる必要があります。

対応するプロジェクトについて、常に以下のライセンスファイルを含めてください。
<table>
<tr>
      <th>Project</th>
      <th>Files to be included</th>
</tr>
<tr>
<td>
<a href="https://kotlinlang.org/">Kotlin</a>
</td>
<td rowspan="4">
<list>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony copyright notice</a></li>
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
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">3-clause BSD license with copyright notice</a>
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
   デフォルトのアロケータの代わりに `mimaloc` メモリアロケータを使用する場合に含めます（`-Xallocator=mimalloc` コンパイラオプションが設定されている場合）。
</p>
</td>
</tr>
<tr>
<td>
<a href="https://www.unicode.org/">Unicode character database</a>
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode license</a>
</td>
</tr>
<tr>
<td>
Multi-producer/multi-consumer bounded queue
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">Copyright notice</a>
</td>
</tr>
</table>

`mingwX64` ターゲットには、追加のライセンスファイルが必要です。

| Project                                                               | Files to be included                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 headers and runtime libraries](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 runtime license</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads license</a></li></list> |
:::note
これらのライブラリのいずれも、配布されるKotlin/Nativeバイナリをオープンソースにする必要はありません。

:::