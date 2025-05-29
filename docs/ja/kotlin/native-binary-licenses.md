[//]: # (title: Kotlin/Native バイナリのライセンスファイル)

他の多くのオープンソースプロジェクトと同様に、Kotlinはサードパーティのコードに依存しており、つまりKotlinプロジェクトにはJetBrainsやKotlinプログラミング言語の貢献者によって開発されていないコードが含まれています。
時には、C++からKotlinに書き直されたコードのような派生作品も含まれます。

> Kotlinで使用されているサードパーティの著作物に対するライセンスは、以下のGitHubリポジトリで確認できます。
>
> * [Kotlinコンパイラ](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

特に、Kotlin/Nativeコンパイラは、サードパーティのコード、データ、または派生作品を含む可能性のあるバイナリを生成します。
これは、Kotlin/Nativeでコンパイルされたバイナリが、サードパーティライセンスの規約と条件に従う必要があることを意味します。

実際には、Kotlin/Nativeでコンパイルされた[最終バイナリ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)を配布する場合、
常に必要なライセンスファイルをバイナリ配布物に含める必要があります。これらのファイルは、配布物のユーザーが読み取り可能な形式でアクセスできるようにすべきです。

対応するプロジェクトには、常に以下のライセンスファイルを含めてください。

<table>
   <tr>
      <th>プロジェクト</th>
      <th>含めるべきファイル</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apacheライセンス 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony著作権表示</a></li>
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
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">3条項BSDライセンスと著作権表示</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MITライセンス</a></p>
          <p>デフォルトのアロケータではなくmimallocメモリロケータを使用する場合（コンパイラオプション <code>-Xallocator=mimalloc</code> が設定されている場合）に含めます。</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode文字データベース</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicodeライセンス</a></td>
   </tr>
   <tr>
        <td>マルチプロデューサー/マルチコンシューマー有界キュー</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">著作権表示</a></td>
   </tr>
</table>

`mingwX64` ターゲットには、追加のライセンスファイルが必要です。

| プロジェクト                                                          | 含めるべきファイル                                                                                                                                                                                                                                                                                                        | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64ヘッダーおよびランタイムライブラリ](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64ランタイムライセンス</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreadsライセンス</a></li></list> |

> これらのライブラリはいずれも、配布されるKotlin/Nativeバイナリをオープンソース化することを要求しません。
>
{style="note"}