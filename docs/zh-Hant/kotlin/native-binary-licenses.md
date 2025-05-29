[//]: # (title: Kotlin/Native 二進位檔的授權檔案)

與許多其他開源專案一樣，Kotlin 依賴於第三方程式碼，這意味著 Kotlin 專案包含一些非由 JetBrains 或 Kotlin 程式語言貢獻者開發的程式碼。有時它是衍生作品，例如從 C++ 重寫為 Kotlin 的程式碼。

> 您可以在我們的 GitHub 儲存庫中找到 Kotlin 使用的第三方作品授權：
>
> * [Kotlin 編譯器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

特別是，Kotlin/Native 編譯器會產生可能包含第三方程式碼、資料或衍生作品的二進位檔。這表示經 Kotlin/Native 編譯的二進位檔受第三方授權的條款和條件約束。

實際上，如果您發佈經 Kotlin/Native 編譯的[最終二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)，您應始終在您的二進位發佈中包含必要的授權檔案。這些檔案應以可讀形式供您發佈的用戶存取。

始終包含以下專案的對應授權檔案：

<table>
   <tr>
      <th>專案</th>
      <th>應包含的檔案</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache 2.0 授權</a></li>
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
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">3 條款 BSD 授權與版權聲明</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT 授權</a></p>
          <p>如果您使用 mimalloc 記憶體分配器而非預設分配器（已設定 <code>-Xallocator=mimalloc</code> 編譯器選項），則應包含此檔案。</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode 字元資料庫</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode 授權</a></td>
   </tr>
   <tr>
        <td>多生產者/多消費者有界佇列</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版權聲明</a></td>
   </tr>
</table>

`mingwX64` 目標需要額外的授權檔案：

| 專案                                                               | 應包含的檔案                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 標頭檔與執行階段函式庫](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 執行階段授權</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads 授權</a></li></list> |

> 這些函式庫都不要求發佈的 Kotlin/Native 二進位檔必須開源。
>
{style="note"}