[//]: # (title: Kotlin 編譯器選項)

Kotlin 的每個發行版都包含對應支援目標的編譯器：JVM、JavaScript 以及適用於[支援平台](native-overview.md#target-platforms)的原生二進位檔。

這些編譯器用於：
*   當您點擊 Kotlin 專案的 **Compile**（編譯）或 **Run**（執行）按鈕時，由 IDE 使用。
*   當您在主控台或 IDE 中呼叫 `gradle build` 時，由 Gradle 使用。
*   當您在主控台或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時，由 Maven 使用。

您也可以依照[使用命令列編譯器](command-line.md)教學中所述，從命令列手動執行 Kotlin 編譯器。

## 編譯器選項

Kotlin 編譯器有多種選項，用於調整編譯過程。不同目標的編譯器選項及其描述列於此頁。

設定編譯器選項及其值（*編譯器參數*）有幾種方法：
*   在 IntelliJ IDEA 中，於 **Settings/Preferences**（設定/偏好設定） | **Build, Execution, Deployment**（建置、執行、部署） | **Compiler**（編譯器） | **Kotlin Compiler**（Kotlin 編譯器）中的 **Additional command line parameters**（額外命令列參數）文字方塊中寫入編譯器參數。
*   如果您使用 Gradle，請在 Kotlin 編譯任務的 `compilerOptions` 屬性中指定編譯器參數。詳情請參閱 [Gradle 編譯器選項](gradle-compiler-options.md#how-to-define-options)。
*   如果您使用 Maven，請在 Maven 外掛程式節點的 `<configuration>` 元素中指定編譯器參數。詳情請參閱 [Maven](maven.md#specify-compiler-options)。
*   如果您執行命令列編譯器，請將編譯器參數直接加入公用程式呼叫中，或將其寫入 [引數檔](#argfile)。

    例如：

    ```bash
    $ kotlinc hello.kt -include-runtime -d hello.jar
    ```

    > 在 Windows 上，當您傳遞包含分隔字元（空白字元、`=`、`;`、`,`）的編譯器參數時，請使用雙引號 (`"`) 將這些參數括起來。
    > ```
    > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
    > ```
    {style="note"}

## 通用選項

以下選項對於所有 Kotlin 編譯器都是通用的。

### -version

顯示編譯器版本。

### -nowarn

在編譯期間抑制編譯器顯示警告。

### -Werror

將任何警告轉為編譯錯誤。

### -Wextra

啟用[額外宣告、表達式和型別編譯器檢查](whatsnew21.md#extra-compiler-checks)，如果為真，則會發出警告。

### -verbose

啟用詳細記錄輸出，其中包含編譯過程的詳細資訊。

### -script

評估 Kotlin 指令碼檔。當使用此選項呼叫時，編譯器會執行給定參數中的第一個 Kotlin 指令碼（`*.kts`）檔。

### -help (-h)

顯示使用資訊並退出。僅顯示標準選項。
要顯示進階選項，請使用 `-X`。

### -X

顯示進階選項的資訊並退出。這些選項目前不穩定：其名稱和行為可能在不另行通知的情況下更改。

### -kotlin-home _path_

指定 Kotlin 編譯器的自訂路徑，用於探索執行階段程式庫。

### -P plugin:pluginId:optionName=value

將選項傳遞給 Kotlin 編譯器外掛程式。
核心外掛程式及其選項列於文件中的[核心編譯器外掛程式](components-stability.md#core-compiler-plugins)部分。

### -language-version _version_

提供與指定 Kotlin 版本的原始碼相容性。

### -api-version _version_

僅允許使用來自指定 Kotlin 捆綁程式庫版本的宣告。

### -progressive

為編譯器啟用[漸進模式](whatsnew13.md#progressive-mode)。

在漸進模式下，對不穩定程式碼的棄用和錯誤修正會立即生效，而無需經歷平穩的遷移週期。
以漸進模式編寫的程式碼向後相容；但是，以非漸進模式編寫的程式碼可能會在漸進模式下導致編譯錯誤。

### @argfile

從給定檔案讀取編譯器選項。此類檔案可以包含帶有值和原始檔路徑的編譯器選項。選項和路徑應由空白字元分隔。例如：

```
-include-runtime -d hello.jar hello.kt
```

若要傳遞包含空白字元的值，請使用單引號（**'**）或雙引號（**"**）將其括起來。如果值中包含引號，請使用反斜線（**\\**）逸出它們。
```
-include-runtime -d 'My folder'
```

您也可以傳遞多個引數檔，例如，將編譯器選項與原始檔分開。

```bash
$ kotlinc @compiler.options @classes
```

如果檔案位於與目前目錄不同的位置，請使用相對路徑。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

啟用使用[需要選擇性加入 (opt-in)](opt-in-requirements.md) 的 API，並帶有給定完整限定名稱的需求註解。

### -Xsuppress-warning

[在整個專案中全域抑制](whatsnew21.md#global-warning-suppression)特定警告，例如：

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVM 編譯器選項

Kotlin 適用於 JVM 的編譯器將 Kotlin 原始檔編譯成 Java 類別檔。用於 Kotlin 到 JVM 編譯的命令列工具是 `kotlinc` 和 `kotlinc-jvm`。您也可以使用它們來執行 Kotlin 指令碼檔。

除了[通用選項](#common-options)外，Kotlin/JVM 編譯器還具有以下選項。

### -classpath _path_ (-cp _path_)

在指定路徑中搜尋類別檔。使用系統路徑分隔符號（Windows 上為 **;**，macOS/Linux 上為 **:**）分隔類別路徑中的元素。類別路徑可以包含檔案和目錄路徑、ZIP 或 JAR 檔。

### -d _path_

將產生出的類別檔放置到指定位置。該位置可以是目錄、ZIP 或 JAR 檔。

### -include-runtime

將 Kotlin 執行階段包含到產生出的 JAR 檔中。使產生出的歸檔可在任何支援 Java 的環境中執行。

### -jdk-home _path_

如果自訂 JDK 主目錄與預設的 `JAVA_HOME` 不同，則使用它並將其包含到類別路徑中。

### -Xjdk-release=version

指定產生出的 JVM 位元碼的目標版本。將類別路徑中 JDK 的 API 限制為指定的 Java 版本。自動設定 [`-jvm-target version`](#jvm-target-version)。
可能的值為 `1.8`、`9`、`10`、...、`21`。

> 此選項[不保證](https://youtrack.jetbrains.com/issue/KT-29974)對每個 JDK 發行版都有效。
>
{style="note"}

### -jvm-target _version_

指定產生出的 JVM 位元碼的目標版本。可能的值為 `1.8`、`9`、`10`、...、`21`。
預設值為 `%defaultJvmTargetVersion%`。

### -java-parameters

為 Java 1.8 方法參數上的反射產生中繼資料 (metadata)。

### -module-name _name_ (JVM)

為產生出的 `.kotlin_module` 檔設定自訂名稱。

### -no-jdk

不要自動包含 Java 執行階段到類別路徑中。

### -no-reflect

不要自動包含 Kotlin 反射 (`kotlin-reflect.jar`) 到類別路徑中。

### -no-stdlib (JVM)

不要自動包含 Kotlin/JVM 標準程式庫 (`kotlin-stdlib.jar`) 和 Kotlin 反射 (`kotlin-reflect.jar`) 到類別路徑中。

### -script-templates _classnames[,]_

指令碼定義範本類別。使用完整限定類別名稱並用逗號（**，**）分隔。

## Kotlin/JS 編譯器選項

Kotlin 適用於 JS 的編譯器將 Kotlin 原始檔編譯成 JavaScript 程式碼。用於 Kotlin 到 JS 編譯的命令列工具是 `kotlinc-js`。

除了[通用選項](#common-options)外，Kotlin/JS 編譯器還具有以下選項。

### -target {es5|es2015}

為指定的 ECMA 版本產生 JS 檔。

### -libraries _path_

Kotlin 程式庫的路徑，包含 `.meta.js` 和 `.kjsm` 檔，並由系統路徑分隔符號分隔。

### -main _{call|noCall}_

定義 `main` 函式是否應在執行時被呼叫。

### -meta-info

產生包含中繼資料 (metadata) 的 `.meta.js` 和 `.kjsm` 檔。在建立 JS 程式庫時使用此選項。

### -module-kind {umd|commonjs|amd|plain}

編譯器產生的 JS 模組類型：

- `umd` - [通用模組定義 (Universal Module Definition)](https://github.com/umdjs/umd) 模組
- `commonjs` - [CommonJS](http://www.commonjs.org/) 模組
- `amd` - [非同步模組定義 (Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模組
- `plain` - 純 JS 模組

要了解更多關於不同類型的 JS 模組及其區別，請參閱[此](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)文章。

### -no-stdlib (JS)

不要自動將預設的 Kotlin/JS 標準程式庫 (stdlib) 包含到編譯依賴項中。

### -output _filepath_

設定編譯結果的目標檔。該值必須是包含檔名的 `.js` 檔路徑。

### -output-postfix _filepath_

將指定檔案的內容加入輸出檔的結尾。

### -output-prefix _filepath_

將指定檔案的內容加入輸出檔的開頭。

### -source-map

產生原始碼映射 (Source Map)。

### -source-map-base-dirs _path_

使用指定的路徑作為基礎目錄。基礎目錄用於計算原始碼映射中的相對路徑。

### -source-map-embed-sources _{always|never|inlining}_

將原始檔嵌入原始碼映射 (Source Map)。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

將您在 Kotlin 程式碼中宣告的變數和函式名稱加入原始碼映射 (Source Map)。

| 設定 | 描述 | 範例輸出 |
|---|---|---|
| `simple-names` | 加入變數名稱和簡單函式名稱。（預設） | `main` |
| `fully-qualified-names` | 加入變數名稱和完整限定函式名稱。 | `com.example.kjs.playground.main` |
| `no` | 不加入任何變數或函式名稱。 | 不適用 |

### -source-map-prefix

將指定的字首加入原始碼映射中的路徑。

## Kotlin/Native 編譯器選項

Kotlin/Native 編譯器將 Kotlin 原始檔編譯成適用於[支援平台](native-overview.md#target-platforms)的原生二進位檔。用於 Kotlin/Native 編譯的命令列工具是 `kotlinc-native`。

除了[通用選項](#common-options)外，Kotlin/Native 編譯器還具有以下選項。

### -enable-assertions (-ea)

在產生出的程式碼中啟用執行階段斷言。

### -g

啟用發出除錯資訊。此選項會降低最佳化層級，不應與 [`-opt`](#opt) 選項結合使用。

### -generate-test-runner (-tr)

產生用於執行專案中單元測試的應用程式。

### -generate-no-exit-test-runner (-trn)

產生用於執行單元測試且無明確程序退出的應用程式。

### -include-binary _path_ (-ib _path_)

將外部二進位檔打包到產生出的 klib 檔中。

### -library _path_ (-l _path_)

連結程式庫。要了解如何在 Kotlin/Native 專案中使用程式庫，請參閱 [Kotlin/Native 程式庫](native-libraries.md)。

### -library-version _version_ (-lv _version_)

設定程式庫版本。

### -list-targets

列出可用的硬體目標。

### -manifest _path_

提供 manifest 附加檔。

### -module-name _name_ (Native)

為編譯模組指定名稱。
此選項也可用於為匯出到 Objective-C 的宣告指定名稱字首：
[如何為我的 Kotlin 框架指定自訂的 Objective-C 字首/名稱？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含原生位元碼程式庫。

### -no-default-libs

禁用將使用者程式碼與隨編譯器散佈的預建[平台程式庫](native-platform-libs.md)連結。

### -nomain

假設 `main` 進入點由外部程式庫提供。

### -nopack

不要將程式庫打包成 klib 檔。

### -linker-option

在二進位建置期間將引數傳遞給連結器。這可用於連結到某些原生程式庫。

### -linker-options _args_

在二進位建置期間將多個引數傳遞給連結器。以空白字元分隔引數。

### -nostdlib

不要連結標準程式庫 (stdlib)。

### -opt

啟用編譯最佳化並產生具有更好執行階段效能的二進位檔。不建議將其與 [`-g`](#g) 選項結合使用，後者會降低最佳化層級。

### -output _name_ (-o _name_)

設定輸出檔的名稱。

### -entry _name_ (-e _name_)

指定完整限定的進入點名稱。

### -produce _output_ (-p _output_)

指定輸出檔類型：

- `program` (程式)
- `static` (靜態)
- `dynamic` (動態)
- `framework` (框架)
- `library` (程式庫)
- `bitcode` (位元碼)

### -repo _path_ (-r _path_)

程式庫搜尋路徑。有關更多資訊，請參閱[程式庫搜尋順序](native-libraries.md#library-search-sequence)。

### -target _target_

設定硬體目標。要查看可用目標列表，請使用 [`-list-targets`](#list-targets) 選項。