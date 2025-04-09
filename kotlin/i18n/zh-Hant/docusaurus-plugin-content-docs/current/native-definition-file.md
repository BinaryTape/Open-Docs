---
title: 定義檔
---
Kotlin/Native 讓你能夠使用 C 和 Objective-C 函式庫，從而在 Kotlin 中使用它們的功能。
一個名為 cinterop 的特殊工具會取得 C 或 Objective-C 函式庫，並產生相應的 Kotlin 綁定 (Kotlin bindings)，
以便像平常一樣在 Kotlin 程式碼中使用該函式庫的方法。

為了產生這些綁定，每個函式庫都需要一個定義檔，通常與函式庫同名。
這是一個屬性檔，它精確地描述了應該如何使用該函式庫。請參閱完整的[可用屬性清單](#properties)。

以下是使用專案時的一般工作流程：

1. 建立一個 `.def` 檔案，描述要包含在綁定中的內容。
2. 在 Kotlin 程式碼中使用產生的綁定。
3. 執行 Kotlin/Native 編譯器以產生最終的可執行檔。

## 建立和設定定義檔

讓我們建立一個定義檔，並為 C 函式庫產生綁定：

1. 在您的 IDE 中，選擇 `src` 資料夾，並使用 **File | New | Directory** 建立一個新的目錄。
2. 將新目錄命名為 `nativeInterop/cinterop`。
   
   這是 `.def` 檔案位置的預設慣例，但如果使用不同的位置，可以在 `build.gradle.kts` 檔案中覆寫它。
3. 選擇新的子資料夾，並使用 **File | New | File** 建立一個 `png.def` 檔案。
4. 新增必要的屬性：

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers` 是要產生 Kotlin 存根 (Kotlin stubs) 的標頭檔清單。您可以將多個檔案新增到此條目，
     並用空格分隔每個檔案。在本例中，只有 `png.h`。被引用的檔案需要位於指定的路徑上（在本例中為 `/usr/include/png`）。
   * `headerFilter` 顯示了具體包含的內容。在 C 中，當一個檔案使用 `#include` 指令引用另一個檔案時，也會包含所有標頭。
     有時這不是必需的，您可以新增此參數
     [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 進行調整。

     如果您不想將外部依賴項（例如系統 `stdint.h` 標頭）提取到互通性 (interop) 函式庫中，可以使用 `headerFilter`。
     此外，它對於函式庫大小優化和修復系統與提供的 Kotlin/Native 編譯環境之間潛在的衝突可能很有用。

   * 如果需要修改特定平台的行為，可以使用類似 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式，
     將特定於平台的值提供給選項。在本例中，它們是 macOS
     （`.osx` 後綴）和 Linux（`.linux` 後綴）。也可以使用沒有後綴的參數
     （例如，`linkerOpts=`），並將其應用於所有平台。

5. 若要產生綁定，請點擊通知中的 **Sync Now** 來同步 Gradle 檔案。

   <img src="/img/gradle-sync.png" alt="Synchronize the Gradle files" style={{verticalAlign: 'middle'}}/>

在綁定產生後，IDE 可以將它們用作原生函式庫的代理檢視。

:::note
您還可以使用命令列中的 [cinterop 工具](#generate-bindings-using-command-line) 來設定綁定產生。

## 屬性 (Properties)

以下是您可以在定義檔中使用的完整屬性清單，以調整產生的二進位檔案的內容。
有關更多資訊，請參閱下面的相應章節。

| **屬性 (Property)**                                                                   | **描述 (Description)**                                                                                                                                                                                                 |
|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 要包含在綁定中的函式庫標頭清單。                                                                                                                                                                                        |
| [`modules`](#import-modules)                                                        | 要包含在綁定中的 Objective-C 函式庫中的 Clang 模組清單。                                                                                                                                                              |
| `language`                                                                          | 指定語言。預設使用 C；如果需要，請變更為 `Objective-C`。                                                                                                                                                                   |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 工具傳遞給 C 編譯器的編譯器選項。                                                                                                                                                                              |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 工具傳遞給連結器的連結器選項。                                                                                                                                                                                |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 應該忽略的函式名稱的空格分隔清單。                                                                                                                                                                                      |                                              
| `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| [`staticLibraries`](#include-a-static-library)                                      | [實驗性 (Experimental)](components-stability#stability-levels-explained)。將靜態函式庫包含到 `.klib` 中。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [實驗性 (Experimental)](components-stability#stability-levels-explained)。cinterop 工具在其中搜尋要包含在 `.klib` 中的函式庫的目錄的空格分隔清單。                                                                       |
| `packageName`                                                                       | 產生的 Kotlin API 的套件前綴。                                                                                                                                                                                        |
| [`headerFilter`](#filter-headers-by-globs)                                          | 使用 glob 模式篩選標頭，並且僅在匯入函式庫時包含它們。                                                                                                                                                                  |
| [`excludeFilter`](#exclude-headers)                                                 | 匯入函式庫時排除特定的標頭，並且優先於 `headerFilter`。                                                                                                                                                                 |
| [`strictEnums`](#configure-enums-generation)                                        | 應該產生為 [Kotlin 列舉 (Kotlin enums)](enum-classes) 的列舉的空格分隔清單。                                                                                                                                      |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 應該產生為整數值的列舉的空格分隔清單。                                                                                                                                                                                |
| [`noStringConversion`](#set-up-string-conversion)                                   | 其 `const char*` 參數不應自動轉換為 Kotlin `String` 的函式的空格分隔清單。                                                                                                                                         |
| `allowedOverloadsForCFunctions`                                                     | 預設情況下，假定 C 函式具有唯一的名稱。如果多個函式具有相同的名稱，則僅選擇一個。但是，您可以透過在 `allowedOverloadsForCFunctions` 中指定這些函式來變更此設定。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 停用編譯器檢查，該檢查不允許將非指定的 Objective-C 初始化器作為 `super()` 建構子呼叫。                                                                                                                             |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | 使用 `ForeignException` 類型將來自 Objective-C 程式碼的例外狀況包裝到 Kotlin 例外狀況中。                                                                                                                             |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 新增自訂訊息，例如，以協助使用者解決連結器錯誤。                                                                                                                                                                        |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

除了屬性清單外，您還可以在定義檔中包含[自訂宣告](#add-custom-declarations)。

### 匯入標頭 (Import headers)

如果 C 函式庫沒有 Clang 模組，而是由一組標頭組成，請使用 `headers` 屬性來指定應匯入的標頭：

```none
headers = curl/curl.h
```

#### 使用 glob 模式篩選標頭 (Filter headers by globs)

您可以使用來自 `.def` 檔案的篩選屬性，依據 glob 模式篩選標頭。若要包含來自標頭的宣告，
請使用 `headerFilter` 屬性。如果標頭符合任何 glob 模式，則其宣告將包含在綁定中。

glob 模式會套用到相對於適當的包含路徑元素的標頭路徑，
例如，`time.h` 或 `curl/curl.h`。因此，如果通常使用 `#include <SomeLibrary/Header.h>` 包含該函式庫，
則您可以使用以下篩選器篩選標頭：

```none
headerFilter = SomeLibrary/**
```

如果未提供 `headerFilter`，則會包含所有標頭。但是，我們鼓勵您使用 `headerFilter`
並盡可能精確地指定 glob 模式。在這種情況下，產生的函式庫僅包含必要的宣告。
它可以幫助避免在開發環境中升級 Kotlin 或工具時出現的各種問題。

#### 排除標頭 (Exclude headers)

若要排除特定的標頭，請使用 `excludeFilter` 屬性。它可以有助於移除冗餘或有問題的
標頭並優化編譯，因為來自指定標頭的宣告不會包含在綁定中：

```none
excludeFilter = SomeLibrary/time.h
```

如果相同的標頭同時包含在 `headerFilter` 中，並且排除在 `excludeFilter` 中，則指定的標頭將
不會包含在綁定中。

:::

### 匯入模組 (Import modules)

如果 Objective-C 函式庫具有 Clang 模組，請使用 `modules` 屬性來指定要匯入的模組：

```none
modules = UIKit
```

### 傳遞編譯器和連結器選項 (Pass compiler and linker options)

使用 `compilerOpts` 屬性將選項傳遞給 C 編譯器，C 編譯器用於在後端分析標頭。
若要將選項傳遞給連結器，連結器用於連結最終的可執行檔，請使用 `linkerOpts`。例如：

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

您還可以指定僅適用於特定目標的目標特定選項：

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

使用此設定，標頭在 Linux 上使用 `-DBAR=bar -DFOO=foo1` 進行分析，在 macOS 上使用 `-DBAR=bar -DFOO=foo2`
進行分析。請注意，任何定義檔選項都可以同時具有通用部分和平台特定部分。

### 忽略特定的函式 (Ignore specific functions)

使用 `excludedFunctions` 屬性來指定應忽略的函式名稱清單。如果標頭中宣告的函式不能保證可呼叫，
並且很難或無法自動確定這一點，則這可能很有用。您也可以使用此屬性來解決
互通性 (interop) 本身中的錯誤。

### 包含靜態函式庫 (Include a static library)

:::caution
此功能是[實驗性 (Experimental)](components-stability#stability-levels-explained)。它可能隨時被刪除或變更。
僅將其用於評估目的。

:::

有時，運送帶有您的產品的靜態函式庫比假設它在
使用者的環境中可用更方便。若要將靜態函式庫包含到 `.klib` 中，請使用 `staticLibrary` 和 `libraryPaths` 屬性：

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

當給定以上程式碼片段時，cinterop 工具會在 `/opt/local/lib` 和 `/usr/local/opt/curl/lib` 中搜尋 `libfoo.a`，
如果找到，則將函式庫二進位檔案包含在 `klib` 中。

在您的程式中使用像這樣的 `klib` 時，該函式庫會自動連結。

### 設定列舉產生 (Configure enums generation)

使用 `strictEnums` 屬性將列舉產生為 Kotlin 列舉 (Kotlin enums)，或使用 `nonStrictEnums` 將它們產生為整數值。
如果列舉未包含在這些清單中的任何一個中，則會根據啟發式方法產生它。

### 設定字串轉換 (Set up string conversion)

使用 `noStringConversion` 屬性來停用自動將 `const char*` 函式參數轉換為
Kotlin `String`。

### 允許呼叫非指定的初始化器 (Allow calling a non-designated initializer)

預設情況下，Kotlin/Native 編譯器不允許將非指定的 Objective-C 初始化器作為 `super()`
建構子呼叫。如果指定的 Objective-C 初始化器未在
函式庫中正確標記，則此行為可能會很不方便。若要停用這些編譯器檢查，請使用 `disableDesignatedInitializerChecks` 屬性。

### 處理 Objective-C 例外狀況 (Handle Objective-C exceptions)

預設情況下，如果 Objective-C 例外狀況到達 Objective-C 到 Kotlin 互通性 (interop) 邊界並到達
Kotlin 程式碼，則程式會崩潰。

若要將 Objective-C 例外狀況傳播到 Kotlin，請啟用使用 `foreignExceptionMode = objc-wrap` 屬性進行包裝。
在這種情況下，Objective-C 例外狀況會轉換為取得 `ForeignException` 類型的 Kotlin 例外狀況。

#### 協助解決連結器錯誤 (Help resolve linker errors)

當 Kotlin 函式庫依賴於 C 或 Objective-C 函式庫時，可能會發生連結器錯誤，例如，使用
[CocoaPods 整合](native-cocoapods)。如果依賴的函式庫未在本機上安裝或在專案組建腳本中明確設定，
則會發生「找不到 Framework」錯誤。

如果您是函式庫作者，則可以使用自訂訊息協助您的使用者解決連結器錯誤。
為此，請將 `userSetupHint=message` 屬性新增到您的 `.def` 檔案，或將 `-Xuser-setup-hint` 編譯器選項傳遞給
`cinterop`。

### 新增自訂宣告 (Add custom declarations)

有時需要在產生綁定之前將自訂 C 宣告新增到函式庫（例如，對於[巨集](native-c-interop#macros)）。
您可以直接將它們包含到 `.def` 檔案的末尾，而不是建立帶有這些宣告的額外標頭檔，
在包含僅包含分隔符序列 `---` 的分隔行的後面：

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

請注意，`.def` 檔案的這部分被視為標頭檔的一部分，因此帶有主體的函式應宣告為 `static`。
在包含來自 `headers` 清單的檔案之後，會分析宣告。

## 使用命令列產生綁定 (Generate bindings using command line)

除了定義檔外，您還可以透過在 `cinterop` 呼叫中將相應的屬性作為選項傳遞，來指定要包含在綁定中的內容。

以下是產生已編譯的 `png.klib` 函式庫的命令範例：

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

請注意，產生的綁定通常是平台特定的，因此如果您是為多個目標開發，
則需要重新產生綁定。

* 對於未包含在 sysroot 搜尋路徑中的主機函式庫，可能需要標頭。
* 對於具有設定腳本的典型 UNIX 函式庫，`compilerOpts` 可能包含帶有 `--cflags` 選項（可能沒有精確路徑）的
  設定腳本的輸出。
* 帶有 `--libs` 的設定腳本的輸出可以傳遞給 `linkerOpts` 屬性。

## 接下來做什麼 (What's next)

* [C 互通性的綁定 (Bindings for C-interoperability)](native-c-interop#bindings)
* [與 Swift/Objective-C 的互通性 (Interoperability with Swift/Objective-C)](native-objc-interop)
  ```