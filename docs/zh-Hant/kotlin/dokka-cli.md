[//]: # (title: 命令列介面 (CLI))

如果因為某些原因您無法使用 [Gradle](dokka-gradle.md) 或 [Maven](dokka-maven.md) 建置工具，Dokka 提供了一個命令列 (CLI) 執行器，用於產生文件。

相較之下，它擁有的功能即使不比 Dokka 的 Gradle 外掛程式更多，也至少與之相同。儘管它在設定上要困難得多，因為沒有自動配置，尤其是在多平台和多模組環境中。

## 開始使用

CLI 執行器以獨立的可執行構件 (artifact) 的形式發佈到 Maven Central。

您可以在 [Maven Central](https://central.sonatype.com/artifact/org.jetbrains.dokka/dokka-cli) 上找到它，或[直接下載](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/%dokkaVersion%/dokka-cli-%dokkaVersion%.jar)。

將 `dokka-cli-%dokkaVersion%.jar` 檔案儲存到您的電腦後，使用 `-help` 選項執行它，以查看所有可用的配置選項及其說明：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

它也適用於某些巢狀選項，例如 `-sourceSet`：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

## 產生文件

### 前提條件

由於沒有建置工具來管理依賴項，您必須自行提供依賴項的 `.jar` 檔案。

以下是您需要用於任何輸出格式的依賴項：

| **群組**             | **構件**                      | **版本**        | **連結**                                                                                                                                                 |
|-----------------------|-------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka` | `dokka-base`                  | %dokkaVersion% | [下載](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-base/%dokkaVersion%/dokka-base-%dokkaVersion%.jar)                                   |
| `org.jetbrains.dokka` | `analysis-kotlin-descriptors` | %dokkaVersion% | [下載](https://repo1.maven.org/maven2/org/jetbrains/dokka/analysis-kotlin-descriptors/%dokkaVersion%/analysis-kotlin-descriptors-%dokkaVersion%.jar) |

以下是 [HTML](dokka-html.md) 輸出格式所需的額外依賴項：

| **群組**               | **構件**       | **版本** | **連結**                                                                                                           |
|-------------------------|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx` | `kotlinx-html-jvm` | 0.8.0       | [下載](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-html-jvm/0.8.0/kotlinx-html-jvm-0.8.0.jar) |
| `org.freemarker`        | `freemarker`       | 2.3.31      | [下載](https://repo1.maven.org/maven2/org/freemarker/freemarker/2.3.31/freemarker-2.3.31.jar)                  |

### 使用命令列選項執行

您可以傳遞命令列選項來配置 CLI 執行器。

您至少需要提供以下選項：

*   `-pluginsClasspath` - 下載依賴項的絕對/相對路徑列表，以分號 `;` 分隔
*   `-sourceSet` - 程式碼來源的絕對路徑，用於產生文件
*   `-outputDir` - 文件輸出目錄的絕對/相對路徑

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;./analysis-kotlin-descriptors-%dokkaVersion%.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

執行給定的範例會在 [HTML](dokka-html.md) 輸出格式中產生文件。

有關更多配置詳情，請參閱[命令列選項](#command-line-options)。

### 使用 JSON 配置執行

可以使用 JSON 配置 CLI 執行器。在這種情況下，您需要將 JSON 配置檔的絕對/相對路徑作為第一個也是唯一一個引數提供。所有其他配置選項都從中解析。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar dokka-configuration.json
```

您至少需要以下 JSON 配置檔：

```json
{
  "outputDir": "./dokka/html",
  "sourceSets": [
    {
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "sourceRoots": [
        "/home/myCoolProject/src/main/kotlin"
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

有關更多詳細資訊，請參閱 [JSON 配置選項](#json-configuration)。

### 其他輸出格式

預設情況下，`dokka-base` 構件僅包含 [HTML](dokka-html.md) 輸出格式。

所有其他輸出格式都以 [Dokka 外掛程式](dokka-plugins.md)的形式實作。為了使用它們，您必須將它們放到外掛程式類別路徑中。

例如，如果您想在實驗性 [GFM](dokka-markdown.md#gfm) 輸出格式中產生文件，您需要下載 `gfm-plugin` 的 JAR ([下載](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)) 並將其傳遞給 `pluginsClasspath` 配置選項。

透過命令列選項：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

透過 JSON 配置：

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

將 GFM 外掛程式傳遞到 `pluginsClasspath` 後，CLI 執行器會以 GFM 輸出格式產生文件。

有關更多資訊，請參閱 [Markdown](dokka-markdown.md) 和 [Javadoc](dokka-javadoc.md#generate-javadoc-documentation) 頁面。

## 命令列選項

要查看所有可能的命令列選項及其詳細說明的列表，請執行：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

簡要摘要：

| 選項                       | 說明                                                                                                                                                                                           |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `moduleName`                 | 專案/模組的名稱。                                                                                                                                                                           |
| `moduleVersion`              | 文件化版本。                                                                                                                                                                                   |
| `outputDir`                  | 輸出目錄路徑，預設為 `./dokka`。                                                                                                                                                          |
| `sourceSet`                  | Dokka 來源集 (source set) 的配置。包含巢狀配置選項。                                                                                                                          |
| `pluginsConfiguration`       | Dokka 外掛程式的配置。                                                                                                                                                                      |
| `pluginsClasspath`           | 包含 Dokka 外掛程式及其依賴項的 jar 列表。接受以分號分隔的多個路徑。                                                                                                                               |
| `offlineMode`                | 是否透過網路解析遠端檔案/連結。                                                                                                                                                                      |
| `failOnWarning`              | 如果 Dokka 發出警告或錯誤，是否中止文件產生。                                                                                                                                                 |
| `delayTemplateSubstitution`  | 是否延遲某些元素的替換。用於多模組專案的增量建置。                                                                                                                                 |
| `noSuppressObviousFunctions` | 是否抑制諸如繼承自 `kotlin.Any` 和 `java.lang.Object` 的明顯函式。                                                                                                                              |
| `includes`                   | 包含模組和套件文件的 Markdown 檔案。接受以分號分隔的多個值。                                                                                                                       |
| `suppressInheritedMembers`   | 是否抑制在給定類別中未明確覆寫的繼承成員。                                                                                                                                            |
| `globalPackageOptions`       | 全域套件配置選項列表，格式為 `"matchingRegex,-deprecated,-privateApi,+warnUndocumented,+suppress;+visibility:PUBLIC;..."`。接受以分號分隔的多個值。                                |
| `globalLinks`                | 全域外部文件連結，格式為 `{url}^{packageListUrl}`。接受以 `^^` 分隔的多個值。                                                                                                                   |
| `globalSrcLink`              | 原始碼目錄與用於瀏覽程式碼的 Web 服務之間的全域映射。接受以分號分隔的多個路徑。                                                                                                                   |
| `helpSourceSet`              | 列印巢狀 `-sourceSet` 配置的幫助資訊。                                                                                                                                                |
| `loggingLevel`               | 記錄層級，可能的值：`DEBUG, PROGRESS, INFO, WARN, ERROR`。                                                                                                                                 |
| `help, h`                    | 用法資訊。                                                                                                                                                                                           |

#### 來源集選項

要查看巢狀 `-sourceSet` 配置的命令列選項列表，請執行：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

簡要摘要：

| 選項                       | 說明                                                                                                                                                                    |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceSetName`              | 來源集的名稱。                                                                                                                                                        |
| `displayName`                | 來源集的顯示名稱，內部和外部都使用。                                                                                                           |
| `classpath`                  | 用於分析和互動式範例的類別路徑。接受以分號分隔的多個路徑。                                                                                                               |
| `src`                        | 要分析和文件化的原始碼根目錄。接受以分號分隔的多個路徑。                                                                                                              |
| `dependentSourceSets`        | 依賴來源集的名稱，格式為 `moduleName/sourceSetName`。接受以分號分隔的多個值。                                                      |
| `samples`                    | 包含範例函式的目錄或檔案列表。接受以分號分隔的多個路徑。 <anchor name="includes-cli"/>                                      |
| `includes`                   | 包含[模組和套件文件](dokka-module-and-package-docs.md)的 Markdown 檔案。接受以分號分隔的多個路徑。                              |
| `documentedVisibilities`     | 要文件化的可見性。接受以分號分隔的多個值。可能的值：`PUBLIC`、`PRIVATE`、`PROTECTED`、`INTERNAL`、`PACKAGE`。                      |
| `reportUndocumented`         | 是否報告未文件化的宣告。                                                                                                                                   |
| `noSkipEmptyPackages`        | 是否為空套件建立頁面。                                                                                                                                    |
| `skipDeprecated`             | 是否跳過已棄用的宣告。                                                                                                                                       |
| `jdkVersion`                 | 用於連結到 JDK Javadoc 的 JDK 版本。                                                                                                                             |
| `languageVersion`            | 用於設定分析和範例的語言版本。                                                                                                                     |
| `apiVersion`                 | 用於設定分析和範例的 Kotlin API 版本。                                                                                                                   |
| `noStdlibLink`               | 是否產生指向 Kotlin 標準函式庫 API 參考文件的連結。                                                                                                                      |
| `noJdkLink`                  | 是否產生指向 JDK Javadoc 的連結。                                                                                                                                     |
| `suppressedFiles`            | 要抑制的檔案路徑。接受以分號分隔的多個路徑。                                                                                               |
| `analysisPlatform`           | 用於設定分析的平台。                                                                                                                                         |
| `perPackageOptions`          | 套件來源集配置列表，格式為 `matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...`。接受以分號分隔的多個值。 |
| `externalDocumentationLinks` | 外部文件連結，格式為 `{url}^{packageListUrl}`。接受以 `^^` 分隔的多個值。                                                                    |
| `srcLink`                    | 原始碼目錄與用於瀏覽程式碼的 Web 服務之間的映射。接受以分號分隔的多個路徑。                                                    |

## JSON 配置

以下是每個配置部分的一些範例和詳細說明。您也可以在頁面底部找到一個應用了[所有配置選項](#complete-configuration)的範例。

### 一般配置

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "includes": [
    "module.md"
  ],
  "sourceLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "perPackageOptions": [
    { "_comment": "Options are described in a separate section" }
  ],
  "externalDocumentationLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "sourceSets": [
    { "_comment": "Options are described in a separate section" }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

<deflist collapsible="true">
    <def title="moduleName">
        <p>用於指代模組的顯示名稱。它用於目錄、導航、日誌等。</p>
        <p>預設值：<code>root</code></p>
    </def>
    <def title="moduleVersion">
        <p>模組版本。</p>
        <p>預設值：空</p>
    </def>
    <def title="outputDirectory">
        <p>無論輸出格式為何，文件產生到的目錄。</p>
        <p>預設值：<code>./dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 發出警告或錯誤，是否中止文件產生。
            此過程會先等待所有錯誤和警告發出。
        </p>
        <p>此設定與 <code>reportUndocumented</code> 搭配使用效果良好</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制明顯函式。</p>
            如果函式是以下情況，則被視為明顯：
            <list>
                <li>
                    繼承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成（由編譯器產生）且沒有任何文件，例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制在給定類別中未明確覆寫的繼承成員。</p>
        <p>
            注意：這可以抑制諸如 <code>equals</code> / <code>hashCode</code> / <code>toString</code> 等函式， 
            但不能抑制諸如 <code>dataClass.componentN</code> 和 
            <code>dataClass.copy</code> 等合成函式。為此請使用 <code>suppressObviousFunctions</code>。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="offlineMode">
        <anchor name="includes-json"/>
        <p>是否透過網路解析遠端檔案/連結。</p>
        <p>
            這包括用於產生外部文件連結的 `package-list`。 
            例如，使標準函式庫中的類別可點擊。 
        </p>
        <p>
            將此設定為 <code>true</code> 在某些情況下可以顯著加快建置時間，
            但也可能降低文件品質和使用者體驗。例如，不
            解析來自依賴項（包括標準函式庫）的類別/成員連結。
        </p>
        <p>
            注意：您可以將擷取的檔案快取到本機，並將它們作為本機路徑提供給
            Dokka。請參閱 <code>externalDocumentationLinks</code> 部分。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">模組和套件文件</a>的 Markdown 檔案列表。
        </p>
        <p>指定檔案的內容將被解析並嵌入到文件中作為模組和套件描述。</p>
        <p>這可以按套件基礎進行配置。</p>
    </def>
    <def title="sourceSets">
        <p>
          Kotlin 
          <a href="https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets">來源集</a>的個別和額外配置。
        </p>
        <p>有關可能選項的列表，請參閱 <a href="#source-set-configuration">來源集配置</a>。</p>
    </def>
    <def title="sourceLinks">
        <p>適用於所有來源集的全域原始碼連結配置。</p>
        <p>有關可能選項的列表，請參閱 <a href="#source-link-configuration">原始碼連結配置</a>。</p>
    </def>
    <def title="perPackageOptions">
        <p>匹配套件的全域配置，無論它們位於哪個來源集。</p>
        <p>有關可能選項的列表，請參閱 <a href="#per-package-configuration">每套件配置</a>。</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>外部文件連結的全域配置，無論它們在哪個來源集中使用。</p>
        <p>有關可能選項的列表，請參閱 <a href="#external-documentation-links-configuration">外部文件連結配置</a>。</p>
    </def>
    <def title="pluginsClasspath">
        <p>包含 Dokka 外掛程式及其依賴項的 JAR 檔案列表。</p>
    </def>
</deflist>

### 來源集配置

如何配置 Kotlin
[來源集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)：

```json
{
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks":  [
        { "_comment": "Options are described in a separate section" }
      ],
      "perPackageOptions": [
        { "_comment": "Options are described in a separate section" }
      ],
      "externalDocumentationLinks":  [
        { "_comment": "Options are described in a separate section" }
      ]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="displayName">
        <p>用於指代此來源集的顯示名稱。</p>
        <p>
            該名稱既用於外部（例如，來源集名稱對文件讀者可見），也用於內部（例如，用於 <code>reportUndocumented</code> 的日誌訊息）。
        </p>
        <p>如果您沒有更好的替代方案，可以使用平台名稱。</p>
    </def>
    <def title="sourceSetID">
        <p>來源集的技術 ID</p>
    </def>
    <def title="documentedVisibilities">
        <p>應文件化的可見性修飾符集合。</p>
        <p>
            這可以用於如果您想文件化 <code>protected</code>/<code>internal</code>/<code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並僅文件化內部 API。
        </p>
        <p>這可以按套件基礎進行配置。</p>
        <p>
            可能的值：</p>
            <list>
                <li><code>PUBLIC</code></li>
                <li><code>PRIVATE</code></li>
                <li><code>PROTECTED</code></li>
                <li><code>INTERNAL</code></li>
                <li><code>PACKAGE</code></li>
            </list>
        <p>預設值：<code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未文件化宣告的警告，即在被 <code>documentedVisibilities</code> 和其他過濾器過濾後沒有 KDoc
            的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配使用效果良好。</p>
        <p>這可以按套件基礎進行配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            在應用各種過濾器後，是否跳過不包含任何可見宣告的套件。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 設定為 <code>true</code> 且您的套件僅包含
            已棄用的宣告，則該套件被視為空。
        </p>
        <p>CLI 執行器的預設值是 <code>false</code>。</p>
    </def>
    <def title="skipDeprecated">
        <p>是否文件化帶有 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以按套件基礎進行配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="jdkVersion">
        <p>產生 Java 類型外部文件連結時使用的 JDK 版本。</p>
        <p>
            例如，如果您在某些公共宣告簽名中使用 <code>java.util.UUID</code>，
            並且此選項設定為 <code>8</code>，Dokka 會為其產生指向 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a> 的外部文件連結。
        </p>
    </def>
    <def title="languageVersion">
        <p>
            用於設定分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境的<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 語言版本</a>。
        </p>
    </def>
    <def title="apiVersion">
        <p>
            用於設定分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境的<a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>。
        </p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否產生指向 Kotlin 標準函式庫 API 參考文件的外部文件連結。
        </p>
        <p>注意：當 <code>noStdLibLink</code> 設定為 <code>false</code> 時，連結**會**產生。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>是否產生指向 JDK Javadoc 的外部文件連結。</p>
        <p>JDK Javadoc 的版本由 <code>jdkVersion</code> 選項決定。</p>
        <p>注意：當 <code>noJdkLink</code> 設定為 <code>false</code> 時，連結**會**產生。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">模組和套件文件</a>的 Markdown 檔案列表。
        </p>
        <p>指定檔案的內容將被解析並嵌入到文件中作為模組和套件描述。</p>
    </def>
    <def title="analysisPlatform">
        <p>
            用於設定程式碼分析和 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 環境的平台。
        </p>
        <p>
            可能的值：</p>
            <list>
                <li><code>jvm</code></li>
                <li><code>common</code></li>
                <li><code>js</code></li>
                <li><code>native</code></li>
            </list>
    </def>
    <def title="sourceRoots">
        <p>
            要分析和文件化的原始碼根目錄。
            可接受的輸入是目錄和單個 <code>.kt</code> / <code>.java</code> 檔案。
        </p>
    </def>
    <def title="classpath">
        <p>用於分析和互動式範例的類別路徑。</p>
        <p>如果來自依賴項的某些類型未能自動解析/選取，這會很有用。</p>
        <p>此選項接受 <code>.jar</code> 和 <code>.klib</code> 檔案。</p>
    </def>
    <def title="samples">
        <p>
            包含透過
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 標籤引用的範例函式的目錄或檔案列表。
        </p>
    </def>
    <def title="suppressedFiles">
        <p>產生文件時要抑制的檔案。</p>
    </def>
    <def title="sourceLinks">
        <p>僅適用於此來源集的原始碼連結參數集。</p>
        <p>有關可能選項的列表，請參閱 <a href="#source-link-configuration">原始碼連結配置</a>。</p>
    </def>
    <def title="perPackageOptions">
        <p>此來源集中與匹配套件相關的參數集。</p>
        <p>有關可能選項的列表，請參閱 <a href="#per-package-configuration">每套件配置</a>。</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>僅適用於此來源集的外部文件連結參數集。</p>
        <p>有關可能選項的列表，請參閱 <a href="#external-documentation-links-configuration">外部文件連結配置</a>。</p>
    </def>
</deflist>

### 原始碼連結配置

`sourceLinks` 配置區塊允許您為每個簽名添加一個原始碼連結，該連結會導向帶有特定行號的 `remoteUrl`。（行號可透過設定 `remoteLineSuffix` 進行配置）。

這有助於讀者找到每個宣告的原始碼。

例如，請參閱 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函式的文件。

您可以同時為所有來源集配置原始碼連結，或[單獨地](#source-set-configuration)：

```json
{
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="localDirectory">
        <p>本機原始碼目錄的路徑。</p>
    </def>
    <def title="remoteUrl">
        <p>
            原始碼託管服務的 URL，文件讀者可以存取，
            例如 GitHub、GitLab、Bitbucket 等。此 URL 用於產生
            宣告的原始碼連結。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            用於將原始碼行號附加到 URL 的後綴。這有助於讀者不僅導航
            到檔案，還導航到宣告的特定行號。
        </p>
        <p>
            數字本身會附加到指定的後綴。例如，
            如果此選項設定為 <code>#L</code> 且行號為 10，則結果 URL 後綴
            為 <code>#L10</code>。
        </p>
        <p>
            常用服務使用的後綴：</p>
            <list>
                <li>GitHub：<code>#L</code></li>
                <li>GitLab：<code>#L</code></li>
                <li>Bitbucket：<code>#lines-</code></li>
            </list>
        <p>預設值：空 (無後綴)</p>
    </def>
</deflist>

### 每套件配置

`perPackageOptions` 配置區塊允許為由 `matchingRegex` 匹配的特定套件設定一些選項。

您可以同時為所有來源集添加套件配置，或[單獨地](#source-set-configuration)：

```json
{
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "skipDeprecated": false,
      "reportUndocumented": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>用於匹配套件的正則表達式。</p>
    </def>
    <def title="suppress">
        <p>產生文件時是否應跳過此套件。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文件化帶有 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以在專案/模組層級設定。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未文件化宣告的警告，即在被 <code>documentedVisibilities</code> 和其他過濾器過濾後沒有 KDoc
            的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配使用效果良好。</p>
        <p>這可以在來源集層級配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>應文件化的可見性修飾符集合。</p>
        <p>
            這可以用於如果您想文件化此套件中的 <code>protected</code>/<code>internal</code>/<code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並僅文件化內部 API。
        </p>
        <p>可在來源集層級配置。</p>
        <p>預設值：<code>PUBLIC</code></p>
    </def>
</deflist>

### 外部文件連結配置

`externalDocumentationLinks` 區塊允許建立導向您的依賴項的外部託管文件的連結。

例如，如果您使用 `kotlinx.serialization` 中的類型，預設情況下它們在您的文件中是無法點擊的，就像它們未解析一樣。但是，由於 `kotlinx.serialization` 的 API 參考文件是由 Dokka 建置並[發佈在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上的，您可以為其配置外部文件連結。這使得 Dokka 可以為該函式庫中的類型產生連結，使其能夠成功解析並可點擊。

您可以同時為所有來源集配置外部文件連結，或[單獨地](#source-set-configuration)：

```json
{
  "externalDocumentationLinks": [
    {
      "url": "https://kotlinlang.org/api/kotlinx.serialization/",
      "packageListUrl": "https://kotlinlang.org/api/kotlinx.serialization/package-list"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="url">
        <p>要連結到的文件根 URL。它**必須**包含一個尾部斜線。</p>
        <p>
            Dokka 會盡力自動為給定 URL 尋找 <code>package-list</code>，
            並將宣告連結起來。
        </p>
        <p>
            如果自動解析失敗，或者您想改用本機快取檔案，
            請考慮設定 <code>packageListUrl</code> 選項。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的確切位置。這是依賴 Dokka
            自動解析它的替代方案。
        </p>
        <p>
            套件列表包含有關文件和專案本身的信息，
            例如模組和套件名稱。
        </p>
        <p>這也可以是本機快取檔案，以避免網路呼叫。</p>
    </def>
</deflist>

### 完整配置

您可以在下方看到同時應用了所有可能配置選項的範例。

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ],
  "externalDocumentationLinks": [
    {
      "url": "https://docs.oracle.com/javase/8/docs/api/",
      "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
    },
    {
      "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
      "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
    }
  ],
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "reportUndocumented": false,
      "skipDeprecated": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ],
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks": [
        {
          "localDirectory": "src/main/kotlin",
          "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
          "remoteLineSuffix": "#L"
        }
      ],
      "externalDocumentationLinks": [
        {
          "url": "https://docs.oracle.com/javase/8/docs/api/",
          "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
        },
        {
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
          "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
        }
      ],
      "perPackageOptions": [
        {
          "matchingRegex": ".*internal.*",
          "suppress": false,
          "reportUndocumented": false,
          "skipDeprecated": false,
          "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
        }
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ],
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"separateInheritedMembers\":false,\"footerMessage\":\"© 2021 pretty good Copyright\"}"
    }
  ],
  "includes": [
    "module.md"
  ]
}