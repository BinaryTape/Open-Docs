[//]: # (title: Kotlin/Native 二進位檔的授權檔案)

如同許多其他開源專案，Kotlin 依賴第三方程式碼，這意味著 Kotlin 專案中包含一些並非由 JetBrains 或 Kotlin 程式語言貢獻者所開發的程式碼。
有時它是衍生作品，例如從 C++ 改寫為 Kotlin 的程式碼。

> 您可以在我們的 GitHub 存儲庫中找到 Kotlin 所使用的第三方作品授權：
>
> * [Kotlin 編譯器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

特別是 Kotlin/Native 編譯器產出的二進位檔可能包含第三方程式碼、資料或衍生作品。
這意味著 Kotlin/Native 編譯的二進位檔受第三方授權的條款與條件約束。

在實務上，如果您散佈 Kotlin/Native 編譯的[最終二進位檔](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)，
您應該始終在您的二進位檔發佈版本中包含必要的授權檔案。這些檔案應以可讀取的形式提供給您發佈版本的用戶存取。

請務必為對應的專案包含以下授權檔案：

<table>
   <tr>
      <th>專案</th>
      <th>需包含的檔案</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 版權聲明</a></li>
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
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">包含版權聲明的 3-clause BSD 授權</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT 授權</a></p>
          <p>若您使用 mimalloc 記憶體分配器而非預設分配器（已設定 <code>-Xallocator=mimalloc</code> 編譯器選項），請包含此檔案。</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode 字元資料庫</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode 授權</a></td>
   </tr>
   <tr>
        <td>多生產者/多消費者有界佇列 (Multi-producer/multi-consumer bounded queue)</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版權聲明</a></td>
   </tr>
</table>

`mingwX64` 目標需要額外的授權檔案：

| 專案 | 需包含的檔案 | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 標頭檔與執行階段庫](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 執行階段授權</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads 授權</a></li></list> |

> 這些庫均不要求散佈的 Kotlin/Native 二進位檔必須開源。
>
{style="note"}