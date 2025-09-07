## 概述

Koog 提供了一種使用 `AIAgentStorage` 來儲存和傳遞資料的方式，這是一個鍵值儲存系統，旨在提供一種型別安全的方式，用於在不同節點甚至子圖之間傳遞資料。

儲存空間可透過代理節點中可用的 `storage` 屬性 (`storage: AIAgentStorage`) 進行存取，從而實現 AI 代理系統不同元件之間的無縫資料共享。

## 鍵與值結構

鍵值資料儲存結構依賴於 `AIAgentStorageKey` data class。有關 `AIAgentStorageKey` 的更多資訊，請參閱以下章節。

### AIAgentStorageKey

該儲存空間使用型別化的鍵系統，以確保在儲存和檢索資料時的型別安全：

-   `AIAgentStorageKey<T>`：一個 data class，代表用於識別和存取資料的儲存鍵。以下是 `AIAgentStorageKey` 類別的主要功能：
    -   泛型型別參數 `T` 指定與此鍵關聯的資料型別，確保型別安全。
    -   每個鍵都有一個 `name` 屬性，它是一個字串識別符，唯一代表該儲存鍵。

## 使用範例

以下章節提供一個實際範例，說明如何建立儲存鍵並使用它來儲存和檢索資料。

### 定義代表您資料的類別

儲存您要傳遞的資料的第一步是建立一個代表您資料的類別。這是一個包含基本使用者資料的簡單類別範例：

```kotlin
class UserData(
   val name: String,
   val age: Int
)
```
<!--- KNIT example-data-transfer-between-nodes-01.kt -->

定義後，請使用該類別建立儲存鍵，如下所述。

### 建立儲存鍵

為已定義的資料結構建立一個型別化的儲存鍵：

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.createStorageKey

class UserData(
    val name: String,
    val age: Int
)

fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
val userDataKey = createStorageKey<UserData>("user-data")
```
<!--- KNIT example-data-transfer-between-nodes-02.kt -->

`createStorageKey` 函數接受一個單一字串參數，該參數唯一識別該鍵。

### 儲存資料

若要使用已建立的儲存鍵儲存資料，請在節點中使用 `storage.set(key: AIAgentStorageKey<T>, value: T)` 方法：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.agent.entity.createStorageKey

class UserData(
   val name: String,
   val age: Int
)

fun main() {
    val userDataKey = createStorageKey<UserData>("user-data")

    val str = strategy<Unit, Unit>("my-strategy") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val nodeSaveData by node<Unit, Unit> {
    storage.set(userDataKey, UserData("John", 26))
}
```
<!--- KNIT example-data-transfer-between-nodes-03.kt -->

### 檢索資料

若要檢索資料，請在節點中使用 `storage.get` 方法：

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.createStorageKey
import ai.koog.agents.core.dsl.builder.strategy

class UserData(
    val name: String,
    val age: Int
)

fun main() {
    val userDataKey = createStorageKey<UserData>("user-data")

    val str = strategy<String, Unit>("my-strategy") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val nodeRetrieveData by node<String, Unit> { message ->
    storage.get(userDataKey)?.let { userFromStorage ->
        println("Hello dear $userFromStorage, here's a message for you: $message")
    }
}
```
<!--- KNIT example-data-transfer-between-nodes-04.kt -->

## API 文件

有關 `AIAgentStorage` 類別的完整參考資料，請參閱 [AIAgentStorage](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/index.html)。

有關 `AIAgentStorage` 類別中可用的個別函數，請參閱以下 API 參考資料：

-   [clear](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/clear.html)
-   [get](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/get.html)
-   [getValue](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/get-value.html)
-   [putAll](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/put-all.html)
-   [remove](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/remove.html)
-   [set](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/set.html)
-   [toMap](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.entity/-a-i-agent-storage/to-map.html)

## 其他資訊

-   `AIAgentStorage` 是執行緒安全的，使用 Mutex 來確保並行存取得到妥善處理。
-   此儲存的設計旨在與任何擴展 `Any` 的型別協同工作。
-   檢索值時，型別轉換會自動處理，確保在您的應用程式中保持型別安全。
-   對於值的非空存取，請使用 `getValue` 方法，如果鍵不存在，該方法將拋出一個異常。
-   您可以使用 `clear` 方法完全清除儲存，該方法將移除所有已儲存的鍵值對。