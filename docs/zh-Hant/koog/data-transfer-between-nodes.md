## 總覽

Koog 提供了一種使用 `AIAgentStorage` 存儲和傳遞資料的方式，這是一個鍵值存儲系統，旨在以型別安全的方式在不同節點甚至子圖之間傳遞資料。

存儲可以透過代理節點中提供的 `storage` 屬性（`storage: AIAgentStorage`）存取，從而實現在 AI 代理系統的不同元件之間無縫共用資料。

## 鍵值結構

鍵值資料存儲結構依賴於 `AIAgentStorageKey` 資料類別。有關 `AIAgentStorageKey` 的更多資訊，請參閱以下章節。

### AIAgentStorageKey

存儲使用類型化金鑰系統，以確保在存儲和檢索資料時的型別安全：

- `AIAgentStorageKey<T>`：代表用於識別和存取資料的存儲金鑰的資料類別。以下是 `AIAgentStorageKey` 類別的主要特性：
    - 泛型型別參數 `T` 指定了與此金鑰相關聯的資料型別，確保型別安全。
    - 每個金鑰都有一個 `name` 屬性，這是一個唯一代表存儲金鑰的字串識別碼。

## 使用範例

以下章節提供了一個建立存儲金鑰並使用其存儲和檢索資料的實際範例。

### 定義代表資料的類別

存儲您想要傳遞的資料的第一步是建立一個代表資料的類別。以下是包含基本使用者資料的簡單類別範例：

```kotlin
class UserData(
   val name: String,
   val age: Int
)
```
<!--- KNIT example-data-transfer-between-nodes-01.kt -->

定義完成後，請按照下述說明使用該類別建立存儲金鑰。

### 建立存儲金鑰

為定義的資料結構建立類型化存儲金鑰：

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

`createStorageKey` 函式接受單個字串參數，用於唯一識別該金鑰。

### 存儲資料

若要使用建立的存儲金鑰儲存資料，請在節點中使用 `storage.set(key: AIAgentStorageKey<T>, value: T)` 方法：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
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
import ai.koog.agents.core.dsl.builder.node

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

有關 `AIAgentStorage` 類別的完整參考，請參閱 [AIAgentStorage](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage)。

有關 `AIAgentStorage` 類別中可用的各個函式，請參閱以下 API 參考：

- [clear](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.clear)
- [get](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.get)
- [getValue](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.getValue)
- [putAll](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.putAll)
- [remove](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.remove)
- [set](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.set)
- [toMap](api:agents-core::ai.koog.agents.core.agent.entity.AIAgentStorage.toMap)

## 附加資訊

- `AIAgentStorage` 是執行緒安全的，使用 Mutex 來確保並行存取得到正確處理。
- 存儲旨在與任何繼承 `Any` 的型別搭配使用。
- 檢索值時，型別轉換會自動處理，確保整個應用程式的型別安全。
- 對於值的不可為 null 存取，請使用 `getValue` 方法，如果金鑰不存在，該方法會拋出例外。
- 您可以使用 `clear` 方法完全清除存儲，這將移除所有存儲的鍵值對。