[//]: # (title: 定義檔)

Kotlin/Native 讓您能夠使用 C 和 Objective-C 函式庫，允許您在 Kotlin 中運用其功能。一個稱為 cinterop 的特殊工具會接收 C 或 Objective-C 函式庫，並產生相對應的 Kotlin 綁定 (bindings)，以便該函式庫的方法可以在您的 Kotlin 程式碼中正常使用。

為了產生這些綁定，每個函式庫都需要一個定義檔，通常與函式庫同名。這是一個屬性檔，精確地描述了該函式庫應如何被使用。請參閱完整的 [可用屬性列表](#properties)。

以下是處理專案時的一般工作流程：

1. 建立一個描述要包含在綁定中的 `.def` 檔案。
2. 在您的 Kotlin 程式碼中使用生成的綁定。
3. 執行 Kotlin/Native 編譯器以產生最終的可執行檔。

## 建立與配置定義檔

讓我們建立一個定義檔並為一個 C 函式庫產生綁定：

1. 在您的 IDE 中，選擇 `src` 資料夾並透過 **File | New | Directory** 建立一個新目錄。
2. 將新目錄命名為 `nativeInterop/cinterop`。

   這是 `.def` 檔案位置的預設慣例，但如果您使用不同的位置，可以在 `build.gradle.kts` 檔案中覆寫此設定。
3. 選擇新的子資料夾並透過 **File | New | File** 建立一個 `png.def` 檔案。
4. 新增必要的屬性：

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers` 是用於產生 Kotlin 存根 (stubs) 的標頭檔列表。您可以將多個檔案新增到此條目中，每個檔案以空格分隔。在此案例中，只有 `png.h`。引用的檔案需要位於指定的路徑上 (在此案例中是 `/usr/include/png`)。
   * `headerFilter` 顯示了確切包含的內容。在 C 語言中，當一個檔案使用 `#include` 指令引用另一個檔案時，所有的標頭也會被包含。有時這並非必要，您可以 [使用全域模式 (glob patterns)](https://en.wikipedia.org/wiki/Glob_(programming)) 添加此參數以進行調整。

     如果您不想將外部依賴 (例如系統的 `stdint.h` 標頭) 引入互通性函式庫中，可以使用 `headerFilter`。此外，它對於函式庫大小最佳化以及修復系統與所提供的 Kotlin/Native 編譯環境之間潛在的衝突也可能很有用。

   * 如果需要修改特定平台的行為，您可以使用類似 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式，為選項提供平台特定值。在此案例中，它們是 macOS (`.osx` 後綴) 和 Linux (`.linux` 後綴)。不帶後綴的參數也是可行的 (例如，`linkerOpts=`)，並適用於所有平台。

5. 若要產生綁定，請在通知中點擊 **Sync Now** 以同步 Gradle 檔案。

   ![Synchronize the Gradle files](gradle-sync.png)

綁定產生後，IDE 可以將它們作為原生函式庫的代理視圖 (proxy view) 來使用。

> 您也可以透過在命令列中使用 [cinterop 工具](#generate-bindings-using-command-line) 來配置綁定生成。
> 
{style="tip"}

## 屬性

以下是您可以在定義檔中使用的完整屬性列表，以調整生成的二進位檔案內容。更多資訊請參閱下方相應的部分。

| **屬性**                                                                        | **描述**                                                                                                                                                                                                          |
|:------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 要包含在綁定中的函式庫標頭列表。                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | 要包含在綁定中的 Objective-C 函式庫 Clang 模組列表。                                                                                                                                    |
| `language`                                                                          | 指定語言。預設使用 C；必要時改為 `Objective-C`。                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 工具傳遞給 C 編譯器的編譯器選項。                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 工具傳遞給連結器的連結器選項。                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 以空格分隔的函式名稱列表，應被忽略。                                                                                                                                                         |                                              
| [`staticLibraries`](#include-a-static-library)                                      | [實驗性功能](components-stability.md#stability-levels-explained)。將靜態函式庫包含到 `.klib` 中。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [實驗性功能](components-stability.md#stability-levels-explained)。以空格分隔的目錄列表，cinterop 工具會在其中搜尋要包含到 `.klib` 中的函式庫。                                    |
| `packageName`                                                                       | 生成 Kotlin API 的套件前綴。                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | 透過全域模式 (globs) 篩選標頭，並在匯入函式庫時僅包含它們。                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | 在匯入函式庫時排除特定標頭，並優先於 `headerFilter`。                                                                                                                                                              |
| [`strictEnums`](#configure-enums-generation)                                        | 以空格分隔的列舉列表，應生成為 [Kotlin 列舉](enum-classes.md)。                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 以空格分隔的列舉列表，應生成為整數值。                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | 以空格分隔的函式列表，其 `const char*` 參數不應自動轉換為 Kotlin `String`。                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | 預設情況下，C 函式被假定為具有唯一名稱。如果多個函式名稱相同，則只選擇其中一個。然而，您可以透過在 `allowedOverloadsForCFunctions` 中指定這些函式來改變此行為。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 禁用不允許將非指定 Objective-C 初始化器作為 `super()` 建構函式呼叫的編譯器檢查。                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | 將來自 Objective-C 程式碼的異常包裝成具有 `ForeignException` 型別的 Kotlin 異常。                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 新增自訂訊息，例如，幫助使用者解決連結器錯誤。                                                                                                                                                 |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

除了屬性列表之外，您還可以在定義檔中包含 [自訂宣告](#add-custom-declarations)。

### 匯入標頭檔

如果 C 函式庫沒有 Clang 模組，而是由一組標頭檔組成，請使用 `headers` 屬性來指定應匯入的標頭檔：

```none
headers = curl/curl.h
```

#### 透過全域模式 (globs) 篩選標頭

您可以使用 `.def` 檔案中的篩選屬性，透過全域模式來篩選標頭檔。如果標頭檔符合任何全域模式，其宣告將被包含在綁定中。

全域模式適用於相對於適當包含路徑元素的標頭路徑，例如 `time.h` 或 `curl/curl.h`。因此，如果函式庫通常以 `#include <SomeLibrary/Header.h>` 方式包含，您可能可以使用以下篩選器來篩選標頭檔：

```none
headerFilter = SomeLibrary/**
```

如果未提供 `headerFilter`，則包含所有標頭檔。然而，我們鼓勵您使用 `headerFilter` 並盡可能精確地指定全域模式。在這種情況下，生成的函式庫僅包含必要的宣告。這有助於避免在升級 Kotlin 或開發環境中的工具時可能遇到的各種問題。

#### 排除標頭檔

若要排除特定的標頭檔，請使用 `excludeFilter` 屬性。這有助於移除冗餘或有問題的標頭檔並最佳化編譯，因為來自指定標頭檔的宣告將不包含在綁定中：

```none
excludeFilter = SomeLibrary/time.h
```

> 如果相同的標頭檔同時被 `headerFilter` 包含，又被 `excludeFilter` 排除，則指定的標頭檔將不會被包含在綁定中。
>
{style="note"}

### 匯入模組

如果 Objective-C 函式庫具有 Clang 模組，請使用 `modules` 屬性來指定要匯入的模組：

```none
modules = UIKit
```

### 傳遞編譯器與連結器選項

使用 `compilerOpts` 屬性將選項傳遞給 C 編譯器，該編譯器會在底層用於分析標頭檔。若要將選項傳遞給連結器，該連結器用於連結最終的可執行檔，請使用 `linkerOpts`。例如：

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

您也可以指定只適用於特定目標的目標特定選項：

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

透過此配置，標頭檔在 Linux 上使用 `-DBAR=bar -DFOO=foo1` 進行分析，在 macOS 上使用 `-DBAR=bar -DFOO=foo2` 進行分析。請注意，任何定義檔選項都可以同時具有通用部分和平台特定部分。

### 忽略特定函式

使用 `excludedFunctions` 屬性來指定應被忽略的函式名稱列表。如果標頭檔中宣告的函式不能保證可呼叫，且很難或不可能自動判斷，這會很有用。您也可以使用此屬性來解決互通性本身的問題。

### 包含靜態函式庫

> 此功能為 [實驗性功能](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。僅用於評估目的。
>
{style="warning"}

有時，將靜態函式庫與您的產品一起發布會更方便，而不是假設它在用戶環境中可用。若要將靜態函式庫包含到 `.klib` 中，請使用 `staticLibraries` 和 `libraryPaths` 屬性：

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

給定上述程式碼片段，cinterop 工具會在 `/opt/local/lib` 和 `/usr/local/opt/curl/lib` 中搜尋 `libfoo.a`，如果找到，則將函式庫二進位檔包含在 `klib` 中。

當您在程式中以這種方式使用 `klib` 時，函式庫會自動連結。

### 配置列舉生成

使用 `strictEnums` 屬性將列舉生成為 Kotlin 列舉，或使用 `nonStrictEnums` 將其生成為整數值。如果一個列舉既不包含在這些列表中的任何一個，則會根據啟發式方法生成。

### 設定字串轉換

使用 `noStringConversion` 屬性來禁用 `const char*` 函式參數自動轉換為 Kotlin `String`s。

### 允許呼叫非指定初始化器

預設情況下，Kotlin/Native 編譯器不允許將非指定 Objective-C 初始化器作為 `super()` 建構函式呼叫。如果函式庫中未正確標記指定 Objective-C 初始化器，此行為可能會帶來不便。若要禁用這些編譯器檢查，請使用 `disableDesignatedInitializerChecks` 屬性。

### 處理 Objective-C 異常

預設情況下，如果 Objective-C 異常達到 Objective-C 到 Kotlin 互通邊界並進入 Kotlin 程式碼，程式將會崩潰。

若要將 Objective-C 異常傳播到 Kotlin，請啟用 `foreignExceptionMode = objc-wrap` 屬性的包裝功能。在這種情況下，Objective-C 異常會被轉換為具有 `ForeignException` 型別的 Kotlin 異常。

### 幫助解決連結器錯誤

當 Kotlin 函式庫依賴於 C 或 Objective-C 函式庫時，例如使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，可能會發生連結器錯誤。如果依賴的函式庫未在機器上本地安裝或未在專案建置腳本中明確配置，則會出現「Framework not found」錯誤。

如果您是函式庫作者，可以透過自訂訊息幫助用戶解決連結器錯誤。為此，請在 `.def` 檔案中新增 `userSetupHint=message` 屬性，或將 `-Xuser-setup-hint` 編譯器選項傳遞給 `cinterop`。

### 新增自訂宣告

有時需要在產生綁定之前向函式庫中新增自訂 C 宣告 (例如，針對 [巨集](native-c-interop.md#macros))。除了建立一個包含這些宣告的額外標頭檔之外，您可以直接將它們包含在 `.def` 檔案的末尾，在一個分隔行之後，該分隔行只包含分隔序列 `---`：

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

請注意，`.def` 檔案的這部分被視為標頭檔的一部分，因此帶有函式主體的函式應宣告為 `static`。宣告會在包含 `headers` 列表中的檔案後解析。

## 使用命令列產生綁定

除了定義檔之外，您還可以透過在 `cinterop` 呼叫中將相應屬性作為選項傳遞，來指定要包含在綁定中的內容。

以下是一個生成 `png.klib` 編譯函式庫的指令範例：

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

請注意，生成的綁定通常是平台特定的，因此如果您正在為多個目標開發，則需要重新生成這些綁定。

* 對於未包含在 sysroot 搜尋路徑中的主機函式庫，可能需要標頭檔。
* 對於帶有配置腳本的典型 UNIX 函式庫，`compilerOpts` 可能會包含配置腳本帶有 `--cflags` 選項的輸出 (可能沒有確切路徑)。
* 帶有 `--libs` 的配置腳本的輸出可以傳遞給 `linkerOpts` 屬性。

## 後續步驟

* [C 互通性的綁定](native-c-interop.md#bindings)
* [與 Swift/Objective-C 的互通性](native-objc-interop.md)