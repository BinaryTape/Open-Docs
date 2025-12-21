[//]: # (title: Maven)

若要為基於 Maven 的專案產生說明文件，您可以使用 Dokka 的 Maven 外掛程式。

> 相較於 [Dokka 的 Gradle 外掛程式](dokka-gradle.md)，Maven 外掛程式僅有基本功能，且不支援多模組建構。
> 
{style="note"}

您可以透過造訪我們的 [Maven 範例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven)專案來試用 Dokka，並了解如何為 Maven 專案進行設定。

## 套用 Dokka

若要套用 Dokka，您需要將 `dokka-maven-plugin` 新增至 POM 檔案的 `plugins` 區段：

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

## 產生說明文件

Maven 外掛程式提供以下目標：

| **目標**      | **說明**                                                                        |
|---------------|----------------------------------------------------------------------------------------|
| `dokka:dokka` | 使用套用的 Dokka 外掛程式產生說明文件。預設為 [HTML](dokka-html.md) 格式。 |

### 實驗性

| **目標**           | **說明**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| `dokka:javadoc`    | 產生 [Javadoc](dokka-javadoc.md) 格式的說明文件。                                    |
| `dokka:javadocJar` | 產生一個包含 [Javadoc](dokka-javadoc.md) 格式說明文件的 `javadoc.jar` 檔案。 |

### 其他輸出格式

依預設，Dokka 的 Maven 外掛程式會以 [HTML](dokka-html.md) 輸出格式建置說明文件。

所有其他輸出格式都實作為 [Dokka 外掛程式](dokka-plugins.md)。為了產生所需格式的說明文件，您必須將其新增為 Dokka 外掛程式到設定中。

例如，要使用實驗性的 [GFM](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm#readme) 格式，您必須新增 `gfm-plugin` artifact：

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

有了這項設定，執行 `dokka:dokka` 目標將會產生 GFM 格式的說明文件。

要了解更多關於 Dokka 外掛程式的資訊，請參閱 [Dokka 外掛程式](dokka-plugins.md)。

## 建置 javadoc.jar

如果您想將程式庫發佈到儲存庫，您可能需要提供一個包含程式庫 API 參考說明文件的 `javadoc.jar` 檔案。

例如，如果您想發佈到 [Maven Central](https://central.sonatype.org/)，您[必須](https://central.sonatype.org/publish/requirements/)在專案旁提供一個 `javadoc.jar`。然而，並非所有儲存庫都有這項規則。

與 [Dokka 的 Gradle 外掛程式](dokka-gradle.md#build-javadoc-jar)不同，Maven 外掛程式提供現成的 `dokka:javadocJar` 目標。預設情況下，它會在 `target` 資料夾中產生 [Javadoc](dokka-javadoc.md) 輸出格式的說明文件。

如果您不滿意內建目標或想自訂輸出（例如，您想產生 [HTML](dokka-html.md) 格式而非 Javadoc），可透過新增帶有以下設定的 Maven JAR 外掛程式來達到類似的行為：

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

說明文件及其 `.jar` 壓縮檔隨後透過執行 `dokka:dokka` 和 `jar:jar@dokka-jar` 目標來產生：

```Bash
mvn dokka:dokka jar:jar@dokka-jar
```

> 如果您將程式庫發佈到 Maven Central，您可以使用 [javadoc.io](https://javadoc.io/) 等服務免費託管您的程式庫 API 說明文件，無需任何設定。它會直接從 `javadoc.jar` 中擷取說明文件頁面。它與 HTML 格式運作良好，如[此範例](https://javadoc.io/doc/com.trib3/server/latest/index.html)所示。
>
{style="tip"}

## 設定範例

Maven 的外掛程式設定區塊可用於設定 Dokka。

以下是僅改變說明文件輸出位置的基本設定範例：

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

## 設定選項

Dokka 擁有多種設定選項，可自訂您和讀者的體驗。

以下是一些範例和每個設定區段的詳細說明。您也可以在頁面底部找到[套用所有設定選項](#complete-configuration)的完整範例。

### 一般設定

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
        <p>是否跳過說明文件產生。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="moduleName">
        <p>用於指稱專案/模組的顯示名稱。用於目錄、導覽、日誌等。</p>
        <p>預設值：<code>{project.artifactId}</code></p>
    </def>
    <def title="outputDir">
        <p>說明文件產生的目錄，不論格式為何。</p>
        <p>預設值：<code>{project.basedir}/target/dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 發出警告或錯誤，是否讓說明文件產生失敗。程序會先等待所有錯誤和警告發出。
        </p>
        <p>此設定與 <code>reportUndocumented</code> 搭配使用效果良好。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制明顯的函式。</p>
        <p>
            函式若為以下情況，則被視為明顯：</p>
            <list>
                <li>
                    繼承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或 
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成（由編譯器產生）且沒有任何說明文件，例如 
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制未在給定類別中明確覆寫的繼承成員。</p>
        <p>
            注意：這可以抑制 <code>equals</code>/<code>hashCode</code>/<code>toString</code> 等函式，但不能抑制 
            <code>dataClass.componentN</code> 和 <code>dataClass.copy</code> 等合成函式。請使用 
            <code>suppressObviousFunctions</code> 處理。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>是否透過網路解析遠端檔案/連結。</p>
        <p>
            這包括用於產生外部說明文件連結的 package-lists。例如，使標準程式庫中的類別可點擊。
        </p>
        <p>
            將此設為 <code>true</code> 在某些情況下可以顯著加快建置時間，但也可能降低說明文件品質和使用者體驗。例如，不解析來自您的依賴項（包括標準程式庫）的類別/成員連結。
        </p>
        <p>
            注意：您可以將擷取的檔案快取到本機，並將其作為本機路徑提供給
            Dokka。請參閱 <code>externalDocumentationLinks</code> 區段。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="sourceDirectories">
        <p>
            要分析和文件化的原始碼根目錄。
            可接受的輸入是目錄和單個 <code>.kt</code> / <code>.java</code> 檔案。
        </p>
        <p>預設值：<code>{project.compileSourceRoots}</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>應文件化的可見性修飾符集合。</p>
        <p>
            如果您想文件化 <code>protected</code>/<code>internal</code>/<code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並僅文件化內部 API，可以使用此選項。
        </p>
        <p>可按每個套件進行設定。</p>
        <p>預設值：<code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未文件化宣告的警告，即在被 <code>documentedVisibilities</code> 和其他篩選器篩選後，沒有 KDocs 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配使用效果良好。</p>
        <p>這可以在套件層級覆寫。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文件化使用 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以在套件層級覆寫。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            是否跳過在套用各種篩選器後不包含任何可見宣告的套件。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 設為 <code>true</code> 且您的套件僅包含
            已棄用宣告，則該套件被視為空。
        </p>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="suppressedFiles">
        <p>
            應抑制的目錄或單個檔案，表示來自這些檔案的宣告不會被文件化。
        </p>
    </def>
    <def title="jdkVersion">
        <p>為 Java 類型產生外部說明文件連結時使用的 JDK 版本。</p>
        <p>
            例如，如果您在某些公共宣告簽章中使用 <code>java.util.UUID</code>，
            且此選項設為 <code>8</code>，Dokka 將為其產生指向 
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a> 的外部說明文件連結。
        </p>
        <p>預設值：JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">用於設定分析</a>和 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境的 Kotlin 語言版本。
        </p>
        <p>預設情況下，使用 Dokka 嵌入式編譯器可用的最新語言版本。</p>
    </def>
    <def title="apiVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">用於設定分析</a>和 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境的 Kotlin API 版本。
        </p>
        <p>預設情況下，它是從 <code>languageVersion</code> 推導出來的。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否產生指向 Kotlin 標準程式庫 API 參考說明文件的外部說明文件連結。
        </p>
        <p>注意：當 <code>noStdLibLink</code> 設為 <code>false</code> 時，<b>會</b>產生連結。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="noJdkLink">
    <anchor name="includes"/>
        <p>是否產生指向 JDK Javadocs 的外部說明文件連結。</p>
        <p>JDK Javadocs 的版本由 <code>jdkVersion</code> 選項決定。</p>
        <p>注意：當 <code>noJdkLink</code> 設為 <code>false</code> 時，<b>會</b>產生連結。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含 
            <a href="dokka-module-and-package-docs.md">模組和套件說明文件</a>的 Markdown 檔案列表
        </p>
        <p>指定檔案的內容會被解析並嵌入到說明文件中作為模組和套件說明。</p>
    </def>
    <def title="classpath">
        <p>用於分析和互動式範例的類別路徑。</p>
        <p>
            如果來自依賴項的某些類型未自動解析/選取，這會很有用。
            此選項接受 <code>.jar</code> 和 <code>.klib</code> 檔案。
        </p>
        <p>預設值：<code>{project.compileClasspathElements}</code></p>
    </def>
    <def title="samples">
        <p>
            包含透過 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample KDoc 標籤引用的範例函式</a>的目錄或檔案列表。
        </p>
    </def>
</deflist>

### 原始碼連結設定

`sourceLinks` 設定區塊允許您為每個簽章新增一個 `source` 連結，該連結指向帶有特定行號的 `url`。(行號可透過設定 `lineSuffix` 進行設定)。

這有助於讀者找到每個宣告的原始碼。

例如，請參閱 `kotlinx.coroutines` 中 
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)
函式的說明文件。

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
            本地原始碼目錄的路徑。路徑必須相對於當前模組的根目錄。
        </p>
        <p>
            注意：僅允許基於 Unix 的路徑，Windows 樣式的路徑將引發錯誤。
        </p>
    </def>
    <def title="url">
        <p>
            原始碼託管服務的 URL，可供說明文件讀者存取，
            例如 GitHub、GitLab、Bitbucket 等。此 URL 用於產生
            宣告的原始碼連結。
        </p>
    </def>
    <def title="lineSuffix">
        <p>
            用於將原始碼行號附加到 URL 的尾碼。這有助於讀者不僅導覽
            到檔案，還能導覽到宣告的特定行號。
        </p>
        <p>
            數字本身會附加到指定的尾碼。例如，如果此選項設為 
            <code>#L</code> 且行號為 10，則產生的 URL 尾碼為 <code>#L10</code>。
        </p>
        <p>
            常用服務使用的尾碼：</p>
            <list>
            <li>GitHub: <code>#L</code></li>
            <li>GitLab: <code>#L</code></li>
            <li>Bitbucket: <code>#lines-</code></li>
            </list>
    </def>
</deflist>

### 外部說明文件連結設定

`externalDocumentationLinks` 區塊允許建立指向您依賴項的外部託管說明文件的連結。

例如，如果您使用 `kotlinx.serialization` 中的類型，依預設它們在您的說明文件中不可點擊，就像未解析一樣。然而，由於 `kotlinx.serialization` 的 API 參考說明文件是由 Dokka 建置並[發佈在 kotlinlang.org 上](https://kotlinlang.org/api/kotlinx.serialization/)，您可以為其設定外部說明文件連結。因此，Dokka 能夠為該程式庫中的類型產生連結，使其成功解析並可點擊。

依預設，Kotlin 標準程式庫和 JDK 的外部說明文件連結已設定。

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
        <p>要連結的說明文件的根 URL。它<b>必須</b>包含一個斜線結尾。</p>
        <p>
            Dokka 會盡力自動尋找給定 URL 的 <code>package-list</code>，
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
            自動解析的替代方案。
        </p>
        <p>
            套件列表包含關於說明文件和專案本身的信息，
            例如模組和套件名稱。
        </p>
        <p>這也可以是本地快取的檔案，以避免網路呼叫。</p>
    </def>
</deflist>

### 套件選項

`perPackageOptions` 設定區塊允許為由 `matchingRegex` 匹配的特定套件設定一些選項。

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
        <p>產生說明文件時是否應跳過此套件。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>應文件化的可見性修飾符集合。</p>
        <p>
            如果您想文件化此套件中的 <code>protected</code>/<code>internal</code>/<code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並僅文件化內部 API，可以使用此選項。
        </p>
        <p>預設值：<code>PUBLIC</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文件化使用 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以在專案/模組層級設定。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未文件化宣告的警告，即在被 <code>documentedVisibilities</code> 和其他篩選器篩選後，沒有 KDocs 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配使用效果良好。</p>
        <p>預設值：<code>false</code></p>
    </def>
</deflist>

### 完整設定

您可以在下面看到同時套用的所有可能設定選項。

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