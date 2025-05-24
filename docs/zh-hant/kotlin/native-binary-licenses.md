---
title: "Kotlin/Native 二進位檔案的授權檔案"
---
與許多其他開源專案一樣，Kotlin 依賴於第三方程式碼，這意味著 Kotlin 專案包含一些非 JetBrains 或 Kotlin 程式語言貢獻者開發的程式碼。 有時它是衍生作品，例如從 C++ 重寫為 Kotlin 的程式碼。

:::note
您可以在我們的 GitHub 儲存庫中找到 Kotlin 中使用的第三方作品的許可證：

* [Kotlin 編譯器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
* [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)

:::

特別是，Kotlin/Native 編譯器產生的二進位檔案可能包含第三方程式碼、資料或衍生作品。 這意味著 Kotlin/Native 編譯的二進位檔案受第三方許可證的條款和條件約束。

實際上，如果您分發 Kotlin/Native 編譯的 [最終二進位檔案](multiplatform-build-native-binaries)，您應始終在二進位檔案發佈中包含必要的許可證檔案。 這些檔案應以可讀的形式供您發佈的用戶存取。

始終包含相應專案的以下許可證檔案：
<table>
<tr>
      <th>專案 (Project)</th>
      <th>要包含的檔案</th>
</tr>
<tr>
<td>
<a href="https://kotlinlang.org/">Kotlin</a>
</td>
<td rowspan="4">
<list>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
<li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 版權聲明</a></li>
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
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">帶版權聲明的 3-clause BSD 許可證</a>
</td>
</tr>
<tr>
<td>
<a href="https://github.com/microsoft/mimalloc">mimalloc</a>
</td>
<td>

<p>
   <a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT 許可證</a>
</p>
<p>
   如果您使用 `mimaloc` 記憶體分配器而不是預設分配器（設定了 `-Xallocator=mimalloc` 編譯器選項），請包含此項。
</p>
</td>
</tr>
<tr>
<td>
<a href="https://www.unicode.org/">Unicode 字元資料庫</a>
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode 許可證</a>
</td>
</tr>
<tr>
<td>
多生產者/多消費者有界佇列
</td>
<td>
<a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版權聲明</a>
</td>
</tr>
</table>

`mingwX64` 目標需要額外的許可證檔案：

| 專案 (Project)                                                               | 要包含的檔案                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 headers and runtime libraries](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 runtime 許可證</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads 許可證</a></li></list> |
:::note
這些庫都不需要將發佈的 Kotlin/Native 二進位檔案開源。

:::