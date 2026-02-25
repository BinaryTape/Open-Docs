[//]: # (title: Kotlin/Native バイナリのライセンスファイル)

他の多くのオープンソースプロジェクトと同様に、Kotlinはサードパーティ製のコードに依存しています。これは、KotlinプロジェクトにJetBrainsやKotlinプログラミング言語のコントリビューターによって開発されていないコードが含まれていることを意味します。
C++からKotlinへと書き換えられたコードのように、派生著作物である場合もあります。

> Kotlinで使用されているサードパーティ製の著作物のライセンスは、GitHubリポジトリで確認できます。
>
> * [Kotlinコンパイラ](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

特に、Kotlin/Nativeコンパイラが生成するバイナリには、サードパーティのコード、データ、または派生著作物が含まれる場合があります。
これは、Kotlin/Nativeでコンパイルされたバイナリが、サードパーティライセンスの利用規約に従う必要があることを意味します。

実際には、Kotlin/Nativeでコンパイルされた[最終的なバイナリ](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)を配布する場合、バイナリの配布物に常に必要なライセンスファイルを含める必要があります。それらのファイルは、配布物のユーザーが読み取り可能な形式でアクセスできる必要があります。

対応するプロジェクトについて、以下のライセンスファイルを必ず含めてください。

<table>
   <tr>
      <th>プロジェクト</th>
      <th>含めるべきファイル</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 著作権表示</a></li>
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
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">著作権表示付きの3条項BSDライセンス</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT ライセンス</a></p>
          <p>デフォルトのメモリアロケータの代わりに mimalloc メモリアロケータを使用する場合（コンパイラオプション <code>-Xallocator=mimalloc</code> が設定されている場合）に含めてください。</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode character database</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode ライセンス</a></td>
   </tr>
   <tr>
        <td>Multi-producer/multi-consumer bounded queue</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">著作権表示</a></td>
   </tr>
</table>

`mingwX64` ターゲットでは、追加のライセンスファイルが必要です。

| プロジェクト | 含めるべきファイル | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 ヘッダーおよびランタイムライブラリ](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 ランタイムライセンス</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads ライセンス</a></li></list> |

> これらのライブラリの中に、配布されるKotlin/Nativeバイナリのオープンソース化を要求するものはありません。
>
{style="note"}