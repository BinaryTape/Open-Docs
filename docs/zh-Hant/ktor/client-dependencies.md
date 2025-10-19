[//]: # (title: 新增客戶端依賴)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何將客戶端依賴新增至現有專案。</link-summary>

要在您的專案中使用 Ktor HTTP 客戶端，您需要[設定儲存庫](#repositories)並新增以下依賴：

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` 包含 Ktor 客戶端的核心功能。
- **[引擎依賴](#engine-dependency)**

  引擎用於處理網路請求。
  請注意，[特定平台](client-supported-platforms.md)可能需要特定的引擎來處理網路請求。
- (可選) **[日誌依賴](#logging-dependency)**

  提供日誌框架以啟用結構化且彈性的日誌功能。

- (可選) **[外掛程式依賴](#plugin-dependency)**

  外掛程式用於擴展客戶端的特定功能。

<p>
    在新增 Ktor 依賴之前，您需要為此專案設定儲存庫：
</p>
<list>
    <li>
        <p>
            <control>生產版本</control>
        </p>
        <p>
            Ktor 的生產版本可在 Maven Central 儲存庫中取得。
            您可以在建構腳本中宣告此儲存庫，如下所示：
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        mavenCentral()&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        mavenCentral()&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <note>
                    <p>
                        您不需要在 <path>pom.xml</path> 檔案中新增 Maven Central 儲存庫，因為您的專案會從
                        <a href="https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom">Super POM</a> 繼承中央儲存庫。
                    </p>
                </note>
            </TabItem>
        </Tabs>
    </li>
    <li>
        <p>
            <control>搶先體驗計畫 (EAP)</control>
        </p>
        <p>
            要存取 Ktor 的 <a href="https://ktor.io/eap/">EAP</a> 版本，您需要引用 <a href="https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/">Space 儲存庫</a>：
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        maven {&#10;                            url = uri(&quot;https://maven.pkg.jetbrains.space/public/p/ktor/eap&quot;)&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        maven {&#10;                            url &quot;https://maven.pkg.jetbrains.space/public/p/ktor/eap&quot;&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;repositories&gt;&#10;                        &lt;repository&gt;&#10;                            &lt;id&gt;ktor-eap&lt;/id&gt;&#10;                            &lt;url&gt;https://maven.pkg.jetbrains.space/public/p/ktor/eap&lt;/url&gt;&#10;                        &lt;/repository&gt;&#10;                    &lt;/repositories&gt;"/>
            </TabItem>
        </Tabs>
        <p>
            請注意，Ktor EAP 可能需要 <a href="https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev">Kotlin 開發儲存庫</a>：
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        maven {&#10;                            url = uri(&quot;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&quot;)&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        maven {&#10;                            url &quot;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&quot;&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;repositories&gt;&#10;                        &lt;repository&gt;&#10;                            &lt;id&gt;ktor-eap&lt;/id&gt;&#10;                            &lt;url&gt;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&lt;/url&gt;&#10;                        &lt;/repository&gt;&#10;                    &lt;/repositories&gt;"/>
            </TabItem>
        </Tabs>
    </li>
</list>

## 新增依賴 {id="add-ktor-dependencies"}

> 對於[不同平台](client-supported-platforms.md)，Ktor 提供帶有後綴的特定平台構件，例如 `-jvm` 或 `-js`，舉例來說是 `ktor-client-core-jvm`。請注意，Gradle 會自動解析適用於給定平台的構件，而 Maven 不支援此功能。這表示對於 Maven，您需要手動新增特定平台的後綴。
>
{type="tip"}

### 客戶端依賴 {id="client-dependency"}

主要的客戶端功能在 `ktor-client-core` 構件中提供。根據您的建構系統，您可以透過以下方式新增它：

<var name="artifact_name" value="ktor-client-core"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

您可以將 `$ktor_version` 替換為所需的 Ktor 版本，舉例來說是 `%ktor_version%`。

#### 多平台 {id="client-dependency-multiplatform"}

對於多平台專案，您可以在 `gradle/libs.versions.toml` 檔案中定義 Ktor 版本和 `ktor-client-core` 構件：

```kotlin
[versions]
ktor = "3.3.1"

[libraries]
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
```

然後，將 `ktor-client-core` 作為依賴新增到 `commonMain` 原始碼集：

```kotlin
sourceSets {
    commonMain.dependencies {
        implementation(libs.ktor.client.core)
    }
}
```

### 引擎依賴 {id="engine-dependency"}

[引擎](client-engines.md)負責處理網路請求。有適用於各種平台的不同客戶端引擎，例如 Apache、CIO、Android、iOS 等。舉例來說，您可以如下新增 `CIO` 引擎依賴：

<var name="artifact_name" value="ktor-client-cio"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

#### 多平台 {id="engine-dependency-multiplatform"}

對於多平台專案，您需要將所需引擎的依賴新增到對應的原始碼集。

舉例來說，要為 Android 新增 `OkHttp` 引擎依賴，您可以先在 `gradle/libs.versions.toml` 檔案中定義 Ktor 版本和 `ktor-client-okhttp` 構件：

```kotlin
[versions]
ktor = "3.3.1"

[libraries]
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
```

然後，將 `ktor-client-okhttp` 作為依賴新增到 `androidMain` 原始碼集：

```kotlin
sourceSets {
    androidMain.dependencies {
        implementation(libs.ktor.client.okhttp)
    }
}
```

有關特定引擎所需依賴的完整列表，請參閱[新增引擎依賴](client-engines.md#dependencies)。

### 日誌依賴

  <p>
    在 <a href="#jvm">JVM</a> 上，Ktor 使用 Simple Logging Facade for Java
    (<a href="http://www.slf4j.org/">SLF4J</a>) 作為日誌記錄的抽象層。SLF4J 將日誌 API 與底層日誌實作分離，
    讓您可以整合最適合您應用程式需求的日誌框架。
    常見的選擇包括 <a href="https://logback.qos.ch/">Logback</a> 或
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果未提供框架，SLF4J 將預設為無操作 (NOP) 實作，這基本上會禁用
    日誌記錄。
  </p>

  <p>
    要啟用日誌記錄，請包含一個帶有所需 SLF4J 實作的構件，例如 <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

有關 Ktor 客戶端中日誌記錄的更多資訊，請參閱[Ktor 客戶端中的日誌記錄](client-logging.md)。

### 外掛程式依賴 {id="plugin-dependency"}

Ktor 讓您可以使用預設不提供的額外客戶端功能（[外掛程式](client-plugins.md)），例如授權和序列化。其中一些在單獨的構件中提供。您可以從所需外掛程式的主題中了解您需要哪些依賴。

> 對於多平台專案，外掛程式依賴應新增到 `commonMain` 原始碼集。請注意，某些外掛程式對於特定平台可能存在[限制](client-engines.md#limitations)。

## 確保 Ktor 版本一致性

<chapter title="使用 Ktor BOM 依賴">

Ktor BOM 讓您可以確保所有 Ktor 模組使用相同且一致的版本，而無需單獨指定每個依賴的版本。

要新增 Ktor BOM 依賴，請在您的建構腳本中宣告它，如下所示：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(platform(&quot;io.ktor:ktor-bom:$ktor_version&quot;))"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation platform &quot;io.ktor:ktor-bom:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependencyManagement&gt;&#10;              &lt;dependencies&gt;&#10;                  &lt;dependency&gt;&#10;                      &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                      &lt;artifactId&gt;ktor-bom&lt;/artifactId&gt;&#10;                      &lt;version&gt;%ktor_version%&lt;/version&gt;&#10;                      &lt;type&gt;pom&lt;/type&gt;&#10;                      &lt;scope&gt;import&lt;/scope&gt;&#10;                  &lt;/dependency&gt;&#10;              &lt;/dependencies&gt;&#10;          &lt;/dependencyManagement&gt;"/>
    </TabItem>
</Tabs>
</chapter>

<var name="target_module" value="client"/>
<p>
    您也可以透過使用已發布的版本目錄來集中 Ktor 依賴宣告。
    此方法提供以下優點：
</p>
<list id="published-version-catalog-benefits">
    <li>
        無需在您自己的目錄中手動宣告 Ktor 版本。
    </li>
    <li>
        在單一命名空間下公開每個 Ktor 模組。
    </li>
</list>
<p>
    要在
    <path>settings.gradle.kts</path>
    中宣告目錄，請使用您選擇的名稱建立一個版本目錄：
</p>
<code-block lang="kotlin" code="    dependencyResolutionManagement {&#10;        versionCatalogs {&#10;            create(&quot;ktorLibs&quot;) {&#10;                from(&quot;io.ktor:ktor-version-catalog:%ktor_version%&quot;)&#10;            }&#10;        }&#10;    }"/>
<p>
    然後，您可以透過引用目錄名稱，在模組的
    <path>build.gradle.kts</path>
    中新增依賴：
</p>
<code-block lang="kotlin" code="    dependencies {&#10;        implementation(ktorLibs.%target_module%.core)&#10;        // ...&#10;    }"/>