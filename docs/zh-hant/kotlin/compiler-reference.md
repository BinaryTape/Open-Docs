---
title: "Kotlin 編譯器選項"
---
Kotlin 的每個版本都包含適用於支援目標的編譯器：
JVM、JavaScript 和適用於[支援平台](native-overview#target-platforms)的原生二進位檔。

這些編譯器由以下項目使用：
* IDE，當您點擊 Kotlin 專案的「__Compile__（編譯）」或「__Run__（執行）」按鈕時。
* Gradle，當您在控制台或 IDE 中呼叫 `gradle build` 時。
* Maven，當您在控制台或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時。

您也可以從命令行手動執行 Kotlin 編譯器，如[使用命令行編譯器](command-line)教學課程中所述。

## 編譯器選項 (Compiler options)

Kotlin 編譯器具有許多選項可用於調整編譯過程。
此頁面列出了不同目標的編譯器選項，以及每個選項的描述。

有多種方法可以設定編譯器選項及其值（_編譯器引數_）：
* 在 IntelliJ IDEA 中，在**Settings/Preferences（設定/偏好設定）** | **Build, Execution, Deployment（建置、執行、部署）** | **Compiler（編譯器）** | **Kotlin Compiler（Kotlin 編譯器）**中的 **Additional command line parameters（其他命令行參數）**文字框中輸入編譯器引數。
* 如果您使用 Gradle，請在 Kotlin 編譯任務的 `compilerOptions` 屬性中指定編譯器引數。
有關詳細資訊，請參閱 [Gradle 編譯器選項 (Gradle compiler options)](gradle-compiler-options#how-to-define-options)。
* 如果您使用 Maven，請在 Maven 外掛程式節點的 `<configuration>` 元素中指定編譯器引數。
有關詳細資訊，請參閱 [Maven](maven#specify-compiler-options)。
* 如果您執行命令行編譯器，請將編譯器引數直接新增到公用程式呼叫或將它們寫入 [argfile](#argfile)。

例如：

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

:::note
在 Windows 上，當您傳遞包含分隔符號字元（空格、`=`、`;`、`,`）的編譯器引數時，請用雙引號（`"`）括住這些引數。
```
$ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
```

:::

## 常用選項 (Common options)

以下選項是所有 Kotlin 編譯器通用的。

### -version

顯示編譯器版本。

### -nowarn

阻止編譯器在編譯期間顯示警告。

### -Werror

將任何警告轉換為編譯錯誤。

### -Wextra

啟用[額外的宣告、表達式和類型編譯器檢查](whatsnew21#extra-compiler-checks)，如果為 true，則發出警告。

### -verbose

啟用詳細記錄輸出，其中包括編譯過程的詳細資訊。

### -script

評估 Kotlin 腳本檔案。 使用此選項呼叫時，編譯器會執行給定引數中的第一個 Kotlin 腳本 (`*.kts`) 檔案。

### -help (-h)

顯示用法資訊並退出。 僅顯示標準選項。
要顯示進階選項，請使用 `-X`。

### -X

顯示有關進階選項的資訊並退出。 這些選項目前不穩定：
它們的名稱和行為可能會在沒有通知的情況下更改。

### -kotlin-home _path_

指定 Kotlin 編譯器的自定義路徑，用於發現執行時函式庫。

### -P plugin:pluginId:optionName=value

將選項傳遞給 Kotlin 編譯器外掛程式。
核心外掛程式及其選項列在文件中的 [核心編譯器外掛程式 (Core compiler plugins)](components-stability#core-compiler-plugins) 部分。

### -language-version _version_

提供與指定 Kotlin 版本的原始碼相容性。

### -api-version _version_

允許僅使用來自指定 Kotlin 版本捆綁函式庫的宣告。

### -progressive

為編譯器啟用[漸進模式](whatsnew13#progressive-mode)。

在漸進模式下，不穩定程式碼的棄用和錯誤修復會立即生效，
而不是經過正常的移轉週期。
以漸進模式編寫的程式碼是向後相容的； 但是，以
非漸進模式編寫的程式碼可能會在漸進模式下導致編譯錯誤。

### @argfile

從給定檔案讀取編譯器選項。 此類檔案可以包含帶有值的編譯器選項
和原始碼檔案的路徑。 選項和路徑應以空格分隔。 例如：

```
-include-runtime -d hello.jar hello.kt
```

要傳遞包含空格的值，請用單引號（**'**）或雙引號（**"**）將其括起來。 如果值包含
其中的引號，請使用反斜線（**\\**）將其逸出。
```
-include-runtime -d 'My folder'
```

您也可以傳遞多個引數檔案，例如，將編譯器選項與原始碼檔案分開。

```bash
$ kotlinc @compiler.options @classes
```

如果檔案位於與目前目錄不同的位置，請使用相對路徑。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

啟用 [需要選擇加入 (requires opt-in)](opt-in-requirements) 的 API 的用法，並使用給定完整名稱的需求註解。

### -Xsuppress-warning

[在整個專案中全域性](whatsnew21#global-warning-suppression) 抑制特定警告，例如：

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVM 編譯器選項 (Compiler options)

用於 JVM 的 Kotlin 編譯器將 Kotlin 原始碼檔案編譯為 Java 類別檔案。
用於 Kotlin 到 JVM 編譯的命令行工具是 `kotlinc` 和 `kotlinc-jvm`。
您也可以使用它們來執行 Kotlin 腳本檔案。

除了[常用選項](#common-options)外，Kotlin/JVM 編譯器還具有以下列出的選項。

### -classpath _path_ (-cp _path_)

在指定路徑中搜尋類別檔案。 使用系統路徑分隔符號分隔類別路徑的元素（Windows 上為 **;**，macOS/Linux 上為 **:**）。
類別路徑可以包含檔案和目錄路徑、ZIP 或 JAR 檔案。

### -d _path_

將產生的類別檔案放入指定位置。 該位置可以是目錄、ZIP 或 JAR 檔案。

### -include-runtime

將 Kotlin 執行時包含到產生的 JAR 檔案中。 使產生的封存檔可在任何啟用 Java 的環境上執行。

### -jdk-home _path_

如果與預設 `JAVA_HOME` 不同，則使用自定義 JDK 主目錄包含到類別路徑中。

### -Xjdk-release=version

指定產生的 JVM 位元組碼的目標版本。 將類別路徑中 JDK 的 API 限制為指定的 Java 版本。
自動設定 [`-jvm-target version`](#jvm-target-version)。
可能的值為 `1.8`、`9`、`10`、...、`21`。

:::note
無法[保證](https://youtrack.jetbrains.com/issue/KT-29974)此選項對每個 JDK 發行版都有效。

:::

### -jvm-target _version_

指定產生的 JVM 位元組碼的目標版本。 可能的值為 `1.8`、`9`、`10`、...、`21`。
預設值為 `1.8`。

### -java-parameters

產生 Java 1.8 反射的元數據，用於方法參數。

### -module-name _name_ (JVM)

為產生的 `.kotlin_module` 檔案設定自定義名稱。

### -no-jdk

不要自動將 Java 執行時包含到類別路徑中。

### -no-reflect

不要自動將 Kotlin 反射 (`kotlin-reflect.jar`) 包含到類別路徑中。

### -no-stdlib (JVM)

不要自動將 Kotlin/JVM stdlib (`kotlin-stdlib.jar`) 和 Kotlin 反射 (`kotlin-reflect.jar`)
包含到類別路徑中。

### -script-templates _classnames[,]_

腳本定義模板類別。 使用完整類別名稱，並用逗號 (**,**) 分隔它們。

## Kotlin/JS 編譯器選項 (Compiler options)

用於 JS 的 Kotlin 編譯器將 Kotlin 原始碼檔案編譯為 JavaScript 程式碼。
用於 Kotlin 到 JS 編譯的命令行工具是 `kotlinc-js`。

除了[常用選項](#common-options)外，Kotlin/JS 編譯器還具有以下列出的選項。

### -target _\{es5|es2015\}_

為指定的 ECMA 版本產生 JS 檔案。

### -libraries _path_

帶有 `.meta.js` 和 `.kjsm` 檔案的 Kotlin 函式庫路徑，以系統路徑分隔符號分隔。

### -main _\{call|noCall\}_

定義是否應在執行時呼叫 `main` 函數。

### -meta-info

產生帶有元數據的 `.meta.js` 和 `.kjsm` 檔案。 建立 JS 函式庫時使用此選項。

### -module-kind _\{umd|commonjs|amd|plain\}_

編譯器產生的 JS 模組種類：

- `umd` - [通用模組定義 (Universal Module Definition)](https://github.com/umdjs/umd) 模組
- `commonjs` - [CommonJS](http://www.commonjs.org/) 模組
- `amd` - [異步模組定義 (Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模組
- `plain` - 普通 JS 模組

要了解有關不同種類的 JS 模組及其區別的更多資訊，
請參閱[這篇](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)文章。

### -no-stdlib (JS)

不要自動將預設 Kotlin/JS stdlib 包含到編譯依賴項中。

### -output _filepath_

設定編譯結果的目標檔案。 該值必須是 `.js` 檔案的路徑，包括其名稱。

### -output-postfix _filepath_

將指定檔案的內容新增到輸出檔案的末尾。

### -output-prefix _filepath_

將指定檔案的內容新增到輸出檔案的開頭。

### -source-map

產生原始碼對應表 (source map)。

### -source-map-base-dirs _path_

將指定路徑用作基準目錄。 基準目錄用於計算原始碼對應表中的相對路徑。

### -source-map-embed-sources _\{always|never|inlining\}_

將原始碼檔案嵌入到原始碼對應表中。

### -source-map-names-policy _\{simple-names|fully-qualified-names|no\}_

將您在 Kotlin 程式碼中宣告的變數和函數名稱新增到原始碼對應表中。

| 設定 | 描述 | 範例輸出 |
|---|---|---|
| `simple-names` | 新增變數名稱和簡單函數名稱。 （預設） | `main` |
| `fully-qualified-names` | 新增變數名稱和完整函數名稱。 | `com.example.kjs.playground.main` |
| `no` | 不新增變數或函數名稱。 | N/A |

### -source-map-prefix

將指定字首新增到原始碼對應表中的路徑。

## Kotlin/Native 編譯器選項 (Compiler options)

Kotlin/Native 編譯器將 Kotlin 原始碼檔案編譯為 [支援平台](native-overview#target-platforms) 的原生二進位檔。
用於 Kotlin/Native 編譯的命令行工具是 `kotlinc-native`。

除了[常用選項](#common-options)外，Kotlin/Native 編譯器還具有以下列出的選項。

### -enable-assertions (-ea)

在產生的程式碼中啟用執行時斷言。

### -g

啟用發出除錯資訊。 此選項降低了最佳化等級，不應與
[`-opt`](#opt) 選項結合使用。

### -generate-test-runner (-tr)

產生一個應用程式，用於從專案執行單元測試。

### -generate-no-exit-test-runner (-trn)

產生一個應用程式，用於在沒有明確進程退出的情況下執行單元測試。

### -include-binary _path_ (-ib _path_)

將外部二進位檔封裝在產生的 klib 檔案中。

### -library _path_ (-l _path_)

與函式庫連結。 要了解有關在 Kotlin/Native 專案中使用函式庫的資訊，請參閱
[Kotlin/Native 函式庫 (Kotlin/Native libraries)](native-libraries)。

### -library-version _version_ (-lv _version_)

設定函式庫版本。

### -list-targets

列出可用的硬體目標。

### -manifest _path_

提供 manifest addend 檔案。

### -module-name _name_ (Native)

指定編譯模組的名稱。
此選項還可用於指定匯出到 Objective-C 的宣告的名稱字首：
[如何為我的 Kotlin 框架指定自定義 Objective-C 字首/名稱？](native-faq#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含原生位元碼函式庫。

### -no-default-libs

停用將使用者程式碼與編譯器隨附的預先建置的[平台函式庫](native-platform-libs)連結。

### -nomain

假設 `main` 進入點由外部函式庫提供。

### -nopack

不要將函式庫封裝到 klib 檔案中。

### -linker-option

在二進位檔建置期間將引數傳遞給連結器。 這可用於與某些原生函式庫連結。

### -linker-options _args_

在二進位檔建置期間將多個引數傳遞給連結器。 用空格分隔引數。

### -nostdlib

不要與 stdlib 連結。

### -opt

啟用編譯最佳化並產生具有更好執行時效能的二進位檔。 不建議將其與
降低最佳化等級的 [`-g`](#g) 選項結合使用。

### -output _name_ (-o _name_)

設定輸出檔案的名稱。

### -entry _name_ (-e _name_)

指定限定進入點名稱。

### -produce _output_ (-p _output_)

指定輸出檔案種類：

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

函式庫搜尋路徑。 有關更多資訊，請參閱 [函式庫搜尋順序 (Library search sequence)](native-libraries#library-search-sequence)。

### -target _target_

設定硬體目標。 要查看可用目標的列表，請使用 [`-list-targets`](#list-targets) 選項。