[//]: # (title: 定義檔案)

Kotlin/Native 讓您能夠使用 C 和 Objective-C 函式庫，進而在 Kotlin 中運用其功能。
一個名為 cinterop 的特殊工具會讀取 C 或 Objective-C 函式庫，並產生相對應的 Kotlin 綁定，
如此一來，該函式庫的方法便能如同往常般在您的 Kotlin 程式碼中使用。

為了產生這些綁定，每個函式庫都需要一個定義檔案，其名稱通常與函式庫相同。
這是一個屬性檔案，精確描述了該函式庫應如何被使用。請參閱 [可用屬性](#properties) 的完整列表。

以下是專案工作的一般工作流程：

1.  建立一個 `.def` 檔案，描述綁定中應包含的內容。
2.  在您的 Kotlin 程式碼中使用已產生的綁定。
3.  執行 Kotlin/Native 編譯器以產生最終的可執行檔。

## 建立與設定定義檔案

讓我們建立一個定義檔案並為 C 函式庫產生綁定：

1.  在您的 IDE 中，選取 `src` 資料夾，並透過 **檔案 | 新增 | 目錄** 建立一個新目錄。
2.  將新目錄命名為 `nativeInterop/cinterop`。
    
    這是 `.def` 檔案位置的預設慣例，但如果您使用不同的位置，可以在 `build.gradle.kts` 檔案中覆寫它。
3.  選取新的子資料夾，並透過 **檔案 | 新增 | 檔案** 建立一個 `png.def` 檔案。
4.  新增必要的屬性：

    ```none
    headers = png.h
    headerFilter = png.h
    package = png
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
    ```

    *   `headers` 是用於產生 Kotlin 存根 (stub) 的標頭檔列表。您可以將多個檔案新增到此條目，每個檔案之間用空格分隔。在此情況下，僅為 `png.h`。引用的檔案需要位於指定的路徑上 (在此情況下，為 `/usr/include/png`)。
    *   `headerFilter` 顯示了確切包含的內容。在 C 語言中，當一個檔案透過 `#include` 指令引用另一個檔案時，所有標頭都會被包含。有時這並非必要，您可以新增此參數 [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 進行調整。

        如果您不希望將外部依賴項 (例如系統的 `stdint.h` 標頭檔) 引入互通函式庫，則可以使用 `headerFilter`。此外，它對於函式庫大小最佳化以及修復系統與所提供的 Kotlin/Native 編譯環境之間潛在的衝突可能很有用。

    *   如果需要修改特定平台的行為，您可以使用類似 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式，為選項提供平台特定的值。在此情況下，它們是 macOS (即 `.osx` 後綴) 和 Linux (即 `.linux` 後綴)。不帶後綴的參數也是可行的 (例如 `linkerOpts=`)，並會應用於所有平台。

5.  若要產生綁定，請在通知中點擊 **立即同步** (Sync Now) 來同步 Gradle 檔案。

    ![Synchronize the Gradle files](gradle-sync.png)

綁定產生後，IDE 可以將其作為原生函式庫的代理視圖使用。

> 您也可以透過在命令列中使用 [cinterop 工具](#generate-bindings-using-command-line) 來配置綁定產生。
> 
{style="tip"}

## 屬性

以下是您可以在定義檔案中使用的完整屬性列表，用於調整所產生二進位檔的內容。
有關更多資訊，請參閱以下對應部分。

| **屬性**                                                                        | **描述**                                                                                                                                                                                                          |
|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 函式庫中要包含在綁定中的標頭列表。                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | 要包含在綁定中的 Objective-C 函式庫的 Clang 模組列表。                                                                                                                                    |
| `language`                                                                          | 指定語言。預設使用 C；必要時變更為 `Objective-C`。                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 工具傳遞給 C 編譯器的編譯器選項。                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 工具傳遞給連結器的連結器選項。                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 以空白分隔的函式名稱列表，應被忽略。                                                                                                                                                         |
| [`staticLibraries`](#include-a-static-library)                                      | [實驗性](components-stability.md#stability-levels-explained)。將靜態函式庫包含到 `.klib` 中。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [實驗性](components-stability.md#stability-levels-explained)。以空白分隔的目錄列表，cinterop 工具在這些目錄中搜尋要包含在 `.klib` 中的函式庫。                                    |
| `packageName`                                                                       | 產生之 Kotlin API 的套件前綴。                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | 透過 glob 模式篩選標頭，僅在匯入函式庫時包含這些標頭。                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | 在匯入函式庫時排除特定的標頭，並優先於 `headerFilter`。                                                                                                                                                              |
| [`strictEnums`](#configure-enums-generation)                                        | 以空白分隔的列舉列表，應產生為 [Kotlin 列舉](enum-classes.md)。                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 以空白分隔的列舉列表，應產生為整數值。                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | 以空白分隔的函式列表，其 `const char*` 參數不應自動轉換為 Kotlin `String`。                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | 預設情況下，C 函式被認為具有唯一名稱。如果多個函式具有相同名稱，則只會選取其中一個。但是，您可以透過在 `allowedOverloadsForCFunctions` 中指定這些函式來更改此行為。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 停用不允許將非指定 Objective-C 初始化器作為 `super()` 建構子呼叫的編譯器檢查。                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | 將 Objective-C 程式碼中的例外情況封裝為 `ForeignException` 類型的 Kotlin 例外情況。                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 新增自訂訊息，例如協助使用者解決連結器錯誤。                                                                                                                                                 |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

除了屬性列表之外，您還可以在定義檔案中包含 [自訂宣告](#add-custom-declarations)。

### 匯入標頭

如果一個 C 函式庫沒有 Clang 模組，而是由一組標頭組成，請使用 `headers` 屬性來指定應匯入的標頭：

```none
headers = curl/curl.h
```

#### 依 glob 模式篩選標頭

您可以使用 `.def` 檔案中的篩選屬性，依 glob 模式篩選標頭。若要包含來自標頭的宣告，
請使用 `headerFilter` 屬性。如果標頭符合任何 glob 模式，其宣告將包含在綁定中。

Glob 模式會應用於相對於適當包含路徑元素的標頭路徑，
例如 `time.h` 或 `curl/curl.h`。因此，如果函式庫通常是透過 `#include <SomeLibrary/Header.h>` 包含的，
您可以使用以下篩選器來篩選標頭：

```none
headerFilter = SomeLibrary/**
```

如果未提供 `headerFilter`，則所有標頭都將被包含。然而，我們鼓勵您使用 `headerFilter`
並盡可能精確地指定 glob 模式。在此情況下，產生的函式庫將僅包含必要的宣告。
這有助於避免在升級 Kotlin 或開發環境中的工具時出現的各種問題。

#### 排除標頭

若要排除特定標頭，請使用 `excludeFilter` 屬性。這有助於移除冗餘或有問題的標頭並最佳化編譯，因為來自指定標頭的宣告不會包含在綁定中：

```none
excludeFilter = SomeLibrary/time.h
```

> 如果同一個標頭既透過 `headerFilter` 包含，又透過 `excludeFilter` 排除，則該標頭將不會包含在綁定中。
>
{style="note"}

### 匯入模組

如果 Objective-C 函式庫具有 Clang 模組，請使用 `modules` 屬性來指定要匯入的模組：

```none
modules = UIKit
```

### 傳遞編譯器與連結器選項

使用 `compilerOpts` 屬性將選項傳遞給 C 編譯器，C 編譯器在底層用於分析標頭。
若要將選項傳遞給連結最終可執行檔的連結器，請使用 `linkerOpts`。例如：

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

您也可以指定僅適用於特定目標的目標特定選項：

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

透過此配置，標頭在 Linux 上使用 `-DBAR=bar -DFOO=foo1` 進行分析，在 macOS 上使用 `-DBAR=bar -DFOO=foo2` 進行分析。
請注意，任何定義檔案選項都可以包含通用和平台特定兩部分。

### 忽略特定函式

使用 `excludedFunctions` 屬性指定應忽略的函式名稱列表。
如果標頭中宣告的函式不保證可呼叫，並且難以或不可能自動判斷，這會很有用。
您還可以使用此屬性來解決互通本身的一個錯誤。

### 包含靜態函式庫

<primary-label ref="experimental-general"/>

有時候，將靜態函式庫與您的產品一同發布會更方便，而不是假設它在使用者環境中可用。
若要將靜態函式庫包含到 `.klib` 中，請使用 `staticLibraries` 和 `libraryPaths` 屬性：

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

當提供上述程式碼片段時，cinterop 工具會在 `/opt/local/lib` 和 `/usr/local/opt/curl/lib` 中搜尋 `libfoo.a`，
如果找到，則會將函式庫二進位檔包含在 `klib` 中。

當在您的程式中使用這樣的 `klib` 時，函式庫會自動連結。

### 配置列舉產生

使用 `strictEnums` 屬性將列舉產生為 Kotlin 列舉，或使用 `nonStrictEnums` 將其產生為整數值。
如果列舉不包含在這兩個列表中的任何一個，它將根據啟發式方法產生。

### 設定字串轉換

使用 `noStringConversion` 屬性來停用 `const char*` 函式參數自動轉換為 Kotlin `String` 的功能。

### 允許呼叫非指定初始化器

預設情況下，Kotlin/Native 編譯器不允許將非指定的 Objective-C 初始化器作為 `super()` 建構子呼叫。
如果函式庫中沒有正確標記指定的 Objective-C 初始化器，此行為可能會帶來不便。
若要停用這些編譯器檢查，請使用 `disableDesignatedInitializerChecks` 屬性。

### 處理 Objective-C 例外

預設情況下，如果 Objective-C 例外達到 Objective-C 到 Kotlin 的互通邊界並進入 Kotlin 程式碼，程式將會崩潰。

若要將 Objective-C 例外傳播到 Kotlin，請透過 `foreignExceptionMode = objc-wrap` 屬性啟用封裝。
在此情況下，Objective-C 例外會被轉換為類型為 `ForeignException` 的 Kotlin 例外。

### 協助解決連結器錯誤

當 Kotlin 函式庫依賴於 C 或 Objective-C 函式庫時，可能會發生連結器錯誤，例如使用
[CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。如果依賴的函式庫未在機器上本地安裝或未在專案建置腳本中明確配置，則會出現「Framework not found」錯誤。

如果您是函式庫作者，可以透過自訂訊息協助使用者解決連結器錯誤。
為此，請將 `userSetupHint=message` 屬性新增到您的 `.def` 檔案中，或將 `-Xuser-setup-hint` 編譯器選項傳遞給 `cinterop`。

### 新增自訂宣告

有時需要先向函式庫新增自訂 C 宣告，然後再產生綁定 (例如，針對 [巨集](native-c-interop.md#macros))。
您可以不建立包含這些宣告的額外標頭檔，而是直接將它們包含到 `.def` 檔案的末尾，在一個僅包含分隔符序列 `---` 的分隔線之後：

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

請注意，`.def` 檔案的此部分被視為標頭檔的一部分，因此帶有函式主體的函式應宣告為 `static`。
宣告會在包含 `headers` 列表中的檔案後被解析。

## 使用命令列產生綁定

除了定義檔案之外，您還可以透過在 `cinterop` 呼叫中將對應屬性作為選項傳遞，來指定綁定中要包含的內容。

以下是產生 `png.klib` 編譯後函式庫的指令範例：

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

請注意，產生的綁定通常是平台特定的，因此如果您正在為多個目標開發，則需要重新產生綁定。

*   對於未包含在 sysroot 搜尋路徑中的主機函式庫，可能需要標頭。
*   對於帶有配置腳本的典型 UNIX 函式庫，`compilerOpts` 可能會包含帶有 `--cflags` 選項 (可能沒有確切路徑) 的配置腳本輸出。
*   帶有 `--libs` 的配置腳本輸出可以傳遞給 `linkerOpts` 屬性。

## 下一步

*   [C 互通性綁定](native-c-interop.md#bindings)
*   [與 Swift/Objective-C 的互通性](native-objc-interop.md)