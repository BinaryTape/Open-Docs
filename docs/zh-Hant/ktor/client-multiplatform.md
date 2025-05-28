[//]: # (title: 多平台)

<tldr>
<p>
程式碼範例：<a href="https://github.com/ktorio/ktor-samples/tree/main/client-mpp">client-mpp</a>
</p>
</tldr>

<link-summary>
Ktor 用戶端可用於多平台專案，並支援 Android、JavaScript 和 Native 平台。
</link-summary>

[Ktor HTTP 用戶端](client-create-and-configure.md) 可用於 [多平台專案](https://kotlinlang.org/docs/multiplatform.html)，並支援以下平台：
* JVM
* [Android](https://kotlinlang.org/docs/android-overview.html)
* [JavaScript](https://kotlinlang.org/docs/js-overview.html)
* [Native](https://kotlinlang.org/docs/native-overview.html)

## 新增依賴 {id="add-dependencies"}
若要在您的專案中使用 Ktor HTTP 用戶端，您需要新增至少兩個依賴：一個用戶端依賴和一個 [引擎](client-engines.md) 依賴。對於多平台專案，您需要依以下方式新增這些依賴：
1. 若要在通用程式碼中使用 Ktor 用戶端，請將 `ktor-client-core` 依賴新增至 `build.gradle` 或 `build.gradle.kts` 檔案中的 `commonMain` 原始碼集：
   <var name="platform_name" value="common"/>
   <var name="artifact_name" value="ktor-client-core"/>
   <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
1. 將所需平台的 [引擎依賴](client-engines.md#dependencies) 新增至對應的原始碼集。對於 Android，您可以將 [Android](client-engines.md#android) 引擎依賴新增至 `androidMain` 原始碼集：
   <var name="platform_name" value="android"/>
   <var name="artifact_name" value="ktor-client-android"/>
   <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
   
   對於 iOS，您需要將 [Darwin](client-engines.md#darwin) 引擎依賴新增至 `iosMain`：
   <var name="platform_name" value="ios"/>
   <var name="artifact_name" value="ktor-client-darwin"/>
   <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
   
   若要了解每個平台支援哪些引擎，請參閱 [](client-engines.md#dependencies)。

## 建立用戶端 {id="create-client"}
若要在多平台專案中建立用戶端，請在專案的 [通用程式碼](https://kotlinlang.org/docs/mpp-discover-project.html#source-sets) 中呼叫 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 建構函式：

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

在此程式碼片段中，`HttpClient` 建構函式不接受引擎作為參數：用戶端將根據 [建置腳本](#add-dependencies) 中新增的 artifact 來為所需平台選擇一個引擎。 

如果您需要為特定平台調整引擎配置，請將對應的引擎類別作為參數傳遞給 `HttpClient` 建構函式，並使用 `engine` 方法配置引擎，例如：
```kotlin
```
{src="snippets/_misc_client/AndroidConfig.kt" interpolate-variables="true" disable-links="false"}

您可以從 [](client-engines.md) 了解如何配置所有引擎類型。

## 程式碼範例 {id="code-example"}

[mpp/client-mpp](https://github.com/ktorio/ktor-samples/tree/main/client-mpp) 專案展示了如何在多平台應用程式中使用 Ktor 用戶端。此應用程式可在以下平台運作：`Android`、`iOS`、`JavaScript` 和 `macosX64`。