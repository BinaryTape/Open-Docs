[//]: # (title: 添加客戶端依賴項)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何將客戶端依賴項添加到現有專案。</link-summary>

要在您的專案中使用 Ktor HTTP 客戶端，您需要[配置程式庫](#repositories)並添加以下依賴項：

-   **[ktor-client-core](#client-dependency)**

    `ktor-client-core` 包含 Ktor 客戶端的核心功能。
-   **[引擎依賴項](#engine-dependency)**

    引擎用於處理網路請求。
    請注意，[特定平台](client-supported-platforms.md)可能需要處理網路請求的特定引擎。
-   (可選) **[日誌依賴項](#logging-dependency)**

    提供日誌框架以啟用結構化且彈性的日誌功能。

-   (可選) **[外掛程式依賴項](#plugin-dependency)**

    外掛程式用於擴展客戶端以提供特定功能。

undefined

## 添加依賴項 {id="add-ktor-dependencies"}

> 對於[不同平台](client-supported-platforms.md)，Ktor 提供帶有 `-jvm` 或 `-js` 等字尾的平台專屬構件，例如 `ktor-client-core-jvm`。請注意，Gradle 會自動解析適用於給定平台的構件，而 Maven 不支援此功能。這表示對於 Maven，您需要手動添加平台專屬字尾。
>
{type="tip"}

### 客戶端依賴項 {id="client-dependency"}

主要客戶端功能在 `ktor-client-core` 構件中可用。根據您的建構系統，您可以透過以下方式添加它：

<var name="artifact_name" value="ktor-client-core"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

您可以將 `$ktor_version` 替換為所需的 Ktor 版本，例如 `%ktor_version%`。

#### 多平台 {id="client-dependency-multiplatform"}

對於多平台專案，您可以在 `gradle/libs.versions.toml` 檔案中定義 Ktor 版本和 `ktor-client-core` 構件：

[object Promise]

然後，將 `ktor-client-core` 作為依賴項添加到 `commonMain` 原始碼集：

[object Promise]

### 引擎依賴項 {id="engine-dependency"}

[引擎](client-engines.md)負責處理網路請求。有適用於各種平台的不同客戶端引擎，例如 Apache、CIO、Android、iOS 等。例如，您可以如下添加 `CIO` 引擎依賴項：

<var name="artifact_name" value="ktor-client-cio"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

#### 多平台 {id="engine-dependency-multiplatform"}

對於多平台專案，您需要將所需引擎的依賴項添加到相應的原始碼集。

例如，要為 Android 添加 `OkHttp` 引擎依賴項，您可以首先在 `gradle/libs.versions.toml` 檔案中定義 Ktor 版本和 `ktor-client-okhttp` 構件：

[object Promise]

然後，將 `ktor-client-okhttp` 作為依賴項添加到 `androidMain` 原始碼集：

[object Promise]

有關特定引擎所需依賴項的完整列表，請參閱 [](client-engines.md#dependencies)。

### 日誌依賴項

<snippet id="jvm-logging">
  <p>
在 <a href="#jvm">JVM</a> 上，Ktor 使用 Java 簡單日誌外觀
(<a href="http://www.slf4j.org/">SLF4J</a>) 作為日誌的抽象層。SLF4J 將日誌 API 與底層日誌實作分離，
讓您能夠整合最適合您的應用程式需求的日誌框架。
常見的選擇包括 <a href="https://logback.qos.ch/">Logback</a> 或 
<a href="https://logging.apache.org/log4j">Log4j</a>。如果未提供框架，SLF4J 將預設為無操作 (NOP) 實作，這實際上會禁用日誌記錄。
  </p>

  <p>
要啟用日誌記錄，請包含一個帶有所需 SLF4J 實作的構件，
例如 <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

有關 Ktor 中日誌記錄的更多資訊，請參閱 [](client-logging.md)。

### 外掛程式依賴項 {id="plugin-dependency"}

Ktor 允許您使用預設不提供的額外客戶端功能（[外掛程式](client-plugins.md)），例如授權和序列化。其中一些功能在單獨的構件中提供。您可以從所需外掛程式的主題中了解您需要哪些依賴項。

> 對於多平台專案，外掛程式依賴項應添加到 `commonMain` 原始碼集。請注意，某些外掛程式可能對特定平台有[限制](client-engines.md#limitations)。

## 確保 Ktor 版本一致性

<chapter title="使用 Ktor BOM 依賴項">

Ktor BOM 允許您確保所有 Ktor 模組使用相同的、一致的版本，而無需為每個依賴項單獨指定版本。

要添加 Ktor BOM 依賴項，請在您的建構腳本中聲明它，如下所示：

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
</chapter>

<var name="target_module" value="client"/>
undefined