<!--- TOC -->

*   [相容性](#compatibility)
*   [公開 API 類型](#public-api-types)
    *   [實驗性 API](#experimental-api)
    *   [Flow 預覽版 API](#flow-preview-api)
    *   [過時 API](#obsolete-api)
    *   [內部 API](#internal-api)
    *   [穩定版 API](#stable-api)
    *   [廢棄週期](#deprecation-cycle)
*   [使用標註的 API](#using-annotated-api)
    *   [以程式碼方式](#programmatically)
    *   [Gradle](#gradle)
    *   [Maven](#maven)

<!--- END -->

## 相容性
本文件描述了 `kotlinx.coroutines` 函式庫自 1.0.0 版以來的相容性政策，以及相容性特定註釋的語義。

## 公開 API 類型
`kotlinx.coroutines` 公開 API 分為五種類型：穩定版、實驗性、過時、內部和廢棄。除了穩定版之外，所有公開 API 都會以對應的註釋標記。

### 實驗性 API
實驗性 API 會以 [@ExperimentalCoroutinesApi][ExperimentalCoroutinesApi] 註釋標記。
當 API 的設計存在潛在的未解問題，最終可能導致 API 的語義變更或其廢棄時，就會將其標記為實驗性。

預設情況下，大多數新 API 都會標記為實驗性，如果沒有新的問題出現，則會在未來主要版本中變得穩定。
否則，語義會被修正，但 ABI 不會改變，或者 API 會進入廢棄週期。

何時使用實驗性 API 可能很危險：
*   您正在撰寫一個依賴於 `kotlinx.coroutines` 的函式庫，並希望在穩定的函式庫 API 中使用實驗性協程 API。
    當您的函式庫的終端使用者更新其 `kotlinx.coroutines` 版本，而實驗性 API 的語義略有不同時，可能會導致不樂見的後果。
*   您希望圍繞實驗性 API 建立應用程式的核心基礎架構。

### Flow 預覽版 API
所有與 [Flow] 相關的 API 都以 [@FlowPreview][FlowPreview] 註釋標記。
此註釋表示 Flow API 處於預覽狀態。
我們不為預覽功能提供版本之間的相容性保證，包括二進位、原始碼和語義相容性。

何時使用預覽版 API 可能很危險：
*   您正在撰寫函式庫/框架，並希望在穩定版本或穩定 API 中使用 [Flow] API。
*   您希望在應用程式的核心基礎架構中使用 [Flow]。
*   您希望將 [Flow] 用作「寫了即忘」的解決方案，並且在更新 `kotlinx.coroutines` 時無法承擔額外的維護成本。

### 過時 API
過時 API 會以 [@ObsoleteCoroutinesApi][ObsoleteCoroutinesApi] 註釋標記。
過時 API 與實驗性類似，但已知存在嚴重的設計缺陷及其潛在替代方案，但替代方案尚未實作。

此 API 的語義不會改變，但一旦替代方案準備就緒，它將會進入廢棄週期。

### 內部 API
內部 API 會以 [@InternalCoroutinesApi][InternalCoroutinesApi] 註釋標記，或是 `kotlinx.coroutines.internal` 套件的一部分。
此 API 不保證其穩定性，在未來版本中可能會被更改和/或移除。
如果您無法避免使用內部 API，請向 [問題追蹤器](https://github.com/Kotlin/kotlinx.coroutines/issues/new) 回報。

### 穩定版 API
穩定版 API 保證保留其 ABI 和文件化的語義。如果某個時刻發現無法修復的設計缺陷，此 API 將會進入廢棄週期，並盡可能保持二進位相容。

### 廢棄週期
當某些 API 被廢棄時，它會經歷多個階段，並且每個階段之間至少有一個主要版本發行。
*   功能在編譯時發出警告並廢棄。大多數情況下，會提供適當的替代方案（和對應的 `replaceWith` 宣告），以便在 IntelliJ IDEA 的幫助下自動遷移廢棄的用法。
*   廢棄等級提高到 `error` 或 `hidden`。不再可能編譯使用廢棄 API 的新程式碼，儘管它仍然存在於 ABI 中。
*   API 完全移除。儘管我們盡最大努力不這樣做，並且沒有計畫移除任何 API，但我們仍然保留此選項，以防出現不可預見的問題，例如安全漏洞。

## 使用標註的 API
所有 API 註釋都是 [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)。
這樣做是為了在使用實驗性或過時 API 時產生編譯警告。
警告可以透過程式碼針對特定呼叫點禁用，或針對整個模組全域禁用。

### 以程式碼方式
對於特定的呼叫點，可以使用 [OptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 註釋禁用警告：
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // 禁用有關實驗性協程 API 的警告 
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
``` 

### Gradle
對於 Gradle 專案，可以在 `build.gradle` 檔案中傳遞編譯器旗標來禁用警告：

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
對於 Maven 專案，可以在 `pom.xml` 檔案中傳遞編譯器旗標來禁用警告：
```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    ... 您的配置 ...
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