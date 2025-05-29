[//]: # (title: Maven)

欲為基於 Maven 的專案生成文件，您可以使用 Dokka 的 Maven 外掛程式。

> 相較於 [Dokka 的 Gradle 外掛程式](dokka-gradle.md)，Maven 外掛程式僅提供基本功能，不支援多模組建構。
>
{style="note"}

您可以透過造訪我們的 [Maven 範例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven) 專案來試用 Dokka，並了解如何在 Maven 專案中配置它。

## 應用 Dokka

欲應用 Dokka，您需要將 `dokka-maven-plugin` 加入您的 POM 檔案的 `plugins` 區段：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 生成文件

Maven 外掛程式提供了以下目標：

| **目標** | **描述** |
|---------------|----------------------------------------------------------------------------------------|
| `dokka:dokka` | 使用 Dokka 外掛程式生成文件。預設為 [HTML](dokka-html.md) 格式。 |

### 實驗性

| **目標** | **描述** |
|--------------------|---------------------------------------------------------------------------------------------|
| `dokka:javadoc` | 以 [Javadoc](dokka-javadoc.md) 格式生成文件。 |
| `dokka:javadocJar` | 生成一個包含 [Javadoc](dokka-javadoc.md) 格式文件的 `javadoc.jar` 檔案。 |

### 其他輸出格式

預設情況下，Dokka 的 Maven 外掛程式會以 [HTML](dokka-html.md) 輸出格式建構文件。

所有其他輸出格式都以 [Dokka 外掛程式](dokka-plugins.md) 的形式實現。為了生成所需格式的文件，您必須將其作為 Dokka 外掛程式添加到配置中。

例如，要使用實驗性的 [GFM](dokka-markdown.md#gfm) 格式，您必須添加 `gfm-plugin` 構件：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

透過此配置，執行 `dokka:dokka` 目標會生成 GFM 格式的文件。

要了解更多關於 Dokka 外掛程式的資訊，請參閱 [Dokka 外掛程式](dokka-plugins.md)。

## 建構 javadoc.jar

如果您想將您的程式庫發佈到儲存庫，您可能需要提供一個包含您程式庫 API 參考文件的 `javadoc.jar` 檔案。

例如，如果您想發佈到 [Maven Central](https://central.sonatype.org/)，您[必須](https://central.sonatype.org/publish/requirements/)連同您的專案一起提供一個 `javadoc.jar`。然而，並非所有儲存庫都有此規定。

與 [Dokka 的 Gradle 外掛程式](dokka-gradle.md#build-javadoc-jar) 不同的是，Maven 外掛程式隨附一個隨時可用的 `dokka:javadocJar` 目標。預設情況下，它會在 `target` 資料夾中生成 [Javadoc](dokka-javadoc.md) 輸出格式的文件。

如果您不滿意內建目標或想自訂輸出（例如，您想生成 [HTML](dokka-html.md) 格式的文件而非 Javadoc），可以透過添加帶有以下配置的 Maven JAR 外掛程式來實現類似行為：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <execution>
            <goals>
                <goal>test-jar</goal>
            </goals>
        </execution>
        <execution>
            <id>dokka-jar</id>
            <phase>package</phase>
            <goals>
                <goal>jar</goal>
            </goals>
            <configuration>
                <classifier>dokka</classifier>
                <classesDirectory>${project.build.directory}/dokka</classesDirectory>
                <skipIfEmpty>true</skipIfEmpty>
            </configuration>
        </execution>
    </executions>
</plugin>
```

文件及其 `.jar` 歸檔可以透過執行 `dokka:dokka` 和 `jar:jar@dokka-jar` 目標來生成：

```Bash
mvn dokka:dokka jar:jar@dokka-jar
```

> 如果您將您的程式庫發佈到 Maven Central，您可以使用像 [javadoc.io](https://javadoc.io/) 這樣的服務，免費且無需任何設置地託管您程式庫的 API 文件。它直接從 `javadoc.jar` 中獲取文件頁面。它與 HTML 格式配合良好，如[此範例](https://javadoc.io/doc/com.trib3/server/latest/index.html)所示。
>
{style="tip"}

## 配置範例

Maven 的外掛程式配置區塊可用於配置 Dokka。

這是一個基本配置範例，僅更改文件的輸出位置：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <outputDir>${project.basedir}/target/documentation/dokka</outputDir>
    </configuration>
</plugin>
```

## 配置選項

Dokka 有許多配置選項，可以客製化您和讀者的體驗。

下方是一些範例以及每個配置區段的詳細描述。您也可以在頁面底部找到一個應用了[所有配置選項](#complete-configuration)的範例。

### 一般配置

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PROTECTED</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <!-- Separate section -->
        </sourceLinks>
        <externalDocumentationLinks>
            <!-- Separate section -->
        </externalDocumentationLinks>
        <perPackageOptions>
            <!-- Separate section -->
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="skip">
        <p>是否跳過文件生成。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="moduleName">
        <p>用於指稱專案/模組的顯示名稱。它用於目錄、導航、日誌等。</p>
        <p>預設值：<code>{project.artifactId}</code></p>
    </def>
    <def title="outputDir">
        <p>生成文件的目錄，不論格式如何。</p>
        <p>預設值：<code>{project.basedir}/target/dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 發出警告或錯誤，是否讓文件生成失敗。此過程會先等待所有錯誤和警告都發出。
        </p>
        <p>此設定與 <code>reportUndocumented</code> 配合良好。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制顯而易見的函數。</p>
        <p>
            如果函數符合以下條件，則被視為顯而易見：</p>
            <list>
                <li>
                    繼承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成的（由編譯器生成）且沒有任何文件，例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制在給定類別中未明確覆寫的繼承成員。</p>
        <p>
            注意：這可以抑制諸如 <code>equals</code>/<code>hashCode</code>/<code>toString</code> 之類的函數，
            但不能抑制諸如 <code>dataClass.componentN</code> 和
            <code>dataClass.copy</code> 之類的合成函數。請為此使用 <code>suppressObviousFunctions</code>。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>是否透過您的網路解析遠端檔案/連結。</p>
        <p>
            這包括用於生成外部文件連結的 package-list。
            例如，使標準程式庫中的類別可點擊。
        </p>
        <p>
            將其設定為 <code>true</code> 在某些情況下可以顯著加快建構時間，
            但也可能降低文件品質和使用者體驗。例如，透過
            不解析來自您的依賴項（包括標準程式庫）的類別/成員連結。
        </p>
        <p>
            注意：您可以將擷取的檔案本地快取並將其作為本地路徑提供給
            Dokka。請參閱 <code>externalDocumentationLinks</code> 區段。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="sourceDirectories">
        <p>
            要分析和記錄的原始碼根目錄。
            可接受的輸入是目錄和單個 <code>.kt</code> / <code>.java</code> 檔案。
        </p>
        <p>預設值：<code>{project.compileSourceRoots}</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>應被記錄的可見性修飾符集合。</p>
        <p>
            如果您想記錄 <code>protected</code>/<code>internal</code>/<code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並只記錄內部 API，則可以使用此選項。
        </p>
        <p>可以按每個套件進行配置。</p>
        <p>預設值：<code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未記錄宣告的警告，即經過 KDoc 過濾後
            <code>documentedVisibilities</code> 和其他過濾器過濾後沒有 KDoc 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 配合良好。</p>
        <p>這可以在套件層級覆寫。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否記錄帶有 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以在套件層級覆寫。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            是否跳過在應用各種過濾器後不包含任何可見宣告的套件。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 設定為 <code>true</code> 且您的套件僅包含
            已廢棄的宣告，則該套件被視為空。
        </p>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="suppressedFiles">
        <p>
            應被抑制的目錄或單個檔案，這表示其中的宣告不會被記錄。
        </p>
    </def>
    <def title="jdkVersion">
        <p>為 Java 型別生成外部文件連結時使用的 JDK 版本。</p>
        <p>
            例如，如果您在某些公開宣告簽名中使用 <code>java.util.UUID</code>，
            並且此選項設定為 <code>8</code>，Dokka 會為其生成一個指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a> 的外部文件連結。
        </p>
        <p>預設值：JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">用於設置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境的 Kotlin 語言版本。
            </a>
        </p>
        <p>預設情況下，使用 Dokka 內嵌編譯器可用的最新語言版本。</p>
    </def>
    <def title="apiVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">用於設置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境的 Kotlin API 版本。
            </a>
        </p>
        <p>預設情況下，它從 <code>languageVersion</code> 推斷。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否生成指向 Kotlin 標準程式庫 API 參考文件的外部文件連結。
        </p>
        <p>注意：當 <code>noStdLibLink</code> 設定為 <code>false</code> 時，連結<b>會</b>生成。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="noJdkLink">
    <anchor name="includes"/>
        <p>是否生成指向 JDK Javadocs 的外部文件連結。</p>
        <p>JDK Javadocs 的版本由 <code>jdkVersion</code> 選項決定。</p>
        <p>注意：當 <code>noJdkLink</code> 設定為 <code>false</code> 時，連結<b>會</b>生成。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">模組和套件文件</a>的 Markdown 檔案列表。
        </p>
        <p>指定檔案的內容會被解析並嵌入到文件中作為模組和套件描述。</p>
    </def>
    <def title="classpath">
        <p>用於分析和互動式範例的 classpath。</p>
        <p>
            如果來自依賴項的某些型別未自動解析/拾取，此選項會很有用。
            此選項接受 <code>.jar</code> 和 <code>.klib</code> 檔案。
        </p>
        <p>預設值：<code>{project.compileClasspathElements}</code></p>
    </def>
    <def title="samples">
        <p>
            包含透過
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample KDoc 標籤</a> 引用之範例函數的目錄或檔案列表。
        </p>
    </def>
</deflist>

### 原始碼連結配置

`sourceLinks` 配置區塊允許您為每個簽名添加一個 `source` 連結，該連結指向帶有特定行號的 `url`。（行號可以透過設定 `lineSuffix` 來配置）。

這有助於讀者找到每個宣告的原始碼。

例如，請參閱 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函數的文件。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="path">
        <p>
            本地原始碼目錄的路徑。該路徑必須相對於當前模組的根目錄。
        </p>
        <p>
            注意：僅允許基於 Unix 的路徑，Windows 風格的路徑將拋出錯誤。
        </p>
    </def>
    <def title="url">
        <p>
            文件讀者可以訪問的原始碼託管服務的 URL，
            例如 GitHub、GitLab、Bitbucket 等。此 URL 用於生成
            宣告的原始碼連結。
        </p>
    </def>
    <def title="lineSuffix">
        <p>
            用於將原始碼行號附加到 URL 的後綴。這有助於讀者不僅導航到檔案，還能導航到宣告的特定行號。
        </p>
        <p>
            數字本身會附加到指定的後綴。例如，如果此選項設定為
            <code>#L</code> 且行號為 10，則結果 URL 後綴為 <code>#L10</code>。
        </p>
        <p>
            常用服務使用的後綴：</p>
            <list>
            <li>GitHub：<code>#L</code></li>
            <li>GitLab：<code>#L</code></li>
            <li>Bitbucket：<code>#lines-</code></li>
            </list>
    </def>
</deflist>

### 外部文件連結配置

`externalDocumentationLinks` 區塊允許創建指向您依賴項的外部託管文件的連結。

例如，如果您使用 `kotlinx.serialization` 中的型別，預設情況下它們在您的文件中是不可點擊的，如同它們未解析一樣。然而，由於 `kotlinx.serialization` 的 API 參考文件由 Dokka 建構並[發佈在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上，您可以為其配置外部文件連結。從而允許 Dokka 為程式庫中的型別生成連結，使其成功解析並可點擊。

預設情況下，Kotlin 標準程式庫和 JDK 的外部文件連結已配置。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/kotlinx.serialization/</url>
                <packageListUrl>file:/${project.basedir}/serialization.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="url">
        <p>要連結到的文件的根 URL。它<b>必須</b>包含一個尾隨斜線。</p>
        <p>
            Dokka 會盡力自動查找給定 URL 的 <code>package-list</code>，
            並將宣告連結在一起。
        </p>
        <p>
            如果自動解析失敗或您想使用本地快取檔案，
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
        <p>這也可以是本地快取檔案，以避免網路呼叫。</p>
    </def>
</deflist>

### 套件選項

`perPackageOptions` 配置區塊允許為由 `matchingRegex` 匹配的特定套件設定一些選項。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>用於匹配套件的正規表達式。</p>
        <p>預設值：<code>.*</code></p>
 </def>
    <def title="suppress">
        <p>生成文件時是否應跳過此套件。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>應被記錄的可見性修飾符集合。</p>
        <p>
            如果您想記錄此套件中的 <code>protected</code>/<code>internal</code>/<code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並只記錄內部 API，則可以使用此選項。
        </p>
        <p>預設值：<code>PUBLIC</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否記錄帶有 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以在專案/模組層級設定。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未記錄宣告的警告，即經過 KDoc 過濾後
            <code>documentedVisibilities</code> 和其他過濾器過濾後沒有 KDoc 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 配合良好。</p>
        <p>預設值：<code>false</code></p>
    </def>
</deflist>

### 完整配置

下方您可以看到所有可能的配置選項同時應用。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PRIVATE</visibility>
            <visibility>PROTECTED</visibility>
            <visibility>INTERNAL</visibility>
            <visibility>PACKAGE</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/core/kotlin-stdlib/</url>
                <packageListUrl>file:/${project.basedir}/stdlib.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```