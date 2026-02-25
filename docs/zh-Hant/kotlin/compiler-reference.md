[//]: # (title: Kotlin 編譯器選項)

每個版本的 Kotlin 都包含針對所支援目標的編譯器：
JVM、JavaScript 以及[支援平台](native-overview.md#target-platforms)的原生二進位檔。

這些編譯器被以下工具使用：
* 當你在 Kotlin 專案中點擊 **編譯** 或 **執行** 按鈕時，IDE 會使用編譯器。
* 當你在主控台或 IDE 中呼叫 `gradle build` 時，Gradle 會使用編譯器。
* 當你在主控台或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時，Maven 會使用編譯器。

你也可以按照[使用命令列編譯器](command-line.md)教學中的說明，從命令列手動執行 Kotlin 編譯器。

## 編譯器選項

Kotlin 編譯器有許多用於自訂編譯過程的選項。
本頁列出了不同目標的編譯器選項以及各個選項的說明。

有幾種方法可以設定編譯器選項及其值（*編譯器引數*）：
* 在 IntelliJ IDEA 中，於 **設定／偏好設定** | **建置、執行、部署** | **編譯器** | **Kotlin 編譯器** 的 **Additional command line parameters** 文字方塊中輸入編譯器引數。
* 如果你使用 Gradle，請在 Kotlin 編譯任務的 `compilerOptions` 屬性中指定編譯器引數。
如需詳細資訊，請參閱 [Gradle 編譯器選項](gradle-compiler-options.md#how-to-define-options)。
* 如果你使用 Maven，請在 Maven 外掛程式節點的 `<configuration>` 元素中指定編譯器引數。
如需詳細資訊，請參閱 [Maven](maven-compile-package.md#specify-compiler-options)。
* 如果你執行命令列編譯器，請直接在公用程式呼叫中加入編譯器引數，或將其寫入 [argfile](#argfile)。

  例如：

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > 在 Windows 上，當你傳遞包含分隔字元（空白字元、`=`、`;`、`,`）的編譯器引數時，
  > 請用雙引號 (`"`) 包圍這些引數。
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 編譯器選項的結構

所有編譯器選項的通用結構以 JAR 構件的形式發佈在 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) 下。此構件包含所有編譯器選項說明的程式碼表示形式和 JSON 等效形式（供非 Kotlin 使用者使用）。此外還包含元資料，例如每個選項引入或穩定化的版本。

## 通用選項

以下選項適用於所有 Kotlin 編譯器。

### -version

顯示編譯器版本。

### -verbose

啟用詳細記錄輸出，其中包括編譯過程的詳細資訊。

### -script

評估 Kotlin 指令嗎檔案。使用此選項呼叫時，編譯器會執行指定引數中第一個 Kotlin 指令嗎 (`*.kts`) 檔案。

### -help (-h)

顯示使用資訊並結束。僅顯示標準選項。
若要顯示進階選項，請使用 `-X`。

### -X

<primary-label ref="experimental-general"/>

顯示關於進階選項的資訊並結束。這些選項目前不穩定：
其名稱和行為可能會在不經通知的情況下發生變更。

### -kotlin-home _路徑_

指定用於探索執行階段程式庫之 Kotlin 編譯器的自訂路徑。
  
### -P plugin:pluginId:optionName=value

將選項傳遞給 Kotlin 編譯器外掛程式。
核心外掛程式及其選項列在文件的[核心編譯器外掛程式](components-stability.md#core-compiler-plugins)章節中。
  
### -language-version _版本_

此選項根據指定的語言版本設定支援的語法和語意。例如，使用 Kotlin 編譯器版本 2.2.0 並配合 `-language-version=1.9`，可讓你僅使用版本 1.9 或更早版本的語言特性和標準程式庫 API。這有助於逐步遷移到較新的 Kotlin 版本。

### -api-version _版本_

僅允許使用來自指定版本的 Kotlin 隨附程式庫的宣告。

### -progressive

為編譯器啟用[漸進模式](whatsnew13.md#progressive-mode)。

在漸進模式下，針對不穩定程式碼的棄用和錯誤修正會立即生效，
而不是經過平緩的遷移週期。
在漸進模式下編寫的程式碼是向後相容的；然而，在
非漸進模式下編寫的程式碼在漸進模式下可能會導致編譯錯誤。

### @argfile

從指定檔案讀取編譯器選項。此類檔案可以包含編譯器選項及其值，
以及原始碼檔案的路徑。選項和路徑應以空白字元分隔。例如：

```
-include-runtime -d hello.jar hello.kt
```

若要傳遞包含空白字元的值，請將其用單引號 (**'**) 或雙引號 (**"**) 包圍。如果值中包含引號，請使用反斜線 (**\\**) 進行轉義。
```
-include-runtime -d 'My folder'
```

你也可以傳遞多個引數檔案，例如，將編譯器選項與原始碼檔案分開。

```bash
$ kotlinc @compiler.options @classes
```

如果檔案位於與目前目錄不同的位置，請使用相對路徑。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _註解_

允許使用[需要選擇性同意](opt-in-requirements.md)的 API，並提供具有指定完全限定名稱的需求註解。

### -Xrepl

<primary-label ref="experimental-general"/>

啟用 Kotlin REPL。

```bash
kotlinc -Xrepl
```

### -Xannotation-target-all

<primary-label ref="experimental-general"/>

啟用實驗性的 [註解 `all` 使用點目標](annotations.md#all-meta-target)：

```bash
kotlinc -Xannotation-target-all
```

### -Xannotation-default-target=param-property

<primary-label ref="experimental-general"/>

啟用新的實驗性[註解使用點目標預設規則](annotations.md#defaults-when-no-use-site-targets-are-specified)：

```bash
kotlinc -Xannotation-default-target=param-property
```

### 警告管理

#### -nowarn

在編譯期間隱藏所有警告。

#### -Werror

將所有警告視為編譯錯誤。

#### -Wextra

啟用[額外的宣告、運算式和型別編譯器檢查](whatsnew21.md#extra-compiler-checks)，
如果為 true 則發出警告。

#### -Xrender-internal-diagnostic-names
<primary-label ref="experimental-general"/>

在警告旁邊列印內部診斷名稱。這對於識別為 `-Xwarning-level` 選項配置的 `DIAGNOSTIC_NAME` 非常有用。

#### -Xwarning-level
<primary-label ref="experimental-general"/>

設定特定編譯器警告的嚴重級別：

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 僅將指定的警告提升為錯誤。
* `warning`: 為指定的診斷發出警告，且預設為啟用。
* `disabled`: 僅在整個模組範圍內隱藏指定的警告。

你可以透過結合模組級規則與特定規則來調整專案中的警告回報：

| 指令                                               | 說明                                                        |
|----------------------------------------------------|-------------------------------------------------------------|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 隱藏除指定警告以外的所有警告。                                |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 將除指定警告以外的所有警告提升為錯誤。                         |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 啟用除指定檢查以外的所有額外檢查。                             |

如果你有許多警告要從一般規則中排除，可以使用 [`@argfile`](#argfile) 在單獨的檔案中列出它們。

你可以使用 [`-Xrender-internal-diagnostic-names`](#xrender-internal-diagnostic-names) 來發現 `DIAGNOSTIC_NAME`。

### -Xdata-flow-based-exhaustiveness
<primary-label ref="experimental-general"/>

針對 `when` 運算式啟用基於資料流的窮舉性檢查。

### -Xallow-reified-type-in-catch
<primary-label ref="experimental-general"/>

支援在 `inline` 函式的 `catch` 子句中使用具現化的 `Throwable` 型別參數。

### Kotlin 合約選項
<primary-label ref="experimental-general"/>

以下選項啟用實驗性的 Kotlin 合約功能。

#### -Xallow-contracts-on-more-functions

在額外的宣告中啟用合約，包括屬性存取子、特定運算子函式以及泛型型別上的型別斷言。

#### -Xallow-condition-implies-returns-contracts

允許在合約中使用 `returnsNotNull()` 函式，以便在指定條件下假定傳回值為非 null。

#### -Xallow-holdsin-contract

允許在合約中使用 `holdsIn` 關鍵字，以便假定布林條件在 Lambda 內部為 `true`。

### -Xreturn-value-checker
<primary-label ref="experimental-general"/>

設定編譯器如何[回報被忽略的結果](unused-return-value-checker.md)：

* `disable`: 停用未使用的傳回值檢查器（預設）。
* `check`: 啟用檢查器，並對來自已標記函式之被忽略的結果回報警告。
* `full`: 啟用檢查器，將專案中的所有函式視為已標記，並對被忽略的結果回報警告。

### -Xcompiler-plugin-order={plugin.before>plugin.after}

設定編譯器外掛程式的執行順序。編譯器會先執行 `plugin.before`，然後執行 `plugin.after`：

你可以為三個或更多外掛程式定義多個排序規則。例如：

```bash
kotlinc -Xcompiler-plugin-order=plugin.first>plugin.middle
kotlinc -Xcompiler-plugin-order=plugin.middle>plugin.last
```

這會產生以下執行順序：

1. `plugin.first`
2. `plugin.middle`
3. `plugin.last`

如果某個編譯器外掛程式不存在，則忽略對應的規則。

你可以透過外掛程式 ID 設定以下外掛程式：

| 編譯器外掛程式              | 外掛程式 ID                                  |
|-----------------------------|--------------------------------------------|
| `all-open`, `kotlin-spring` | `org.jetbrains.kotlin.allopen`             |
| AtomicFU                    | `org.jetbrains.kotlinx.atomicfu`           |
| Compose                     | `androidx.compose.compiler.plugins.kotlin` |
| `js-plain-objects`          | `org.jetbrains.kotlinx.jspo`               |
| `jvm-abi-gen`               | `org.jetbrains.kotlin.jvm.abi`             |
| kapt                        | `org.jetbrains.kotlin.kapt3`               |
| Lombok                      | `org.jetbrains.kotlin.lombok`              |
| `no-arg`, `kotlin-jpa`      | `org.jetbrains.kotlin.noarg`               |
| Parcelize                   | `org.jetbrains.kotlin.parcelize`           |
| Power-assert                | `org.jetbrains.kotlin.powerassert`         |
| SAM with receiver           | `org.jetbrains.kotlin.samWithReceiver`     |
| Serialization               | `org.jetbrains.kotlinx.serialization`      |

此執行順序僅控制編譯器外掛程式的後端，而非前端。

### -Xphases-to-dump-before

<primary-label ref="experimental-general"/>

設定為 `ExternalPackageParentPatcherLowering` 以在 IR lowering 編譯階段後建立傾印檔案。使用 [`-Xdump-directory`](#xdump-directory) 編譯器選項設定 Kotlin/JVM 的輸出目錄。

## Kotlin/JVM 編譯器選項

針對 JVM 的 Kotlin 編譯器將 Kotlin 原始碼檔案編譯成 Java 類別檔案。
Kotlin 到 JVM 編譯的命令列工具是 `kotlinc` 和 `kotlinc-jvm`。
你也可以使用它們來執行 Kotlin 指令嗎檔案。

除了[通用選項](#common-options)外，Kotlin/JVM 編譯器還具有下列選項。

### -classpath _路徑_ (-cp _路徑_)

在指定路徑中搜尋類別檔案。使用系統路徑分隔符號（Windows 為 **;**，macOS/Linux 為 **:**）分隔類別路徑元素。
類別路徑可以包含檔案和目錄路徑、ZIP 或 JAR 檔案。

### -d _路徑_

將產生的類別檔案放置到指定位置。該位置可以是目錄、ZIP 或 JAR 檔案。

### -include-runtime

在產生的 JAR 檔案中包含 Kotlin 執行階段。使產生的封存檔可以在任何啟用 Java 的環境中執行。

### -jdk-home _路徑_

如果與預設的 `JAVA_HOME` 不同，請使用自訂 JDK 首頁目錄以包含在類別路徑中。

### -Xjdk-release=version

<primary-label ref="experimental-general"/>

指定產生的 JVM bytecode 的目標版本。將類別路徑中 JDK 的 API 限制為指定的 Java 版本。
自動設定 [`-jvm-target version`](#jvm-target-version)。
可能的值為 `1.8`、`9`、`10`、...、`25`。

> 此選項[不保證](https://youtrack.jetbrains.com/issue/KT-29974)對每個 JDK 發行版都有效。
>
{style="note"}

### -jvm-target _版本_

指定產生的 JVM bytecode 的目標版本。可能的值為 `1.8`、`9`、`10`、...、`25`。
預設值為 `%defaultJvmTargetVersion%`。

### -java-parameters

為方法參數產生 Java 1.8 反射元資料。

### -module-name _名稱_ (JVM)

為產生的 `.kotlin_module` 檔案設定自訂名稱。
  
### -no-jdk

不要自動將 Java 執行階段包含在類別路徑中。

### -no-reflect

不要自動將 Kotlin 反射 (`kotlin-reflect.jar`) 包含在類別路徑中。

### -no-stdlib (JVM)

不要自動將 Kotlin/JVM stdlib (`kotlin-stdlib.jar`) 和 Kotlin 反射 (`kotlin-reflect.jar`) 包含在類別路徑中。
  
### -script-templates _類別名稱[,]_

指令嗎定義範本類別。使用完全限定類名並以逗號 (**,**) 分隔。

### -Xjvm-expose-boxed

<primary-label ref="experimental-general"/>

產生模組中所有內嵌值類別的封裝版本，以及使用它們的函式的封裝變體，使兩者都可以從 Java 存取。如需詳細資訊，請參閱從 Java 呼叫 Kotlin 指南中的[內嵌值類別](java-to-kotlin-interop.md#inline-value-classes)。

### -jvm-default _模式_

控制在介面中宣告的函式如何編譯為 JVM 上的預設方法。

| 模式               | 說明                                                                                                                       |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `enable`           | 在介面中產生預設實作，並在子類別和 `DefaultImpls` 類別中包含橋接函式。（預設） |
| `no-compatibility` | 僅在介面中產生預設實作，跳過相容性橋接器和 `DefaultImpls` 類別。                  |
| `disable`          | 僅產生相容性橋接器和 `DefaultImpls` 類別，跳過預設方法。                                        |

### -Xdump-directory

<primary-label ref="experimental-general"/>

為 [-Xphases-to-dump-before`](#xphases-to-dump-before) 編譯器選項設定傾印檔案目錄。

## Kotlin/JS 編譯器選項

針對 JS 的 Kotlin 編譯器將 Kotlin 原始碼檔案編譯成 JavaScript 程式碼。
Kotlin 到 JS 編譯的命令列工具是 `kotlinc-js`。

除了[通用選項](#common-options)外，Kotlin/JS 編譯器還具有下列選項。

### -target {es5|es2015}

為指定的 ECMA 版本產生 JS 檔案。

### -libraries _路徑_

指向包含 `.meta.js` 和 `.kjsm` 檔案之 Kotlin 程式庫的路徑，以系統路徑分隔符號分隔。

### -main _{call|noCall}_

定義執行時是否應呼叫 `main` 函式。

### -meta-info

產生包含元資料的 `.meta.js` 和 `.kjsm` 檔案。建立 JS 程式庫時請使用此選項。

### -module-kind {umd|commonjs|amd|plain}

編譯器產生的 JS 模組類型：

- `umd` - [通用模組定義 (Universal Module Definition)](https://github.com/umdjs/umd) 模組
- `commonjs` - [CommonJS](http://www.commonjs.org/) 模組
- `amd` - [非同步模組定義 (Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模組
- `plain` - 普通 JS 模組
    
若要進一步了解不同類型的 JS 模組及其區別，
請參閱[此篇文章](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)。

### -no-stdlib (JS)

不要自動將預設的 Kotlin/JS stdlib 包含在編譯相依性中。

### -output _檔案路徑_

設定編譯結果的目標檔案。該值必須是包含名稱在內的 `.js` 檔案路徑。

### -output-postfix _檔案路徑_

將指定檔案的內容新增至輸出檔案的末尾。

### -output-prefix _檔案路徑_

將指定檔案的內容新增至輸出檔案的開頭。

### -source-map

產生原始碼對應檔。

### -source-map-base-dirs _路徑_

使用指定的路徑作為基準目錄。基準目錄用於計算原始碼對應檔中的相對路徑。

### -source-map-embed-sources _{always|never|inlining}_

將原始碼檔案嵌入到原始碼對應檔中。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

將你在 Kotlin 程式碼中宣告的變數和函式名稱新增到原始碼對應檔中。

| 設定 | 說明 | 輸出範例 |
|---|---|---|
| `simple-names` | 新增變數名稱和簡單函式名稱。（預設） | `main` |
| `fully-qualified-names` | 新增變數名稱和完全限定函式名稱。 | `com.example.kjs.playground.main` |
| `no` | 不新增變數或函式名稱。 | N/A |

### -source-map-prefix

在原始碼對應檔中的路徑新增指定的前綴。

### -Xes-long-as-bigint
<primary-label ref="experimental-general"/>

在編譯為現代 JavaScript (ES2020) 時，啟用對 JavaScript `BigInt` 型別的支援，以表示 Kotlin `Long` 值。

## Kotlin/Native 編譯器選項

Kotlin/Native 編譯器將 Kotlin 原始碼檔案編譯為[支援平台](native-overview.md#target-platforms)的原生二進位檔。
Kotlin/Native 編譯的命令列工具是 `kotlinc-native`。

除了[通用選項](#common-options)外，Kotlin/Native 編譯器還具有下列選項。

### -enable-assertions (-ea)

在產生的程式碼中啟用執行時斷言。

### -g

啟用發出偵錯資訊。此選項會降低最佳化級別，不應與 [`-opt`](#opt) 選項結合使用。
    
### -generate-test-runner (-tr)

產生一個用於執行專案單元測試的應用程式。

### -generate-no-exit-test-runner (-trn)

產生一個用於執行單元測試且沒有明確處理序結束的應用程式。

### -include-binary _路徑_ (-ib _路徑_)

在產生的 klib 檔案中封裝外部二進位檔。

### -library _路徑_ (-l _路徑_)

與程式庫連結。若要了解在 Kotlin/Native 專案中使用程式庫的資訊，請參閱 
[Kotlin/Native 程式庫](native-libraries.md)。

### -library-version _版本_ (-lv _version_)

設定程式庫版本。
    
### -list-targets

列出可用的硬體目標。

### -manifest _路徑_

提供 manifest 附加檔案。

### -module-name _名稱_ (Native)

指定編譯模組的名稱。
此選項也可用於為匯出到 Objective-C 的宣告指定名稱前綴：
[如何為我的 Kotlin 框架指定自訂 Objective-C 前綴／名稱？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _路徑_ (-nl _路徑_)

包含原生 bitcode 程式庫。

### -no-default-libs

停用將使用者程式碼與編譯器隨附的預建[平台程式庫](native-platform-libs.md)進行連結。

### -nomain

假定 `main` 入口點由外部程式庫提供。

### -nopack

不要將程式庫封裝成 klib 檔案。

### -linker-option

在建置二進位檔期間將引數傳遞給連結器。這可以用於與某些原生程式庫連結。

### -linker-options _參數_

在建置二進位檔期間將多個引數傳遞給連結器。以空白字元分隔引數。

### -nostdlib

不要與 stdlib 連結。

### -opt

啟用編譯最佳化並產生具有更好執行時效能的二進位檔。不建議將其與 [`-g`](#g) 選項結合使用，因為後者會降低最佳化級別。

### -output _名稱_ (-o _名稱_)

設定輸出檔案的名稱。

### -entry _名稱_ (-e _名稱_)

指定限定入口點名稱。

### -produce _輸出_ (-p _輸出_)

指定輸出檔案種類：

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _路徑_ (-r _路徑_)

程式庫搜尋路徑。如需詳細資訊，請參閱[程式庫搜尋順序](native-libraries.md#library-search-sequence)。

### -target _目標_

設定硬體目標。若要查看可用目標列表，請使用 [`-list-targets`](#list-targets) 選項。