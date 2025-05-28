[//]: # (title: 新增用戶端依賴)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何將用戶端依賴新增至現有專案。</link-summary>

若要在專案中使用 Ktor HTTP 用戶端，您需要[設定儲存庫](#repositories)並新增以下依賴：

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` 包含 Ktor 用戶端的核心功能。
- **[引擎依賴](#engine-dependency)**

  引擎用於處理網路請求。
  請注意，[特定平台](client-supported-platforms.md)可能需要處理網路請求的特定引擎。
- (選用) **[記錄依賴](#logging-dependency)**

  提供一個記錄框架以啟用結構化且彈性的記錄功能。

- (選用) **[插件依賴](#plugin-dependency)**

  插件用於擴展用戶端的特定功能。

<include from="server-dependencies.topic" element-id="repositories"/>

## 新增依賴 {id="add-ktor-dependencies"}

> 對於[不同平台](client-supported-platforms.md)，Ktor 提供了帶有 `-jvm` 或 `-js` 等後綴的平台特定構件，例如 `ktor-client-core-jvm`。請注意，Gradle 會自動解析適用於給定平台的構件，而 Maven 不支援此功能。這表示對於 Maven，您需要手動新增平台特定後綴。
>
{type="tip"}

### 用戶端依賴 {id="client-dependency"}

主要的用戶端功能在 `ktor-client-core` 構件中提供。根據您的建構系統，您可以透過以下方式新增它：

<var name="artifact_name" value="ktor-client-core"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

您可以將 `$ktor_version` 替換為所需的 Ktor 版本，例如 `%ktor_version%`。

#### 多平台 {id="client-dependency-multiplatform"}

對於多平台專案，您可以在 `gradle/libs.versions.toml` 檔案中定義 Ktor 版本和 `ktor-client-core` 構件：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,19"}

然後，將 `ktor-client-core` 作為依賴新增到 `commonMain` 原始碼集：

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

### 引擎依賴 {id="engine-dependency"}

[引擎](client-engines.md)負責處理網路請求。有適用於各種平台的不同用戶端引擎，例如 Apache、CIO、Android、iOS 等。例如，您可以如下新增 `CIO` 引擎依賴：

<var name="artifact_name" value="ktor-client-cio"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### 多平台 {id="engine-dependency-multiplatform"}

對於多平台專案，您需要將所需引擎的依賴新增到相應的原始碼集。

例如，要為 Android 新增 `OkHttp` 引擎依賴，您可以首先在 `gradle/libs.versions.toml` 檔案中定義 Ktor 版本和 `ktor-client-okhttp` 構件：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,20"}

然後，將 `ktor-client-okhttp` 作為依賴新增到 `androidMain` 原始碼集：

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26,34-36,40"}

有關特定引擎所需依賴的完整列表，請參閱 [](client-engines.md#dependencies)。

### 記錄依賴

<include from="client-logging.md" element-id="jvm-logging"/>

有關 Ktor 中記錄的更多資訊，請參閱 [](client-logging.md)。

### 插件依賴 {id="plugin-dependency"}

Ktor 讓您可以使用預設不提供的額外用戶端功能（[插件](client-plugins.md)），例如授權和序列化。其中一些以單獨的構件形式提供。您可以從所需插件的主題中了解您需要哪些依賴。

> 對於多平台專案，插件依賴應該新增到 `commonMain` 原始碼集。請注意，某些插件可能對特定平台有[限制](client-engines.md#limitations)。