[//]: # (title: Kotlin 編譯器選項)

每個 Kotlin 版本都包含針對其支援目標的編譯器：
JVM、JavaScript，以及針對 [支援平台](native-overview.md#target-platforms) 的原生二進位檔。

這些編譯器由以下工具使用：
* IDE，當您點擊 Kotlin 專案的 __編譯__ 或 __執行__ 按鈕時。
* Gradle，當您在命令列或 IDE 中呼叫 `gradle build` 時。
* Maven，當您在命令列或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時。

您也可以從命令列手動執行 Kotlin 編譯器，詳情請參閱 [使用命令列編譯器](command-line.md) 教學。

## 編譯器選項

Kotlin 編譯器有許多選項可用於客製化編譯過程。
本頁面列出了針對不同目標的編譯器選項及其說明。

有幾種方法可以設定編譯器選項及其值（_編譯器引數_）：
* 在 IntelliJ IDEA 中，於 **設定/偏好設定** | **建置、執行、部署** | **編譯器** | **Kotlin 編譯器** 中的 **額外命令列參數** 文字方塊中輸入編譯器引數。
* 如果您使用 Gradle，請在 Kotlin 編譯任務的 `compilerOptions` 屬性中指定編譯器引數。詳情請參閱 [Gradle 編譯器選項](gradle-compiler-options.md#how-to-define-options)。
* 如果您使用 Maven，請在 Maven 插件節點的 `<configuration>` 元素中指定編譯器引數。詳情請參閱 [Maven](maven.md#specify-compiler-options)。
* 如果您執行命令列編譯器，請直接將編譯器引數新增到公用程式呼叫中，或將它們寫入 [argfile](#argfile)。

  例如：

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > 在 Windows 上，當您傳遞包含分隔字元（空白、`=`、`;`、`,`）的編譯器引數時，請使用雙引號 (`"`) 將這些引數括起來。
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 編譯器選項的 Schema

所有編譯器選項的通用 Schema 已以 JAR 構件的形式發佈在 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) 下。此構件包含所有編譯器選項說明的程式碼表示和 JSON 等效項（用於非 Kotlin 消費者），以及中繼資料，例如每個選項引入或穩定化的版本。

## 共用選項

以下選項適用於所有 Kotlin 編譯器。

### -version

顯示編譯器版本。

### -verbose

啟用詳細記錄輸出，其中包含編譯過程的詳細資訊。

### -script

評估 Kotlin 腳本檔案。當使用此選項呼叫時，編譯器會執行所給引數中第一個 Kotlin 腳本 (`*.kts`) 檔案。

### -help (-h)

顯示使用資訊並退出。僅顯示標準選項。若要顯示進階選項，請使用 `-X`。

### -X

<primary-label ref="experimental-general"/>

顯示有關進階選項的資訊並退出。這些選項目前不穩定：其名稱和行為可能會在不另行通知的情況下更改。

### -kotlin-home _path_

指定 Kotlin 編譯器的自訂路徑，用於尋找執行期函式庫。
  
### -P plugin:pluginId:optionName=value

將選項傳遞給 Kotlin 編譯器套件。核心套件及其選項列於文件中 [核心編譯器套件](components-stability.md#core-compiler-plugins) 章節。
  
### -language-version _version_

此選項根據指定的語言版本設定支援的語法和語義。例如，將 Kotlin 編譯器版本 2.2.0 與 `-language-version=1.9` 搭配使用，您只能使用版本 1.9 或更早版本的語言功能和標準函式庫 API。這有助於逐步遷移到較新的 Kotlin 版本。

### -api-version _version_

僅允許使用來自指定版本 Kotlin 綁定函式庫的宣告。

### -progressive

為編譯器啟用 [漸進模式](whatsnew13.md#progressive-mode)。

在漸進模式下，不穩定程式碼的棄用和錯誤修復會立即生效，而無需經歷平穩的遷移週期。以漸進模式編寫的程式碼向後相容；然而，以非漸進模式編寫的程式碼可能會在漸進模式下導致編譯錯誤。

### @argfile

從指定檔案讀取編譯器選項。此類檔案可以包含帶有值和原始碼路徑的編譯器選項。選項和路徑應以空白字元分隔。例如：

```
-include-runtime -d hello.jar hello.kt
```

若要傳遞包含空白字元的值，請使用單引號 (**'**) 或雙引號 (**"**) 將其括起來。如果值中包含引號，請使用反斜線 (**\\**) 對其進行跳脫。
```
-include-runtime -d 'My folder'
```

您也可以傳遞多個引數檔案，例如，將編譯器選項與原始碼檔案分開。

```bash
$ kotlinc @compiler.options @classes
```

如果檔案位於與當前目錄不同的位置，請使用相對路徑。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

啟用對 [需要選擇啟用](opt-in-requirements.md) 的 API 的使用，並使用指定完整限定名稱的要求註解。

### -Xrepl

<primary-label ref="experimental-general"/>

啟用 Kotlin REPL。

```bash
kotlinc -Xrepl
```

### -Xannotation-target-all

<primary-label ref="experimental-general"/>

啟用實驗性 [`all` 註解使用點目標](annotations.md#all-meta-target)：

```bash
kotlinc -Xannotation-target-all
```

### -Xannotation-default-target=param-property

<primary-label ref="experimental-general"/>

啟用新的實驗性 [註解使用點目標預設規則](annotations.md#defaults-when-no-use-site-targets-are-specified)：

```bash
kotlinc -Xannotation-default-target=param-property
```

### 警告管理

#### -nowarn

在編譯期間抑制所有警告。

#### -Werror

將所有警告視為編譯錯誤。

#### -Wextra

啟用 [額外的宣告、表達式和型別編譯器檢查](whatsnew21.md#extra-compiler-checks)，若為真則發出警告。

#### -Xrender-internal-diagnostic-names
<primary-label ref="experimental-general"/>

顯示內部診斷名稱以及警告。這對於識別為 `-Xwarning-level` 選項配置的 `DIAGNOSTIC_NAME` 非常有用。

#### -Xwarning-level
<primary-label ref="experimental-general"/>

設定特定編譯器警告的嚴重程度：

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 僅將指定的警告提升為錯誤。
* `warning`: 對於指定的診斷發出警告，並預設啟用。
* `disabled`: 僅在模組範圍內抑制指定的警告。

您可以透過將模組範圍規則與特定規則結合來調整專案中的警告報告：

| 命令 | 描述 |
|---|---|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制所有警告，但指定的警告除外。 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 將所有警告提升為錯誤，但指定的警告除外。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 啟用所有額外檢查，但指定的檢查除外。 |

如果您有許多警告要從一般規則中排除，您可以使用 [`@argfile`](#argfile) 將它們列在單獨的檔案中。

您可以使用 [`-Xrender-internal-diagnostic-names`](#xrender-internal-diagnostic-names) 來發現 `DIAGNOSTIC_NAME`。

### -Xdata-flow-based-exhaustiveness
<primary-label ref="experimental-general"/>

啟用基於資料流的 `when` 表達式窮舉性檢查。

### -Xallow-reified-type-in-catch
<primary-label ref="experimental-general"/>

啟用對 `inline` 函式中 `catch` 子句裡的實化 `Throwable` 類型參數的支援。

### Kotlin 契約選項
<primary-label ref="experimental-general"/>

以下選項啟用實驗性的 Kotlin 契約功能。

#### -Xallow-contracts-on-more-functions

啟用在更多宣告中使用契約，包括屬性存取器、特定的運算子函式以及泛型上的類型斷言。

#### -Xallow-condition-implies-returns-contracts

允許在契約中使用 `returnsNotNull()` 函式，以假定在指定條件下傳回非空值。

#### -Xallow-holdsin-contract

允許在契約中使用 `holdsIn` 關鍵字，以假定在 `lambda` 內部布林條件為 `true`。

## Kotlin/JVM 編譯器選項

用於 JVM 的 Kotlin 編譯器將 Kotlin 原始碼檔案編譯為 Java 類別檔案。用於 Kotlin 到 JVM 編譯的命令列工具是 `kotlinc` 和 `kotlinc-jvm`。您也可以使用它們來執行 Kotlin 腳本檔案。

除了 [共用選項](#common-options) 之外，Kotlin/JVM 編譯器還有以下選項。

### -classpath _path_ (-cp _path_)

在指定路徑中搜尋類別檔案。使用系統路徑分隔符（Windows 上為 **;**，macOS/Linux 上為 **:**）分隔類別路徑的元素。類別路徑可以包含檔案和目錄路徑、ZIP 或 JAR 檔案。

### -d _path_

將生成的類別檔案放置到指定位置。該位置可以是目錄、ZIP 或 JAR 檔案。

### -include-runtime

將 Kotlin 執行期包含在生成的 JAR 檔案中。使生成的歸檔檔案可在任何啟用 Java 的環境中運行。

### -jdk-home _path_

如果與預設的 `JAVA_HOME` 不同，則使用自訂的 JDK 主目錄包含到類別路徑中。

### -Xjdk-release=version

<primary-label ref="experimental-general"/>

指定生成的 JVM 位元組碼的目標版本。將類別路徑中 JDK 的 API 限制為指定的 Java 版本。自動設定 [`-jvm-target version`](#jvm-target-version)。可能的值為 `1.8`、`9`、`10`、...、`24`。

> 此選項 [不保證](https://youtrack.jetbrains.com/issue/KT-29974) 對每個 JDK 發行版都有效。
>
{style="note"}

### -jvm-target _version_

指定生成的 JVM 位元組碼的目標版本。可能的值為 `1.8`、`9`、`10`、...、`24`。預設值為 `%defaultJvmTargetVersion%`。

### -java-parameters

為 Java 1.8 方法參數上的反射生成中繼資料。

### -module-name _name_ (JVM)

為生成的 `.kotlin_module` 檔案設定自訂名稱。
  
### -no-jdk

不要自動將 Java 執行期包含在類別路徑中。

### -no-reflect

不要自動將 Kotlin 反射 (`kotlin-reflect.jar`) 包含在類別路徑中。

### -no-stdlib (JVM)

不要自動將 Kotlin/JVM 標準函式庫 (`kotlin-stdlib.jar`) 和 Kotlin 反射 (`kotlin-reflect.jar`) 包含在類別路徑中。
  
### -script-templates _classnames[,]_

腳本定義範本類別。使用完整限定類別名稱並以逗號 (**,**) 分隔。

### -Xjvm-expose-boxed

<primary-label ref="experimental-general"/>

生成模組中所有內聯值類別的裝箱版本，以及使用它們的函式的裝箱變體，使兩者都可以從 Java 存取。更多資訊請參閱《從 Java 呼叫 Kotlin 指南》中的 [內聯值類別](java-to-kotlin-interop.md#inline-value-classes)。

### -jvm-default _mode_

控制介面中宣告的函式如何在 JVM 上編譯為預設方法。

| 模式 | 描述 |
|---|---|
| `enable` | 在介面中生成預設實作，並在子類別和 `DefaultImpls` 類別中包含橋接函式。（預設） |
| `no-compatibility` | 僅在介面中生成預設實作，跳過相容性橋接和 `DefaultImpls` 類別。 |
| `disable` | 僅生成相容性橋接和 `DefaultImpls` 類別，跳過預設方法。 |

## Kotlin/JS 編譯器選項

用於 JS 的 Kotlin 編譯器將 Kotlin 原始碼檔案編譯為 JavaScript 程式碼。用於 Kotlin 到 JS 編譯的命令列工具是 `kotlinc-js`。

除了 [共用選項](#common-options) 之外，Kotlin/JS 編譯器還有以下選項。

### -target {es5|es2015}

為指定的 ECMA 版本生成 JS 檔案。

### -libraries _path_

包含 `.meta.js` 和 `.kjsm` 檔案的 Kotlin 函式庫路徑，以系統路徑分隔符分隔。

### -main _{call|noCall}_

定義 `main` 函式是否應在執行時被呼叫。

### -meta-info

生成帶有中繼資料的 `.meta.js` 和 `.kjsm` 檔案。在建立 JS 函式庫時使用此選項。

### -module-kind {umd|commonjs|amd|plain}

編譯器生成的 JS 模組類型：

- `umd` - [通用模組定義](https://github.com/umdjs/umd) 模組
- `commonjs` - [CommonJS](http://www.commonjs.org/) 模組
- `amd` - [非同步模組定義](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模組
- `plain` - 純 JS 模組
    
若要了解更多有關不同類型 JS 模組及其區別的資訊，請參閱 [這篇](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) 文章。

### -no-stdlib (JS)

不要自動將預設的 Kotlin/JS 標準函式庫包含到編譯依賴項中。

### -output _filepath_

設定編譯結果的目標檔案。該值必須是包含其名稱的 `.js` 檔案路徑。

### -output-postfix _filepath_

將指定檔案的內容新增到輸出檔案的末尾。

### -output-prefix _filepath_

將指定檔案的內容新增到輸出檔案的開頭。

### -source-map

生成原始碼對應 (source map)。

### -source-map-base-dirs _path_

使用指定路徑作為基礎目錄。基礎目錄用於計算原始碼對應中的相對路徑。

### -source-map-embed-sources _{always|never|inlining}_

將原始碼檔案嵌入到原始碼對應中。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

將您在 Kotlin 程式碼中宣告的變數和函式名稱新增到原始碼對應中。

| 設定 | 描述 | 範例輸出 |
|---|---|---|
| `simple-names` | 新增變數名稱和簡單函式名稱。（預設） | `main` |
| `fully-qualified-names` | 新增變數名稱和完整限定函式名稱。 | `com.example.kjs.playground.main` |
| `no` | 不新增變數或函式名稱。 | N/A |

### -source-map-prefix

將指定的字首新增到原始碼對應中的路徑。

### -Xes-long-as-bigint
<primary-label ref="experimental-general"/>

啟用對 JavaScript `BigInt` 類型的支援，以便在編譯為現代 JavaScript (ES2020) 時表示 Kotlin `Long` 值。

## Kotlin/Native 編譯器選項

Kotlin/Native 編譯器將 Kotlin 原始碼檔案編譯為針對 [支援平台](native-overview.md#target-platforms) 的原生二進位檔。用於 Kotlin/Native 編譯的命令列工具是 `kotlinc-native`。

除了 [共用選項](#common-options) 之外，Kotlin/Native 編譯器還有以下選項。

### -enable-assertions (-ea)

在生成的程式碼中啟用執行期斷言。

### -g

啟用發出偵錯資訊。此選項會降低最佳化級別，不應與 [`-opt`](#opt) 選項結合使用。
    
### -generate-test-runner (-tr)

生成用於從專案運行單元測試的應用程式。

### -generate-no-exit-test-runner (-trn)

生成用於運行單元測試而無需顯式程序退出的應用程式。

### -include-binary _path_ (-ib _path_)

將外部二進位檔打包到生成的 klib 檔案中。

### -library _path_ (-l _path_)

與函式庫連結。若要了解如何在 Kotlin/native 專案中使用函式庫，請參閱 [Kotlin/Native 函式庫](native-libraries.md)。

### -library-version _version_ (-lv _version_)

設定函式庫版本。
    
### -list-targets

列出可用的硬體目標。

### -manifest _path_

提供一個清單附加檔案。

### -module-name _name_ (Native)

指定編譯模組的名稱。此選項也可用於指定匯出到 Objective-C 的宣告的名稱字首：[如何為我的 Kotlin 框架指定自訂 Objective-C 字首/名稱？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含原生位元碼函式庫。

### -no-default-libs

禁用使用者程式碼與編譯器分發的預建 [平台函式庫](native-platform-libs.md) 的連結。

### -nomain

假定 `main` 進入點由外部函式庫提供。

### -nopack

不要將函式庫打包成 klib 檔案。

### -linker-option

在二進位建置期間向連結器傳遞一個引數。這可用於連結某些原生函式庫。

### -linker-options _args_

在二進位建置期間向連結器傳遞多個引數。以空白字元分隔引數。

### -nostdlib

不連結標準函式庫 (stdlib)。

### -opt

啟用編譯最佳化並生成具有更好執行期效能的二進位檔。不建議將其與降低最佳化級別的 [`-g`](#g) 選項結合使用。

### -output _name_ (-o _name_)

設定輸出檔案的名稱。

### -entry _name_ (-e _name_)

指定完整限定的進入點名稱。

### -produce _output_ (-p _output_)

指定輸出檔案類型：

- `program` (程式)
- `static` (靜態)
- `dynamic` (動態)
- `framework` (框架)
- `library` (函式庫)
- `bitcode` (位元碼)

### -repo _path_ (-r _path_)

函式庫搜尋路徑。更多資訊請參閱 [函式庫搜尋順序](native-libraries.md#library-search-sequence)。

### -target _target_

設定硬體目標。若要查看可用目標列表，請使用 [`-list-targets`](#list-targets) 選項。