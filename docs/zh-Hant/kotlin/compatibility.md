<!--- TOC -->

* [相容性](#compatibility)
* [公開 API 類型](#public-api-types)
  * [實驗性 API](#experimental-api)
  * [Flow 預覽版 API](#flow-preview-api)
  * [過時 API](#obsolete-api)
  * [內部 API](#internal-api)
  * [穩定版 API](#stable-api)
  * [棄用週期](#deprecation-cycle)
* [使用註解 API](#using-annotated-api)
  * [以程式碼方式](#programmatically)
  * [Gradle](#gradle)
  * [Maven](#maven)

<!--- END -->

## 相容性
本文件描述了自 1.0.0 版以來 `kotlinx.coroutines` 函式庫的相容性政策，以及特定於相容性的註解語義。

## 公開 API 類型
`kotlinx.coroutines` 公開 API 分為五種類型：穩定版、實驗性、過時、內部和已棄用。除穩定版外的所有公開 API 都標記了對應的註解。

### 實驗性 API
實驗性 API 標記有 [@ExperimentalCoroutinesApi][ExperimentalCoroutinesApi] 註解。當 API 的設計存在潛在的未解決問題，最終可能導致 API 的語義變更或其棄用時，該 API 會被標記為實驗性。

預設情況下，大多數新 API 都會被標記為實驗性，如果沒有出現新問題，會在接下來的主要版本發佈之一中變為穩定版。否則，語義會在不改變 ABI 的情況下修復，或 API 進入棄用週期。

何時使用實驗性 API 可能很危險：
* 您正在編寫一個依賴於 `kotlinx.coroutines` 的函式庫，並想在函式庫的穩定版 API 中使用實驗性協程 API。當您函式庫的終端使用者更新 `kotlinx.coroutines` 版本時，若實驗性 API 的語義略有不同，這可能會導致不樂見的後果。
* 您想圍繞實驗性 API 構建應用程式的核心基礎設施。

### Flow 預覽版 API
所有 [Flow] 相關 API 都標記有 [@FlowPreview][FlowPreview] 註解。此註解表示 Flow API 處於預覽狀態。我們不為預覽功能提供跨版本相容性保證，包括二進位、原始碼和語義相容性。

何時使用預覽版 API 可能很危險：
* 您正在編寫函式庫/框架，並想在穩定版本或穩定 API 中使用 [Flow] API。
* 您想在應用程式的核心基礎設施中使用 [Flow]。
* 您想將 [Flow] 作為「寫完即忘」的解決方案，並且在 `kotlinx.coroutines` 更新時無法承擔額外的維護成本。

### 過時 API
過時 API 標記有 [@ObsoleteCoroutinesApi][ObsoleteCoroutinesApi] 註解。過時 API 與實驗性 API 類似，但已知存在嚴重的設計缺陷，並有潛在的替代方案，只是該替代方案尚未實現。

此 API 的語義不會改變，但一旦替代方案準備就緒，它將進入棄用週期。

### 內部 API
內部 API 標記有 [@InternalCoroutinesApi][InternalCoroutinesApi] 註解，或是 `kotlinx.coroutines.internal` 套件的一部分。此 API 不保證其穩定性，可能會在未來的版本中變更及/或移除。如果您無法避免使用內部 API，請向 [問題追蹤器](https://github.com/Kotlin/kotlinx.coroutines/issues/new) 回報。

### 穩定版 API
穩定版 API 保證保留其 ABI 和文件化語義。如果在某個時間點發現無法修復的設計缺陷，此 API 將進入棄用週期，並在盡可能長的時期內保持二進位相容。

### 棄用週期
當某些 API 被棄用時，它會經歷多個階段，每個階段之間至少會有一個主要版本發佈。
* 功能會以編譯警告的形式棄用。大多數情況下，會提供適當的替代方案（及對應的 `replaceWith` 宣告），以借助 IntelliJ IDEA 自動遷移棄用用法。
* 棄用級別會提高到 `error` 或 `hidden`。不再可能針對棄用 API 編譯新程式碼，儘管它仍然存在於 ABI 中。
* API 被完全移除。雖然我們盡最大努力不這樣做，也沒有移除任何 API 的計畫，但我們仍然保留此選項，以防範不可預見的問題，例如安全漏洞。

## 使用註解 API
所有 API 註解都是 [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)。這樣做旨在產生關於使用實驗性或過時 API 的編譯警告。警告可以透過程式碼方式停用，針對特定的呼叫點，或針對整個模組全域停用。

### 以程式碼方式
對於特定的呼叫點，可以透過使用 [OptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 註解來停用警告：
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // 停用關於實驗性協程 API 的警告
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
``` 

### Gradle
對於 Gradle 專案，可以透過在您的 `build.gradle` 檔案中傳遞編譯器旗標來停用警告：

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
對於 Maven 專案，可以透過在您的 `pom.xml` 檔案中傳遞編譯器旗標來停用警告：
```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    ... your configuration ...
    <configuration>
        <args>
            <arg>-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi</arg>
        </args>
    </configuration>
</plugin>
```

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines.flow -->

[Flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html

<!--- INDEX kotlinx.coroutines -->

[ExperimentalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-experimental-coroutines-api/index.html
[FlowPreview]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-flow-preview/index.html
[ObsoleteCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-obsolete-coroutines-api/index.html
[InternalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-internal-coroutines-api/index.html

<!--- END -->